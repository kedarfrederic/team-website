# Team Website — TODO

Outstanding items for the Webflow staging site (`go.teamrollouts.com`) before going live on `teamrollouts.com`.

## Pending — CRM lead capture
- [ ] **Lifecycle Status / Lead Status fields** — Simon is finalising the values. Once the value set is stable, update `server/api/routes/websiteLeads.ts` in the teamtargets repo to set `lifecycle_status` and `lead_status` on contact create. Currently the endpoint creates the contact + an activity tagged with the source form, no lifecycle/lead status is set.
- [ ] Decide whether website leads should land in a review queue (pending SDR enrichment) or straight into a pipeline stage. Pipeline stage TBD.
- [ ] Add Cloudflare Turnstile to demo + contact + onboarding forms once we see any spam volume. (Honeypot only for now.)

## Pending — Tracking / SEO / launch
- [ ] **GTM** site-wide install (carries GA4, Meta Pixel) — pull existing container ID from old landing pages
- [ ] **Search Console** verification + sitemap submission
- [ ] **sitemap.xml + robots.txt**
- [ ] **301 redirect map** for legacy `*.html` URLs once we cut over to `teamrollouts.com`
- [ ] **OG images / favicons** per page review
- [ ] Cross-browser + mobile QA pass
- [ ] **404 + 500 pages** (Webflow-built)

## Pending — Content / pages
- [ ] Insights blog articles — kept on GH Pages for now (option A); migrate to per-page Webflow embeds later if we want them under `go.teamrollouts.com/insights/<slug>`
- [ ] Replace `data-hubspot-form` attributes on contact / demo / onboarding forms once CRM-only is verified working

## Done
- [x] Migrate every page to Webflow + GH Pages CDN architecture
- [x] Site-wide nav, footer, cookie consent
- [x] Site-wide form validation (brand pill style)
- [x] Universal embed pattern
- [x] Onboarding plan tier cleanup (drop Team tier, vertical stack)
- [x] All migrated pages serve correctly (no broken redirects)
