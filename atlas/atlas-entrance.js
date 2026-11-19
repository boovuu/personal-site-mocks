(() => {
  'use strict';
  const stops = {
    opening: ['00', 'The question'],
    wolf: ['01', 'The wolf test'],
    coin: ['02', 'The coin'],
    website: ['03', 'The website'],
    answers: ['04', 'AI answers'],
    visitor: ['05', 'The visitor'],
    crossing: ['06', 'Open water']
  };
  const storageKey = 'atlas-guided-crossing';
  // Restore the latest chapter on ordinary loads and browser Back/Forward.
  // The destination is constructed only from a known chapter ID.
  const resume = document.querySelector('[data-resume-story]');
  function restoreStoryLink() {
    if (!resume) return;
    let lastStop = null;
    try { lastStop = sessionStorage.getItem(storageKey); } catch { /* Navigation works without storage. */ }
    if (!Object.hasOwn(stops, lastStop)) return;
    const [number, label] = stops[lastStop];
    resume.href = `guided-story.html#${lastStop}`;
    resume.querySelector('[data-resume-label]').textContent = `Continue the story · ${number} / ${label}`;
  }
  restoreStoryLink();
  window.addEventListener('pageshow', restoreStoryLink);

  if (!document.querySelector('.journey-nav')) return;
  let requestedStop = null;
  // Preserve an explicit chapter choice even if the map is opened mid-scroll.
  window.addEventListener('wheel', () => { requestedStop = null; }, { passive: true });
  window.addEventListener('touchmove', () => { requestedStop = null; }, { passive: true });
  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      const active = document.querySelector('.journey-nav a[aria-current="location"]');
      if (active?.hash === `#${requestedStop}`) requestedStop = null;
    });
  }, { passive: true });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin) return;
    if (destination.pathname === location.pathname) {
      const target = destination.hash.slice(1);
      if (Object.hasOwn(stops, target)) requestedStop = target;
      return;
    }
    const active = document.querySelector('.journey-nav a[aria-current="location"]');
    const chapter = requestedStop || active?.hash.slice(1);
    if (!Object.hasOwn(stops, chapter)) return;
    try { sessionStorage.setItem(storageKey, chapter); } catch { /* The ordinary back link remains available. */ }
  });
})();
