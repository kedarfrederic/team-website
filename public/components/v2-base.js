/* ────────────────────────────────────────────────────────────
   v2-base.js — shared behaviour for the v2 marketing pages.

   Ported from team-july2026-multipager/js/chrome.js, but ONLY the
   parts that belong to page content. Deliberately NOT ported:
     • nav/footer injection — team-website server-renders those via
       Nav.astro / Footer.astro (crawlers don't run JS, and the
       Astro components carry Sanity stega for click-to-edit)
     • the light/dark theme toggle — deferred as its own feature
     • the footer newsletter form — Footer.astro already ships one
       wired to the same website-leads endpoint

   Load with `is:inline` AFTER the page body.
   ──────────────────────────────────────────────────────────── */
(() => {
  'use strict';

  /* reveal-on-scroll — elements start at opacity:0 via v2-base.css and are
     revealed once when they scroll into view. Honour reduced-motion by
     revealing everything immediately instead of animating. */
  const els = document.querySelectorAll('.reveal');
  const revealAll = () => els.forEach((el) => el.classList.add('in'));
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    try {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (!e.isIntersecting) return;
          // Respect an inline transition-delay if the markup set one.
          e.target.classList.add('in');
          io.unobserve(e.target);
        }),
        { threshold: 0.16 }
      );
      els.forEach((el) => io.observe(el));

      // Safety net: IntersectionObserver callbacks don't fire in a background
      // /hidden tab, and a page whose every section is opacity:0 until an
      // observer fires is one failure away from looking blank. If anything is
      // still hidden shortly after load, just show it — a missed animation is
      // an acceptable cost, invisible content is not.
      setTimeout(revealAll, 2500);
    } catch (err) {
      revealAll();
    }
  }

  /* Single source of truth for "book a demo" — every [data-demo] CTA points
     at Calendly. Mirrors chrome.js so ported markup keeps working. */
  const DEMO = 'https://calendly.com/teamrollouts-demo/30min';
  document.querySelectorAll('[data-demo]').forEach((a) => {
    a.href = DEMO;
    a.target = '_blank';
    a.rel = 'noopener';
  });
})();
