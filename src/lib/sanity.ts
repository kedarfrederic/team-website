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

import { createClient, type ClientConfig, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { AstroGlobal } from "astro";

export const SANITY_PROJECT_ID = "g1olb5am";
export const SANITY_DATASET = "production";
export const SANITY_API_VERSION = "2024-12-01";
export const SANITY_STUDIO_URL =
  import.meta.env.PUBLIC_SANITY_STUDIO_URL ?? "https://team-cms.sanity.studio";

// Public client — NO stega encoding. Stega injects zero-width characters
// into every text node so the visual-editing overlay can attach pencils;
// that's perfect inside the Studio iframe but terrible on the public site
// (zero-width chars in <title>/<meta>, console spam from the overlay
// trying to decode random text nodes, and the overlay accidentally
// attaching pencils for non-editor visitors). Use the CDN for the
// public client — fewer reads against the live API, faster response.
export const sanityClient: SanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
});

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
 *
 * Note: `perspective: "drafts"` is the @sanity/client v7+ name for what
 * used to be called `"previewDrafts"`. With the old name, v7 silently
 * returns published-only content — which manifests as the Studio iframe
 * "refreshing without showing the new content until you click Publish".
 */
function createPreviewClient(astro?: Pick<AstroGlobal, "locals">): SanityClient {
  const token = readEnv(astro, "SANITY_API_READ_TOKEN");
  if (!token) return sanityClient;

  return createClient({
    ...baseConfig,
    useCdn: false,
    token,
    perspective: "drafts",
    stega: {
      enabled: true,
      studioUrl: SANITY_STUDIO_URL,
    },
  });
}

/**
 * Detect preview mode for the current request.
 *
 * Three signals, any of which trips preview mode:
 *  1. The `sanity-preview` cookie set by `/api/preview/enable`.
 *  2. The same name found in the raw `Cookie` header (works around any
 *     adapter-level cookie parsing quirks on CF Pages).
 *  3. A `?preview=1` query param (set by /api/preview/enable as a redirect
 *     fallback when the browser drops the partitioned cookie — Safari ITP,
 *     strict cross-site cookie blocking, etc.).
 */
export function isPreviewRequest(
  astro?: Pick<AstroGlobal, "cookies" | "request" | "url">
): boolean {
  if (!astro) return false;
  // 1. Astro's typed cookie API
  try {
    if (astro.cookies?.get("sanity-preview")?.value === "1") return true;
  } catch {
    /* fall through */
  }
  // 2. Raw cookie header
  try {
    const raw = astro.request?.headers?.get("cookie") ?? "";
    if (/(?:^|;\s*)sanity-preview=1(?:;|$)/.test(raw)) return true;
  } catch {
    /* fall through */
  }
  // 3. Query param fallback
  try {
    if (astro.url?.searchParams.get("preview") === "1") return true;
  } catch {
    /* fall through */
  }
  return false;
}

/**
 * Return the right client for the current request. Pages call this via
 * `getClient(Astro)`. Cached per-request via `Astro.locals` so repeated
 * calls in the same request (e.g. layout + page) only build the preview
 * client once.
 */
export function getClient(
  astro?: Pick<AstroGlobal, "cookies" | "locals" | "request" | "url">
): SanityClient {
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
