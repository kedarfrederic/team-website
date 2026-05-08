/**
 * Sanity client + image URL builder.
 *
 * One client at build time, two modes at request time:
 *   - Published (default): public CDN, no token, no drafts. Used by every
 *     prerendered page; emits stega-encoded strings so Studio's overlay can
 *     paint click-to-edit pencils on the live HTML.
 *   - Preview (cookie set): same dataset but `previewDrafts` perspective so
 *     unpublished edits surface in the iframe. Requires SANITY_API_READ_TOKEN.
 *
 * Why stega in production: the marketing site is statically prerendered, so
 * Cloudflare's edge serves the same HTML to every visitor. Stega encoding
 * embeds Sanity field metadata as zero-width unicode chars inside text
 * strings — invisible to visitors, but the Studio Presentation iframe reads
 * them to know which Sanity field each chunk of text came from. Without
 * stega, click-to-edit overlays have nothing to anchor against on a
 * static-rendered site.
 */

import { createClient, type ClientConfig, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { AstroGlobal } from "astro";

export const SANITY_PROJECT_ID = "g1olb5am";
export const SANITY_DATASET = "production";
export const SANITY_API_VERSION = "2024-12-01";

/**
 * Studio URL used for stega encoding — clicks on an overlay open the matching
 * document at this origin. Defaults to the deployed Studio so production
 * pages link to the live editor; override locally with PUBLIC_SANITY_STUDIO_URL.
 */
export const SANITY_STUDIO_URL =
  import.meta.env.PUBLIC_SANITY_STUDIO_URL ?? "https://team-cms.sanity.studio";

const baseConfig: ClientConfig = {
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
};

/**
 * Cached published client — reads the published dataset, with stega
 * encoding turned on so Studio's Visual Editing overlay can paint
 * click-to-edit pencils on every Sanity-bound string in the static HTML.
 */
export const sanityClient = createClient({
  ...baseConfig,
  useCdn: true,
  stega: {
    enabled: true,
    studioUrl: SANITY_STUDIO_URL,
  },
});

/**
 * Build a preview-aware client. Requires `SANITY_API_READ_TOKEN` (a
 * Viewer-role token from manage.sanity.io) to read drafts. Falls back to the
 * published client when the token is missing so the site still renders
 * without secrets configured locally.
 */
function createPreviewClient(): SanityClient {
  const token =
    import.meta.env.SANITY_API_READ_TOKEN ??
    import.meta.env.PUBLIC_SANITY_API_READ_TOKEN;

  if (!token) return sanityClient;

  return createClient({
    ...baseConfig,
    useCdn: false,
    token,
    perspective: "previewDrafts",
    stega: {
      enabled: true,
      studioUrl: SANITY_STUDIO_URL,
    },
  });
}

let _previewClient: SanityClient | null = null;
function getPreviewClient(): SanityClient {
  if (!_previewClient) _previewClient = createPreviewClient();
  return _previewClient;
}

/**
 * Detect preview mode for the current request. We use a cookie set by
 * `/api/preview/enable` because the cookie survives client-side navigation
 * inside the Presentation iframe — query params alone don't.
 *
 * Wrapped in try/catch because Astro emits a noisy warning when cookies
 * are read on a prerendered route at build time. At build time the request
 * doesn't exist yet — the correct answer is always `false`, and we never
 * want to fail the build over a missing header.
 */
export function isPreviewRequest(astro?: Pick<AstroGlobal, "cookies">): boolean {
  if (!astro) return false;
  try {
    return astro.cookies.get("sanity-preview")?.value === "1";
  } catch {
    return false;
  }
}

/**
 * Return the right client for the current request. Pages call this via
 * `getClient(Astro)` and pass the result into the query helpers.
 */
export function getClient(astro?: Pick<AstroGlobal, "cookies">): SanityClient {
  return isPreviewRequest(astro) ? getPreviewClient() : sanityClient;
}

// Image URL builder: stega settings on the source client are stripped here,
// so generated image URLs stay clean (no encoded metadata in src attrs).
const builder = imageUrlBuilder(
  createClient({ ...baseConfig, useCdn: true })
);

/**
 * Generate a Sanity image URL with optional transformations.
 * Pass the raw image field from a query (it has the asset reference);
 * chain transformations like `.width(800).format("webp").url()`.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
