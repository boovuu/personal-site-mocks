/* bogdanvuckovic.com - tracker activation file.
   One file drives every tracker on the site. Fill an ID below and the tracker
   switches on site-wide on the next deploy; an empty string keeps it off.
   Wired into every canon page as: <script src="/assets/trackers.js" defer></script> */
(function () {
  "use strict";

  var CONFIG = {
    /* Google Analytics 4 measurement ID, e.g. "G-ABCDEF1234".
       Source: analytics.google.com -> Admin -> Data streams -> web stream. */
    ga4: "",

    /* RB2B pixel script URL, from dashboard: Script -> View Script.
       Paste the src URL of their snippet; if their snippet is not a plain
       script tag, wire the exact snippet here instead. */
    rb2b: "",

    /* Any additional tracker script URLs (MoltSets needs none: it is an
       agent-side API, not a site pixel). */
    extra: []
  };

  var active = [CONFIG.ga4, CONFIG.rb2b].concat(CONFIG.extra).filter(Boolean);
  if (!active.length) return; /* nothing configured: page stays untouched */

  function inject(src) {
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  /* GA4 (gtag.js) */
  if (CONFIG.ga4) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", CONFIG.ga4);
    inject("https://www.googletagmanager.com/gtag/js?id=" + CONFIG.ga4);
  }

  /* RB2B and any extras */
  if (CONFIG.rb2b) inject(CONFIG.rb2b);
  CONFIG.extra.forEach(inject);
})();
