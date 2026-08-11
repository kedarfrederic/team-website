/* ════════════════════════════════════════════════════════════
   v2-chrome.js — behaviour for V2Nav / V2Footer.
   Ported from team-july2026-multipager/js/chrome.js, minus the
   nav/footer DOM injection (Astro server-renders both) and the
   theme toggle (deferred).

   Dropdown panels are pure CSS (:hover / :focus-within), so the
   only JS here is the burger, the scrolled state, and the
   newsletter submit.
   ════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const nav = document.getElementById('v2Nav');
  const mnav = document.getElementById('v2Mnav');
  const burger = document.getElementById('v2Burger');

  /* mobile menu */
  if (burger && mnav) {
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    // Any link closes it.
    mnav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        document.body.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
    // Escape closes it.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  /* Keyboard/mouse parity for the hover dropdowns: the triggers are buttons
     with no destination, so a click must not latch the panel open (clicking
     focuses the button, and :focus-within keeps the panel visible). Keyboard
     Tab still opens it via :focus-within. Mirrors chrome.js. */
  if (nav) {
    nav.querySelectorAll('.nav__link[aria-haspopup]').forEach((btn) => {
      btn.addEventListener('mousedown', (e) => e.preventDefault());
      btn.addEventListener('click', (e) => { e.preventDefault(); btn.blur(); });
    });
  }

  /* scrolled state — solid/blurred bar past the top of the page */
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* newsletter → CRM (same endpoint + honeypot as every other form) */
  const form = document.getElementById('v2FootNews');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.classList.contains('done')) return;
      const email = form.email.value.trim();
      if (!email) return;
      if (form.website.value) return; // honeypot — bots fill this, humans don't
      const btn = form.querySelector('button');
      try {
        await fetch('https://admin.getteamnow.com/api/v1/website-leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source_form: 'newsletter',
            email,
            first_name: email.split('@')[0],
            website: '',
            page_url: location.href,
          }),
        });
      } catch (err) {
        /* Non-blocking on purpose: the source does the same. A failed
           subscribe shouldn't surface an error on a marketing page. */
      }
      form.classList.add('done');
      if (btn) btn.textContent = 'Subscribed';
    });
  }

  /* ── shared motion engine (window.TM) ──
     PORTED VERBATIM from chrome.js. Dropping it was a real defect, not a
     simplification: v2-solutions.js makes 8 TM calls and every page-specific
     inline animation script upstream is built on it. Worse, the consumers guard
     with `window.TM || {stub}`, and that stub's `seq()` returns no-op play/reset
     — so with TM missing the animations silently did nothing, with no console
     error and nothing visibly broken except the motion itself. If you ever find
     yourself trimming this file again, TM is not chrome: it is the animation
     contract the pages depend on. ── */
/* ── shared motion: one consistent scroll-choreography for every page ──
     TM.replay(el, onEnter, onExit, threshold) fires onEnter each time el
     scrolls into view and onExit each time it leaves, so animated UI plays
     coming down and resets going back up — the homepage behaviour. */
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.TM = {
    reduced,
    replay(el, onEnter, onExit, threshold = .35) {
      if (!el) return;
      if (reduced) { onEnter && onEnter(); return; }   // no scrub, just settle open
      let inView = false;
      new IntersectionObserver((es) => es.forEach(e => {
        if (e.isIntersecting && !inView) { inView = true; onEnter && onEnter(); }
        else if (!e.isIntersecting && inView) { inView = false; onExit && onExit(); }
      }), { threshold }).observe(el);
    },
    // sequential class-toggle for a set of children; returns {play, reset}
    seq(items, cls, gap, delay = 0) {
      const list = [...items]; let timers = [];
      const clear = () => { timers.forEach(t => { clearTimeout(t); }); timers = []; };
      return {
        play() { if (reduced) { list.forEach(el => el.classList.add(cls)); return; }
          clear(); list.forEach((el, i) => timers.push(setTimeout(() => el.classList.add(cls), delay + i * gap))); },
        reset() { clear(); list.forEach(el => el.classList.remove(cls)); }
      };
    }
  };
})();
