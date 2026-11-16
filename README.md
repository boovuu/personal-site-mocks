# Personal site

- `index.html`: the current homepage, a self-contained editorial page using Petar’s bitmap design. Its copy lives in this file.
- `workbench.html`: Behind the site, the hub for explanations, design rules, and open decisions.
- `v9-carries-the-work.html`: annotated companion to the homepage.
- `archive.html`: earlier visual directions and identity exploration. Old URLs remain available.

The homepage links to Behind the site in its footer. Supporting pages provide a route back home.

## Updating

Edit current homepage copy in `index.html`. `site-content.js` and `content.duckdb` supply the earlier v9/v10 studies and the workbench; they do not render the current homepage. Use `node build-from-duckdb.js` when editing those legacy content sources. For current changes, run `node scripts/sync-navigation.js --check` and `node scripts/check-tokens.js .`, then review the page on desktop and mobile.

## Draft limitations

The contact address is a placeholder, D.I.C.E. has no live artifact, and price and identity decisions remain open. Workbench status is manually maintained, not live telemetry.

The header and favicon use the identity study’s small Bearing coin: a needle and star. The full two-sided coin remains documented in the identity study.

## Editorial revision · 11 October 2026

The homepage addresses business leaders through direction, judgement, and coordination. Three notes carry the researched thinking: the quartermaster analogy, brand versus website, and a website-purpose guide. `dice.html` adapts the existing identity study’s seed generator into a standalone project study; it is not a completed logbook or a port of the original engine. The author rejected the 38-styles case; it has been removed from current content and the database. The prior strategy is labeled historical in `strategy-history.json`.

The database exporter now writes inside this checkout. The content drift check compares body copy as well as titles and returns a failure on divergence.

## Cinematic alternative

`cinematic.html` explores a full-screen sea, sky, guiding star and sailing ship. It shares the editorial content and leaves `index.html` intact. The hero uses a generated still image with slow movement; reduced-motion preferences disable the movement.
