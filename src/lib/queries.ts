/**
 * GROQ queries — one place for every page's data fetch.
 *
 * Astro pages import the matching `getXPage` function from here, which
 * returns either the page document or null (when the document hasn't been
 * created yet — common during the build-out phase).
 *
 * Conventions:
 * - Singletons use the documentId pattern (one per page) — query by `_id`
 * - Collections use document type + ordering
 * - `null` returns are valid; pages render their own empty/placeholder
 *   states so the build doesn't fail when content is missing.
 */

import { sanityClient } from "./sanity";

// ── Site Settings (used by every page for nav/footer/SEO) ─────
export async function getSiteSettings() {
  return sanityClient.fetch(`*[_type == "siteSettings" && _id == "siteSettings"][0]`);
}

// ── Singleton pages ───────────────────────────────────────────
export async function getHomepage() {
  return sanityClient.fetch(`*[_type == "homepage" && _id == "homepage"][0]`);
}

export async function getPricingPage() {
  return sanityClient.fetch(`*[_type == "pricingPage" && _id == "pricingPage"][0]`);
}

export async function getAboutPage() {
  return sanityClient.fetch(`*[_type == "aboutPage" && _id == "aboutPage"][0]`);
}

export async function getEnterprisePage() {
  return sanityClient.fetch(`*[_type == "enterprisePage" && _id == "enterprisePage"][0]`);
}

export async function getSecurityPage() {
  return sanityClient.fetch(`*[_type == "securityPage" && _id == "securityPage"][0]`);
}

export async function getIntegrationsPage() {
  return sanityClient.fetch(`*[_type == "integrationsPage" && _id == "integrationsPage"][0]`);
}

export async function getInsightsIndexPage() {
  return sanityClient.fetch(`*[_type == "insightsIndexPage" && _id == "insightsIndexPage"][0]`);
}

export async function getChangelogPage() {
  return sanityClient.fetch(`*[_type == "changelogPage" && _id == "changelogPage"][0]`);
}

export async function getDemoPage() {
  return sanityClient.fetch(`*[_type == "demoPage" && _id == "demoPage"][0]`);
}

export async function getContactPage() {
  return sanityClient.fetch(`*[_type == "contactPage" && _id == "contactPage"][0]`);
}

// ── ICP role pages (3 singletons of the same type) ───────────
export async function getIcpPage(documentId: "forArtistsPage" | "forLabelsPage" | "forManagersPage") {
  return sanityClient.fetch(
    `*[_type == "icpPage" && _id == $id][0]`,
    { id: documentId }
  );
}

export async function getPartnerPage() {
  return sanityClient.fetch(`*[_type == "partnerPage" && _id == "forPartnersPage"][0]`);
}

// ── Vertical product pages (2 singletons of the same type) ───
export async function getVerticalProductPage(documentId: "intelligencePage" | "orchestrationPage") {
  return sanityClient.fetch(
    `*[_type == "verticalProductPage" && _id == $id][0]`,
    { id: documentId }
  );
}

// ── Collections ───────────────────────────────────────────────
export async function getInsightPosts() {
  return sanityClient.fetch(`
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

export async function getInsightPostBySlug(slug: string) {
  return sanityClient.fetch(
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

export async function getInsightPostSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<{ slug: { current: string } }[]>(
    `*[_type == "insightPost" && defined(slug.current)]{ slug }`
  );
  return slugs.map((s) => s.slug.current);
}

export async function getChangelogEntries() {
  return sanityClient.fetch(`
    *[_type == "changelogEntry"] | order(releaseDate desc, sortWithinDate asc)
  `);
}

export async function getIntegrations() {
  return sanityClient.fetch(`
    *[_type == "integration"] | order(sortOrder asc, name asc)
  `);
}
