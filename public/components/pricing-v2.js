/* ────────────────────────────────────────────────────────────
   Pricing page v2 — billing toggle only.
   reveal-on-scroll and the [data-demo] rewrite are shared, and live
   in v2-base.js (loaded before this). FAQ needs no JS — native
   <details>/<summary> handles disclosure.
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

})();
