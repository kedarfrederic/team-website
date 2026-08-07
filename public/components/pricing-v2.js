/* ────────────────────────────────────────────────────────────
   Pricing page v2 — billing toggle + reveal-on-scroll.
   Ported from team-july2026-multipager/{pricing.html inline
   script, js/chrome.js's reveal observer}. FAQ needs no JS —
   native <details>/<summary> handles disclosure.
   ──────────────────────────────────────────────────────────── */
(() => {
  'use strict';

  /* billing toggle — swaps every [data-yearly]/[data-monthly] pair's text,
     and appends &period=<p> to each plan's CTA href. Generalized from the
     source's per-id version so it scales to any number of tiers/fields. */
  const bill = document.getElementById('bill');
  if (bill) {
    const swap = (period) => {
      bill.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.period === period));
      document.querySelectorAll('[data-yearly][data-monthly]').forEach((el) => {
        const v = el.dataset[period];
        if (v) el.textContent = v;
      });
      document.querySelectorAll('a[data-cta][data-plan]').forEach((cta) => {
        const base = cta.href.split('&period=')[0].split('?period=')[0];
        const sep = base.includes('?') ? '&' : '?';
        cta.href = base + sep + 'period=' + period;
      });
    };
    bill.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => swap(btn.dataset.period));
    });
  }

  /* reveal on scroll */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }),
    { threshold: 0.16 }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
