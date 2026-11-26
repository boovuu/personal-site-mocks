/* bogdanvuckovic.com - tracker activation file.
   One file configures the trackers. Empty IDs disable them. Clarity also
   requires a visitor's opt-in on the canonical public website.
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

    /* Public Digital Atlas project ID from its Clarity tracking code.
       An empty ID disables recording and its opt-in control. Never put an export token here. */
    clarity: "zjxc30ib05",

    /* Any additional tracker script URLs (MoltSets needs none: it is an
       agent-side API, not a site pixel). */
    extra: []
  };

  function inject(src) {
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  function installClarity(projectId) {
    if (!/^[a-z0-9]+$/i.test(projectId) || !projectId || window.location.origin !== "https://bogdanvuckovic.com" ||
        window.top !== window || document.getElementById("atlas-recording-settings")) return;

    var key = "atlas.clarity-consent.v1";
    var started = false;
    var panel = document.createElement("details");
    panel.id = "atlas-recording-settings";
    panel.style.cssText = "font:normal .85rem/1.5 system-ui,sans-serif;letter-spacing:normal;text-transform:none;max-width:42ch;text-align:start;";
    panel.innerHTML = '<summary style="cursor:pointer">Session recording</summary>' +
      '<p>Microsoft Clarity can record clicks and scrolling on this site and use cookies to link your visits. ' +
      '<a href="https://privacy.microsoft.com/privacystatement">Microsoft privacy statement</a>.</p>' +
      '<label><input type="checkbox"> Allow session recording</label><p role="status"></p>';
    var checkbox = panel.querySelector("input");
    var message = panel.querySelector('[role="status"]');
    var footers = document.querySelectorAll("footer");
    var footer = footers[footers.length - 1];
    (footer || document.body).appendChild(panel);

    function allowed() {
      if (navigator.globalPrivacyControl === true) return false;
      try { return localStorage.getItem(key) === "granted"; } catch (_) { return false; }
    }

    function applyChoice() {
      var granted = allowed();
      checkbox.checked = granted;
      if (granted && !started) {
        started = true;
        window.clarity = window.clarity || function () {
          (window.clarity.q = window.clarity.q || []).push(arguments);
        };
        window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
        inject("https://www.clarity.ms/tag/" + projectId);
      } else if (!granted && started) {
        started = false;
        window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
        // With denied storage the SDK can restart in cookieless mode. A fresh page
        // enforces the saved choice and also cancels any still-loading tag.
        window.location.reload();
      }
    }

    checkbox.disabled = navigator.globalPrivacyControl === true;
    if (checkbox.disabled) message.textContent = "Recording is off because your browser signals Global Privacy Control.";
    checkbox.addEventListener("change", function () {
      try {
        localStorage.setItem(key, checkbox.checked ? "granted" : "denied");
      } catch (_) {
        checkbox.checked = false;
        message.textContent = "Your browser could not save this choice. Recording is off.";
        if (started) {
          window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
          window.location.reload();
        }
        return;
      }
      applyChoice();
    });
    window.addEventListener("storage", function (event) {
      if (event.key === key || event.key === null) applyChoice();
    });
    window.addEventListener("pageshow", applyChoice);
    applyChoice();
  }

  installClarity(CONFIG.clarity);
  // These pages previously had no GTM or RB2B tags. They opt in only to the recording settings.
  if (document.currentScript && document.currentScript.hasAttribute("data-clarity-only")) return;

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
