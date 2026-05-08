/**
 * Sanity client + image URL builder.
 *
 * The `@sanity/astro` integration owns the published client (configured in
 * astro.config.mjs with stega enabled). We re-export it as `sanityClient`
 * so query helpers and components have one canonical import, and provide
 * `getClient(Astro)` which returns a draft-aware client when the
 * `sanity-preview` cookie is set on the current request.
 *
 * Cloudflare quirk: encrypted env vars (read token + preview secret) are
 * NOT exposed via `import.meta.env`. They reach the Worker only through
 * `Astro.locals.runtime.env` at request time. We try the runtime binding
 * first, then fall back to `import.meta.env` so local `astro dev` (which
 * loads `.env` via Vite) keeps working.
 */

import { sanityClient as baseClient } from "sanity:client";
import { createClient, type ClientConfig, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { AstroGlobal } from "astro";

export const SANITY_PROJECT_ID = "g1olb5am";
export const SANITY_DATASET = "production";
export const SANITY_API_VERSION = "2024-12-01";
export const SANITY_STUDIO_URL =
  import.meta.env.PUBLIC_SANITY_STUDIO_URL ?? "https://team-cms.sanity.studio";

// Re-export the integration-managed published client. It already has stega
// encoding turned on (configured in astro.config.mjs).
export const sanityClient = baseClient;

const baseConfig: ClientConfig = {
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
};

/** Read an env var from Cloudflare's runtime binding first, then build-time. */
function readEnv(astro: Pick<AstroGlobal, "locals"> | undefined, name: string): string | undefined {
  const runtime = (astro?.locals as any)?.runtime?.env ?? {};
  return runtime[name] ?? (import.meta.env as any)[name];
}

/**
 * Build a draft-aware client. Requires `SANITY_API_READ_TOKEN` (a Viewer
 * token from manage.sanity.io). Falls back to the published client when
 * the token isn't reachable so the site keeps rendering.
 */
function createPreviewClient(astro?: Pick<AstroGlobal, "locals">): SanityClient {
  const token = readEnv(astro, "SANITY_API_READ_TOKEN");
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

/**
 * Detect preview mode for the current request via the `sanity-preview`
 * cookie set by `/api/preview/enable`.
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
 * `getClient(Astro)`. Cached per-request via `Astro.locals` so repeated
 * calls in the same request (e.g. layout + page) only build the preview
 * client once.
 */
export function getClient(astro?: Pick<AstroGlobal, "cookies" | "locals">): SanityClient {
  if (!isPreviewRequest(astro)) return sanityClient;
  const cache = (astro?.locals as any) ?? {};
  if (cache.__sanityPreviewClient) return cache.__sanityPreviewClient;
  const client = createPreviewClient(astro);
  cache.__sanityPreviewClient = client;
  return client;
}

// Image URL builder: use a clean, non-stega client so generated img src
// attributes don't carry encoded metadata.
const builder = imageUrlBuilder(
  createClient({ ...baseConfig, useCdn: true })
);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
