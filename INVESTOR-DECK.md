# Investor deck — `/investors`

The pre-seed deck as a live page: `teamrollouts.com/investors`. Unlisted
(noindexed, linked from nowhere), full-screen presentation with keyboard /
tap navigation and print-to-PDF (⌘P produces one page per slide).

- **Visitors** see the **published** version — behind a passphrase if the
  gate is on.
- **Admins** (Google sign-in, allowlisted email) see the **draft**, can edit
  any text inline on the page, save, and publish. Publishing is instant — a
  KV write, not a redeploy.

## How editing works

Open `/investors` → toolbar appears bottom-right → **Edit** → click any text
on any slide and retype it. **Save** stores the draft; **Publish** makes it
live for visitors. *View published* shows exactly what an outsider sees.
**Gate** toggles the visitor passphrase (changing the passphrase signs every
current visitor out; admins are never gated).

Layout, images, and animation live in code
(`src/lib/investor-deck/template.html` + `public/investors/deck.css`), not
in the editable content — edit those the normal way, then run
`npm run deck:compile` and commit both the template and
`src/lib/investor-deck/compiled.json`.

> Structural edits shift editing slugs *within the slide you changed* (slugs
> are `<slide-label>.<n>`). After a structural change, re-check any stored
> override on that slide (open the draft, re-touch, re-publish).

## One-time production setup (owner, ~10 min)

The page already renders the deck from its built-in defaults with no setup.
Editing + gating in production need three things in the Cloudflare Pages
project (**team-website**):

1. **KV binding** — Dashboard → Workers & Pages → KV → *Create namespace*
   (name it e.g. `investor-deck`). Then Pages → team-website → Settings →
   Bindings → *Add* → KV namespace, **variable name `INVESTOR_DECK`**, select
   the namespace. Applies on the next deploy.
2. **Env vars** (Pages → Settings → Environment variables, Production):
   - `INVESTOR_GOOGLE_CLIENT_ID` / `INVESTOR_GOOGLE_CLIENT_SECRET` — create
     an OAuth client (Web application) at console.cloud.google.com →
     APIs & Services → Credentials, with authorized redirect URI
     `https://teamrollouts.com/api/investors/callback`.
   - `INVESTOR_SESSION_SECRET` — any random 32+ character string.
   - `INVESTOR_ADMIN_EMAILS` — optional; comma list of emails and/or
     `@domains`. Defaults to `@teamrollouts.com,@teamforartists.com`.
3. **Redeploy** (any push, or Retry deployment) so the binding + vars load.

Then visit `/investors`, sign in with Google, and use **Gate** in the
toolbar to set the passphrase if the deck should be private.

## Local development

```
npm run dev          # http://localhost:4321/investors
```

Set `INVESTOR_DEV_ADMIN=1` in `.env` to get the admin toolbar without OAuth
(dev server only — the bypass cannot activate in a production build). Local
drafts/config persist to `.investor-deck-dev.json` (gitignored).

## Pieces

| Path | Role |
| --- | --- |
| `src/lib/investor-deck/template.html` | The designed slides (source of truth for layout + default copy) |
| `scripts/compile-investor-deck.mjs` | Marks editable text leaves, emits `compiled.json` (`npm run deck:compile`) |
| `src/lib/investor-deck/compiled.json` | Generated render artifact (committed) |
| `src/lib/investor-deck/runtime.ts` | Rendering, sanitizer, signed cookies, storage adapter, allowlist |
| `src/pages/investors.astro` | The page: draft/published resolution + passphrase gate |
| `src/pages/api/investors/*` | auth / callback / logout / draft / publish / gate / config |
| `public/investors/` | deck.css, deck-stage.js (presentation engine), edit.js/css, slide images |

Content overrides are sanitized to inline formatting (`em strong b i br span
sup sub`, class-only spans) on write **and** on render, so stored content
can't inject markup. Draft/publish docs live in KV under `investor-deck:*`.
