# Personal site

- `index.html`: the current homepage, a self-contained editorial page using Petar’s bitmap design. Its copy lives in this file.
- `work/wos.html`: the detailed WOS case, linked from the broader enterprise website example.
- `work/hybrid-publishing.html`: the anonymised Sanity + Webflow hybrid publishing case.
- `assets/work-case.css`: the shared case-page layout and typography.
- `workbench.html`: Behind the site, the hub for explanations, design rules, and open decisions.
- `v9-carries-the-work.html`: annotated companion to the homepage.
- `archive.html`: earlier visual directions and identity exploration. Old URLs remain available.

The homepage links to Behind the site in its footer. Supporting pages provide a route back home.

## Updating

Edit current homepage copy in `index.html`. `site-content.js` and `content.duckdb` supply the earlier v9/v10 studies and the workbench; they do not render the current homepage. Use `node build-from-duckdb.js` when editing those legacy content sources. For current changes, run `node scripts/sync-navigation.js --check` and `node scripts/check-tokens.js .`, then review the page on desktop and mobile.

After a push to `main`, the **Update sitemap** workflow discovers published HTML pages on the site's domain. Link a new page from a listed public page, or give it a canonical link to its own HTTPS URL if it should be discoverable on its own. For example, `notes/new-story/index.html` is listed as `/notes/new-story/`. Public links can lead through multiple new pages in the same release.

The workflow excludes drafts, archived design variants, the crawler experiment, redirects, pages marked `noindex`, pages blocked for Googlebot in `robots.txt`, and copies that declare another canonical URL. It removes a repository-backed page when its source is deleted or it becomes ineligible. Routes served outside this repository can still be listed manually.

The workflow updates `lastmod` when a page first becomes public or when its text, links, search metadata, embedded data, or referenced local media and application scripts change. Dates use the mainline commit date in Belgrade time. CSS, favicons, and the shared analytics script are excluded. When the sitemap changes, the workflow commits it and requests a GitHub Pages build. You can rerun it from Actions to retry a publish.

## Draft limitations

The contact address is a placeholder, D.I.C.E. has no live artifact, and price and identity decisions remain open. Workbench status is manually maintained, not live telemetry.

The header and favicon use the identity study’s small Bearing coin. The favicon keeps its white needle and red tip legible on light and dark surfaces with a filled disk. Use `<link rel="icon" type="image/png" sizes="96x96" href="/favicon-compass.png">` on public pages. Keep that URL stable and export the PNG and the browser fallback `/favicon.ico` from `favicon.svg` when the artwork changes.

## Editorial revision · 11 October 2026

The homepage addresses business leaders through direction, judgement, and coordination. Three notes carry the researched thinking: the quartermaster analogy, brand versus website, and a website-purpose guide. `dice.html` adapts the existing identity study’s seed generator into a standalone project study; it is not a completed logbook or a port of the original engine. The author rejected the 38-styles case; it has been removed from current content and the database. The prior strategy is labeled historical in `strategy-history.json`.

The database exporter now writes inside this checkout. The content drift check compares body copy as well as titles and returns a failure on divergence.

## Cinematic alternative

`cinematic.html` explores a full-screen sea, sky, guiding star and sailing ship. It shares the editorial content and leaves `index.html` intact. The hero uses a generated still image with slow movement; reduced-motion preferences disable the movement.
