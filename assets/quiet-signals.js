/* Progressive enhancement only. No collection, visitor identification or analytics.
   The destination marker describes arrival provenance, not verified clicks. */
(function () {
  'use strict';
  var panel = document.getElementById('quiet-signals');
  var work = document.getElementById('work');
  if (!panel || !work || !('IntersectionObserver' in window)) return;
  var key = 'qs-suggestion-dismissed-v1';
  try { if (sessionStorage.getItem(key)) return; } catch (_) {}
  var dismissed = false;
  var observer = new IntersectionObserver(function (entries) {
    if (!dismissed && entries.some(function (entry) { return entry.isIntersecting; })) {
      panel.hidden = false;
      observer.disconnect();
    }
  }, { threshold: 0 });
  observer.observe(work);
  function dismiss() {
    dismissed = true;
    var focused = panel.contains(document.activeElement);
    panel.hidden = true;
    observer.disconnect();
    try { sessionStorage.setItem(key, '1'); } catch (_) {}
    if (focused) { work.setAttribute('tabindex', '-1'); work.focus({preventScroll:true}); }
  }
  panel.querySelector('button').addEventListener('click', dismiss);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !panel.hidden) dismiss();
  });
})();
