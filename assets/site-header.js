(() => {
  const header = document.querySelector('.site-header');
  const toggle = header.querySelector('.site-menu-toggle');
  const links = header.querySelector('nav');
  const small = matchMedia('(max-width: 850px)');
  const close = () => toggle.setAttribute('aria-expanded', 'false');
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target) || event.target.closest('a')) close();
  });
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) close();
  });
  small.addEventListener('change', close);
  window.addEventListener('pageshow', close);

  // The three homepage section links also work when opened directly from another page.
  const home = header.querySelector('.site-home[aria-current]');
  if (home) {
    const update = () => {
      home.setAttribute('aria-current', 'page');
      for (const link of links.querySelectorAll('a[href^="/#"]')) {
        if (location.hash === link.hash) {
          link.setAttribute('aria-current', 'location');
          home.removeAttribute('aria-current');
        } else link.removeAttribute('aria-current');
      }
    };
    window.addEventListener('hashchange', update);
    update();
  }
})();
