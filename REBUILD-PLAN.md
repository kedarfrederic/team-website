# Marketing Site Rebuild — Kickoff Plan

**Architecture:** Sanity Studio (CMS) + Astro (SSG) + Cloudflare Pages (hosting)
**Replaces:** Static HTML hosted on Webflow + the in-app `marketingCms` admin in `team-pilot-1`
**Goal:** Visual click-to-edit content management, full SEO, instant marketing-automation linkage, off-Webflow

---

## Context — why this rebuild

The marketing site (`siteamrollouts/team-website`) is currently 24 static HTML pages exported from Webflow and hosted on Webflow. Editing copy or assets requires a developer because Webflow's CMS bindings were lost during the export → static-HTML port. The platform's existing in-app `marketingCms` (admin panel + tRPC router + 1409-line content registry) was built to fix this but its UX is form-based, has no preview, no asset management, and the content schemas are hardcoded in TypeScript.

**The new architecture solves all three problems at once:**
- **Sanity Studio** provides the polished click-to-edit experience (the thing form-based admins can't replicate without months of frontend work).
- **Astro** rebuilds the static HTML at content-publish time, preserving all existing JS-driven UI.
- **Cloudflare Pages** hosts the output (same Cloudflare account as R2, single control plane).

End-state: marketers edit copy/assets in Sanity, hit publish, the site rebuilds in ~60 seconds and goes live globally — full SEO, full event-tracking control, no vendor opacity.

---

## Content surface inventory

**24 top-level marketing pages** + **7 insight articles** + a game easter egg.

Pages grouped by template:
| Group | Pages | Template style |
|---|---|---|
| Marquee homepage | `homepage` (3500 lines, complex) | Unique — typewriter hero, scroll-pinned tiles, 4-tab roles, engine demo, marquee, FAQ, carousel |
| Pricing | `pricing` | Hero + billing toggle + 2 tier cards + 18-row comparison table + 4-item FAQ + final CTA |
| ICP role pages | `for-artists`, `for-labels`, `for-managers`, `for-partners` | Same template: ICP hero + 3-pain rows + 6–12 feature cards + 3-step block + final CTA + cross-link other ICPs (`for-partners` uses tabbed features) |
| Vertical product | `intelligence`, `orchestration` | ICP hero + 3-paragraph scroll reveal + 3-pain rows + 4-tab feature spotlight (16 mocks) + trust callout + final CTA + bridge + roles grid |
| Solo product | `enterprise`, `integrations` | Hero + pain or filterable grid + included/API section + roles grid |
| Story | `about` | Hero + mission + story + 3 values + CTA + roles grid |
| Trust | `security` | Hero + 4 pillars + AI privacy + 3 enterprise blocks + scroll-stack compliance cards + 5-FAQ + final CTA |
| Blog | `insights` (index) + `/insights/*.html` (7 articles) | Standard category-filterable list + post-detail with rich-text body |
| Operations | `changelog` | Searchable + filterable timeline (~13 date groups, ~52 entries) |
| Forms | `demo`, `contact` | Already wired to platform (`/api/forms/*`) — only marketing copy is CMS surface |
| Legal/utility | `privacy`, `terms`, `cookie-policy`, `sms-terms`, `sign-in`, `index`, `teamrun`, `onboarding` | Out of scope for v1 (low-priority, stable text) |

### Reusable patterns spotted across pages

These become **shared Sanity object types** (used in many docs):
- **`ctaBlock`** — final-CTA section, every product/role page
- **`faqBlock`** — homepage, pricing, security
- **`rolesGrid`** — 4 cards (Artists/Managers/Labels/Partners) on enterprise, about, intelligence, orchestration, integrations
- **`painRow`** — 3-row alternating pain/feature pattern (`{metadataPill, headline, body, mockType}`) on every ICP + vertical-product page
- **`featureCard`** — homepage features, ICP feature spotlights
- **`stepsBlock`** — 3-numbered-steps on every ICP page
- **`testimonial`** — homepage stories carousel
- **`marqueeLogo`** — homepage integrations marquee (21 logos × 2 rows)

### The key CMS-design decision: structured mock visuals

The site has ~14 mock visual types (`mock-gantt`, `mock-collab`, `mock-dashboard`, `fp-budget`, `fp-chat`, `fp-timeline`, etc.) used inside pain rows and feature cards. **These mocks contain editable content** — labels, percentages, fake timeline tasks, fake chat messages — currently hardcoded in HTML.

For the CMS to be useful, mock data must be **structured fields**, not opaque images. E.g., `fp-budget` becomes `{bars: [{label, percent, value, gradientStart, gradientEnd}]}`. Without this, marketers can't update the demo numbers/labels without a developer.

This is the single biggest design call for the schema. The plan below treats mock data as a polymorphic Sanity object type — different shape per `mockType`, all under one umbrella.

---

## What of the existing in-app `marketingCms` we keep / drop / migrate

**Drop** (after rebuild ships and Webflow is decommissioned):
- `client/src/pages/admin/AdminMarketingCms.tsx` (1644 lines, form-based admin) — replaced by Sanity Studio
- `client/src/hooks/useCmsContent.ts` + `shared/cmsContentRegistry.ts` (1409 lines of hardcoded fallbacks) — replaced by Sanity schemas + queries
- `server/routers/marketingCmsRouter.ts` — replaced by Sanity's hosted API
- `cms_content` and `cms_blog_categories` Postgres tables — replaced by Sanity Content Lake
- The in-app marketing pages (`Landing.tsx`, `/pricing`, `/features/*`, `/blog`, etc.) — already on the cutover plan to retire

**Migrate** (one-time data move into Sanity):
- `cms_blog_posts` rows → Sanity `insightPost` documents (script: read DB, write to Sanity API). Roughly 7 articles already exist.
- Blog categories → Sanity `insightCategory` documents.

**Keep** (orthogonal to the marketing CMS):
- `/api/forms/demo` and `/api/forms/contact` endpoints — already built, marketing site fetch()es them.
- Platform admin for everything non-marketing (users, organizations, releases, billing, etc.) — unchanged.
- Sanity webhook → platform endpoint to record marketing publishes in the platform audit log (small new endpoint, optional but recommended).

---

## Proposed Sanity schema (high-level)

**Page documents (singletons, one of each):**
```
homepage           pricingPage          forArtistsPage      forLabelsPage
forManagersPage    forPartnersPage      enterprisePage      aboutPage
intelligencePage   orchestrationPage    integrationsPage    insightsIndexPage
securityPage       changelogPage        demoPage            contactPage
siteSettings       (nav groups, footer, social, global SEO)
```

**Collections (many-of):**
```
insightPost           — blog articles (7 to migrate from DB)
insightCategory       — blog category taxonomy
changelogEntry       — changelog rows (grouped by releaseDate field)
integration          — integrations grid items (~20 logos)
testimonial          — reusable across homepage carousel + future surfaces
```

**Reusable object types (embedded inside docs):**
```
ctaBlock { eyebrow?, headline, body?, primaryCta {label, href}, secondaryCta? }
faqBlock { eyebrow, headline, sub?, items: faqItem[] }
faqItem { question, answer (Portable Text) }
rolesGrid { eyebrow?, headline, cards: roleCard[] }
roleCard { title, description, href }
painSection { eyebrow?, headline, rows: painRow[] }
painRow { metadataPill, headline, body, mockData (polymorphic) }
featureSpotlight { eyebrow?, headline, sub?, cards: featureCard[] }
featureCard { title, description, mockData (polymorphic), href? }
stepsBlock { eyebrow?, headline, steps: stepItem[] }
stepItem { number, title, description }
mockData — polymorphic — one of:
  - mockGantt { rows: ganttRow[] }
  - mockChat { messages: chatMessage[] }
  - mockBudget { bars: budgetBar[], totals?: ... }
  - mockTimeline { columns, tasks }
  - mockDashboard { kpis, ... }
  - mockTasks { rows }
  - mockChecklist { items }
  - ... (one variant per existing mockType in the HTML)
```

**Content shape examples:**
- `homepage.heroSection = { typer: string[], subhead, ctaPrimary, ctaSecondary, bgImage }`
- `pricingPage.tiers = { freeTier: pricingTier, proTier: pricingTier }` where `pricingTier = { name, who, monthlyPrice, yearlyPrice, period, trialNote, then, billing, ctaLabel, ctaHref, includesLabel, features: string[], badge?, compareLink? }`
- `pricingPage.comparisonRows: comparisonRow[]` where `comparisonRow = { label, tooltip?, freeValue, proValue, valueType: 'check'|'dash'|'text' }`
- `homepage.integrationsMarquee: marqueeLogo[]` where `marqueeLogo = { name, logoSlug, title }`

Each document gets standard SEO fields (`metaTitle`, `metaDescription`, `ogImage`) as a shared `seoBlock` object.

---

## Astro project structure

```
team-website/
├── src/
│   ├── pages/
│   │   ├── index.astro            ← homepage doc → render
│   │   ├── pricing.astro
│   │   ├── for-artists.astro
│   │   ├── for-labels.astro
│   │   ├── for-managers.astro
│   │   ├── for-partners.astro
│   │   ├── enterprise.astro
│   │   ├── about.astro
│   │   ├── intelligence.astro
│   │   ├── orchestration.astro
│   │   ├── integrations.astro
│   │   ├── security.astro
│   │   ├── changelog.astro
│   │   ├── demo.astro
│   │   ├── contact.astro
│   │   └── insights/
│   │       ├── index.astro        ← insights list page
│   │       └── [slug].astro       ← per-post page (queries insightPost by slug)
│   ├── components/
│   │   ├── blocks/                ← one per reusable Sanity object
│   │   │   ├── CtaBlock.astro
│   │   │   ├── FaqBlock.astro
│   │   │   ├── RolesGrid.astro
│   │   │   ├── PainSection.astro
│   │   │   ├── FeatureSpotlight.astro
│   │   │   ├── StepsBlock.astro
│   │   │   └── MockData.astro     ← dispatches to mockType variants
│   │   ├── mocks/                 ← one per mockType
│   │   │   ├── MockGantt.astro
│   │   │   ├── MockChat.astro
│   │   │   ├── MockBudget.astro
│   │   │   └── ...
│   │   └── layout/
│   │       ├── Nav.astro          ← reads siteSettings.navGroups
│   │       ├── Footer.astro
│   │       └── BaseLayout.astro
│   ├── styles/                    ← migrated from existing /components/*.css
│   ├── scripts/                   ← migrated JS interactions (typewriter, scroll, marquee, carousel)
│   └── lib/
│       └── sanity.ts              ← client + queries (groq)
├── sanity/                        ← Sanity Studio (also shipped from this repo)
│   ├── schemas/
│   │   ├── documents/             ← page singletons + collections
│   │   ├── objects/               ← reusable blocks + mockData variants
│   │   └── index.ts
│   ├── desk-structure.ts          ← custom Studio sidebar (page-by-page nav, not type-by-type)
│   ├── presentation/              ← Visual Editing config + drafts/previews
│   └── sanity.config.ts
├── public/                        ← preserved from existing repo (assets, fonts, videos)
├── astro.config.mjs               ← integrations: @sanity/astro, @astrojs/sitemap
└── package.json
```

**Visual Editing setup:** Sanity's `@sanity/visual-editing` package + Astro's draft-mode capability gives editors a side-by-side experience — they edit a field in Sanity Studio, the Astro preview re-renders that exact element instantly, no rebuild.

---

## Hosting + deploy pipeline

```
Editor publishes in Sanity
          │
          ▼
Sanity webhook fires → Cloudflare Pages deploy hook
          │
          ▼
Cloudflare Pages runs `astro build`
  ├── Astro queries Sanity for all content
  ├── Renders 24 pages + 7 insight articles to static HTML
  └── Outputs to /dist
          │
          ▼
Pages deploys /dist globally to Cloudflare's edge (~30–60s)
          │
          ▼
DNS: teamrollouts.com → Cloudflare Pages (instead of Webflow)
```

**Env vars / secrets needed:**
- Sanity project ID + dataset name (public, in repo config)
- Sanity API read token (committed to Cloudflare Pages env, used at build time)
- Cloudflare Pages deploy webhook URL (committed to platform env so we can also trigger rebuilds from the platform if needed — e.g., deploying a fresh blog post from the platform admin)

**Audit-log webhook (optional but recommended):**
A small `POST /api/webhooks/sanity-publish` on the platform that Sanity calls on publish. Payload: `{userId, documentId, documentType, timestamp}`. We log it for change-tracking and to power future automation (e.g., "page X changed → re-run preview screenshots → notify Slack").

---

## Phased build plan

### Phase 0 — Decisions (you, before kickoff)
- [ ] Sign off on this plan or request changes
- [ ] Create Sanity org + project (free tier, ~2 min) — share `projectId` and `dataset` name
- [ ] Create Cloudflare Pages project (linked to `siteamrollouts/team-website` repo) — share project name
- [ ] Confirm preferred branching strategy (single `main` with auto-deploy on push, OR `main` + `preview` for staging?)

### Phase 1 — Sanity Studio + schemas (~3 days)
- [ ] Initialize Sanity Studio in repo at `/sanity/`
- [ ] Define all schemas: documents + reusable objects + mockData variants
- [ ] Custom desk structure so the sidebar is organized by *page* (Homepage / Pricing / For Artists / ...) not *type* — matches how marketers think
- [ ] Seed example content for one page (homepage) to validate end-to-end
- [ ] Studio runs locally; you and the team can poke at it before any frontend work

### Phase 2 — Astro skeleton + content fetch (~2 days)
- [ ] Init Astro project alongside existing static HTML (in same repo, separate folder initially)
- [ ] Wire `@sanity/astro` integration
- [ ] Build `BaseLayout.astro` + `Nav.astro` + `Footer.astro` reading from `siteSettings`
- [ ] Migrate the simplest page (`about` or `contact`) end-to-end as proof
- [ ] Confirm SEO output: meta tags, OG tags, structured data, sitemap

### Phase 3 — Block components + mock library (~2 days)
- [ ] Build the 7 reusable block components (`CtaBlock`, `FaqBlock`, etc.)
- [ ] Build the 14 mock components (`MockGantt`, `MockChat`, etc.) — port from existing CSS/JS
- [ ] Each block consumes Sanity data, renders identical output to current site

### Phase 4 — Page-by-page migration (~5 days)
Order: simplest first → most complex last. Approximate per-page size:
| Page | Effort | Notes |
|---|---|---|
| `about`, `contact`, `demo` | 0.25d each | Mostly static text |
| `security`, `enterprise`, `integrations` | 0.5d each | Mid-complexity |
| `for-artists`, `for-labels`, `for-managers` | 0.5d each | Same template, do them in a row |
| `for-partners` | 0.5d | Tabbed features variant |
| `intelligence`, `orchestration` | 0.75d each | 4-tab spotlight + scroll reveals |
| `pricing` | 0.75d | Billing toggle JS, comparison table |
| `changelog`, `insights` (index) | 0.5d each | Filtering, search |
| Insight article template + 7 posts | 0.75d | Single template, content migrated |
| `homepage` | 1.5d | Most complex JS — typewriter, pinned scroll, engine demo, marquee, carousel |

### Phase 5 — JS interaction preservation (~1 day)
- [ ] Audit all JS-driven UX from existing site (typewriter, scroll-pin tiles, role tabs, engine search demo, releases→timeline transition, marquee, FAQ accordion, swiper, video lightbox, billing toggle, search/filter)
- [ ] Wire each into the Astro components, bundling JS efficiently (Astro defers and tree-shakes by default)

### Phase 6 — Visual Editing + presentation (~1 day)
- [ ] Configure Sanity Presentation tool with Astro draft preview URL
- [ ] Wire `@sanity/visual-editing` into Astro pages
- [ ] Add overlay click-to-edit indicators on every content surface
- [ ] Test editor flow end-to-end: edit field → preview updates → publish → live in 60s

### Phase 7 — Hosting + deploy webhook (~0.5 day)
- [ ] Configure Cloudflare Pages: build command, env vars, Sanity webhook → deploy hook
- [ ] Test full publish-to-live cycle
- [ ] Build the platform-side `/api/webhooks/sanity-publish` endpoint for audit logging

### Phase 8 — Data migration (~1 day)
- [ ] Script: read existing `cms_blog_posts` from platform DB → write `insightPost` documents to Sanity
- [ ] Manually port 24 pages of marketing copy from current HTML → Sanity (one-time task; could be done by Studio Nine or marketing while engineering does Phases 1–6)

### Phase 9 — DNS cutover + Webflow decommission (~0.5 day)
- [ ] Update DNS: `teamrollouts.com` and `www.teamrollouts.com` → Cloudflare Pages
- [ ] Update DNS for `go.teamrollouts.com` if it should also point at Pages
- [ ] Cancel Webflow hosting subscription
- [ ] Final SEO sanity check (sitemap submitted to Google Search Console)

### Phase 10 — Retire in-app marketing (~0.5 day)
- [ ] Delete `Landing.tsx`, `/pricing`, `/features/*`, `/blog/*` routes from platform
- [ ] Delete `marketingCmsRouter`, `useCmsContent`, `cmsContentRegistry`, `AdminMarketingCms`
- [ ] Drop `cms_content`, `cms_blog_posts`, `cms_blog_categories` tables (after confirming Sanity has all data)
- [ ] Redirect platform `/` for unauthenticated users straight to `/sign-in` (no more in-app marketing)

**Total estimated effort: ~15–17 working days of focused work.** Realistically 3 calendar weeks given review cycles, parallel content migration, and unexpected design quirks.

---

## Open questions for you

1. **Branching strategy** — single `main` (deploy on every push), or `main` + `preview` branch for staging review before going live? Either works in Cloudflare Pages.
2. **Insights authoring** — keep the existing 7 articles' rich-text bodies as-is (one-time HTML→Portable-Text migration), or rewrite them in Sanity from scratch?
3. **Animation/scroll preservation** — there are some heavy scroll-pinned interactions on `homepage`. Confirm: do we preserve them 1:1, or is there appetite to simplify any during the rebuild?
4. **`go.teamrollouts.com`** — is this a separate Webflow site that should also migrate, or does it consolidate into `teamrollouts.com` post-rebuild?
5. **Editor seats** — Sanity free tier includes 3 user seats. How many people will need editor access? (If 4+, the next tier is $99/mo.)
6. **Asset hosting** — Sanity includes a 5GB hosted CDN with image transformations included. Use that, or push assets to Cloudflare R2 (already in your stack)? Sanity-hosted is simpler; R2 is cheaper at scale and gives you full control. Recommend Sanity for v1, migrate later if needed.
7. **SEO redirect map** — any URL paths changing in the rebuild? If so, we need a 301 redirect map to avoid losing search rankings.

---

## Verification (how we know it's working)

After Phase 7:
- Edit a field in Sanity Studio → publish → marketing site shows the change within 60s
- Cloudflare Pages build log shows ~30–60s build time, no errors
- Lighthouse score on key pages ≥ 95 (Performance, SEO, Accessibility)
- All existing JS interactions work identically to current site (manual QA pass)
- Platform audit log shows the publish event

After Phase 9:
- DNS resolves `teamrollouts.com` → Cloudflare Pages globally (verify from multiple regions)
- HubSpot/PostHog/GTM events fire correctly on every page
- Form submissions to `/api/forms/demo` and `/api/forms/contact` continue working
- Google Search Console shows new sitemap, no crawl errors
- Webflow hosting fully decommissioned

---

## Critical files (for reference during build)

**Marketing site repo:** `/Users/kedarfrederic/Desktop/Team Repo Clone/team-website/`
- All `*.html` files — source of truth for current content (extract → Sanity)
- `/components/*` — current CSS/JS to port into Astro
- `/assets/*` — images/videos to upload to Sanity (or R2)
- `/insights/*.html` — 7 articles to migrate as `insightPost` documents
- `/webflow-build/WEBFLOW-BUILD-GUIDE.md` — original Webflow export notes (reference only)

**Platform repo:** `/Users/kedarfrederic/Desktop/Team Repo Clone/team-pilot-1/`
- `server/routers/marketingCmsRouter.ts` — to delete in Phase 10
- `shared/cmsContentRegistry.ts` — content shapes that inform Sanity schema design
- `client/src/pages/admin/AdminMarketingCms.tsx` — to delete in Phase 10
- `server/routes/marketingForms.ts` — already serves `/api/forms/*`, no changes needed
- `server/_core/csrf.ts` — `/api/webhooks` already CSRF-exempt; if we add the Sanity-publish endpoint there, no extra work

---

## Next concrete step

Once you've reviewed this plan and answered the open questions above, the kickoff sequence is:

1. You create Sanity project + Cloudflare Pages project (~5 min total)
2. You answer the open questions
3. I start Phase 1 (Sanity schemas) — this is the longest single chunk and gates everything else
4. Once schemas land, content migration can happen in parallel with Astro skeleton work
