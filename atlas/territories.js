// Show the selected drawing stage in the panel beside its controls.
function createCoinLandmark() {
  const panel = document.querySelector('#coin-studies');
  const landmark = document.querySelector('#coin-landmark');
  const sketch = document.querySelector('#sketch-on-map');
  const turn = document.querySelector('#turn-map-coin');
  const caption = document.querySelector('#coin-stage-caption');
  const stops = {
    sketch: ['#coin-marks','Five marks stand for the five words that start a D.I.C.E. draw. The first two sketches reconstruct the finished design.'],
    chart: ['#coin-study','A line joins the five stars into the W of Cassiopeia. Two pencil circles place the rim around them.'],
    coin: ['#coin-seed','The brass Seed face carries Cassiopeia inside an engraved rim. Turn the coin to see the compass on the other side.']
  };
  let stage = 'sketch';
  const siteLink = panel.querySelector('#bearing-story');

  function setStage(value) {
    stage = value === 'bearing' || Object.hasOwn(stops,value) ? value : 'sketch';
    const bearing = stage === 'bearing';
    const finished = bearing || stage === 'coin';
    turn.querySelector('.turning-coin').style.transform = bearing ? 'rotateY(180deg)' : '';
    turn.setAttribute('aria-label', bearing ? 'Explore the personal website island' : 'Turn the Reckoning Coin over');
    turn.querySelector('.turn-caption').textContent = bearing ? 'Follow the compass →' : 'Turn over ↻';
    siteLink.hidden = !bearing;
    turn.hidden = !finished;
    sketch.toggleAttribute('hidden', finished);
    const [drawing, description] = stops[bearing ? 'coin' : stage];
    sketch.querySelector('use').setAttribute('href',drawing);
    caption.textContent = bearing ? 'The compass points to 22.5°. Bearing is the face Bogdan chose for his personal site.' : description;
    for (const button of panel.querySelectorAll('[data-coin-stage]')) {
      button.setAttribute('aria-pressed',String(button.dataset.coinStage === (bearing ? 'coin' : stage)));
    }
  }

  for (const button of panel.querySelectorAll('[data-coin-stage]')) {
    button.addEventListener('click',() => {
      const [route, query] = location.hash.split('?');
      const params = new URLSearchParams(query);
      params.set('stage',button.dataset.coinStage);
      location.hash = route+'?'+params;
    });
  }
  turn.addEventListener('click',() => {
    location.hash = stage === 'bearing' ? siteLink.hash : '#map/dice?at=dice-coin&stage=bearing';
  });
  return {
    show(visible, value) {
      panel.hidden = !visible;
      landmark.hidden = !visible;
      if (visible) setStage(value);
    }
  };
}

// The same coastlines and paths stay on screen as the camera moves between scales.
function createTerritoryMap(ideas, definitions) {
  const svg = document.querySelector('#landscape');
  const world = document.querySelector('#map-world');
  const labels = document.querySelector('#map-labels');
  const frame = document.querySelector('#chart-window');
  const heading = document.querySelector('#map-heading');
  const back = document.querySelector('#map-return');
  const caption = document.querySelector('#map-caption');
  const byId = new Map(ideas.map(note => [note.id, note]));
  const membership = new Map();
  const territories = new Map();
  let selected = '';
  let activeNote = '';
  let crossing = false;
  let geometry = new Map();
  let width, height, narrow;
  const NS = 'http://www.w3.org/2000/svg';
  const coin = createCoinLandmark();
  const preview = document.querySelector('.landmark-preview');
  const surveyControls = document.querySelector('#survey-controls');
  const farther = document.querySelector('#survey-out');
  const closer = document.querySelector('#survey-in');
  const surveyScales = [.72,.80,.88,1];
  let surveyLevel = 2;
  farther.addEventListener('click', () => { if (surveyLevel > 0) { surveyLevel--; paint(); } });
  closer.addEventListener('click', () => { if (surveyLevel < surveyScales.length-1) { surveyLevel++; paint(); } });

  function svgNode(tag, attributes, parent) {
    const node = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    parent.append(node);
    return node;
  }

  // Walk the reading paths to collect the notes belonging to each island.
  function visit(note, territory) {
    if (membership.has(note.id)) return;
    membership.set(note.id, territory.root);
    territory.stops.push({note});
    const children = ideas.filter(child => child.trailFrom === note.id);
    for (const child of children) visit(child, territory);
  }
  const newRoots = ideas.filter(note => !note.trailFrom && !definitions.some(t => t.root === note.id));
  const regions = definitions.concat(newRoots.map(note => ({
    root:note.id, title:note.mapLabel || note.title, description:note.summary
  })));
  for (const definition of regions) {
    const territory = {...definition, stops:[]};
    visit(byId.get(territory.root), territory);
    territories.set(territory.root, territory);
  }

  function coast(seed) {
    const points = [];
    for (let n = 0; n < 154; n++) {
      const t = 2 * Math.PI * n / 154;
      const r = .88 + .060*Math.sin(3*t+seed) + .045*Math.cos(5*t-seed)
        + .037*Math.sin(9*t+.5*seed) + .025*Math.cos(17*t+seed) + .013*Math.sin(29*t);
      const inlet = .32*Math.pow(Math.max(0,Math.cos(t+seed*.94)),16);
      const bay = .48*Math.pow(Math.max(0,Math.cos(t-seed*1.48)),21) + inlet;
      const headland = .26*Math.pow(Math.max(0,Math.cos(t+seed*.91)),15);
      const radius = r - bay + headland;
      points.push([radius*Math.cos(t) + .055*Math.sin(2*t+seed),radius*Math.sin(t) + .075*Math.cos(2*t-seed)]);
    }
    return 'M' + points.map(p => p.map(v => v.toFixed(4)).join(' ')).join('L') + 'Z';
  }

  // Place uncharted additions in open water (or free space inside an island).
  // Published points keep their bearings as new notes arrive.
  function openPoint(occupied, near) {
    if (!occupied.length) return [.5,.5];
    let best = [.5,.5], clearance = -Infinity;
    for (let col = 0; col < 9; col++) {
      for (let row = 0; row < 9; row++) {
        const u = .16 + .085*col, v = .16 + .085*row;
        if (near && Math.hypot(u-.5,v-.5) > .39) continue;
        const gap = Math.min(...occupied.map(([x,y]) => Math.hypot(u-x,v-y)));
        const score = gap - (near ? .20*Math.hypot(u-near[0],v-near[1]) : 0);
        if (score > clearance) { best = [u,v]; clearance = score; }
      }
    }
    return best;
  }

  function printChartMargins() {
    const winds = document.querySelector('#wind-lines');
    const margins = document.querySelector('#chart-margins');
    winds.replaceChildren();
    margins.replaceChildren();
    const cx = width*(narrow ? .79 : .65);
    const cy = height*(narrow ? .09 : .56);
    const radius = narrow ? 37 : 61;
    const reach = Math.hypot(width,height);
    // Two wind centres create the crossing rhumb lines of a portolan chart.
    for (const [x,y,count] of [[cx,cy,32],[width*.035,height*.55,16]]) {
      const fan = svgNode('g',{transform:'translate('+x+' '+y+')'},winds);
      for (let i = 0; i < count; i++) {
        const angle = i * 2*Math.PI/count;
        const ochre = i%4 === 0;
        svgNode('line',{x1:0,y1:0,x2:reach*Math.cos(angle),y2:reach*Math.sin(angle),
          stroke:ochre?'#996b46':'#526e73',opacity:ochre ? .27 : .20,'stroke-width':ochre ? .85 : .55},fan);
      }
    }
    svgNode('use',{href:'#chart-rose',x:cx-radius,y:cy-radius,width:radius*2,height:radius*2,class:'wind-rose'},margins);
    // Engraved double rule enclosing a graduated margin.
    for (const inset of [4,9,12]) {
      svgNode('rect',{x:inset,y:inset,width:width-2*inset,height:height-2*inset,
        fill:'none',stroke:'#796d55','stroke-width':inset===9?.85:.55},margins);
    }
    for (const y of [5,height-8]) svgNode('rect',{x:5,y,width:width-10,height:3,fill:'url(#border-degrees-x)',opacity:.65},margins);
    for (const x of [5,width-8]) svgNode('rect',{x,y:5,width:3,height:height-10,fill:'url(#border-degrees-y)',opacity:.65},margins);
  }

  function placeSeaEngravings(obstacles) {
    // Find the nearest open patch to each engraving's preferred location.
    function openSea(px,py,w,h) {
      let distance = Infinity, best;
      for (let y = 16+h/2; y <= height-16-h/2; y += 8) {
        for (let x = 16+w/2; x <= width-16-w/2; x += 8) {
          const d = (px-x)**2 + (py-y)**2;
          if (d >= distance) continue;
          const box = {left:x-w/2-4,right:x+w/2+4,top:y-h/2-4,bottom:y+h/2+4};
          if (obstacles.some(o => box.left<o.right && box.right>o.left && box.top<o.bottom && box.bottom>o.top)) continue;
          distance = d;
          best = {x,y,box};
        }
      }
      if (best) obstacles.push(best.box);
      return best;
    }
    const rose = document.querySelector('.wind-rose');
    const side = Number(rose.getAttribute('width'));
    const center = openSea(width*(narrow ? .79 : .65),height*(narrow ? .09 : .56),side,side);
    rose.style.visibility = center ? '' : 'hidden';
    if (center) {
      rose.setAttribute('x',center.x-side/2);
      rose.setAttribute('y',center.y-side/2);
      document.querySelector('#wind-lines > g').setAttribute('transform','translate('+center.x+' '+center.y+')');
    }
    const ship = document.querySelector('.chart-ship');
    const berth = openSea(width*(narrow ? .75 : .66),height*(narrow ? .88 : .28),ship.offsetWidth,ship.offsetHeight);
    ship.style.visibility = berth ? '' : 'hidden';
    if (berth) {
      ship.style.left = berth.x+'px';
      ship.style.top = berth.y+'px';
    }
  }

  function buildChart() {
    width = Math.max(260, frame.clientWidth);
    narrow = width < 620;
    const list = [...territories.values()];
    height = narrow ? Math.max(840,list.length*140) : Math.max(580,Math.min(725,width*.55),list.length*94);
    frame.style.height = height + 'px';
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    printChartMargins();
    world.replaceChildren();
    geometry = new Map();
    const total = membership.size;
    const centers = list.map(t => narrow ? t.mobileCenter : t.center);
    const occupied = centers.filter(Boolean);
    for (const [index,territory] of list.entries()) {
      const seed = index + 1;
      const size = Math.sqrt(territory.stops.length/total);
      const w = width * Math.min(narrow ? .43 : .31, size*(narrow ? .64 : .38));
      const h = height * Math.min(.34, size*(narrow ? .24 : .38));
      const center = centers[index] || openPoint(occupied);
      if (!centers[index]) occupied.push(center);
      const x = center[0]*width, y = center[1]*height;
      const island = svgNode('g', {'data-territory':territory.root}, world);
      const contours = svgNode('g', {transform:'translate('+x+' '+y+') scale('+w/2+' '+h/2+')'}, island);
      const d = coast(seed);
      for (const [scale, fill, stroke] of [[1.13,'none','#a6aba0'],[1.085,'none','#92a19a'],[1.04,'none','#758c8b'],[1,'#dcc699','#4b5f61'],[.965,'url(#land-hatch)','#9e9277'],[.88,'#eee0bf','#a79776'],[.79,'none','#c2b392']]) {
        svgNode('path',{d, transform:'scale('+scale+')',fill,stroke,'vector-effect':'non-scaling-stroke','stroke-width':scale===1?1.25:.65},contours);
      }
      // Small offshore outcrops belong to the same shore at both scales.
      const outcropAngle = seed*2.15;
      for (let i = 0; i < 2 + seed%3; i++) {
        const angle = outcropAngle + i*(.31+.065*Math.cos(seed+i));
        const reach = 1.08 + .14*i + .06*Math.sin(seed);
        const scale = (.16+.035*Math.cos(seed)) / (1+.46*i);
        svgNode('path', {
          d:coast(seed+i+2), transform:'translate('+Math.cos(angle)*reach+' '+Math.sin(angle)*reach+') rotate('+seed*17+') scale('+scale+' '+scale*.69+')',
          fill:'#e9dfc4',stroke:'#738b91','vector-effect':'non-scaling-stroke','stroke-width':.75
        },contours);
      }
      // Fine relief marks give the coastline the same engraved finish at both scales.
      for (let ridge = 0; ridge < 3; ridge++) {
        const cx = -.48 + ridge * .43;
        const cy = (ridge % 2 ? .40 : -.46) + .035*Math.sin(seed+ridge);
        for (let line = 0; line < 5; line++) {
          const points = [];
          for (let i = 0; i <= 24; i++) {
            const f = i/24, edge = Math.sin(f*Math.PI);
            const ly = cy + edge*(.035*Math.cos(f*7+seed) + .023*Math.sin(f*16+ridge)) + line*.012*edge;
            points.push([(cx + f*.24).toFixed(3),ly.toFixed(3)].join(' '));
          }
          svgNode('path',{d:'M'+points.join('L'),fill:'none',stroke:'#8b927e',opacity:.62,'stroke-width':.62,'vector-effect':'non-scaling-stroke'},contours);
        }
      }
      const stops = new Map();
      const positions = new Map(territory.stops.filter(({note}) => note.mapPoint).map(({note}) => [note.id,(narrow && note.mobilePoint) || note.mapPoint]));
      for (const {note} of territory.stops) {
        if (!positions.has(note.id)) positions.set(note.id,openPoint([...positions.values()],positions.get(note.trailFrom) || [.5,.5]));
        const [u,v] = positions.get(note.id);
        stops.set(note.id,{x:x+(u-.5)*w,y:y+(v-.5)*h});
      }
      for (const {note} of territory.stops) {
        const end = stops.get(note.id);
        for (const parent of [note.trailFrom, ...(note.alsoFrom || [])]) {
          const start = stops.get(parent);
          if (!start) continue;
          const cx = (start.x + end.x)/2 - .16*(end.y-start.y)*w/h;
          const cy = (start.y + end.y)/2 + .16*(end.x-start.x)*h/w;
          const main = ['dice-wolf','dice-trials','dice-coin','site-sailboat','site-hermes','site-dotted-sailboat','site-petar'].includes(note.id);
          svgNode('path',{d:'M'+start.x+' '+start.y+' Q'+cx+' '+cy+' '+end.x+' '+end.y,class:main?'trail-line main-voyage':'trail-line'},island);
        }
      }
      for (const {note} of territory.stops) {
        const point = stops.get(note.id);
        svgNode('circle',{cx:point.x,cy:point.y,r:2.7,class:'coast-stop'},island);
      }
      const landLink = svgNode('a',{href:'#map/'+territory.root,tabindex:'-1',class:'land-hit'},island);
      svgNode('path',{d,transform:'translate('+x+' '+y+') scale('+w/2+' '+h/2+')',fill:'transparent'},landLink);
      geometry.set(territory.root,{x,y,w,h,stops,extent:island.getBBox()});
    }
    paint();
  }

  function mapLink(label, href, x, y, className, name) {
    const a = document.createElement('a');
    a.className = 'chart-link ' + className;
    a.href = href;
    a.style.left = x / width * 100 + '%';
    a.style.top = y / height * 100 + '%';
    a.setAttribute('aria-label', name);
    const title = document.createElement('span');
    title.className = 'chart-name';
    title.textContent = label;
    a.append(title);
    labels.append(a);
    return a;
  }

  function paint() {
    const t = territories.get(selected);
    heading.textContent = t ? t.title : 'The idea territories';
    back.hidden = !t;
    const fromBearing = selected === 'personal-site' && new URLSearchParams(location.hash.split('?')[1]).get('via') === 'bearing';
    back.textContent = fromBearing ? '← Compass crossing' : '← All territories';
    back.href = fromBearing ? '#map/dice?at=dice-coin&stage=bearing' : '#explore';
    preview.hidden = selected !== 'dice';
    surveyControls.hidden = Boolean(t);
    frame.classList.toggle('close-up', Boolean(t));
    labels.replaceChildren();
    svg.querySelector('#bearing-course')?.remove();
    if (crossing) {
      const siteRoot = membership.get('personal-site');
      const from = geometry.get('dice').stops.get('dice-coin');
      const to = geometry.get(siteRoot).stops.get('personal-site');
      const scale = Math.min(width * .56 / Math.abs(to.x-from.x), height * .53 / Math.abs(to.y-from.y), 2.3);
      const dx = (width - (from.x+to.x)*scale)/2;
      const dy = (height - (from.y+to.y)*scale)/2;
      world.style.transform = 'matrix('+[scale,0,0,scale,dx,dy].join(',')+')';
      for (const group of world.children) group.classList.toggle('distant', !['dice',siteRoot].includes(group.dataset.territory));
      const x1 = from.x*scale+dx, y1 = from.y*scale+dy;
      const x2 = to.x*scale+dx, y2 = to.y*scale+dy;
      const course = svgNode('g',{id:'bearing-course','pointer-events':'none'},svg);
      svgNode('path',{d:'M'+x1+' '+y1+' C'+x1+' '+(y1*.6+y2*.4)+' '+x2+' '+(y2*.6+y1*.4)+' '+x2+' '+y2,class:'bearing-line'},course);
      mapLink('D.I.C.E. · The coin','#idea/dice-coin?map=dice',x1,y1,'stop-label','Read the origin of the coin');
      mapLink('The personal site →','#map/personal-site?via=bearing',x2,y2,'stop-label','Explore the personal website island');
      heading.textContent = 'Where D.I.C.E. meets the personal site';
      caption.textContent = 'The same coin belongs to both projects. Follow the copper line to explore the homepage versions on the personal website island.';
      return;
    }
    for (const group of world.children) group.classList.toggle('distant', !!t && group.dataset.territory !== selected);
    if (!t) {
      const scale = surveyScales[surveyLevel];
      const dx = width*(1-scale)/2, dy = height*(1-scale)/2;
      world.style.transform = 'matrix('+[scale,0,0,scale,dx,dy].join(',')+')';
      farther.disabled = surveyLevel === 0;
      closer.disabled = surveyLevel === surveyScales.length-1;
      caption.textContent = 'Each dot is an idea. As connected notes are added, their territory grows. Choose a territory to follow a path.';
      const land = [...geometry.values()].map(({extent}) => ({
        left:extent.x*scale+dx, right:(extent.x+extent.width)*scale+dx,
        top:extent.y*scale+dy, bottom:(extent.y+extent.height)*scale+dy
      }));
      const captions = [];
      for (const [index,region] of [...territories.values()].entries()) {
        const b = geometry.get(region.root);
        const a = mapLink(region.title,'#map/'+region.root,b.x*scale+dx,0,'region-label','Explore '+region.title);
        a.style.maxWidth = (narrow ? Math.min(155,width/2-14) : Math.max(225,b.w*scale))+'px';
        const count = document.createElement('small');
        count.textContent = region.stops.length + (region.stops.length===1?' idea':' ideas') + ' →';
        a.append(count);
        const w = a.offsetWidth, h = a.offsetHeight;
        const leftLimit = narrow && b.x >= width/2 ? width/2+4 : 6;
        const rightLimit = narrow && b.x < width/2 ? width/2-4 : width-6;
        const x = Math.max(leftLimit+w/2,Math.min(rightLimit-w/2,b.x*scale+dx));
        const shore = land[index], gap = narrow ? 6 : 9;
        const above = shore.top-gap-h, below = shore.bottom+gap;
        const preference = b.y > height*.5 ? [above,below] : [below,above];
        const options = [];
        for (const extra of [0,8,16,24]) {
          for (const y of preference) {
            const top = y + (y===above ? -extra : extra);
            const r = {left:x-w/2,right:x+w/2,top,bottom:top+h};
            if (top >= 5 && r.bottom <= height-5 && land.every(o => apart(r,o))) options.push(r);
          }
        }
        a.style.left = x+'px';
        captions.push({a,options,fallback:preference[0]});
      }
      function apart(a,b) {
        return a.right+3<=b.left || a.left>=b.right+3 || a.bottom+3<=b.top || a.top>=b.bottom+3;
      }
      // Choose sides together so a label cannot cut off its neighbour's only berth.
      const placed = [];
      function arrange(i) {
        if (i === captions.length) return true;
        for (const box of captions[i].options) {
          if (!placed.every(other => apart(box,other))) continue;
          placed.push(box);
          if (arrange(i+1)) return true;
          placed.pop();
        }
        return false;
      }
      arrange(0);
      captions.forEach(({a,options,fallback},i) => {
        a.style.top = (placed[i]?.top ?? options[0]?.top ?? fallback)+'px';
      });
      placeSeaEngravings(land.concat(placed));
      return;
    }
    const b = geometry.get(selected);
    const sx = width/b.w*(narrow ? .86 : .74), sy = height/b.h*(narrow ? .81 : .72);
    const dx = width/2 - b.x*sx, dy = height/2 - b.y*sy;
    world.style.transform = 'matrix('+[sx,0,0,sy,dx,dy].join(',')+')';
    caption.textContent = t.description;
    if (selected === 'dice') caption.textContent += ' Dotted paths lead to later notes.';
    else if (selected !== 'personal-site') caption.textContent += ' Follow a dotted path and select a stop to read its note.';
    for (const {note} of t.stops) {
      const pt = b.stops.get(note.id);
      const a = mapLink(note.mapLabel || note.title,'#idea/'+note.id+'?map='+t.root,pt.x*sx+dx,pt.y*sy+dy,'stop-label',note.title);
      if (note.id === t.root) {
        a.classList.add('starting-stop');
        const origin = document.createElement('small');
        origin.textContent = 'Starting idea';
        a.append(origin);
      }
      if (selected === 'dice') {
        if (note.id === 'dice-wolf') a.classList.add('wolf-stop');
        if (note.id === 'dice-coin') {
          a.href='#map/dice?at=dice-coin&stage=coin';
          a.setAttribute('aria-label','4 · See and turn the Reckoning Coin');
          a.classList.add('coin-stop');

        }
      }
      if (note.id === activeNote) {
        a.classList.add('last-stop');
        a.setAttribute('aria-current','location');
      }
    }
  }

  let previousWidth = 0;
  const observer = new ResizeObserver(() => {
    if (frame.clientWidth && frame.clientWidth !== previousWidth) {
      previousWidth = frame.clientWidth;
      buildChart();
    }
  });
  observer.observe(frame);
  document.fonts.ready.then(() => { if (!selected && frame.clientWidth && geometry.size) paint(); });

  return {
    territories, membership,
    show(root, note, stage) {
      selected = territories.has(root) ? root : '';
      activeNote = note || '';
      crossing = selected === 'dice' && stage === 'bearing';
      coin.show(selected === 'dice' && (note === 'dice-coin' || Boolean(stage)), stage || 'coin');
      if (frame.clientWidth && frame.clientWidth !== previousWidth) {
        previousWidth = frame.clientWidth;
        buildChart();
      } else if (geometry.size) paint();
    }
  };
}
