# New design on Team's Sanity-backed website

## Correct target

- Repository: `kedarfrederic/team-website` (fork of `tobediscussed/team-website`).
- Checkout: `/Users/kedarfrederic/Documents/Codex/2026-10-03/team-website-integration/work/team-website-sanity`.
- Base commit: `f11595148831584ba2256496ab09eb2a24f11b0a`.
- Owned branch: `codex/studio-nine-sanity-korean-20261003`.
- Sanity project: `g1olb5am`, dataset: `production`.
- Existing Studio: `https://team-cms.sanity.studio`.
- Existing website host: Cloudflare Pages project `team-website`; canonical domain `https://teamrollouts.com`.
- Simon's `team-website-v2` is the design source. Its Vercel project is not the deployment target.

## Verified preview

- PR: https://github.com/kedarfrederic/team-website/pull/8
- Tested code commit: `cd867cd3a3163bc6877efcbcde29f9251519c287`.
- Cloudflare check reports a successful deployment of that exact code commit.
- Immutable English preview: https://6659b906.team-website-6ur.pages.dev/
- Immutable Korean preview: https://6659b906.team-website-6ur.pages.dev/ko/
- Branch alias: https://codex-studio-nine-sanity-kor.team-website-6ur.pages.dev/
- GitHub run `37141694875`: website and Studio jobs both succeeded, including Studio typecheck, build and schema extraction.
- Hosting worked through the existing GitHub/Cloudflare integration even though local Wrangler authentication is expired. The earlier request to restore local Cloudflare access is unnecessary for this preview.

## Implementation

The supplied design is isolated under `src/studio-nine` and `public/studio-nine`; public marketing route entrypoints now use it. The Cloudflare SSR adapter, investor server routes, draft-preview endpoints, parent-domain consent contract, CRM submission endpoint, booking calendar and application sign-up/sign-in flows are retained.

English and Korean pages are separate `marketingV3Page` documents. The Studio sidebar exposes the new pages by language, with shared navigation/footer content separately editable. Copy is keyed to the original design fragment; uploaded image replacements and editable destinations preserve component layouts and motion. Middleware applies the selected language and CMS edits before returning complete HTML. Technical selectors, native form values and locale-picker targets are not translated. The application receives `lang=ko` or `lang=en`.

The 10 existing article routes and 166 changelog entries are sourced from existing Sanity collections, including the intentionally unlisted article route. A public snapshot is available only for published-content outages; failed draft fetches are not silently replaced. Legal bodies and original update dates are preserved. Public articles stay prerendered and in the sitemap; `/preview/insights/:slug` provides draft-aware article preview. Preview output is noindex/private/no-store.

`npm run seed:studio-nine` is a dry run. With `--apply` and an existing write token it uses `createIfNotExists` for exactly 36 namespace documents. It never overwrites existing edits or the previous website documents. Initial documents have already been created and read back in the project.

## Verification and boundaries

- Local website typecheck: zero errors.
- Actual Astro template tests: all 16 translated pages in English and Korean, CMS merging/escaping, route identity, consent markup, image references, schema structure, draft-request isolation and app language handoff.
- Local Cloudflare SSR build: passed, including all 10 existing article routes and sitemap.
- Existing investor APIs and preview authorization endpoints have no changes.
- GitHub validation workflow checks website typecheck/tests/build plus Studio typecheck/build/schema extraction on the submitted head.
- No browser-rendered visual, mobile-device or native-Korean-reader approval is claimed. Existing browser-access denial is respected.
- Local Studio dependency files are partly offloaded by macOS; its attempted checks stalled on file reads. CI supplies an independent clean Studio installation.

## Release steps still required

1. Review both languages and the CMS/application journeys on the verified preview above.
2. Recheck the latest PR head and required checks before publishing; the follow-up commit only records this handoff evidence.
3. Deploy the changed Studio to the existing `team-cms` host with its existing preview configuration and secrets. Do not create a replacement Studio or expose secret values in logs.
4. Obtain the user's approval for the verified production change, merge the existing-site PR, and verify production on the exact deployment SHA.

Optional copy/pricing revisions remain deferred at the user's request. Do not resume Simon's Vercel deployment or claim local checks establish a live release.
