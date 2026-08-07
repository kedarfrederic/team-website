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
})();
