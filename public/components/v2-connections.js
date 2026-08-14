/* ═══════════════════════════════════════════════════════════════
   v2-connections.js — connections page motion.

   Ported from the inline <script> in team-july2026-multipager/connections.html.
   It was missed in the original port: the page's CSS came across as
   v2-connections.css but this never did, so the scroll-choreographed motion
   was simply absent. Depends on window.TM from v2-chrome.js, which must
   load first.

   NOT PORTED — that page's OTHER inline block is a theme bootstrap that
   reads localStorage['tm-theme'] and stamps data-theme on <html>.
   Bringing it over would let a stored "light" value flip this page to the
   light theme, which is the dark-lock defect fixed in BaseLayout. The
   site is deliberately dark-locked; see the note on <html> there.
   ═══════════════════════════════════════════════════════════════ */
/* ── integrations data — matches the product's connector catalogue ── */
const INT = [
  { cat:'Productivity', slug:'productivity', items:[
    ['Notion','notion',1,'Bring pages and databases into the brain.'],
    ['Slack','slack',1,'Bring channel context into the brain.'],
    ['Gmail','gmail',1,'Pull release-relevant email and its attachments in.'],
    ['Google Calendar','googlecalendar',1,'Keep the brain aware of what\'s scheduled.'],
    ['Airtable','airtable',1,'Sync records from a base into the brain.'],
    ['Linear','linear',1,'Bring issues and projects into the brain.'],
    ['Asana','asana',0,'Tasks and projects into the brain.'],
    ['Trello','trello',0,'Boards and cards into the brain.'],
    ['ClickUp','clickup',0,'Docs and tasks into the brain.'],
    ['Discord','discord',0,'Community channel context.'],
    ['Outlook','outlook',0,'Email and calendar into the brain.'],
  ]},
  { cat:'Files', slug:'files', items:[
    ['Google Drive','googledrive',1,'Feed documents from a Drive folder as they change.'],
    ['Google Sheets','googlesheets',1,'Sync rows from a spreadsheet into the release brain.'],
    ['Dropbox','dropbox',1,'Feed files from a folder in, and add files back.'],
    ['Google Docs','googledocs',1,'Read and write docs through the assistant.'],
    ['Box','box',0,'Enterprise files into the brain.'],
  ]},
  { cat:'Social', slug:'social', items:[
    ['Instagram','instagram',0,'Posts and insights into the brain.'],
    ['YouTube','youtube',0,'Channel, video and comment intelligence.'],
    ['Facebook','facebook',0,'Page insights into the brain.'],
    ['Reddit','reddit',0,'Community sentiment.'],
  ]},
  { cat:'Commerce & Events', slug:'commerce', items:[
    ['Eventbrite','eventbrite',0,'Ticket sales and attendees.'],
    ['Ticketmaster','ticketmaster',0,'Event and ticket data.'],
  ]},
];
/* Slugs with a real file in public/v2/assets/logos/.
   This listed 21 and only 9 existed, so 12 connector tiles rendered a
   broken-image glyph instead of the letter-tile fallback three lines below —
   which has always been there for exactly this case. A hand-kept inventory of
   a directory drifts from the directory; the onerror below makes that drift
   cosmetic, but the list is corrected so the common path does not rely on it. */
const HAVE = new Set(['asana','dropbox','gmail','googlecalendar','googledocs','googledrive','googlesheets','notion','slack','trello']);
/* notion.svg IS on disk; notion-dark.svg never was, so this remap pointed the
   one Notion tile at a 404 while its own file sat there unused. */
const TILE = {};
const BRAND = { eventbrite:{ fg:'#f05537', ch:'e' } }; // no square icon — branded letter tile
const icon = (slug,name) => BRAND[slug]
  ? `<span class="icard__ic" style="font-family:var(--font-display);font-weight:700;font-size:1.4rem;color:${BRAND[slug].fg}">${BRAND[slug].ch}</span>`
  : HAVE.has(slug)
    /* The initial is painted by the wrapper with the <img> on top; onerror just
       removes the image and reveals it. No broken glyph, no layout shift, and
       HAVE becomes an optimisation rather than a correctness dependency — it
       being the latter is why 12 tiles were broken. */
    ? `<span class="icard__ic icard__ic--fallback" data-initial="${name[0]}"><img decoding="async" src="/v2/assets/logos/${TILE[slug]||slug}.svg" alt="" loading="lazy" onerror="this.remove()"></span>`
    : `<span class="icard__mono">${name[0]}</span>`;

/* render the directory */
document.getElementById('cats').innerHTML = INT.map(c => `
  <div class="cat" data-cat="${c.slug}">
    <div class="cat__head"><span class="t">${c.cat}</span><span class="n">${c.items.filter(i=>i[2]).length} live · ${c.items.filter(i=>!i[2]).length} coming</span></div>
    <div class="igrid">
      ${c.items.map(([name,slug,live,desc]) => `
        <div class="icard${live?'':' icard--soon'}">
          ${icon(slug,name)}
          <div class="icard__b">
            <div class="icard__top"><b>${name}</b>${live?'<span class="icard__live" title="Available now"></span>':'<span class="icard__soon">Soon</span>'}</div>
            <p class="icard__d">${desc}</p>
          </div>
        </div>`).join('')}
    </div>
  </div>`).join('');

/* filter chips */
const cats = [...document.querySelectorAll('#cats .cat')];
const chips = ['<button class="dchip on" data-f="all">All</button>']
  .concat(INT.map(c => `<button class="dchip" data-f="${c.slug}">${c.cat}</button>`)).join('');
document.getElementById('dfilter').innerHTML = chips;
document.querySelectorAll('#dfilter .dchip').forEach(ch => ch.addEventListener('click', () => {
  document.querySelectorAll('#dfilter .dchip').forEach(x => x.classList.remove('on'));
  ch.classList.add('on');
  const f = ch.dataset.f;
  cats.forEach(c => c.style.display = (f === 'all' || c.dataset.cat === f) ? '' : 'none');
}));

/* live / soon counts */
const all = INT.flatMap(c => c.items);
document.getElementById('statLive').textContent = all.filter(i => i[2]).length;
document.getElementById('statSoon').textContent = all.filter(i => !i[2]).length;

/* hero proof wall — live connectors, white monochrome, doubled for a seamless loop */
const WHITE = new Set(['notion','gmail','googlecalendar','airtable','linear','googledrive','googlesheets','dropbox','googledocs']);
const wallTiles = all.filter(i=>i[2] && HAVE.has(i[1]))
  .map(([name,slug]) => {
    const w = WHITE.has(slug);
    const src = w ? `/v2/assets/logos/white/${slug}.svg` : `/v2/assets/logos/${slug}.svg`;
    /* A failed tile removes itself from the marquee — decorative, and better
       missing a brand than showing a break. Same drift: it filtered on HAVE. */
    return `<span class="tile"><img decoding="async" class="${w?'':'mono'}" src="${src}" alt="${name}" loading="lazy" onerror="this.parentElement.remove()"></span>`;
  }).join('');
/* each group must be wider than the viewport, or the loop shows empty space at
   the far edge before it wraps. Repeat the set until one group exceeds the
   widest realistic screen, then duplicate that group and translate -50%. */
(() => {
  const wall = document.getElementById('wall');
  const need = Math.max(screen.width || 0, innerWidth, 1440);
  wall.innerHTML = `<div class="wall__track"><div class="wall__group">${wallTiles}</div></div>`;
  const g = wall.querySelector('.wall__group');
  let reps = 1;
  while (g.getBoundingClientRect().width < need * 1.05 && reps < 12) { g.innerHTML += wallTiles; reps++; }
  const groupHTML = g.innerHTML;
  wall.innerHTML = `<div class="wall__track"><div class="wall__group">${groupHTML}</div><div class="wall__group">${groupHTML}</div></div>`;
})();

/* animate the live-wire feed on scroll-in (shared TM helper) */
(() => {
  const root = document.getElementById('feed'); if (!root || !window.TM) return;
  const s = window.TM.seq(root.querySelectorAll('.fev'), 'in', 520, 260);
  window.TM.replay(root, s.play, s.reset, .4);
})();
