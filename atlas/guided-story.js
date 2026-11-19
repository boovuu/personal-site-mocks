(() => {
  'use strict';

  // The chapter links remain ordinary anchors, including with JavaScript disabled.
  const chapters = [...document.querySelectorAll('[data-chapter]')];
  const chapterLinks = [...document.querySelectorAll('.journey-nav > a')];
  function markChapter() {
    let active = chapters[0];
    for (const chapter of chapters) {
      if (chapter.getBoundingClientRect().top <= Math.min(window.innerHeight * .35, 220)) active = chapter;
    }
    for (const link of chapterLinks) {
      if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { markChapter(); scheduled = false; });
  }, { passive: true });
  window.addEventListener('resize', markChapter);
  window.addEventListener('pageshow', markChapter);
  markChapter();

  const coin = document.getElementById('turn-coin');
  coin.addEventListener('click', () => {
    const bearing = coin.getAttribute('aria-pressed') !== 'true';
    coin.setAttribute('aria-pressed', String(bearing));
    coin.setAttribute('aria-label', `Turn the Reckoning Coin to the ${bearing ? 'Seed' : 'Bearing'} face`);
    document.getElementById('coin-face-label').textContent = bearing
      ? 'Bearing · the direction you choose, 022.5°'
      : 'Seed · the starting point chance gives you';
    document.getElementById('coin-face-note').textContent = bearing
      ? 'The compass points at 022.5°, north-northeast: a chosen heading.'
      : 'The five stars connect to Cassiopeia, a constellation that helps you find north.';
  });

  const periods = {
    '2023': ['An observation', 'An answer that did not match its source.', 'An early note records an AI getting a website wrong. The archive preserves the note. The original exchange hasn’t been reproduced in this study.'],
    '2024': ['More questions', 'What did the answer use?', 'The notes and article drafts start looking at retrieval, citations and comparisons between sources. If a later article repeats a number, that’s still the same underlying evidence.'],
    '2025': ['An operating model', 'What should we actually measure?', 'The playbook moves into visibility, sentiment, citations and measurement. It describes what to track. The KPIs listed here are proposed targets.'],
    '2026': ['A field study', 'What did Google actually fetch?', 'The session account reports requests from Google’s testing tools. I still need the original request logs to check that account. It doesn’t yet tell us what routine crawling, indexing or AI citations did.']
  };
  for (const button of document.querySelectorAll('[data-year]')) {
    button.addEventListener('click', () => {
      for (const peer of document.querySelectorAll('[data-year]')) peer.setAttribute('aria-pressed', String(peer === button));
      const year = button.dataset.year;
      const [label, title, body] = periods[year];
      document.getElementById('year-label').textContent = `${year} / ${label}`;
      document.getElementById('year-title').textContent = title;
      document.getElementById('year-body').textContent = body;
      const source = document.getElementById('year-source');
      source.href = year === '2026' ? 'aeo.html#field-study' : 'aeo.html#plate';
      source.textContent = year === '2026' ? 'Read the field study ↗' : 'Open the illustrated research ↗';
    });
  }

  // These synthetic examples and resources are copied from abm-network.js.
  const entrances = {
    vertical: {
      page: 'Field service software for HVAC contractors',
      visit: 'Reads the HVAC page, then opens the multi-site maintenance example.',
      offer: 'A multi-site maintenance checklist',
      reason: 'Planning maintenance across several sites? Use six questions to check what your current process can handle.',
      inference: 'Multi-site maintenance may be relevant. Industry fit alone does not reveal a purchase plan.',
      content: ['List the sites, equipment and maintenance intervals you need to cover.', 'Identify who owns each schedule and who can change it.', 'Check how urgent jobs are prioritised alongside planned work.', 'Confirm what a technician can access without a connection.', 'Decide which proof of completion the customer needs.', 'Name one measure for a pilot: missed visits, repeat visits or scheduling time.']
    },
    pain: {
      page: 'Reduce repeat visits caused by missing job information',
      visit: 'Reads the repeat-visit article and returns to the section about technicians arriving without the right history.',
      offer: 'A repeat-visit audit worksheet',
      reason: 'Still sending someone back to finish a job? Review ten recent repeat visits and find which information was missing.',
      inference: 'Incomplete job information is a plausible concern. A return visit is not proof of buying intent.',
      content: ['Choose ten recent jobs that required an unplanned return.', 'For each, record the stated reason for the second visit.', 'Mark whether equipment history, parts, photos or access details were missing.', 'Record when the missing information became available.', 'Choose the most frequent preventable cause and one change to test.', 'Review the next ten comparable jobs; compare causes, not just the raw number of visits.']
    },
    solution: {
      page: 'Connect dispatch, job records and invoicing',
      visit: 'Opens the integration guide, then the migration questions.',
      offer: 'An integration planning checklist',
      reason: 'Mapping how a new system would fit? Use this checklist to identify records, owners and failure cases before choosing a tool.',
      inference: 'The visitor may be evaluating how a system would fit. An integration page visit does not establish budget or authority.',
      content: ['Name the source of truth for customers, jobs, parts and invoices.', 'List which records need to move in each direction.', 'Decide how duplicate records and conflicting updates are resolved.', 'Identify who reviews a failed transfer and how quickly.', 'Choose a small migration sample and a way to reconcile it.', 'Write acceptance criteria and a rollback plan before moving live records.']
    }
  };
  for (const button of document.querySelectorAll('[data-entry]')) {
    button.addEventListener('click', () => {
      for (const peer of document.querySelectorAll('[data-entry]')) peer.setAttribute('aria-pressed', String(peer === button));
      const entry = entrances[button.dataset.entry];
      for (const field of ['page', 'visit', 'offer', 'reason', 'inference']) document.getElementById(`entry-${field}`).textContent = entry[field];
      document.querySelector('#resource-details summary').textContent = button.dataset.entry === 'pain' ? 'Open the worksheet' : 'Open the checklist';
      document.getElementById('resource-items').replaceChildren(...entry.content.map(text => {
        const item = document.createElement('li');
        item.textContent = text;
        return item;
      }));
    });
  }
})();
