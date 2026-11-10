/* bogdanvuckovic.com - tracker activation file.
   One file drives every tracker on the site. Fill an ID below and the tracker
   switches on site-wide on the next deploy; an empty string keeps it off.
   Wired into every canon page as: <script src="/assets/trackers.js" defer></script> */
(function () {
  "use strict";

  var CONFIG = {
    /* Google Tag Manager container ID. Fires GA4 through the container; tags
       are then managed from the GTM web UI with no repo edits.
       Source: tagmanager.google.com, container ID in the page header. */
    gtm: "GTM-MBGWTGHQ",

    /* Google Analytics 4 measurement ID for direct gtag.js, e.g. "G-ABCDEF1234".
       Fill EITHER gtm OR ga4, never both (double counting).
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

  var active = [CONFIG.gtm, CONFIG.ga4, CONFIG.rb2b].concat(CONFIG.extra).filter(Boolean);
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

  /* Google Tag Manager (loads GTM; the container fires the GA4 property).
     The noscript iframe part of Google's snippet is omitted: it exists for
     JS-disabled visitors, and analytics cannot run without JS anyway. */
  if (CONFIG.gtm) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    inject("https://www.googletagmanager.com/gtm.js?id=" + CONFIG.gtm);
  }

  /* RB2B and any extras */
  if (CONFIG.rb2b) inject(CONFIG.rb2b);
  CONFIG.extra.forEach(inject);
})();
