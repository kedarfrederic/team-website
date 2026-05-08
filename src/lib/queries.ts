/**
 * GROQ queries — one place for every page's data fetch.
 *
 * Each helper takes an optional `client`. Default is the published
 * `sanityClient` (CDN, no drafts) — perfect for static builds. Pages that
 * need to render drafts pass a preview-aware client from `getClient(Astro)`
 * so the Studio Presentation tool can show unpublished edits.
 *
 * Conventions:
 * - Singletons use the documentId pattern (one per page) — query by `_id`
 * - Collections use document type + ordering
 * - `null` returns are valid; pages render their own empty/placeholder
 *   states so the build doesn't fail when content is missing.
 */

import type { SanityClient } from "@sanity/client";
import { sanityClient } from "./sanity";

type Client = SanityClient;

// ── Site Settings (used by every page for nav/footer/SEO) ─────
export async function getSiteSettings(client: Client = sanityClient) {
  return client.fetch(`*[_type == "siteSettings" && _id == "siteSettings"][0]`);
}

// ── Singleton pages ───────────────────────────────────────────
export async function getHomepage(client: Client = sanityClient) {
  return client.fetch(`*[_type == "homepage" && _id == "homepage"][0]`);
}

export async function getPricingPage(client: Client = sanityClient) {
  return client.fetch(`*[_type == "pricingPage" && _id == "pricingPage"][0]`);
}

export async function getAboutPage(client: Client = sanityClient) {
  return client.fetch(`*[_type == "aboutPage" && _id == "aboutPage"][0]`);
}

export async function getEnterprisePage(client: Client = sanityClient) {
  return client.fetch(`*[_type == "enterprisePage" && _id == "enterprisePage"][0]`);
}

export async function getSecurityPage(client: Client = sanityClient) {
  return client.fetch(`*[_type == "securityPage" && _id == "securityPage"][0]`);
}

export async function getIntegrationsPage(client: Client = sanityClient) {
  return client.fetch(`*[_type == "integrationsPage" && _id == "integrationsPage"][0]`);
}

export async function getInsightsIndexPage(client: Client = sanityClient) {
  return client.fetch(`*[_type == "insightsIndexPage" && _id == "insightsIndexPage"][0]`);
}

export async function getChangelogPage(client: Client = sanityClient) {
  return client.fetch(`*[_type == "changelogPage" && _id == "changelogPage"][0]`);
}

export async function getDemoPage(client: Client = sanityClient) {
  return client.fetch(`*[_type == "demoPage" && _id == "demoPage"][0]`);
}

export async function getContactPage(client: Client = sanityClient) {
  return client.fetch(`*[_type == "contactPage" && _id == "contactPage"][0]`);
}

// ── ICP role pages (3 singletons of the same type) ───────────
export async function getIcpPage(
  documentId: "forArtistsPage" | "forLabelsPage" | "forManagersPage",
  client: Client = sanityClient
) {
  return client.fetch(`*[_type == "icpPage" && _id == $id][0]`, { id: documentId });
}

export async function getPartnerPage(client: Client = sanityClient) {
  return client.fetch(`*[_type == "partnerPage" && _id == "forPartnersPage"][0]`);
}

// ── Vertical product pages (2 singletons of the same type) ───
export async function getVerticalProductPage(
  documentId: "intelligencePage" | "orchestrationPage",
  client: Client = sanityClient
) {
  return client.fetch(`*[_type == "verticalProductPage" && _id == $id][0]`, { id: documentId });
}

// ── Collections ───────────────────────────────────────────────
export async function getInsightPosts(client: Client = sanityClient) {
  return client.fetch(`
    *[_type == "insightPost"] | order(publishDate desc) {
      _id,
      title,
      slug,
      excerpt,
      heroImage,
      publishDate,
      readMinutes,
      authorName,
      "category": category->{ title, slug, color }
    }
  `);
}

export async function getInsightPostBySlug(slug: string, client: Client = sanityClient) {
  return client.fetch(
    `
    *[_type == "insightPost" && slug.current == $slug][0] {
      ...,
      "category": category->{ title, slug, color },
      "relatedPosts": relatedPosts[]->{ _id, title, slug, excerpt, heroImage, publishDate, "category": category->{ title } }
    }
  `,
    { slug }
  );
}

export async function getInsightPostSlugs(client: Client = sanityClient): Promise<string[]> {
  const slugs = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "insightPost" && defined(slug.current)]{ slug }`
  );
  return slugs.map((s) => s.slug.current);
}

export async function getChangelogEntries(client: Client = sanityClient) {
  return client.fetch(`
    *[_type == "changelogEntry"] | order(releaseDate desc, sortWithinDate asc)
  `);
}

export async function getIntegrations(client: Client = sanityClient) {
  return client.fetch(`
    *[_type == "integration"] | order(sortOrder asc, name asc)
  `);
}
