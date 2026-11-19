"""Discover public HTML pages and update their sitemap dates from Git history."""

import argparse
import hashlib
import json
import re
import subprocess
import xml.etree.ElementTree as ET
from datetime import datetime
from dataclasses import dataclass
from functools import lru_cache
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote, unquote, urljoin, urlsplit
from zoneinfo import ZoneInfo


# The last manual review of every date, before automation was enabled.
AUDITED_REVISION = "9439d1208b693d1f8001e428350b1f5396474484"
NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
TIMEZONE = ZoneInfo("Europe/Belgrade")
UTILITY_SCRIPTS = {"/assets/trackers.js", "/assets/favicon-theme.js", "/assets/site-header.js"}
HEADINGS = {"title", "h1", "h2", "h3", "h4", "h5", "h6"}
# These routes are downloadable assets, design alternatives, or a deliberately unlisted study.
UNLISTED_PREFIXES = ("assets/", "scripts/", "skills/", "identity-studies/", "atlas/site-editions/")
UNLISTED_FILES = {"404.html", "cinematic.html", "notes/how-google-search-works.html"}


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
        self.links = []
        self.canonicals = []
        self.base = None
        self.in_head = True  # HTML permits an implicit head before the body.
        self.template_depth = 0
        self.document = False
        self.noindex = False

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

    def handle_decl(self, decl):
        if decl.lower().split()[:2] == ["doctype", "html"]:
            self.document = True

    def inspect_for_indexing(self, tag, a):
        if tag in ("html", "head", "body"):
            self.document = True
        if tag not in ("html", "head", "title", "meta", "link", "base", "style", "script", "noscript"):
            self.in_head = False
        if self.in_head:
            if tag == "base" and self.base is None and a.get("href"):
                self.base = a["href"]
            if tag == "link" and "canonical" in (a.get("rel") or "").lower().split():
                self.canonicals.append(a.get("href") or "")
        if tag == "meta":
            name = (a.get("name") or "").strip().lower()
            directives = re.split(r"[,\s]+", (a.get("content") or "").lower())
            if name in ("robots", "googlebot", "bingbot") and {"noindex", "none"}.intersection(directives):
                self.noindex = True
            if (a.get("http-equiv") or "").strip().lower() == "refresh":
                self.noindex = True
        if tag in ("a", "area") and a.get("href"):
            self.links.append(a["href"])

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "template":
            self.template_depth += 1
        if not self.template_depth:
            self.inspect_for_indexing(tag, a)
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
        if tag == "template" and self.template_depth:
            self.template_depth -= 1
        if tag == "head" and not self.template_depth:
            self.in_head = False
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


@dataclass
class ParsedPage:
    digest: bytes
    assets: list
    links: list
    self_canonical: bool
    eligible: bool


def local_path(base, href, site, canonical=False):
    try:
        target = urlsplit(urljoin(base, href))
    except ValueError:
        return None
    if target.netloc.lower() != site or target.scheme not in ("http", "https"):
        return None
    if canonical and (not href.strip() or target.scheme != "https" or target.query or target.fragment):
        return None
    path = unquote(target.path or "/")
    return path.lstrip("/") + ("index.html" if path.endswith("/") else "")


@lru_cache(maxsize=128)
def parse_page(blob, url):
    parser = PageContent(url)
    parser.feed(git("cat-file", "blob", blob).decode("utf-8"))
    parser.close()
    digest = hashlib.sha256(json.dumps(parser.parts, ensure_ascii=False).encode()).digest()
    site = urlsplit(url).netloc
    try:
        base = urljoin(url, parser.base or "")
    except ValueError:
        base = url
    source = local_path(url, url, site)
    canonical_paths = {local_path(base, href, site, canonical=True) for href in parser.canonicals}
    self_canonical = canonical_paths == {source}
    eligible = parser.document and not parser.noindex and (not canonical_paths or self_canonical)
    links = [local_path(base, href, site) for href in parser.links]
    return ParsedPage(digest, sorted(parser.assets), links, self_canonical, eligible)


def tree_at(revision):
    tree = {}
    for record in git("ls-tree", "-rz", revision).split(b"\0"):
        if record:
            meta, path = record.split(b"\t", 1)
            tree[path.decode("utf-8", "surrogateescape")] = meta.split()[2].decode("ascii")
    return tree


def page_candidate(path):
    if not path.lower().endswith(".html") or path in UNLISTED_FILES or path.startswith(UNLISTED_PREFIXES):
        return False
    if re.fullmatch(r"v\d+-[^/]+\.html", path):
        return False
    return all(not p.startswith((".", "_")) and p not in ("drafts", "previews", "private") for p in path.split("/"))


def robots_path(value):
    """Normalize raw UTF-8 and percent escapes, preserving escaped reserved characters."""
    def normalize_escape(match):
        byte = int(match[0][1:], 16)
        char = chr(byte)
        if char.isascii() and (char.isalnum() or char in "-._~"):
            return char
        return f"%{byte:02X}"

    encoded = quote(value, safe="/!$&'()*+,;=:@?%")
    return re.sub(r"%[\da-fA-F]{2}", normalize_escape, encoded)


@lru_cache(maxsize=16)
def crawl_rules(blob, agent="googlebot"):
    groups = []
    names, rules = [], []
    source = git("cat-file", "blob", blob).decode("utf-8-sig", errors="replace") if blob else ""
    for line in source.splitlines():
        name, _, value = line.partition("#")[0].partition(":")
        name, value = name.strip().lower(), value.strip()
        if name == "user-agent":
            if rules:
                groups.append((names, rules))
                names, rules = [], []
            if value:
                names.append(value.lower())
        elif names and name in ("allow", "disallow"):
            rules.append((name == "allow", value))
    groups.append((names, rules))

    matches = []
    for names, rules in groups:
        specificity = max((len(name) for name in names if name != "*" and name in agent), default=-1)
        if specificity >= 0 or "*" in names:
            matches.append((specificity, rules))
    best = max((specificity for specificity, _ in matches), default=-1)
    patterns = []
    for specificity, rules in matches:
        if specificity != best:
            continue
        for allowed, raw in rules:
            if raw:
                pattern = robots_path(raw)
                anchored = pattern.endswith("$")
                path = pattern[:-1] if anchored else pattern
                regex = re.escape(path).replace(r"\*", ".*") + (r"\Z" if anchored else "")
                patterns.append((len(pattern), allowed, re.compile(regex)))
    # Longest matching rule wins, with Allow winning equal-length conflicts.
    return sorted(patterns, key=lambda rule: rule[:2], reverse=True)


def crawl_allowed(rules, url):
    target = urlsplit(url)
    path = robots_path(target.path + ("?" + target.query if target.query else ""))
    return next((allowed for _, allowed, regex in rules if regex.match(path)), True)


def indexed_entries(root, site):
    entries = {}
    for entry in root.findall(f"{{{NS}}}url"):
        url = entry.findtext(f"{{{NS}}}loc")
        path = local_path(url, url, site)
        if path and path.lower().endswith(".html"):
            entries[path] = entry
    return entries


@lru_cache(maxsize=32)
def listed_paths(blob, site):
    if not blob:
        return set()
    return set(indexed_entries(ET.fromstring(git("cat-file", "blob", blob)), site))


def public_pages(tree, site):
    """Start with listed and self-canonical documents, then follow local links."""
    rules = crawl_rules(tree.get("robots.txt"))
    listed = listed_paths(tree.get("sitemap.xml"), site)
    candidates = {}
    todo = []
    for path, blob in tree.items():
        if not page_candidate(path):
            continue
        route = "/" + quote(path)
        if route.endswith("/index.html"):
            route = route[:-len("index.html")]
        url = f"https://{site}{route}"
        page = parse_page(blob, url)
        if page.eligible and crawl_allowed(rules, url):
            candidates[path] = url, page
            if path in listed or page.self_canonical:
                todo.append(path)

    reached = {}
    while todo:
        path = todo.pop()
        if path and path not in candidates and path + "/index.html" in candidates:
            path += "/index.html"
        if path in reached or path not in candidates:
            continue
        url, page = candidates[path]
        reached[path] = url, (page.digest, tuple(tree.get(asset) for asset in page.assets))
        todo.extend(page.links)
    return reached


def update(since):
    site = Path("CNAME").read_text().strip().lower()
    sitemap = Path("sitemap.xml")
    root = ET.parse(sitemap).getroot()
    entries = indexed_entries(root, site)

    if not since:
        marker = git("log", "--first-parent", "-1", "--format=%H",
                     "--grep=^Sitemap-Dates-Synced: yes$").decode().strip()
        since = marker or AUDITED_REVISION
    history = git("log", "--reverse", "--first-parent", "--format=%H %ct", f"{since}..HEAD")
    tree = tree_at(since)
    previous = public_pages(tree, site)
    backed = set(entries).intersection(tree)
    dates = {}
    for line in history.decode().splitlines():
        revision, timestamp = line.split()
        tree = tree_at(revision)
        current = public_pages(tree, site)
        backed.update(entries.keys() & tree.keys())
        date = datetime.fromtimestamp(int(timestamp), TIMEZONE).date().isoformat()
        for path, state in current.items():
            if state != previous.get(path):
                dates[path] = date
        previous = current

    removed = backed - previous.keys()
    for path in sorted(removed):
        print("Remove", entries[path].findtext(f"{{{NS}}}loc"))
        root.remove(entries[path])

    added = 0
    changes = 0
    for path, (url, _) in sorted(previous.items()):
        date = dates.get(path)
        entry = entries.get(path)
        if entry is None:
            if len(root):
                root[-1].tail = "\n  "
            else:
                root.text = "\n  "
            entry = ET.SubElement(root, f"{{{NS}}}url")
            ET.SubElement(entry, f"{{{NS}}}loc").text = url
            entry.tail = "\n"
            print("Add", url)
            added += 1
        if date is None:
            # A previously eligible page can predate the review window. Omit an
            # unknown lastmod rather than assigning today's publish date to it.
            continue
        lastmod = entry.find(f"{{{NS}}}lastmod")
        if lastmod is None:
            lastmod = ET.Element(f"{{{NS}}}lastmod")
            entry.insert(list(entry).index(entry.find(f"{{{NS}}}loc")) + 1, lastmod)
        if lastmod.text != date:
            print(f"{url}  {lastmod.text or '(none)'} -> {date}")
            lastmod.text = date
            changes += 1

    if changes or added or removed:
        if len(root):
            root[-1].tail = "\n"
        ET.register_namespace("", NS)
        xml = ET.tostring(root, encoding="unicode")
        sitemap.write_text('<?xml version="1.0" encoding="UTF-8"?>\n' + xml + "\n")
    print(f"{added} URLs added, {len(removed)} removed, {changes} sitemap dates updated.")


if __name__ == "__main__":
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--since", help="compare from this Git revision instead of the last review")
    update(cli.parse_args().since)
