/* ═══════════════════════════════════════════════════════════════
   v2-tours.js — tours page motion.

   Ported from the inline <script> in team-july2026-multipager/tours.html.
   It was missed in the original port: the page's CSS came across as
   v2-tours.css but this never did, so the scroll-choreographed motion
   was simply absent. Depends on window.TM from v2-chrome.js, which must
   load first.

   NOT PORTED — that page's OTHER inline block is a theme bootstrap that
   reads localStorage['tm-theme'] and stamps data-theme on <html>.
   Bringing it over would let a stored "light" value flip this page to the
   light theme, which is the dark-lock defect fixed in BaseLayout. The
   site is deliberately dark-locked; see the note on <html> there.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const root = document.getElementById('tourPanel'); if (!root || !window.TM) return;
  const s = window.TM.seq(root.querySelectorAll('.trow'), 'in', 110, 120);
  window.TM.replay(root, s.play, s.reset, .3);
})();
