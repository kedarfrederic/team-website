/**
 * Sanity client + image URL builder.
 *
 * Astro's @sanity/astro integration also exposes `sanityClient` from
 * `sanity:client` virtual module — both work. This file is the canonical
 * import for the rest of the codebase so we have one place to swap config
 * if we ever need an authenticated client for previews.
 */

import { createClient, type ClientConfig } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const config: ClientConfig = {
  projectId: "g1olb5am",
  dataset: "production",
  apiVersion: "2024-12-01",
  useCdn: true, // Build-time fetches — CDN is fine; we rebuild on publish webhook
};

export const sanityClient = createClient(config);

const builder = imageUrlBuilder(sanityClient);

/**
 * Generate a Sanity image URL with optional transformations.
 * Pass the raw image field from a query (it has the asset reference);
 * chain transformations like `.width(800).format("webp").url()`.
 *
 * Example:
 *   urlFor(post.heroImage).width(1200).quality(85).format("webp").url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
