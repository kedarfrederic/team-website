import { defineConfig } from "astro/config";
import sanity from "@sanity/astro";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

/**
 * Astro config — Sanity-fed marketing site.
 *
 * Output mode: `server` (SSR via Cloudflare Worker). Required by Sanity's
 * canonical Visual Editing pattern — the iframe loaded by Studio's
 * Presentation tool needs to re-render with draft content + stega encoding
 * on every request when the preview cookie is set, which can't happen with
 * fully prerendered static HTML. Visitors without the preview cookie still
 * get fast responses because Cloudflare's edge caches the Worker output
 * (responses are deterministic for cookie-less requests).
 *
 * Pages can opt INTO build-time prerendering with `export const prerender =
 * true` if they're truly static — but most of our pages now need the
 * cookie-aware client, so we leave them server-rendered by default.
 *
 * Stega + visual editing: enabled via the @sanity/astro integration. The
 * VisualEditing component (`@sanity/astro/visual-editing`) is mounted in
 * BaseLayout — it's a React component, hence the @astrojs/react integration.
 */
export default defineConfig({
  site: "https://teamrollouts.com",
  output: "server",

  /**
   * Retired pages from the pre-v2 site, 301'd to their v2 successors.
   *
   * These four are NOT part of the delivered v2 design (they don't exist in
   * team-july2026-multipager at all), and after the v2 nav/footer landed
   * nothing linked to them — they were live, indexable dead ends still
   * rendering the old light chrome. Redirecting rather than deleting keeps any
   * accumulated SEO equity and stops external/bookmarked links 404ing.
   *
   * Their .astro files are removed, because a matching page file takes
   * precedence over a redirect entry (recoverable from git history).
   *
   * DELIBERATELY NOT redirected:
   *   /sms-terms    — SMS compliance doc, referenced by the app's opt-in flow
   *                   and by carriers. Not a marketing page; must stay reachable.
   *   /changelog    — kept, per owner.
   *   /home-classic — intentional rollback copy of the previous homepage,
   *                   already noindex'd.
   */
  redirects: {
    "/orchestration": "/rollouts",
    "/intelligence": "/teammate",
    "/integrations": "/connections",
    "/demo": "/contact",
  },
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [
    react(),
    sitemap({
      /**
       * Exclude anything that isn't a public, indexable page. A sitemap invites
       * crawling, so listing a noindex'd URL sends contradictory signals.
       *   /api/       — endpoints, not pages
       *   /playground/ — component sandbox (noindex'd; its own comment says it
       *                  should stay out of the sitemap, but it was being listed)
       *   /home-classic — the pre-v2 homepage kept for rollback; noindex'd
       */
      filter: (page) =>
        !page.includes("/api/") &&
        !page.includes("/playground/") &&
        !page.includes("/home-classic"),
    }),
    sanity({
      projectId: "g1olb5am",
      dataset: "production",
      apiVersion: "2024-12-01",
      // useCdn MUST be false for stega encoding to be applied. The CDN
      // serves pre-cached responses without the runtime stega injection
      // that Visual Editing's overlay needs to anchor pencils against.
      // We're already SSR'd through a Worker so the small latency hit is
      // negligible — Cloudflare's edge cache holds the Worker response
      // for cookie-less visitors.
      useCdn: false,
      stega: {
        // Studio runs at https://team-cms.sanity.studio — overlay clicks on
        // a marketing page open the matching document there. Override at
        // build/runtime via PUBLIC_SANITY_STUDIO_URL if needed.
        studioUrl:
          process.env.PUBLIC_SANITY_STUDIO_URL ?? "https://team-cms.sanity.studio",
      },
    }),
  ],
  vite: {
    ssr: {
      external: ["node:async_hooks"],
    },
  },
});
