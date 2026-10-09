/* ============================================================
   SITE CONTENT — JEDINI FAJL KOJI MENJAŠ ZA IDENTITET SAJTA
   ============================================================
   Sve što se na sajtu vidi kao "ko si ja, šta radim, kako me
   se kontaktira" je OVDE. Dizajn (v9.html) samo čita ova polja.
   Promeni text -> sajt se menja. Ne treba dirati HTML.

   PRAVILA (kratko):
   - clients: anonimizovane oznake, NIKAD prava imena klijenata
   - claims: samo brojevi koje možeš da dokazuješ
   - email: zameni placeholder pre objave
   ============================================================ */

window.SITE = {

  /* ---- 1. identitet (ko si) ------------------------------- */
  identity: {
    name:        "Bogdan Vučković",
    role:        "Independent website operator",
    location:    "Belgrade, Serbia",
    timezone:    "Working across time zones",
    brandLine:   "Websites · systems · growth",
    sealLetter:  "B",                     // slovo u pečatu
    email:       "hello@example.com",     // PLACEHOLDER — zameni pre objave
    github:      "https://github.com/boovuu"
  },

  /* ---- 2. hero (prvi ekran) ------------------------------- */
  hero: {
    eyebrow:    "The work behind the website",
    lead:       "A website should <em>carry</em> the work.",
    copy:       "I help B2B teams build and run websites that hold together — from Webflow and CMS to analytics, conversion, consent, and launch.",
    primaryCta: { label: "See how I work", href: "#work" },
    secondaryCta:{ label: "A little about my approach", href: "#approach" },
    mapCard: {
      code:  "Operating map / 01",
      label: "Web system",
      stops: ["CONTENT", "PLATFORM", "MEASURE", "IMPROVE"],
      note:  "One connected system.",
      strong:"Nothing left to chance."
    }
  },

  /* ---- 3. sekcija "how I see it" -------------------------- */
  approach: {
    kicker:  "01 / How I see it",
    heading: "The site is not a poster. It is part of how the business works.",
    body: [
      "Good work lives in the details people rarely see: a form that reaches the right place, a CMS that stays usable, consent that behaves properly, analytics that can be trusted.",
      "I work across those details and the bigger picture. The aim is a site the team can rely on after launch, not a beautiful handoff that starts to fray."
    ]
  },

  /* ---- 4. rad (anonimizovano, po zakonu fronta) -----------
     industry = maska (nikad pravo ime klijenta)
     chain    = lanac razloga: problem → potez → rezultat → granice
     measure  = šta je mereno (samo dokazivi brojevi)
  ------------------------------------------------------------ */
  work: {
    kicker:  "02 / Selected work",
    heading: "Built to hold together.",
    sub:     "Different teams. Shared discipline. Names withheld by rule.",
    cases: [
      {
        industry: "Enterprise software",
        title:    "Website operations, end to end",
        body:     "Webflow, analytics, consent, hiring flows, structured data, and ongoing performance work — one owner across the whole surface.",
        chain:    "problem: no owner across seams → move: single-operator coverage → result: site holds shape between teams → limits: numbers shared on request",
        tags:     ["Webflow", "Analytics", "Growth systems"]
      },
      {
        industry: "Contract management",
        title:    "Marketing site and campaigns",
        body:     "Campaign pages with attention to consent, embedded video, and the details that keep measurement intact.",
        chain:    "problem: measurement broke at the edges → move: consent + embed discipline → result: clean data survives campaigns → limits: baseline pre-dates tooling",
        tags:     ["CMS", "Campaigns", "Measurement"]
      },
      {
        industry: "Travel operator · at scale",
        title:    "1,500 records, one system",
        body:     "A property CMS rebuilt as architecture, with schema and answer-shaped content that search and AI engines parse.",
        chain:    "problem: one-off pages decayed → move: CMS as system + schema @graph → result: machine-quotable structure → limits: quoted volume still accruing",
        tags:     ["CMS architecture", "Schema", "AEO"]
      },
      {
        industry: "SaaS marketing",
        title:    "From 38 styles to one",
        body:     "A marketing site rebuilt on tokens and a section library. Pages stopped being designed twice.",
        chain:    "problem: 38 ad-hoc styles → move: token law + section library → result: new page costs an afternoon → limits: library still grows",
        tags:     ["Design systems", "Tokens", "Delivery"]
      }
    ]
  },

  /* ---- 5. principi rada ----------------------------------- */
  principles: {
    kicker:  "03 / Working principles",
    heading: "Clear thinking. Careful execution.",
    items: [
      { title: "Know what the site needs to do.",
        body:  "Start with the job, the audience, and the constraints. Then choose the right build." },
      { title: "Make the invisible parts dependable.",
        body:  "Forms, data, consent, redirects, accessibility, and performance deserve the same care as the page itself." },
      { title: "Leave the team in a better position.",
        body:  "Build for the next edit, the next campaign, and the person who has to maintain it." }
    ]
  },

  /* ---- 6. kontakt (konsultacije = jedra vrata) ------------ */
  contact: {
    kicker:  "A good place to start",
    heading: "Where is your website getting stuck?",
    body:    "Tell me what is not working. We can work out what it needs next.",
    cta:     { label: "Start a conversation", href: "mailto:hello@example.com" }  // PLACEHOLDER email
  },

  /* ---- 7. futer ------------------------------------------- */
  footer: {
    note: "Built with intent, not noise.",
    backToTop: "Back to the top"
  },

  /* ---- 8. eksponati (živi dokazi, u izradi) --------------- */
  exhibits: [
    { code: "Exhibit A · this site", title: "The system, with reasons on",
      body: "Toggle the reason layer: every section carries its why.", href: "#", linkLabel: "Toggle reasons" },
    { code: "Exhibit B · the engine", title: "D.I.C.E. — randomness you can audit",
      body: "Same seed, same draw, forever. Deterministic creative engine with real hashes.", href: "#", linkLabel: "Coming soon" }
  ]
};
