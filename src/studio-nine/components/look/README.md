# Personalised demo: in-app scenes

The `/look` demo plays a recreation of the real Team app. It is built from the **real app's markup and CSS**, captured from pilot-staging on 21 Oct 2026, so it matches the product closely.

- `TeamApp.astro`: mounts everything in a **Shadow DOM** (`#tappHost`), so host-site CSS can't leak in and app CSS can't leak out. The engine reads `window.__tapp`.
- `look-engine.js`: the player and story (chapters, per-segment playlists, typing, cursor, coachmarks, TeamMate chat from the panel's `<template>`s). It's inlined by `pages/look.astro`.
- `look-engine.css`: the 1440×900 virtual screen (scaled with `--k`), scene switching, pop/typing/scroll states.
- `tapp.css`: the app's own CSS, tree-shaken to what the captured screens use, layers flattened, and every selector scoped under `.tapp`. **Don't hand-edit.** Regenerate it with the shaker (see below).
- `tapp-fonts.css`: maps the app's font names (`Inter UIN`, `Nyght`/`Nyght Serif`, `JetBrains Mono UIN`) onto the site's own font files in `/fonts`.
- `scenes/*.html`: one file per screen or overlay, as raw HTML. Use the real app class names.
- `scenes/_extra-*.css`: small additions only, for things the real CSS doesn't cover (demo-only states, fixes). Scope every rule under `.tapp`.

## Skeleton (what the scenes sit in)

```html
<div class="tapp"><div class="uin">           <!-- 1440x900 virtual screen, scaled to fit the demo frame -->
  <div class="wash"></div>
  <div class="page" id="tpage"> …scene files… </div>
  …overlay files (ov-*.html)…
</div></div>
```

## Scene file rules

- **Scene files** (`<name>.html`): a single root `<div class="xscene" data-scene="<name>" hidden>`. Don't use `tsc`; the app has its own `.tsc` class. Inside it goes what the real `.page` holds for that screen, usually `header.top.rh-top` plus the `main.view.on` and any sibling sections. Keep the real wrappers and classes so the real CSS applies.
- **Overlay files** (`ov-<name>.html`): a single root, e.g. `<div class="tov" data-ov="<name>">`, holding the real element: `.dlg` dialogs, `aside.panel`, `.toast`, `.dock`, menus and popovers. The engine toggles `.on` (or the real open-state class) on it.
- **No real data.** Replace staging names (Abe Parker, jack O lantern, justdemoing, Roc Universe, SImon, Kay Dhar, Bella Blake, real artists) with **personalisation slots**, i.e. elements with `data-f="<key>"`:
  - `first`: viewer first name ("Marcus")
  - `account` / `company`: viewer's org ("Neon Records")
  - `artist` ("Nova Reed"), `release` ("Afterglow"), `reldate` ("Sun, Nov 22"), `reldateShort` ("Nov 22"), `days` ("32")
  - `budget` ("$8,000"), `teammate` ("Kedar"), `handle` ("@novareed"), `initial` ("M"), `artinitial` ("N")

  Slot text is replaced at runtime. Write the default text inside the element too.
- **Fixed demo calendar:** today is **Wed 21 Oct 2026**, and the release is **Sun 22 Nov 2026** (32 days out). Supporting cast: other artists Mara Vane, The Hightides, Odeon, Saint Cloud, Caro Vega; team KF (Kedar Frederic), JT, AM.
- **Images:** only the site's own photography in `/studio-nine/img/set/*.webp` (e.g. `face-1.webp`, `aud-artist.webp`, `hiw-4-artist.webp`, `story-artist.webp`, `cover-release.webp`). Never staging or Spotify images.
- **Icons:** copy the inline `<svg>`s from the captures (lucide icons).
- **Engine hooks:** add `id="…"` to every element the cursor clicks or a coachmark rings. Use the ids your brief lists, and note any extras in a comment at the top of the file.
- Strip everything else: React attrs, `data-*` (except `data-f`, `data-scene`, `data-ov`), event handlers, `aria-*` noise, and `<script>`.

## Lab and verification

- **Lab:** `node campaigns/personalized-demo/tools/labscene.mjs out.png scenes/<scene>.html [scenes/ov-x.html] [--js "…"] [--ref <reference.png>]` renders the files in the skeleton at 1440×900 with `tapp.css`, fills the slots, and with `--ref` writes `out-cmp.png` with the reference on the left and yours on the right.
- **Shaker:** `node campaigns/personalized-demo/tools/shake.mjs http://localhost:8765/all.html tapp.css` rebuilds the CSS from the captures plus the scene files. It resolves media queries for a 1440×900 screen, so the demo never picks up the app's phone layout.
- **Porting to the live site:** copy this folder plus `pages/look.astro`, and copy `/fonts/JetBrainsMono-Variable.woff2` (Inter and Nyght are already on the site) and the `/studio-nine/img/set/*.webp` photos the scenes use.
- **References:** `clients/team/campaigns/personalized-demo/reference/staging-2026-10-21/` (`dom2/*.html` and `.png`, plus `shots/*.png`).
