# Studio Nine design migration into Team's Sanity site

Target: the existing `kedarfrederic/team-website` Cloudflare/SSR repository, Sanity project `g1olb5am`, dataset `production`, Studio `team-cms.sanity.studio`. Simon's Vercel project is not the deployment destination. The prior source-repository Korean branch is reusable source work only.

Preserve the existing server adapter, preview authorization and draft-aware client, investor routes, consent/analytics contracts, Sanity editorial collections, and legacy rollback. Isolate the delivered design in `src/studio-nine` and its static assets under `/studio-nine/`; replace public page entrypoints without changing investor/API code.

Add separately editable English/Korean marketing documents with design copy, link destinations and image uploads. New documents use a new type and IDs; existing published page/editorial documents are never rewritten. Reuse the translated fallback copy so public content is complete even before CMS documents are populated. Draft preview stays private and public output uses published data.

Keep current public article bodies, author/date metadata, real changelog entries and legal text while applying the delivered design. Preserve Korean navigation/app handoff and old connections URLs. Editorial rewrites and pricing changes are deferred.

Verify the full Worker build, actual Astro component output and pure middleware transformations, draft/published isolation, CMS overrides, SEO and app links, preserved route contracts, and Studio schema build. Use provider/GitHub deployment evidence; do not infer live deployment from a successful local build. Browser/rendered/device verification remains separate.
