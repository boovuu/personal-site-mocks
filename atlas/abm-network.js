// November 14: a proposed extension, with synthetic examples and cited external experiments.
const abmEntries = {
  "vertical": {
    "label": "Industry",
    "page": "Field service software for HVAC contractors",
    "visit": "Reads the HVAC page, then opens the multi-site maintenance example.",
    "inference": "Multi-site maintenance may be relevant. Industry fit alone does not reveal a purchase plan.",
    "offer": "A multi-site maintenance checklist",
    "reason": "Planning maintenance across several sites? Use six questions to check what your current process can handle.",
    "content": [
      "List the sites, equipment and maintenance intervals you need to cover.",
      "Identify who owns each schedule and who can change it.",
      "Check how urgent jobs are prioritised alongside planned work.",
      "Confirm what a technician can access without a connection.",
      "Decide which proof of completion the customer needs.",
      "Name one measure for a pilot: missed visits, repeat visits or scheduling time."
    ]
  },
  "pain": {
    "label": "Problem",
    "page": "Reduce repeat visits caused by missing job information",
    "visit": "Reads the repeat-visit article and returns to the section about technicians arriving without the right history.",
    "inference": "Incomplete job information is a plausible concern. A return visit is not proof of buying intent.",
    "offer": "A repeat-visit audit worksheet",
    "reason": "Still sending someone back to finish a job? Review ten recent repeat visits and find which information was missing.",
    "content": [
      "Choose ten recent jobs that required an unplanned return.",
      "For each, record the stated reason for the second visit.",
      "Mark whether equipment history, parts, photos or access details were missing.",
      "Record when the missing information became available.",
      "Choose the most frequent preventable cause and one change to test.",
      "Review the next ten comparable jobs; compare causes, not just the raw number of visits."
    ]
  },
  "solution": {
    "label": "Solution",
    "page": "Connect dispatch, job records and invoicing",
    "visit": "Opens the integration guide, then the migration questions.",
    "inference": "The visitor may be evaluating how a system would fit. An integration page visit does not establish budget or authority.",
    "offer": "An integration planning checklist",
    "reason": "Mapping how a new system would fit? Use this checklist to identify records, owners and failure cases before choosing a tool.",
    "content": [
      "Name the source of truth for customers, jobs, parts and invoices.",
      "List which records need to move in each direction.",
      "Decide how duplicate records and conflicting updates are resolved.",
      "Identify who reviews a failed transfer and how quickly.",
      "Choose a small migration sample and a way to reconcile it.",
      "Write acceptance criteria and a rollback plan before moving live records."
    ]
  }
};
atlasIdeas.push(...[
  {
    "subject": "websites",
    "kind": "ABM development · November 14",
    "sources": [
      [
        "Bogdan’s landing-page network proposal · this conversation, November 14, 2026",
        null
      ]
    ],
    "related": [
      [
        "abm-playbook",
        "Return to the playbook and compare the three entrances."
      ]
    ],
    "id": "abm-vertical",
    "mapLabel": "6a · Enter by industry",
    "mapPoint": [
      0.19,
      0.59
    ],
    "mobilePoint": [
      0.22,
      0.58
    ],
    "title": "Start with the industry a company recognises",
    "summary": "One entrance into the network is a page for a particular vertical. It should describe work that people in that industry recognise and offer evidence relevant to it.",
    "sections": [
      [
        "The net is made of useful entrances",
        "A company does not have to know our product category before finding us. An industry page can meet it through the language of its work. In this demonstration, the example is an HVAC contractor managing maintenance across several customer sites."
      ],
      [
        "What belongs on this page",
        "Show the maintenance workflow, the operational constraints and an appropriate customer example if one exists. A change of logo or headline alone is not a useful industry page. Each page should answer a distinct question; overlapping pages can share one destination."
      ],
      [
        "What this entrance tells us",
        "It provides a hypothesis about relevance. The follow-on pages and voluntary responses may refine it. The page visit itself does not identify a person, confirm a company or tell us that a purchase is imminent."
      ]
    ],
    "trailFrom": "abm-playbook",
    "detail": "",
    "nextStop": "abm-match",
    "entry": "vertical"
  },
  {
    "subject": "websites",
    "kind": "ABM development · November 14",
    "sources": [
      [
        "Bogdan’s landing-page network proposal · this conversation, November 14, 2026",
        null
      ]
    ],
    "related": [
      [
        "abm-playbook",
        "Return to the playbook and compare the three entrances."
      ]
    ],
    "id": "abm-pain",
    "mapLabel": "6b · Enter by problem",
    "mapPoint": [
      0.51,
      0.63
    ],
    "mobilePoint": [
      0.76,
      0.57
    ],
    "title": "Start with a problem the visitor wants to solve",
    "summary": "A second entrance names a specific difficulty. The visitor can find useful help before deciding whether they need a particular product.",
    "sections": [
      [
        "Make the problem recognisable",
        "The example page asks why technicians have to return to jobs they should have finished on the first visit. It examines missing equipment history, parts and access information. It earns attention by helping the reader diagnose a problem."
      ],
      [
        "Let behaviour refine the offer",
        "Reading an article once is weak evidence. Returning to its diagnostic section gives us a more specific, still uncertain clue. An audit worksheet is a reasonable next offer because it helps the visitor examine their own situation."
      ],
      [
        "Connect the pages without forcing a funnel",
        "Link to a practical diagnosis, an explanation of the relevant solution and a credible example. A visitor should be able to choose. The network gives several routes into the same subject."
      ]
    ],
    "trailFrom": "abm-playbook",
    "detail": "",
    "nextStop": "abm-match",
    "entry": "pain"
  },
  {
    "subject": "websites",
    "kind": "ABM development · November 14",
    "sources": [
      [
        "Bogdan’s landing-page network proposal · this conversation, November 14, 2026",
        null
      ]
    ],
    "related": [
      [
        "abm-playbook",
        "Return to the playbook and compare the three entrances."
      ]
    ],
    "id": "abm-solution",
    "mapLabel": "6c · Enter by solution",
    "mapPoint": [
      0.83,
      0.59
    ],
    "mobilePoint": [
      0.24,
      0.68
    ],
    "title": "Start with the solution someone is already researching",
    "summary": "A third entrance serves visitors who can name the change they want: connect dispatch, job records and invoicing. They need to understand fit and trade-offs.",
    "sections": [
      [
        "Answer the evaluation question",
        "Explain which records connect, what needs configuring and where responsibility sits. Show limitations and migration requirements. A solution page should help a visitor compare approaches, even if they are not ready to request a demo."
      ],
      [
        "Offer help with the decision in front of them",
        "If the visitor moves from integrations to migration, a planning checklist is more relevant than another broad introduction to the industry. The offer follows the question suggested by the visit."
      ],
      [
        "One company can use all three entrances",
        "These are routes into a subject, not fixed categories of people. A company might first arrive through a problem article and later return through a solution page. Keep that sequence instead of permanently assigning it to the first page it touched."
      ]
    ],
    "trailFrom": "abm-playbook",
    "detail": "",
    "nextStop": "abm-match",
    "entry": "solution"
  },
  {
    "subject": "websites",
    "kind": "ABM development · November 14",
    "sources": [
      [
        "Bogdan’s landing-page network proposal · this conversation, November 14, 2026",
        null
      ],
      [
        "6sense · Company Identification API FAQ",
        "https://support.6sense.com/company-identification-api-faq"
      ]
    ],
    "related": [
      [
        "abm-playbook",
        "Return to the playbook and compare the three entrances."
      ]
    ],
    "id": "abm-match",
    "mapLabel": "7 · Connect visits to an account",
    "mapPoint": [
      0.51,
      0.79
    ],
    "mobilePoint": [
      0.73,
      0.78
    ],
    "title": "Bring the visits together without inventing certainty",
    "summary": "An account is a company we want to understand or work with. A useful account view separates observed activity, the evidence for a company match and our interpretation of what the company might need.",
    "sections": [
      [
        "Keep anonymous visits useful",
        "When there is no reliable company match, keep the visitor anonymous and offer content relevant to the current page. The network still works. Do not invent a company or a named decision-maker to complete the diagram."
      ],
      [
        "Add the company only when the evidence supports it",
        "A submitted work email, an existing CRM relationship or a sufficiently reliable company-identification service can support a match, with different limitations. A company-level match is not proof of a particular person. Store the source, time and confidence of the match."
      ],
      [
        "Keep observations separate from interpretation",
        "The account view should show the actual pages and dates, a known relationship and owner if available, then a separate suggested response. Several people may contribute to company-level activity. Do not present their combined history as one person’s journey."
      ]
    ],
    "trailFrom": "abm-vertical",
    "detail": "",
    "nextStop": "abm-offer",
    "alsoFrom": [
      "abm-pain",
      "abm-solution"
    ],
    "abmExample": true
  },
  {
    "subject": "websites",
    "kind": "ABM development · November 14",
    "sources": [
      [
        "Bogdan’s landing-page network proposal · this conversation, November 14, 2026",
        null
      ]
    ],
    "related": [
      [
        "abm-playbook",
        "Return to the playbook and compare the three entrances."
      ]
    ],
    "id": "abm-offer",
    "mapLabel": "8 · Offer useful content",
    "mapPoint": [
      0.81,
      0.94
    ],
    "mobilePoint": [
      0.27,
      0.87
    ],
    "title": "Offer one piece of content that fits the visit",
    "summary": "The slide-in is a small invitation beside the page. Its job is to help with a recognisable question: diagnose a recurring problem, plan a change or evaluate a solution.",
    "sections": [
      [
        "A proposed rule, ready to test",
        "After a visitor has read the relevant section or returned to the subject, offer the matching worksheet once. Do not interrupt arrival. Suppress it after dismissal or after the resource has been opened. These are proposed rules for a pilot; this Atlas demo opens only when you press the button."
      ],
      [
        "The content has to justify the interruption",
        "Name the resource and explain what the reader can do with it. Let them open it without a form in this first experiment. If we later ask for contact information, the value and purpose of that request need to be explicit."
      ],
      [
        "Try the three offers",
        "The entrance you chose carries through to this example. Switch entrances to compare the proposed visit and the resource it leads to. Everything in this demonstration is synthetic; the Atlas is not identifying your company or collecting these events."
      ]
    ],
    "trailFrom": "abm-match",
    "detail": "",
    "nextStop": "abm-evidence",
    "abmExample": true
  },
  {
    "subject": "websites",
    "kind": "ABM development · November 14",
    "sources": [
      [
        "Bogdan’s landing-page network proposal · this conversation, November 14, 2026",
        null
      ]
    ],
    "related": [
      [
        "abm-playbook",
        "Return to the playbook and choose a different entrance."
      ],
      [
        "website-purpose",
        "Connect this experiment to the decision the website should help a buyer make."
      ]
    ],
    "id": "abm-evidence",
    "mapLabel": "9 · Check the evidence",
    "mapPoint": [
      0.25,
      0.94
    ],
    "mobilePoint": [
      0.73,
      0.97
    ],
    "title": "What other teams tested — and what we should test here",
    "summary": "Published examples support parts of this idea. They do not prove the whole network, company identification and slide-in sequence as one system. Each result below belongs to its own experiment.",
    "sections": [
      [
        "What we can reasonably borrow",
        "Industry relevance can help a visitor recognise the offer. More precise wording can improve the fit of incoming leads. A visible content invitation can attract attention. These are plausible explanations to test here, not promises that the published uplifts will repeat."
      ],
      [
        "First test: does the entrance help?",
        "Choose one vertical and one recurring problem. Give each page a distinct job and one useful resource. Compare qualified enquiries and resource use with a suitable existing page. Record traffic source and eligibility so a campaign change is not mistaken for a page improvement."
      ],
      [
        "Second test: does the slide-in add value?",
        "Compare the same resource offered inline with the inline offer plus a slide-in. Keep the copy and eligibility rules constant. Randomly assign eligible accounts when reliable identification exists; otherwise assign visitors consistently and report that limitation. Measure opens per eligible visitor, use of the resource, dismissals and qualified enquiries."
      ],
      [
        "Decide before seeing the result",
        "Choose one primary outcome, the smallest improvement worth detecting and the sample needed from the actual baseline. Keep the assignment and measurement period fixed. Follow account progression separately over time; more clicks alone do not establish a better sales outcome."
      ]
    ],
    "trailFrom": "abm-offer",
    "detail": "",
    "studies": [
      {
        "title": "Samsara · A page that named the right use case",
        "result": "36% higher lead-to-opportunity conversion",
        "body": "Construction visitors researching fleet tracking often needed to track equipment. Samsara changed “GPS Fleet Tracking” to “GPS Asset Tracking for Construction”. Webflow reports a 36% increase in lead-to-opportunity conversion for that change. The likely explanation is a closer match between the visitor’s task and the offer. This is a vendor-published customer story; it does not disclose the sample, baseline or uncertainty. The metric is lead quality progression, not all-site conversion.",
        "url": "https://webflow.com/customers/samsara",
        "source": "Read Webflow’s Samsara case study"
      },
      {
        "title": "Simpro · Industry paths and account-specific pages",
        "result": "3× more likely to engage on industry paths",
        "body": "Mutiny reports that industry paths attracted three times the engagement of generic solution paths. Simpro also used account-specific microsites with relevant testimonials, content from prior conversations and a meeting option with the assigned sales representative. This suggests a useful pattern: connect the entrance, evidence and next action to the company’s situation. The case does not define engagement, provide sample sizes or isolate which element caused the improvement. Its broader business results combine several changes.",
        "url": "https://www.mutinyhq.com/case-studies/simpro",
        "source": "Read Mutiny’s Simpro case study"
      },
      {
        "title": "Ontotext · Test the industry experience against a control",
        "result": "301% reported conversion uplift in a two-month test",
        "body": "Webeo describes a 50/50 comparison of personalised and standard experiences for government and public-sector visitors. After two months it reports a 301% conversion uplift, followed by a wider rollout. The useful lesson is the comparison within one audience before scaling. The summary does not disclose the baseline, sample size, conversion definition or statistical uncertainty; the percentage alone is insufficient to predict our results. Greater industry relevance is a plausible explanation, not a demonstrated mechanism.",
        "url": "https://www.webeo.com/resources/the-power-of-a-b-testing-with-website-personalization-examples/",
        "source": "Read Webeo’s account of the Ontotext test"
      },
      {
        "title": "HubSpot · A slide-in attracted attention",
        "result": "192% higher click-through rate; lead impact is unclear",
        "body": "In a historical one-month test on ten high-traffic posts, HubSpot compared slide-ins with static bottom-of-post calls to action. It reports 192% higher click-through and lower conversion after the click. The article claims 27% more submissions, then contradicts that claim in its next sentence. Treat the submission result as unresolved. Greater visibility may explain the click lift, but this is evidence about placement, not account targeting or qualified pipeline.",
        "url": "https://blog.hubspot.com/marketing/how-to-add-a-slide-in-call-to-action-to-your-blog-posts",
        "source": "Read HubSpot’s original slide-in test"
      }
    ]
  }
]);
