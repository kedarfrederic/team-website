/**
 * URL ↔ document resolver for the Studio Presentation tool.
 *
 * Tells Studio which document(s) to surface for any preview-frame URL
 * (so opening `/pricing` in the iframe highlights the `pricingPage`
 * singleton in the structure pane), and which preview URL to open from
 * a given document (the inverse mapping in `locations.ts`).
 */

import { defineDocuments } from "sanity/presentation";
import {
  homepageLocations,
  pricingLocations,
  aboutLocations,
  enterpriseLocations,
  securityLocations,
  integrationsLocations,
  insightsIndexLocations,
  changelogLocations,
  demoLocations,
  contactLocations,
  partnerLocations,
  icpLocations,
  verticalProductLocations,
  insightPostLocations,
} from "./locations";

export const mainDocuments = defineDocuments([
  { route: "/", filter: `_type == "homepage" && _id == "homepage"` },
  { route: "/pricing", filter: `_type == "pricingPage" && _id == "pricingPage"` },
  { route: "/about", filter: `_type == "aboutPage" && _id == "aboutPage"` },
  { route: "/enterprise", filter: `_type == "enterprisePage" && _id == "enterprisePage"` },
  { route: "/security", filter: `_type == "securityPage" && _id == "securityPage"` },
  { route: "/integrations", filter: `_type == "integrationsPage" && _id == "integrationsPage"` },
  { route: "/insights", filter: `_type == "insightsIndexPage" && _id == "insightsIndexPage"` },
  { route: "/changelog", filter: `_type == "changelogPage" && _id == "changelogPage"` },
  { route: "/demo", filter: `_type == "demoPage" && _id == "demoPage"` },
  { route: "/contact", filter: `_type == "contactPage" && _id == "contactPage"` },
  { route: "/for-partners", filter: `_type == "partnerPage" && _id == "forPartnersPage"` },
  { route: "/for-artists", filter: `_type == "icpPage" && _id == "forArtistsPage"` },
  { route: "/for-labels", filter: `_type == "icpPage" && _id == "forLabelsPage"` },
  { route: "/for-managers", filter: `_type == "icpPage" && _id == "forManagersPage"` },
  { route: "/intelligence", filter: `_type == "verticalProductPage" && _id == "intelligencePage"` },
  { route: "/orchestration", filter: `_type == "verticalProductPage" && _id == "orchestrationPage"` },
  { route: "/insights/:slug", filter: `_type == "insightPost" && slug.current == $slug` },
]);

export const documentLocations = {
  homepage: homepageLocations,
  pricingPage: pricingLocations,
  aboutPage: aboutLocations,
  enterprisePage: enterpriseLocations,
  securityPage: securityLocations,
  integrationsPage: integrationsLocations,
  insightsIndexPage: insightsIndexLocations,
  changelogPage: changelogLocations,
  demoPage: demoLocations,
  contactPage: contactLocations,
  partnerPage: partnerLocations,
  icpPage: icpLocations,
  verticalProductPage: verticalProductLocations,
  insightPost: insightPostLocations,
};
