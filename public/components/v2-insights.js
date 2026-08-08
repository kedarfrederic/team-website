/* ────────────────────────────────────────────────────────────
   v2-insights.js — category + search filtering for the Insights index.
   Ported from team-july2026-multipager/insights.html's inline script.

   Filtering is client-side over the already-rendered cards: every card
   carries data-cat and a lowercased data-search blob, so no request is
   made while typing and the page still works (unfiltered) without JS.
   ──────────────────────────────────────────────────────────── */
(() => {
  'use strict';
  const grid = document.getElementById('igrid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.icard')];
  const chips = [...document.querySelectorAll('.ichip')];
  const search = document.getElementById('isearch');
  const empty = document.getElementById('iempty');
  let cat = 'all';

  const apply = () => {
    const q = (search?.value || '').trim().toLowerCase();
    let shown = 0;
    cards.forEach((c) => {
      const ok =
        (cat === 'all' || c.dataset.cat === cat) &&
        (!q || (c.dataset.search || '').includes(q));
      c.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  };

  chips.forEach((ch) =>
    ch.addEventListener('click', () => {
      chips.forEach((x) => x.classList.remove('on'));
      ch.classList.add('on');
      cat = ch.dataset.cat;
      apply();
    })
  );
  if (search) search.addEventListener('input', apply);
})();
