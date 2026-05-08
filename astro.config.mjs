import { defineConfig } from "astro/config";
import sanity from "@sanity/astro";
import cloudflare from "@astrojs/cloudflare";

/**
 * Astro config — Sanity-fed marketing site.
 *
 * Output mode: `static` is the default — every marketing page prerenders to
 * HTML at deploy time and ships from Cloudflare Pages' edge cache. The few
 * routes that need to run on a request (preview mode toggles, the Studio
 * Presentation iframe handshake) opt out via `export const prerender = false`
 * and are served by the Cloudflare adapter.
 *
 * Visual Editing: when the `sanity-preview` cookie is set (toggled by
 * `/api/preview/enable`), the same page templates re-render against draft
 * content with stega-encoded strings, and the BaseLayout injects the
 * `enableOverlays()` runtime so editors get click-to-edit pencils inside the
 * Studio Presentation iframe.
 */
export default defineConfig({
  site: "https://teamrollouts.com",
  output: "static",
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [
    sanity({
      projectId: "g1olb5am",
      dataset: "production",
      apiVersion: "2024-12-01",
      // Build-time queries against the public dataset — no token needed.
      // Studio is mounted in /sanity/, not embedded in the marketing site.
      useCdn: true,
    }),
  ],
  vite: {
    // The Cloudflare adapter pulls in workerd-only modules; keep them out of
    // the client bundle so static prerendering doesn't try to resolve them.
    ssr: {
      external: ["node:async_hooks"],
    },
  },
});
