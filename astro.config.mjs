import { defineConfig } from "astro/config";
import sanity from "@sanity/astro";

/**
 * Astro config — pure SSG output, Sanity-fed.
 *
 * The marketing site is built as static HTML at deploy time and served
 * from Cloudflare Pages. No SSR, no edge functions — content updates
 * happen via rebuild on Sanity webhook.
 *
 * Sanity client connection: project g1olb5am, dataset production. The
 * dataset is configured with public visibility so build-time queries
 * don't need a token.
 */
export default defineConfig({
  site: "https://teamrollouts.com",
  output: "static",
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
});
