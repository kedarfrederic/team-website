/* ═══════════════════════════════════════════════════════════════
   v2-rollouts.js — rollouts page motion.

   Ported from the inline <script> in team-july2026-multipager/rollouts.html.
   It was missed in the original port: the page's CSS came across as
   v2-rollouts.css but this never did, so the scroll-choreographed motion
   was simply absent. Depends on window.TM from v2-chrome.js, which must
   load first.

   NOT PORTED — that page's OTHER inline block is a theme bootstrap that
   reads localStorage['tm-theme'] and stamps data-theme on <html>.
   Bringing it over would let a stored "light" value flip this page to the
   light theme, which is the dark-lock defect fixed in BaseLayout. The
   site is deliberately dark-locked; see the note on <html> there.
   ═══════════════════════════════════════════════════════════════ */
/* rail + facets + panels reveal in on scroll (shared TM helper) */
(() => {
  const wire = (id, sel, gap, delay, thr) => {
    const root = document.getElementById(id); if (!root || !window.TM) return;
    const s = window.TM.seq(root.querySelectorAll(sel), 'in', gap, delay);
    window.TM.replay(root, s.play, s.reset, thr);
  };
  wire('railPanel', '.rail__row', 90, 100, .3);
})();
