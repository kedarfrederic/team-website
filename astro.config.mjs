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
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [
    react(),
    sitemap({
      // Skip the API + preview routes — they're not user-facing pages.
      filter: (page) => !page.includes("/api/"),
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
