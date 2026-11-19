"""Exercise the sitemap updater against real, disposable Git histories."""

import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET


UPDATER = Path(__file__).with_name("update-sitemap.py").resolve()
ORIGIN = "https://bogdanvuckovic.com"
INITIAL_DATE = "2026-11-10"


class SitemapTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)
        self.git("init", "--quiet", "-b", "main")
        self.git("config", "user.name", "Sitemap Test")
        self.git("config", "user.email", "test@example.invalid")
        self.git("config", "commit.gpgsign", "false")
        self.write("CNAME", "bogdanvuckovic.com\n")

    def git(self, *args, date=None):
        env = os.environ.copy()
        if date:
            env.update(GIT_AUTHOR_DATE=date, GIT_COMMITTER_DATE=date)
        return subprocess.check_output(
            ["git", *args], cwd=self.root, env=env, text=True
        ).strip()

    def write(self, path, content):
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")

    def page(self, path, body, head=""):
        self.write(path, f"<!doctype html><html><head>{head}</head><body>{body}</body></html>")

    def commit(self, message, date):
        self.git("add", ".")
        self.git("commit", "--quiet", "-m", message, date=date)
        return self.git("rev-parse", "HEAD")

    def initial(self, *paths):
        rows = [
            f"  <url><loc>{ORIGIN}{path}</loc><lastmod>{INITIAL_DATE}</lastmod></url>"
            for path in paths
        ]
        self.write("sitemap.xml", "\n".join([
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            *rows, "</urlset>", "",
        ]))
        return self.commit("Initial public site", "2026-11-10T10:00:00+00:00")

    def update(self, base):
        subprocess.run(
            [sys.executable, str(UPDATER), "--since", base], cwd=self.root, check=True
        )
        sitemap = ET.parse(self.root / "sitemap.xml").getroot()
        return {
            entry.findtext("{*}loc").removeprefix(ORIGIN): entry.findtext("{*}lastmod")
            for entry in sitemap
        }

    def test_editorial_changes_and_idempotent_retries(self):
        self.page("index.html", "First edition")
        self.page("notes/index.html", '<a href="/archive">Sources</a>')
        self.page("schema.html", "", '<script type="application/ld+json">{"name":"A"}</script>')
        self.page("data.html", '<script type="application/json">{"caption":"A"}</script>')
        self.page("unchanged.html", "Still here")
        base = self.initial("/", "/notes/", "/schema.html", "/data.html", "/unchanged.html")

        self.page("index.html", "Second edition")
        self.page("notes/index.html", '<a href="/references">Sources</a>')
        self.page("unlisted-experiment.html", "Live but deliberately outside the sitemap")
        self.commit("Edit home and link destination", "2026-11-11T23:40:00+00:00")
        self.page("schema.html", "", '<script type="application/ld+json">{"name":"B"}</script>')
        self.page("data.html", '<script type="application/json">{"caption":"B"}</script>')
        self.commit("Revise machine-readable content", "2026-11-13T09:03:00+00:00")

        expected = {
            "/": "2026-11-12", "/notes/": "2026-11-12", "/schema.html": "2026-11-13",
            "/data.html": "2026-11-13", "/unchanged.html": INITIAL_DATE,
        }
        self.assertEqual(self.update(base), expected)
        sitemap = self.root / "sitemap.xml"
        first_run = sitemap.read_bytes()
        self.assertEqual(self.update(base), expected)
        self.assertEqual(sitemap.read_bytes(), first_run)
        self.commit("Publish sitemap dates", "2026-11-14T08:00:00+00:00")
        self.assertEqual(self.update(base), expected)
        self.assertEqual(sitemap.read_bytes(), first_run)

    def test_only_reading_content_and_its_assets_count(self):
        head = '<link rel="stylesheet" href="/site.css"><link rel="icon" href="/favicon.svg">'
        tracker = '<script src="/assets/trackers.js"></script>'
        self.page("index.html", '<p class="wide" style="color:red">Hi</p>' + tracker, head)
        self.page("atlas/index.html", '<script src="ideas.js?v=1"></script>')
        self.page("story.html", '<img src="/assets/diagram.svg" alt="Diagram">')
        before = {
            "site.css": "p {color:red}", "favicon.svg": "<svg/>",
            "assets/trackers.js": "let count = 1;", "atlas/ideas.js": 'const caption = "Draft";',
            "assets/diagram.svg": "<svg><title>First edition</title></svg>",
        }
        for path, content in before.items():
            self.write(path, content)
        base = self.initial("/", "/atlas/", "/story.html")

        self.page("index.html", '<p class="narrow" style="color:blue">Hi</p>' + tracker, head)
        self.write("site.css", "p {color:blue}")
        self.write("favicon.svg", "<svg><circle/></svg>")
        self.write("assets/trackers.js", "let count = 2;")
        self.commit("Refresh presentation and tracking", "2026-11-11T09:00:00+00:00")
        self.write("atlas/ideas.js", 'const caption = "Published case study";')
        self.write("assets/diagram.svg", "<svg><title>Corrected edition</title></svg>")
        self.commit("Change chapter data and diagram", "2026-11-13T08:30:00+00:00")
        self.assertEqual(self.update(base), {
            "/": INITIAL_DATE, "/atlas/": "2026-11-13", "/story.html": "2026-11-13",
        })

    def test_branch_content_dates_from_its_merge_to_main(self):
        self.page("index.html", "First edition")
        base = self.initial("/")
        self.git("checkout", "-q", "-b", "article")
        self.page("index.html", "Second edition")
        self.commit("Draft update", "2026-11-12T12:00:00+00:00")
        self.git("checkout", "-q", "main")
        self.git("merge", "--no-ff", "-q", "-m", "Publish article", "article",
                 date="2026-11-15T13:00:00+00:00")
        self.assertEqual(self.update(base), {"/": "2026-11-15"})

    def test_discover_public_pages_and_keep_exclusions(self):
        self.page("index.html", "Home")
        base = self.initial("/")
        self.page("feature.html", "Feature", f'<link rel="canonical" href="{ORIGIN}/feature.html">')
        self.commit("Publish standalone canonical feature", "2026-11-11T23:15:00+00:00")

        excluded = {
            "private.html": '<meta name="robots" content="follow, noindex">',
            "hidden.html": '<meta name="robots" content="none">',
            "moved.html": '<meta http-equiv="refresh" content="0;url=/feature.html">',
            "duplicate.html": f'<link rel="canonical" href="{ORIGIN}/feature.html">',
            "syndicated.html": '<link rel="canonical" href="https://example.org/story">',
            "notes/how-google-search-works.html": "",
        }
        for path, head in excluded.items():
            self.page(path, "Excluded", head)
        self.page("orphan.html", "Unlinked experiment")
        self.page("notes/read.html", '<a href="part%201/">Next chapter</a>')
        self.page("notes/part 1/index.html", '<a href="../read.html#intro">Back to start</a>')
        links = ["/notes/read.html", "/notes/read.html#intro", *("/" + p for p in excluded)]
        self.page("index.html", "".join(f'<a href="{link}">Read</a>' for link in links))
        self.commit("Publish linked story and chapter", "2026-11-14T12:00:00+00:00")

        expected = {
            "/": "2026-11-14", "/feature.html": "2026-11-12",
            "/notes/read.html": "2026-11-14", "/notes/part%201/": "2026-11-14",
        }
        self.assertEqual(self.update(base), expected)
        sitemap = self.root / "sitemap.xml"
        self.assertEqual(len(ET.parse(sitemap).getroot().findall("{*}url")), len(expected))
        first_run = sitemap.read_bytes()
        self.commit("Publish sitemap entries", "2026-11-16T12:00:00+00:00")
        self.assertEqual(self.update(base), expected)
        self.assertEqual(sitemap.read_bytes(), first_run)

    def test_rename_removes_only_the_previously_repo_backed_url(self):
        self.page("index.html", '<a href="/old.html">Article</a>')
        self.page("old.html", "Article body")
        base = self.initial("/", "/old.html", "/worker-only.html")
        (self.root / "old.html").rename(self.root / "new.html")
        self.page("index.html", '<a href="/new.html">Article</a>')
        self.commit("Move published article", "2026-11-13T07:30:00+00:00")
        self.assertEqual(self.update(base), {
            "/": "2026-11-13", "/new.html": "2026-11-13", "/worker-only.html": INITIAL_DATE,
        })

    def test_first_public_link_and_later_withdrawal(self):
        self.page("index.html", "Home")
        self.page("topic/index.html", "Written before publication")
        self.write("handout.pdf", "A separately listed download")
        base = self.initial("/", "/handout.pdf")
        self.page("index.html", '<a href="/topic">Read the topic</a>')
        self.commit("Link the newly public section", "2026-11-13T10:00:00+00:00")
        expected = {"/": "2026-11-13", "/topic/": "2026-11-13", "/handout.pdf": INITIAL_DATE}
        self.assertEqual(self.update(base), expected)
        self.commit("Publish discovery results", "2026-11-14T10:00:00+00:00")
        self.assertEqual(self.update(base), expected)
        self.write("topic/index.html", '<!doctype html><meta name="robots" content="noindex"><body>Withdrawn')
        self.commit("Withdraw topic from indexing", "2026-11-15T11:00:00+00:00")
        self.assertEqual(self.update(base), {"/": "2026-11-13", "/handout.pdf": INITIAL_DATE})


    def test_robots_resolves_specific_groups_and_longest_path_rules(self):
        self.page("index.html", "Home")
        base = self.initial("/")
        for path in ("hidden/one.html", "hidden/ok.html", "café.html", "public.html"):
            self.page(path, "Article", f'<link rel="canonical" href="/{path}">')
        self.write("robots.txt", """User-agent: *
Disallow: /
User-agent: Googlebot
Allow: /
Disallow: /hidden/
Disallow: /*é.html$
User-agent: Googlebot
Allow: /hidden/ok.html$
Disallow: /hidden/ok.html$
""")
        self.commit("Publish pages with crawl rules", "2026-11-13T08:00:00+00:00")
        self.assertEqual(self.update(base), {
            "/": INITIAL_DATE, "/hidden/ok.html": "2026-11-13", "/public.html": "2026-11-13",
        })


if __name__ == "__main__":
    unittest.main()
