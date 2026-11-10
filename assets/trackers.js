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

    /* RB2B account key, from dashboard: Script -> View and install script.
       Their pixel is an inline loader script (not a plain tag), wired
       verbatim in the RB2B section below. */
    rb2b: "E63P0HYRYDOW",

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

  /* RB2B pixel: their official inline loader, wired verbatim from the
     dashboard. Identifies US-traffic visitors; alerts deliver via Slack. */
  if (CONFIG.rb2b) {
    !function (key) {
      if (window.reb2b) return;
      window.reb2b = { loaded: true };
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://ddwl4m2hdecbv.cloudfront.net/b/" + key + "/" + key + ".js.gz";
      document.getElementsByTagName("script")[0].parentNode.insertBefore(s, document.getElementsByTagName("script")[0]);
    }(CONFIG.rb2b);
  }

  /* any extras */
  CONFIG.extra.forEach(inject);
})();
