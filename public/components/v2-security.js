/* ═══════════════════════════════════════════════════════════════
   v2-security.js — security page motion.

   Ported from the inline <script> in team-july2026-multipager/security.html.
   It was missed in the original port: the page's CSS came across as
   v2-security.css but this never did, so the scroll-choreographed motion
   was simply absent. Depends on window.TM from v2-chrome.js, which must
   load first.

   NOT PORTED — that page's OTHER inline block is a theme bootstrap that
   reads localStorage['tm-theme'] and stamps data-theme on <html>.
   Bringing it over would let a stored "light" value flip this page to the
   light theme, which is the dark-lock defect fixed in BaseLayout. The
   site is deliberately dark-locked; see the note on <html> there.
   ═══════════════════════════════════════════════════════════════ */
/* the vault fills in on scroll-down and empties back out on scroll-up */
(() => {
  const vault = document.getElementById('vault'); if (!vault || !window.TM) return;
  const items = vault.querySelectorAll('.vault__lab,.vchip,.vault__core,.vault__ok,.wlab,.vblock');
  const s = window.TM.seq(items, 'in', 90, 60);
  window.TM.replay(vault, s.play, s.reset, .3);
})();
