/* v2-app-preview.js
   Product-UI mockup behaviour (app-preview panels).

   Ported verbatim from team-july2026-multipager/js/app-preview.js.
   Shared v2 foundation (tokens, typography, buttons, .reveal, page
   ground) lives in v2-base.css / v2-base.js and loads first.
*/
/* ═══════════════════════════════════════════════════════════════
   Team app preview — the product "in action": the countdown ticks,
   tasks keep landing on the timeline, and the TeamMate chat carries
   on. Lifted from the homepage (onepager.js) so it can be reused.
   Runs only while #devband is in view. Needs css/app-preview.css.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const band = $('#devband'); if (!band) return;
  let live = false;
  new IntersectionObserver(e => { live = e[0].isIntersecting; }, { threshold: 0.12 }).observe(band);

  /* countdown counts for real */
  const secsEl = $('#appSecs'), minsEl = $('#appMins');
  let m = 6, s = 27;
  if (secsEl && minsEl) setInterval(() => {
    if (!live || document.hidden) return;
    s--; if (s < 0) { s = 59; m = m > 0 ? m - 1 : 59; }
    secsEl.textContent = String(s).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
  }, 1000);

  /* ── copy ───────────────────────────────────────────────────────
     User-visible strings this preview injects. They do NOT appear in the
     body HTML of any page that mounts it, so a fully translated body would
     still render an English task board and an English conversation — the
     same trap as homepage-v2.js and v2-connections.js.

     NOTE these arrays duplicate homepage-v2.js's POOL and CHAT verbatim.
     The duplication is pre-existing; what matters here is that a locale
     supplies ONE Korean source to both, so the same mock cannot drift into
     two different translations. See src/lib/ko/appPreview.ts.

     Per-item fallback: an untranslated row stays English rather than
     rendering "undefined". */
  const COPY = (() => {
    const EN = {
      labels: { activeNew: 'ACTIVE · NEW' },
      pool: [
        ['Master v10 QC Check', 'AUDIO'],
        ['Pre-Save Link Goes Live', 'DSP_ACTIVATION'],
        ['Vinyl PO Sign-off', 'OPS'],
        ['EPK Refresh + Press Shots', 'PRESS'],
        ['Lyric Video Teaser Cut', 'CONTENT'],
        ['Radio One-Sheet Draft', 'RADIO'],
      ],
      chat: [
        [0, 'TEAMMATE · 12:53', "Pulled 3 past releases. Ava's pre-save pushes in week 2 outperformed week 4 by 31%."],
        [1, '12:54 · YOU', 'Move the pre-save blast earlier then.'],
        [0, 'TEAMMATE · 12:54', 'Done. Moved to Thu 25 and assigned to Maya. Budget untouched.'],
        [1, '12:56 · YOU', "What's still unassigned this week?"],
        [0, 'TEAMMATE · 12:56', 'Two tasks: the country playlist pitch and the venue shortlist. Want owners on both?'],
        [1, '12:57 · YOU', 'Yes, assign them.'],
        [0, 'TEAMMATE · 12:57', 'Assigned. Playlist pitch to Sam, venues to Maya. Timeline updated.'],
      ],
    };
    const o = (typeof window !== 'undefined' && window.__TEAM_APP_PREVIEW_COPY) || {};
    const merged = Object.assign({}, EN, o);
    merged.labels = Object.assign({}, EN.labels, o.labels || {});
    for (const k of ['pool', 'chat']) {
      const sup = Array.isArray(o[k]) ? o[k] : [];
      merged[k] = EN[k].map((d, i) => sup[i] ?? d);
    }
    return merged;
  })();

  /* tasks keep landing on the timeline */
  const days = $$('.app__day');
  const POOL = ['tcard--blue', 'tcard--teal', 'tcard--amber', 'tcard--dark', 'tcard--purple', 'tcard--blue']
    .map((cls, i) => [cls, (COPY.pool[i] || [])[0] || '', (COPY.pool[i] || [])[1] || '']);
  let ti = 0;
  if (days.length) setInterval(() => {
    if (!live || document.hidden) return;
    const [cls, title, tag] = POOL[ti % POOL.length];
    const day = days[1 + (ti % 3)]; ti++;
    if (!day) return;
    const el = document.createElement('div');
    el.className = `tcard ${cls} tcard--pop`;
    el.innerHTML = `<p class="mono tcard__meta">${COPY.labels.activeNew}</p><b>${title}</b><span class="mono">${tag}</span>`;
    day.append(el);
    const mine = day.querySelectorAll('.tcard--pop');
    if (mine.length > 2) { const o = mine[0]; o.classList.add('tcard--out'); setTimeout(() => o.remove(), 550); }
  }, 3800);

  /* the conversation carries on */
  const scroll = $('.app__scroll');
  const CHAT = COPY.chat;

  let ci = 0;
  if (scroll) setInterval(() => {
    if (!live || document.hidden) return;
    const [you, meta, text] = CHAT[ci % CHAT.length]; ci++;
    const d = document.createElement('div');
    d.className = 'app__msg' + (you ? ' app__msg--you' : '') + ' app__msg--in';
    d.innerHTML = `<u class="mono">${meta}</u><p>${text}</p>`;
    scroll.append(d);
    while (scroll.children.length > 4) scroll.firstChild.remove();
  }, 4200);
})();
