(() => {
  const byId = new Map(atlasIdeas.map(idea => [idea.id, idea]));
  const hero = document.querySelector('.hero');
  const browse = document.querySelector('#browse');
  const reader = document.querySelector('#reader');
  const search = document.querySelector('#idea-search');
  const subject = document.querySelector('#subject');
  const results = document.querySelector('#results');
  const count = document.querySelector('#result-count');
  const map = createTerritoryMap(atlasIdeas, atlasTerritories);
  let readerMap = '';
  let lastDirectory = '#explore';

  function element(tag, value, className) {
    const node = document.createElement(tag);
    if (value) node.textContent = value;
    if (className) node.className = className;
    return node;
  }

  function link(label, url, className) {
    const anchor = element('a', label, className);
    anchor.href = url;
    return anchor;
  }

  function normalized(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f.]/g, '');
  }

  function showResults() {
    const query = normalized(search.value.trim());
    const matches = atlasIdeas.filter(idea => {
      const text = [idea.title, idea.summary, idea.detail, idea.kind, atlasSubjects[idea.subject]].join(' ');
      return (!subject.value || subject.value === idea.subject) && normalized(text).includes(query);
    });
    results.replaceChildren();
    count.textContent = matches.length ? matches.length + (matches.length === 1 ? ' idea' : ' ideas') : 'No ideas match this search.';
    if (!matches.length) {
      const clear = element('button', 'Show all ideas');
      clear.id = 'clear-search';
      clear.addEventListener('click', () => {
        search.value = subject.value = '';
        filterChanged();
        search.focus();
      });
      results.append(clear);
      return;
    }
    for (const [id, title] of Object.entries(atlasSubjects)) {
      const group = matches.filter(idea => idea.subject === id);
      if (!group.length) continue;
      const section = element('section', '', 'result-section');
      section.append(element('h3', title));
      for (const idea of group) {
        const anchor = link('', '#idea/' + idea.id, 'idea-row');
        const arrow = element('span', '→', 'arrow');
        arrow.setAttribute('aria-hidden', 'true');
        anchor.append(element('span', idea.title, 'question'), arrow);
        section.append(anchor);
      }
      results.append(section);
    }
  }

  function filterChanged() {
    const params = new URLSearchParams();
    if (search.value.trim()) params.set('q', search.value.trim());
    if (subject.value) params.set('subject', subject.value);
    lastDirectory = '#index' + (params.size ? '?' + params : '');
    history.replaceState(history.state, '', lastDirectory);
    showResults();
  }

  function sourceList(idea) {
    const part = element('section');
    part.append(element('h2', 'The work behind this idea'));
    const list = element('ul');
    for (const [label, url] of idea.sources) {
      const item = element('li');
      if (url) item.append(link(label, url, 'source'));
      else item.append(element('span', label), element('small', 'Private archive', 'access-note'));
      list.append(item);
    }
    part.append(list);
    return part;
  }

  function relatedList(idea) {
    const part = element('section');
    part.append(element('h2', 'Follow a connected idea'));
    const list = element('ul');
    for (const [id, why] of idea.related) {
      const item = element('li');
      const nextMap = readerMap && map.membership.get(id);
      const anchor = link('', '#idea/' + id + (nextMap ? '?map=' + nextMap : ''), 'suggestion');
      anchor.append(element('strong', byId.get(id).title), element('span', why));
      item.append(anchor);
      list.append(item);
    }
    part.append(list);
    return part;
  }

  function storyArt() {
    const gallery = element('div', '', 'story-art');
    for (const [filename, caption, alt] of [
      ['kata-bird.jpg', 'Kata i ptica na jednoj nozi · The meeting', 'An illustration from Kata’s encounter with the bird'],
      ['vera-garden.jpg', 'Žirafa i tajna bašta · The seed', 'The seed scene from Vera’s garden story']
    ]) {
      const figure = element('figure');
      const image = element('img');
      image.src = filename;
      image.alt = alt;
      const anchor = link('', filename);
      anchor.append(image);
      figure.append(anchor, element('figcaption', caption));
      gallery.append(figure);
    }
    return gallery;
  }

  function readingPassage([title, passage, illustration]) {
    const section = element('section', '', 'reading-passage');
    section.append(element('h2', title), element('p', passage, 'body-copy'));
    if (illustration) {
      const figure = element('figure', '', 'archive-plate');
      const picture = element('img');
      picture.src = illustration.src;
      picture.alt = illustration.alt;
      const caption = element('figcaption');
      if (illustration.href) caption.append(link(illustration.caption + ' →', illustration.href, 'source'));
      else caption.textContent = illustration.caption;
      figure.append(picture, caption);
      section.append(figure);
    }
    return section;
  }

  let offerSupport;
  function loadOfferSupport() {
    if (!offerSupport) offerSupport = (async () => {
      try {
        if (!('popover' in HTMLElement.prototype)) await import('https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js');
        if (!('commandForElement' in HTMLButtonElement.prototype)) await import('https://esm.run/invokers-polyfill');
        return true;
      } catch { return false; }
    })();
    return offerSupport;
  }

  function abmExample(entry, withOffer) {
    const example = abmEntries[entry];
    const section = element('section', '', 'abm-example');
    section.append(element('p', 'Illustrative example · invented company and visits', 'reader-kind'),
      element('h2', 'Follow the visit to the offer'));
    const choices = element('nav', '', 'abm-choices');
    choices.setAttribute('aria-label', 'Choose the landing-page entrance');
    for (const [key, value] of Object.entries(abmEntries)) {
      const a = link(value.label, '#idea/' + (withOffer ? 'abm-offer' : 'abm-match') + '?map=abm&entry=' + key);
      if (entry === key) a.setAttribute('aria-current', 'true');
      choices.append(a);
    }
    const facts = element('dl', '', 'abm-observations');
    for (const [label, value] of [
      ['Entrance', example.page],
      ['Observed visits', example.visit],
      ['Account match', 'Northline Maintenance · fictional company. In this scenario, a previously submitted work email links this visitor to an existing CRM account. The match does not establish their role or purchase intent.'],
      ['Working hypothesis', example.inference],
      ['Proposed content', example.offer]
    ]) facts.append(element('dt', label), element('dd', value));
    section.append(choices, facts);
    if (!withOffer) return section;
    const trigger = element('button', 'Show the slide-in offer', 'route-next');
    trigger.type = 'button';
    trigger.disabled = true;
    trigger.setAttribute('commandfor', 'abm-content-offer');
    trigger.setAttribute('command', 'show-popover');
    trigger.setAttribute('aria-controls', 'abm-content-offer');
    trigger.setAttribute('aria-expanded', 'false');
    const panel = element('aside', '', 'abm-slide-in');
    panel.id = 'abm-content-offer';
    panel.setAttribute('popover', 'auto');
    panel.setAttribute('aria-labelledby', 'abm-offer-title');
    const close = element('button', 'Close offer', 'abm-offer-close');
    close.type = 'button';
    close.setAttribute('commandfor', panel.id);
    close.setAttribute('command', 'hide-popover');
    const title = element('h2', example.offer);
    title.id = 'abm-offer-title';
    const open = element('button', 'Open the ' + (entry === 'pain' ? 'worksheet' : 'checklist') + ' →', 'route-next');
    open.type = 'button';
    panel.append(close, element('p', 'An example content offer', 'reader-kind'), title, element('p', example.reason), open, element('p', 'Read it here. No form or email required.', 'abm-offer-note'));
    const resource = element('section', '', 'abm-resource');
    resource.hidden = true;
    const resourceTitle = element('h3', example.offer);
    resourceTitle.tabIndex = -1;
    const list = element('ol');
    for (const task of example.content) list.append(element('li', task));
    resource.append(resourceTitle, element('p', 'A short sample written for this demonstration. It shows what the offer actually delivers.'), list);
    panel.addEventListener('toggle', event => trigger.setAttribute('aria-expanded', String(event.newState === 'open')));
    close.addEventListener('click', () => requestAnimationFrame(() => { if (trigger.isConnected) trigger.focus({preventScroll:true}); }));
    open.addEventListener('click', () => {
      resource.hidden = false;
      if (panel.hasAttribute('popover')) panel.hidePopover?.();
      resourceTitle.focus({preventScroll:true});
      resource.scrollIntoView({block:'center'});
    });
    section.append(trigger, panel, resource);
    loadOfferSupport().then(supported => {
      if (!section.isConnected) return;
      if (supported) trigger.disabled = false;
      else {
        // If a polyfill cannot load, keep the content offer available in the document.
        panel.removeAttribute('popover');
        panel.classList.add('abm-offer-inline');
        trigger.hidden = close.hidden = true;
      }
    });
    return section;
  }

  function abmStudies(studies) {
    const section = element('section', '', 'abm-studies');
    section.append(element('h2', 'Four published examples'));
    for (const study of studies) {
      const article = element('article', '', 'reading-passage');
      article.append(element('h3', study.title), element('p', study.result, 'abm-study-result'), element('p', study.body), link(study.source + ' →', study.url, 'source'));
      section.append(article);
    }
    return section;
  }

  function showIdea(idea, viaBearing, requestedEntry) {
    const entry = idea.entry || (Object.hasOwn(abmEntries, requestedEntry) ? requestedEntry : "pain");
    const heading = element('h1', idea.title);
    heading.tabIndex = -1;
    const nav = element('nav', '', 'reading-navigation');
    nav.setAttribute('aria-label', 'Return to the map or collection');
    const territory = map.territories.get(map.membership.get(idea.id));
    if (!readerMap) nav.append(link(lastDirectory.includes('?') ? '← Back to search results' : '← Browse all ideas', lastDirectory, 'reader-back'));
    if (viaBearing) {
      nav.append(link('← Back to the compass crossing','#map/dice?at=dice-coin&stage=bearing','reader-back'));
    } else if (territory) {
      nav.append(link(readerMap ? '← ' + territory.title + ' map' : 'See this idea on the map →', '#map/' + territory.root + '?at=' + idea.id, 'reader-back'));
    }
    reader.replaceChildren(nav,
      element('p', atlasSubjects[idea.subject] + ' · ' + idea.kind, 'reader-kind'),
      heading, element('p', idea.summary, 'lede')
    );
    if (idea.seed) {
      const words = element('div', '', 'fixed-seed');
      words.setAttribute('aria-label', 'The five saved input words');
      for (const word of idea.seed) words.append(element('span', word));
      reader.append(words);
    }
    if (idea.cards) {
      const cards = element('ol', '', 'draw-record');
      for (const card of idea.cards) {
        const item = element('li');
        item.append(element('p', 'Position ' + card.position + ' · ' + card.orientation, 'reader-kind'),
          element('h2', card.card), element('p', card.raw_meaning, 'card-meaning'));
        cards.append(item);
      }
      reader.append(cards);
    }
    if (idea.draft) {
      const draft = element('section', '', 'archived-draft');
      draft.append(element('h2', 'The saved draft'));
      const quote = element('blockquote');
      for (const paragraph of idea.draft) quote.append(element('p', paragraph));
      draft.append(quote);
      reader.append(draft);
    }
    if (idea.edition) {
      const [src, alt, original] = idea.edition;
      const figure = element('figure', '', 'edition-plate');
      const full = link('', original);
      const image = element('img');
      image.src = src;
      image.alt = alt;
      full.append(image);
      figure.append(full, link(src === original ? 'View the full-size screenshot →' : 'Open this homepage version →', original, 'source'));
      reader.append(figure);
    }
    if (idea.id === 'dice-wolf') {
      reader.append(document.querySelector('#wolf-pair').content.cloneNode(true));
    }
    if (idea.studies) reader.append(abmStudies(idea.studies));
    for (const passage of idea.sections || []) reader.append(readingPassage(passage));
    if (idea.abmExample) reader.append(abmExample(entry, idea.id === 'abm-offer'));
    if (idea.id === 'banana-wars') {
      const trace = element('section', '', 'match-excerpt');
      trace.append(element('h2', 'One move from the match record'),
        element('p','In match bw-d7864563b4db, the game recorded the outcome “impact” for move metis-84f4f7e1. Its identifier lets you look up that same move in the original record.'),
        link('Read why the essay compares this match with a card draw →','#idea/trust?map=dice','source'));
      reader.append(trace);
    }
    if (idea.id === 'healthcare') reader.append(document.querySelector('#growth-drawings').content.cloneNode(true));
    if (idea.id === 'kata-vera') reader.append(storyArt());
    reader.append(element('p', idea.detail, 'body-copy'));
    if (idea.id === 'dice') reader.append(link('Follow the wolf experiment →','#idea/dice-wolf?map=dice','route-next'));
    if (idea.id === 'dice-wolf') reader.append(link('Continue to the homepage, game and orchid trials →','#idea/dice-trials?map=dice','route-next'));
    if (idea.id === 'dice-trials') reader.append(link('How the five words became a coin →','#idea/dice-coin?map=dice','route-next'));
    if (idea.id === 'dice-coin') reader.append(link('Turn the coin toward the personal website →','#map/dice?at=dice-coin&stage=coin','source'));
    if (idea.nextStop) {
      const next = byId.get(idea.nextStop);
      reader.append(link('Next · ' + next.mapLabel + ' →', '#idea/' + next.id + '?map=' + territory.root + (territory.root === 'abm' ? '&entry=' + entry : ''), 'route-next'));
    }
    if (idea.nextStops) {
      const branches = element('nav', '', 'abm-branches');
      branches.setAttribute('aria-label', 'Choose an entrance into the landing-page network');
      branches.append(element('h2', 'Choose an entrance into the network'));
      for (const id of idea.nextStops) {
        const next = byId.get(id);
        branches.append(link(next.mapLabel + ' →', '#idea/' + id + '?map=' + territory.root + '&entry=' + next.entry, 'route-next'));
      }
      reader.append(branches);
    }
    if (idea.comparison) {
      const panel = element('details', '', 'reading-passage');
      panel.append(element('summary', 'Compare all five images, from the night draft to the finished homepage'));
      for (const passage of idea.comparison) panel.append(readingPassage(passage));
      reader.append(panel);
    }
    const more = element('div', '', 'reader-bottom');
    more.append(sourceList(idea), relatedList(idea));
    reader.append(more);
    return heading;
  }

  function renderRoute() {
    const [route, query = ''] = location.hash.slice(1).split('?');
    const params = new URLSearchParams(query);
    const requestedMap = route.startsWith('map/') && route.slice(4);
    const region = map.territories.get(requestedMap);
    const legacy = { editions: 'healthcare', philosophy: 'atlas-drawings' };
    const idea = byId.get(legacy[route] || (route.startsWith('idea/') && route.slice(5)));
    hero.hidden = Boolean(idea || region);
    browse.hidden = Boolean(idea);
    reader.hidden = !idea;
    document.title = idea ? idea.title + ' · Digital Atlas' : 'Digital Atlas · Bogdan Vučković';
    if (idea) {
      readerMap = params.get('map') === map.membership.get(idea.id) ? params.get('map') : '';
      const heading = showIdea(idea, idea.id === 'personal-site' && params.get('via') === 'bearing', params.get('entry'));
      heading.focus({preventScroll:true});
      if (route === 'editions') reader.querySelector('.growth').scrollIntoView();
      else window.scrollTo(0, 0);
      return;
    }
    document.querySelector('.browse-heading').hidden = Boolean(region);
    document.querySelector('.browse-layout').hidden = Boolean(region);
    map.show(region?.root, params.get('at'), params.get('stage'));
    if (region) {
      document.title = document.querySelector('#map-heading').textContent + ' · Digital Atlas';
      const turn = region.root === 'dice' && params.get('at') === 'dice-coin' && ['coin','bearing'].includes(params.get('stage')) ? document.querySelector('#turn-map-coin') : null;
      (turn || document.querySelector('.last-stop') || document.querySelector('#map-heading')).focus({preventScroll:true});
      document.querySelector('#map-book').scrollIntoView();
      return;
    }
    search.value = params.get('q') || '';
    subject.value = Object.hasOwn(atlasSubjects, params.get('subject')) ? params.get('subject') : '';
    lastDirectory = route === 'explore' || route === 'index' ? location.hash : '#explore';
    showResults();
    if (route === 'index' || (route === 'explore' && query)) {
      document.querySelector('#index-heading').scrollIntoView();
      document.querySelector('#idea-search').focus({preventScroll:true});
      return;
    }
    if (route && route !== 'top') {
      document.querySelector('#directory-heading').focus({preventScroll:true});
      document.querySelector('#explore').scrollIntoView();
    } else window.scrollTo(0, 0);
  }

  for (const [key, name] of Object.entries(atlasSubjects)) subject.add(new Option(name, key));
  search.addEventListener('input', filterChanged);
  subject.addEventListener('change', filterChanged);
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
})();
