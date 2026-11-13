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
      item.append(link(label, url, 'source'));
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

  function showIdea(idea, viaBearing) {
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
    for (const passage of idea.sections || []) reader.append(readingPassage(passage));
    reader.append(element('p', idea.detail, 'body-copy'));
    if (idea.id === 'dice') reader.append(link('Follow the wolf experiment →','#idea/dice-wolf?map=dice','route-next'));
    if (idea.id === 'dice-wolf') reader.append(link('Continue to the homepage, game and orchid trials →','#idea/dice-trials?map=dice','route-next'));
    if (idea.id === 'dice-trials') reader.append(link('How the five words became a coin →','#idea/dice-coin?map=dice','route-next'));
    if (idea.id === 'dice-coin') reader.append(link('Turn the finished coin on the map →','#map/dice?at=dice-coin&stage=coin','route-next'));
    if (idea.nextStop) {
      const next = byId.get(idea.nextStop);
      reader.append(link('Next · ' + next.mapLabel + ' →', '#idea/' + next.id + '?map=' + territory.root, 'route-next'));
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
    const idea = byId.get(route.startsWith('idea/') && route.slice(5));
    hero.hidden = Boolean(idea || region);
    browse.hidden = Boolean(idea);
    reader.hidden = !idea;
    document.title = idea ? idea.title + ' · Digital Atlas' : 'Digital Atlas · Bogdan Vučković';
    if (idea) {
      readerMap = params.get('map') === map.membership.get(idea.id) ? params.get('map') : '';
      const heading = showIdea(idea, idea.id === 'personal-site' && params.get('via') === 'bearing');
      heading.focus({preventScroll:true});
      window.scrollTo(0, 0);
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
