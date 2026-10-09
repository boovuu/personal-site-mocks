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
      strong:"Every part accountable.",      // proofId: proof.system-view (GPT: 'Nothing left to chance' = nedokazljiv apsolut)
      proofId: "proof.map-card"
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
      body: "Toggle the reason layer: every section carries its why.", href: "#", linkLabel: "Toggle reasons", proofId: "proof.reason-layer" },
    { code: "Exhibit B · the engine", title: "D.I.C.E. — randomness you can audit",
      body: "Same seed, same draw, forever. Deterministic creative engine with real hashes.", href: "#", linkLabel: "Coming soon", proofId: "proof.dice" }
  ],

  /* ---- 8b. PROOF REGISTER (GPT enforcement: proofId → dokaz) --
     Svaka tvrdnja sa proofId mora imati unos ovde. Lint proverava.
     level: artifact (klikljivo) | example (imenovan slučaj) | metric (broj) | none (još nema) -------------------------------------------------- */
  proofs: {
    "proof.map-card":     { level: "artifact", what: "The operating-map card itself + the reason layer on this page", where: "hero map card / reasons toggle" },
    "proof.reason-layer": { level: "artifact", what: "Reasons toggle annotates every section with its why",  where: "top bar of this page" },
    "proof.dice":         { level: "none",     what: "D.I.C.E. deterministic engine (JS port planned)",       where: "/dice — not yet built" },
    "proof.chain-visible":{ level: "artifact", what: "Every work case ships with problem → move → result → limits", where: "Selected work section" },
    "proof.case-scale":   { level: "metric",   what: "1,500+ CMS records moved into one system",              where: "Travel operator case" },
    "proof.case-tokens":  { level: "metric",   what: "38 styles collapsed into one token law",                where: "SaaS marketing case" },
    "proof.anonymized":   { level: "example",  what: "All cases anonymized by rule; details shared privately on request", where: "Selected work + on request" }
  },

  /* ============================================================
     9. STRATEGIJSKI SLOJ (Canopy model — context tokens)
     Ovo je "mozak" ispod teksta: svaka rečenica na sajtu mora
     da pokazuje na bar jedan token odavde. Menjaš ovde → celo
     mesto poruke se pomera skupa. STRATEGE: edituj slobodno;
     STRANICA: ne dodaje ništa što nema token.
     ============================================================ */
  strategy: {

    /* -- 9a. CONTEXT TOKENS (4 sloja, Canopy hijerarhija) ---- */
    contextTokens: {

      /* SLOJ 1 — FOUNDATION: uzvodne istine. Ako se ovo menja,
         pregleda se CEO sajt (hero, ICP, messaging). */
      foundation: [
        { token: "category.core",
          value: "Growth engineering on the Webflow stack",
          note:  "Šta si po kategoriji. Jedan brend = jedna kategorija." },
        { token: "audience.primary",
          value: "Founders, agency principals, and marketing/ops leads at B2B teams whose website is a revenue surface, not a brochure",
          note:  "Kome sajt govori pre svih. Vidi ICP ispod." },
        { token: "problem.site-decay",
          value: "Websites fray at the seams: broken tracking, one-off pages, consent drift, measurement nobody trusts",
          note:  "Bol koju rešavaš. Bez nje nema urgencije." },
        { token: "promise.carries-the-work",
          value: "A website that holds together — and carries the work behind it to revenue",
          note:  "Obećanje u jednoj rečenici. Hero pokazuje ovaj token." }
      ],

      /* SLOJ 2 — NARRATIVE: kako se priča priča. */
      narrative: [
        { token: "message.operator-first",
          value: "Speak as the one operator who owns the whole surface, not a vendor list of services",
          note:  "Glas sajta: vlasnik, ne agencijski brochure." },
        { token: "proof.chain-visible",
          value: "Every case shows the reasoning chain: problem → move → result → limits",
          note:  "Dokaz je lanac razmišljanja, ne samo broj." },
        { token: "proof.live-artifacts",
          value: "Claims are backed by things a stranger can click and check (exhibits, engine, system view)",
          note:  "Ništa što se ne može kliknuti i proveriti." },
        { token: "position.systems-gap",
          value: "Between one-off page vendors and heavyweight agencies: the operator who builds systems that compound",
          note:  "Gde stojiš na tržištu i zašto si skup." }
      ],

      /* SLOJ 3 — EXPERIENCE: kako narativ postaje dizajn. */
      experience: [
        { token: "design.proof-first",
          value: "Show the work early; keep proof close to every claim",
          note:  "Redosled sekcija: rad pre priče o sebi.",
          proofId: "proof.chain-visible" },
        { token: "design.editorial-craft",
          value: "Serif voice, warm paper, generous air — built to feel made by a person who thinks, not a template",
          note:  "Vizuelni identitet (v9). Menja se samo uz ovaj token.",
          proofId: "proof.reason-layer" },
        { token: "visual.restrained-premium",
          value: "Premium through control, whitespace, and disciplined typography — not through decoration",
          note:  "Skupoća dolazi iz urednosti.",
          proofId: "proof.reason-layer" },
        { token: "motion.subtle-refinement",
          value: "Movement only to support clarity; nothing moves without a reason",
          note:  "Motion pravilo za sve buduće sekcije.",
          proofId: "proof.reason-layer" }
      ],

      /* SLOJ 4 — CONVERSION: ponašanje stranice i akcija. */
      conversion: [
        { token: "cta.primary-consult",
          value: "The one door: a paid consult conversation. Everything else routes around it",
          note:  "Jedna konverzija. Role interest ide kroz ista vrata.",
          proofId: "proof.anonymized" },
        { token: "cta.honest-exit",
          value: "If the fit is not there, the site says so — trust filters better than persuasion",
          note:  "Iskrenost kao filter: odbija loše fitove jeftino.",
          proofId: "proof.anonymized" },
        { token: "guardrail.claim-backed",
          value: "No claim ships without a visible artifact or number behind it",
          note:  "Tvrd zakon: bez dokaza se ne objavljuje.",
          proofId: "proof.reason-layer" },
        { token: "guardrail.client-safe",
          value: "Clients anonymized by rule; internals stay internal",
          note:  "Zaštita klijenata i tebe. Nikad prava imena.",
          proofId: "proof.anonymized" }
      ]
    },

    /* -- 9b. ICP (ko je idealan klijent — Canopy ICP format) - */
    icp: {
      summary: "B2B teams whose website is a revenue surface and who have outgrown one-off fixes: they need an operator who owns the whole surface — platform, measurement, conversion — as one system.",
      priority: [
        {
          tier: "ICP 1 · best fit",
          who: "B2B SaaS and established service companies with a Webflow/CMS site already earning (or meant to earn) pipeline",
          why: [
            "they feel the tracking/CMS/consent pain weekly",
            "they can buy an operator, not a project",
            "existing stack means systems work, not rip-and-replace"
          ]
        },
        {
          tier: "ICP 2 · validation",
          who: "Larger marketing teams with formal processes and agencies in the loop",
          why:  ["strong enterprise signal", "bigger contracts", "but slower cycles and heavier coordination"]
        },
        {
          tier: "ICP 3 · adjacent",
          who: "Founders needing full site rebuilds from zero",
          why:  ["welcome work, but weakest proof fit", "keeps the story less sharp — secondary"]
        }
      ],
      buyerCommittee: [
        { role: "Economic buyer",      who: "Founder / CEO / CMO",                 concern: "Will the site carry more revenue, not just look better?" },
        { role: "Operational champion",who: "Head of Marketing / Growth lead",     concern: "Will this remove the weekly site-ops drag from my plate?" },
        { role: "Analytical champion", who: "Performance / analytics lead",        concern: "Will the numbers finally survive an audit?" },
        { role: "Technical stakeholder",who: "Web/ops engineer",                   concern: "Will it connect to our stack without disruption?" }
      ],
      jobs: {
        functional: [
          "trust the analytics before spending on campaigns",
          "launch pages without breaking tracking or consent",
          "get AEO/schema right so AI engines quote the site correctly",
          "stop rebuilding the same page twice"
        ],
        emotional: [
          "feel the site is finally under control",
          "stop being embarrassed by broken details in front of leadership"
        ],
        social: [
          "look disciplined to the board and investors",
          "show a modern operating posture"
        ]
      },
      triggers: [
        "campaign metrics nobody trusts",
        "a site redesign that frayed within months",
        "AI search changing how buyers find them",
        "new CMO/CEO wants a cleaner web operation",
        "consent/privacy pressure from legal"
      ],
      objections: [
        { objection: "we already have an agency",            answer: "I am not a replacement — I own the seams agencies leave open: tracking, schema, systems, QA" },
        { objection: "we have dashboards",                   answer: "Dashboards show what happened; I make the instrumentation trustworthy first" },
        { objection: "sounds like more tooling",             answer: "Fewer moving parts, one owner — the opposite of tool sprawl" },
        { objection: "AI search is overhyped",               answer: "Structured, answer-shaped sites get quoted; that is measurable, not hype" }
      ],
      bestFitSignals: [
        "revenue depends on the site and they know it",
        "existing Webflow/CMS stack with real traffic",
        "marketing and ops both care about the numbers",
        "someone is hand-stitching reports or fixes weekly"
      ],
      weakFitSignals: [
        "single landing page, price shopping",
        "want a pretty brochure with no measurement",
        "need a full-time in-house hire, not an operator"
      ]
    },

    /* -- 9c. MESSAGING (Canopy messaging-architecture format)  */
    messaging: {
      goal: "Make Bogdan immediately legible as the operator whose websites carry real business work — premium, precise, provable.",
      core: "I build and run websites that hold together: Webflow and CMS architecture, measurement that survives audits, consent that behaves, and conversion work with visible reasoning.",
      oneLiner: "Websites that carry the work.",
      elevator: "B2B teams come to me when their site has outgrown one-off fixes. I own the whole surface — platform, content system, analytics, consent, conversion — as one connected system, and every claim on my own site is backed by something you can click.",
      heroRoutes: [
        { headline: "A website should carry the work.",                        note: "current — craft-first" },
        { headline: "The operator your website outgrew.",                      note: "pain-first" },
        { headline: "One owner. Every seam. Measured.",                        note: "systems-first" }
      ],
      pillars: [
        { pillar: "Systems over one-off pages",
          support: "Tokens, section libraries, CMS architecture — a new page should cost an afternoon, not a redesign.",
          proofTypes: ["38→1 case", "section library", "/system exhibit"],
          proofId: "proof.case-tokens" },
        { pillar: "Measurement that survives an audit",
          support: "GA4, GTM, Consent Mode v2 — built like it will be audited, because it will.",
          proofTypes: ["clean before/after attribution case", "consent discipline case"] },
        { pillar: "Quoted by machines",
          support: "Schema, unified @graph, answer-shaped content — search and AI engines parse and quote the site correctly.",
          proofTypes: ["1,500-record CMS case", "AEO layer of this very site"] },
        { pillar: "Agents draft. Humans sign.",
          support: "Agent-built systems do the repeatable; judgment stays with the person who signs.",
          proofTypes: ["this site's own build", "D.I.C.E. engine"] }
      ]
    },

    /* -- 9d. ARTIFACT BINDINGS (koji token drži koji deo) ---- */
    bindings: [
      { artifact: "Hero (eyebrow + lead + copy)", needs: "promise.carries-the-work · category.core", keeps: "strategic center of gravity" },
      { artifact: "Operating map card",           needs: "position.systems-gap · message.operator-first", keeps: "the system story in one diagram" },
      { artifact: "Approach section",             needs: "problem.site-decay · design.proof-first", keeps: "why details matter" },
      { artifact: "Selected work cases",          needs: "proof.chain-visible · guardrail.client-safe", keeps: "anonymized reasoning chains" },
      { artifact: "Principles",                   needs: "message.operator-first · visual.restrained-premium", keeps: "the operating posture" },
      { artifact: "Exhibits",                     needs: "proof.live-artifacts · guardrail.claim-backed", keeps: "clickable proof" },
      { artifact: "Contact block",                needs: "cta.primary-consult · cta.honest-exit", keeps: "the one door, honest exit" },
      { artifact: "Whole design skin",            needs: "design.editorial-craft · visual.restrained-premium · motion.subtle-refinement", keeps: "editorial craft identity" }
    ],

    /* -- 9e. CHANGE CASCADE (šta se pregleda kad token menjaš) */
    cascade: [
      { if: "category.core or audience.primary changes", review: ["hero language", "ICP section", "messaging one-liner", "meta description"] },
      { if: "promise.carries-the-work changes",          review: ["hero lead", "contact heading", "footer note"] },
      { if: "proof.chain-visible changes",               review: ["all work cases", "exhibits"] },
      { if: "cta.primary-consult changes",               review: ["hero CTA", "nav CTA", "contact block"] },
      { if: "design.editorial-craft changes",            review: ["DESIGN.md", "fonts", "palette", "v9 skin"] }
    ],

    /* -- 9f. OPERATING TEST (Canopy working rule) ------------ */
    operatingTest: [
      "Which token does this section inherit?",
      "Which token does it prove?",
      "If the answers are fuzzy, the section is drifting — cut it or register its token."
    ]
  }
};
