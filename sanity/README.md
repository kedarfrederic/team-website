# Team Marketing CMS — Sanity Studio

The CMS that powers the rebuilt Team marketing site.

- **Project:** `g1olb5am`
- **Dataset:** `public`
- **Hosted Studio (after deploy):** https://team-cms.sanity.studio

## Local development

Requires Node 18+.

```bash
cd sanity
npm install
npm run dev
```

Studio runs at http://localhost:3333. Sign in with the Sanity account you've been added to as a member of the project.

## Deploying the hosted Studio

Once schemas are stable, deploy the Studio so editors don't need a local checkout:

```bash
npm run deploy
```

First deploy will ask you to confirm the `studioHost` (currently `team-cms` per `sanity.cli.ts`). After that, the Studio is live at https://team-cms.sanity.studio for any project member.

## Schema organization

```
schemas/
├── index.ts                  # Single registry — every type imported here
├── documents/                # Top-level types editors create/edit as discrete entries
│   ├── homepage.ts           # Singleton (one per dataset)
│   ├── insightPost.ts        # Collection (many)
│   ├── insightCategory.ts    # Collection (many)
│   ├── siteSettings.ts       # Singleton (nav + footer + global SEO)
│   └── ...                   # one file per page, plus collections (changelog, integrations, etc.)
└── objects/                  # Embedded/reusable types — only used inside documents
    ├── ctaBlock.ts           # "Final CTA" pattern shared across pages
    ├── faqBlock.ts + faqItem.ts
    ├── rolesGrid.ts + roleCard.ts
    ├── painSection.ts + painRow.ts
    ├── featureSpotlight.ts + featureCard.ts
    ├── stepsBlock.ts + stepItem.ts
    ├── seoBlock.ts           # Per-document SEO meta
    └── mockData/             # Polymorphic mock visuals (Gantt, chat, budget, timeline, etc.)
        ├── mockGantt.ts
        ├── mockBudget.ts
        ├── mockChat.ts
        └── mockTimeline.ts
```

## Adding a new schema

1. Create the file under `schemas/documents/` or `schemas/objects/`.
2. Use `defineType` + `defineField` from `sanity` for type safety.
3. Import + register in `schemas/index.ts`.
4. Restart `npm run dev` (Studio hot-reloads schemas but a fresh start is sometimes needed).
5. If it's a document, add it to the desk structure in `deskStructure.ts` so the sidebar grouping is intentional.

## Custom desk structure

The default Studio sidebar groups by type ("All documents of type X"). For a marketing CMS, that's the wrong mental model — editors think in pages, not types. `deskStructure.ts` overrides this so the sidebar is a list of pages (Homepage, Pricing, For Artists…) plus a collapsed "Library" section for collections (Insights, Integrations, Changelog, Site Settings).

Edit there when adding/reordering pages.
