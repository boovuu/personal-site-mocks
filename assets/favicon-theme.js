// Keep all favicon formats in sync because browsers choose different candidates.
(() => {
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  const icons = document.querySelectorAll('link[data-favicon-format]');
  const update = () => {
    const theme = preference.matches ? 'dark' : 'light';
    for (const icon of icons) {
      icon.href = `/favicon-${theme}.${icon.dataset.faviconFormat}`;
    }
  };
  update();
  preference.addEventListener('change', update);
})();
