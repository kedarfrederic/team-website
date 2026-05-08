/**
 * Document → URL mapping for the Studio Presentation tool.
 *
 * When an editor opens any of these documents, Studio knows which marketing
 * page to load in the preview iframe. The reverse mapping (URL → document)
 * is handled in `presentation/resolve.ts`.
 *
 * Add a new entry here every time we mint a new singleton page document.
 */

import { defineLocations } from "sanity/presentation";

export const homepageLocations = defineLocations({
  locations: [{ title: "Homepage", href: "/" }],
});

export const pricingLocations = defineLocations({
  locations: [{ title: "Pricing", href: "/pricing" }],
});

export const aboutLocations = defineLocations({
  locations: [{ title: "About", href: "/about" }],
});

export const enterpriseLocations = defineLocations({
  locations: [{ title: "Enterprise", href: "/enterprise" }],
});

export const securityLocations = defineLocations({
  locations: [{ title: "Security", href: "/security" }],
});

export const integrationsLocations = defineLocations({
  locations: [{ title: "Integrations", href: "/integrations" }],
});

export const insightsIndexLocations = defineLocations({
  locations: [{ title: "Insights", href: "/insights" }],
});

export const changelogLocations = defineLocations({
  locations: [{ title: "Changelog", href: "/changelog" }],
});

export const demoLocations = defineLocations({
  locations: [{ title: "Book a demo", href: "/demo" }],
});

export const contactLocations = defineLocations({
  locations: [{ title: "Contact", href: "/contact" }],
});

export const partnerLocations = defineLocations({
  locations: [{ title: "For partners", href: "/for-partners" }],
});

/**
 * ICP pages (artists / labels / managers) and vertical product pages
 * (intelligence / orchestration) share a document type but have multiple
 * singleton instances. The locations resolver inspects `_id` to pick the
 * matching URL.
 */
export const icpLocations = defineLocations({
  select: { _id: "_id", headline: "hero.headline" },
  resolve: (doc) => {
    const map: Record<string, string> = {
      forArtistsPage: "/for-artists",
      forLabelsPage: "/for-labels",
      forManagersPage: "/for-managers",
    };
    const href = map[doc?._id as string];
    if (!href) return null;
    return { locations: [{ title: doc?.headline ?? "ICP page", href }] };
  },
});

export const verticalProductLocations = defineLocations({
  select: { _id: "_id", headline: "hero.headline" },
  resolve: (doc) => {
    const map: Record<string, string> = {
      intelligencePage: "/intelligence",
      orchestrationPage: "/orchestration",
    };
    const href = map[doc?._id as string];
    if (!href) return null;
    return { locations: [{ title: doc?.headline ?? "Product page", href }] };
  },
});

/**
 * Insight posts are addressable by slug.
 */
export const insightPostLocations = defineLocations({
  select: { title: "title", slug: "slug.current" },
  resolve: (doc) => {
    if (!doc?.slug) return null;
    return {
      locations: [
        { title: doc?.title ?? "Insight post", href: `/insights/${doc.slug}` },
        { title: "Insights index", href: "/insights" },
      ],
    };
  },
});
