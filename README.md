# Team Marketing Site

The marketing site that lives at `teamrollouts.com`. Sanity-backed, Astro-built, hosted on Cloudflare Pages.

> **Read [REBUILD-PLAN.md](./REBUILD-PLAN.md) first** if you're new to this codebase. It documents why this exists and the phased plan for replacing the legacy static HTML.

## Repo layout

```
team-website/
├── src/                  ← Astro app (the rebuild)
│   ├── pages/            ← One .astro file per route
│   ├── layouts/          ← BaseLayout + meta
│   ├── components/       ← Reusable Astro components
│   ├── lib/              ← Sanity client + GROQ queries
│   └── styles/           ← Brand kit tokens + base reset
├── sanity/               ← Sanity Studio (the CMS) — see sanity/README.md
├── public/               ← Static assets copied verbatim into Astro's dist/
│
├── *.html                ← Legacy static site (still live until Phase 7 cutover)
├── components/           ← Legacy per-page CSS/JS pairs
├── pages/                ← Legacy body fragments
├── insights/             ← Legacy article HTMLs
├── assets/               ← Legacy media (videos, images)
└── webflow-build/        ← Original Webflow export (reference only)
```

The legacy HTML at the root keeps serving on Cloudflare Pages until ALL pages are migrated to Astro. Once Phase 4 is done, Cloudflare's build config flips to `npm run build` + output dir `dist/`, and the legacy HTML stops being served.

## Local development — TWO things to run

### 1. Sanity Studio (the CMS)

```bash
cd sanity
npm install
npm run dev      # → http://localhost:3333
```

Edit/create content here. See [sanity/README.md](./sanity/README.md) for details.

### 2. Astro site (the rendered output)

```bash
# from repo root
npm install
npm run dev      # → http://localhost:4321
```

Astro reads from Sanity at request time during dev (so you see your edits live). At `npm run build`, Astro queries Sanity once and bakes everything to static HTML in `dist/`.

## Deploys

- **GitHub fork:** `kedarfrederic/team-website`
- **Cloudflare Pages project:** `team-website`
- **Live preview URL:** `team-website-6ur.pages.dev` (until DNS cutover)
- **Production:** `teamrollouts.com` (post-cutover)

Today, Cloudflare Pages is configured with **no build step** — it serves the repo root as-is, which means the legacy static HTML is what users see. When Phase 4 is complete and ready to flip:

1. Update Cloudflare Pages build config:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
2. Push any commit → triggers a build with the new config
3. Now `dist/` (Astro output) gets deployed; the legacy HTML stops being served

## Phase status

See [REBUILD-PLAN.md](./REBUILD-PLAN.md) for the full plan.

- ✅ Phase 1 — Sanity Studio + all 18 schemas + page-by-page desk structure
- 🚧 Phase 2 — Astro skeleton + Sanity client + first page (`/about`) migrated as proof
- ⏳ Phase 3 — Reusable block components (CTA, FAQ, mocks, etc.)
- ⏳ Phase 4 — Page-by-page migration of remaining pages
- ⏳ Phase 5 — JS interaction preservation (typewriter, scroll-pin, marquee, swiper)
- ⏳ Phase 6 — Sanity Visual Editing wired up
- ⏳ Phase 7 — Cloudflare Pages build config cutover
- ⏳ Phase 8 — Content migration (Studio Nine + marketing populate Sanity)
- ⏳ Phase 9 — DNS cutover from Webflow → Cloudflare Pages
- ⏳ Phase 10 — Retire in-app marketing pages on the platform side
