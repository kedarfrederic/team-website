/* ═══════════════════════════════════════════════════════════════
   v2-teammate.js — teammate page motion.

   Ported from the inline <script> in team-july2026-multipager/teammate.html.
   It was missed in the original port: the page's CSS came across as
   v2-teammate.css but this never did, so the scroll-choreographed motion
   was simply absent. Depends on window.TM from v2-chrome.js, which must
   load first.

   NOT PORTED — that page's OTHER inline block is a theme bootstrap that
   reads localStorage['tm-theme'] and stamps data-theme on <html>.
   Bringing it over would let a stored "light" value flip this page to the
   light theme, which is the dark-lock defect fixed in BaseLayout. The
   site is deliberately dark-locked; see the note on <html> there.
   ═══════════════════════════════════════════════════════════════ */
/* memory + ask cards animate in on scroll (shared TM helper) */
(() => {
  const wire = (id, sel, gap, delay, thr) => {
    const root = document.getElementById(id); if (!root || !window.TM) return;
    const s = window.TM.seq(root.querySelectorAll(sel), 'in', gap, delay);
    window.TM.replay(root, s.play, s.reset, thr);
  };
  wire('memPanel', '.mem__row', 170, 120, .35);
  wire('ask', '.ask__card', 300, 150, .3);
})();

/* SIGNATURE — scrub the overnight. JS sets --t (0→1); the clock ticks 23:41→07:00
   and CSS reveals each action + grows the morning glow off that one value. */
(() => {
  const night = document.getElementById('night'); if (!night) return;
  const stage = night.querySelector('.night__stage');
  const nH = document.getElementById('nH'), nM = document.getElementById('nM');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(pointer: coarse)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const START = 23 * 60 + 41, END = 7 * 60 + 1440;              // 23:41 → 07:00 (next day)
  const setClock = m => { m = Math.round(m) % 1440; nH.textContent = String(Math.floor(m / 60)).padStart(2, '0'); nM.textContent = String(m % 60).padStart(2, '0'); };

  if (reduced || touch) { night.classList.add('night--static'); stage.style.setProperty('--t', 1); setClock(END); return; }
  let raf = 0;
  const tick = () => {
    raf = 0;
    const total = night.offsetHeight - innerHeight;
    const p = clamp(-night.getBoundingClientRect().top / total);
    stage.style.setProperty('--t', p.toFixed(3));
    setClock(START + p * (END - START));
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  tick();
})();
