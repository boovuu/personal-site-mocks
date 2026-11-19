"""Update listed pages from their Git history. Run from the repository root."""

import argparse
import hashlib
import json
import subprocess
import xml.etree.ElementTree as ET
from datetime import datetime
from functools import lru_cache
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from zoneinfo import ZoneInfo


# The last manual review of every date, before automation was enabled.
AUDITED_REVISION = "9439d1208b693d1f8001e428350b1f5396474484"
NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
TIMEZONE = ZoneInfo("Europe/Belgrade")
UTILITY_SCRIPTS = {"/assets/trackers.js", "/assets/favicon-theme.js", "/assets/site-header.js"}
HEADINGS = {"title", "h1", "h2", "h3", "h4", "h5", "h6"}


def git(*args):
    return subprocess.check_output(["git", *args])


class PageContent(HTMLParser):
    """Capture page content and the local media or scripts used to render it."""

    def __init__(self, url):
        super().__init__()
        self.url = url
        self.parts = []
        self.assets = set()
        self.section = None

    def record_asset(self, value):
        if not value:
            return
        target = urlsplit(urljoin(self.url, value))
        if target.netloc == urlsplit(self.url).netloc and target.scheme in ("http", "https"):
            # Local asset versions come from their bytes, including for cache-busted URLs.
            path = unquote(target.path).lstrip("/")
            self.assets.add(path)
            self.parts.append(("asset", path))
        else:
            self.parts.append(("asset", value))

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in HEADINGS:
            self.parts.append(("open", tag))
        elif tag == "style":
            self.section = "skip"
        elif tag == "script":
            src = a.get("src")
            if src:
                self.section = "skip"
                script = urlsplit(urljoin(self.url, src))
                if script.netloc != urlsplit(self.url).netloc or script.path not in UTILITY_SCRIPTS:
                    self.record_asset(src)
            else:
                self.section = (a.get("type") or "script").lower()
        elif tag == "meta":
            name = (a.get("name") or a.get("property") or "").lower()
            if name in ("description", "robots") or name.startswith(("og:", "twitter:")):
                self.parts.append((name, a.get("content")))
        elif tag == "link" and "canonical" in (a.get("rel") or "").lower().split():
            self.parts.append(("canonical", a.get("href")))
        elif tag in ("a", "area"):
            self.parts.append(("href", a.get("href")))
        elif tag in ("img", "source", "video", "audio", "track", "iframe"):
            for attr in ("src", "poster"):
                self.record_asset(a.get(attr))
            srcset = a.get("srcset") or ""
            if "data:" in srcset:
                self.parts.append(("srcset", srcset))
            else:
                for candidate in srcset.split(","):
                    fields = candidate.split()
                    if fields:
                        self.record_asset(fields[0])
                        self.parts.append(("descriptor", tuple(fields[1:])))
        for attr in ("alt", "aria-label"):
            if a.get(attr):
                self.parts.append((attr, a[attr]))

    def handle_endtag(self, tag):
        if tag in HEADINGS:
            self.parts.append(("close", tag))
        elif tag in ("script", "style"):
            self.section = None

    def handle_data(self, data):
        if self.section == "skip" or not data.strip():
            return
        if self.section in ("application/json", "application/ld+json"):
            try:
                data = json.dumps(json.loads(data), sort_keys=True, ensure_ascii=False)
            except ValueError:
                pass  # Retain the raw data if the published payload isn't valid JSON.
        if self.section:
            self.parts.append((self.section, data.strip()))
        else:
            self.parts.extend(data.split())


@lru_cache(maxsize=128)
def parse_page(blob, url):
    parser = PageContent(url)
    parser.feed(git("cat-file", "blob", blob).decode("utf-8"))
    parser.close()
    digest = hashlib.sha256(json.dumps(parser.parts, ensure_ascii=False).encode()).digest()
    return digest, sorted(parser.assets)


def tree_at(revision):
    tree = {}
    for record in git("ls-tree", "-rz", revision).split(b"\0"):
        if record:
            meta, path = record.split(b"\t", 1)
            tree[path.decode("utf-8", "surrogateescape")] = meta.split()[2].decode("ascii")
    return tree


def signatures(urls, revision):
    tree = tree_at(revision)
    result = {}
    for url, path in urls.items():
        if path in tree:
            digest, assets = parse_page(tree[path], url)
            result[url] = digest, tuple(tree.get(asset) for asset in assets)
    return result


def update(since):
    site = Path("CNAME").read_text().strip().lower()
    sitemap = Path("sitemap.xml")
    root = ET.parse(sitemap).getroot()
    entries = {}
    paths = {}
    for entry in root.findall(f"{{{NS}}}url"):
        url = entry.findtext(f"{{{NS}}}loc")
        target = urlsplit(url)
        if target.hostname == site:
            path = unquote(target.path).lstrip("/")
            paths[url] = path + "index.html" if target.path.endswith("/") else path
            entries[url] = entry

    if not since:
        marker = git("log", "--first-parent", "-1", "--format=%H",
                     "--grep=^Sitemap-Dates-Synced: yes$").decode().strip()
        since = marker or AUDITED_REVISION
    history = git("log", "--reverse", "--first-parent", "--format=%H %ct", f"{since}..HEAD")
    previous = signatures(paths, since)
    dates = {}
    for line in history.decode().splitlines():
        revision, timestamp = line.split()
        current = signatures(paths, revision)
        date = datetime.fromtimestamp(int(timestamp), TIMEZONE).date().isoformat()
        for url, content in current.items():
            if content != previous.get(url):
                dates[url] = date
        previous = current

    changes = 0
    for url, date in dates.items():
        if url not in previous:
            continue
        entry = entries[url]
        lastmod = entry.find(f"{{{NS}}}lastmod")
        if lastmod is None:
            lastmod = ET.Element(f"{{{NS}}}lastmod")
            entry.insert(list(entry).index(entry.find(f"{{{NS}}}loc")) + 1, lastmod)
        if lastmod.text != date:
            print(f"{url}  {lastmod.text or '(none)'} -> {date}")
            lastmod.text = date
            changes += 1

    if changes:
        ET.register_namespace("", NS)
        xml = ET.tostring(root, encoding="unicode")
        sitemap.write_text('<?xml version="1.0" encoding="UTF-8"?>\n' + xml + "\n")
    print(f"{changes} sitemap dates updated.")


if __name__ == "__main__":
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--since", help="compare from this Git revision instead of the last review")
    update(cli.parse_args().since)
