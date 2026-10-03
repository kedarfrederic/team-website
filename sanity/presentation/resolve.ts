/**
 * URL ↔ document resolver for the Studio Presentation tool.
 *
 * Tells Studio which document(s) to surface for any preview-frame URL
 * (so opening `/pricing` in the iframe highlights the `pricingPage`
 * singleton in the structure pane), and which preview URL to open from
 * a given document (the inverse mapping in `locations.ts`).
 */

import { defineDocuments, defineLocations } from "sanity/presentation";
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
  { route: "/", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-home"` },
  { route: "/pricing", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-pricing"` },
  { route: "/rollouts", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-rollouts"` },
  { route: "/teammate", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-teammate"` },
  { route: "/assets", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-assets"` },
  { route: "/tours", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-tours"` },
  { route: "/connectors", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-connectors"` },
  { route: "/contact", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-contact"` },
  { route: "/security", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-security"` },
  { route: "/about", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-about"` },
  { route: "/for-artists", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-for-artists"` },
  { route: "/for-managers", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-for-managers"` },
  { route: "/for-labels", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-for-labels"` },
  { route: "/for-partners", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-for-partners"` },
  { route: "/enterprise", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-enterprise"` },
  { route: "/demo", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-demo"` },
  { route: "/insights", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-insights"` },
  { route: "/changelog", filter: `_type == "marketingV3Page" && _id == "marketing-v3-en-changelog"` },
  { route: "/ko/", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-home"` },
  { route: "/ko/pricing", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-pricing"` },
  { route: "/ko/rollouts", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-rollouts"` },
  { route: "/ko/teammate", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-teammate"` },
  { route: "/ko/assets", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-assets"` },
  { route: "/ko/tours", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-tours"` },
  { route: "/ko/connectors", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-connectors"` },
  { route: "/ko/contact", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-contact"` },
  { route: "/ko/security", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-security"` },
  { route: "/ko/about", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-about"` },
  { route: "/ko/for-artists", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-for-artists"` },
  { route: "/ko/for-managers", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-for-managers"` },
  { route: "/ko/for-labels", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-for-labels"` },
  { route: "/ko/for-partners", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-for-partners"` },
  { route: "/ko/enterprise", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-enterprise"` },
  { route: "/ko/demo", filter: `_type == "marketingV3Page" && _id == "marketing-v3-ko-demo"` },

  { route: "/integrations", filter: `_type == "integrationsPage" && _id == "integrationsPage"` },
  { route: "/intelligence", filter: `_type == "verticalProductPage" && _id == "intelligencePage"` },
  { route: "/orchestration", filter: `_type == "verticalProductPage" && _id == "orchestrationPage"` },
  { route: "/preview/insights/:slug", filter: `_type == "insightPost" && slug.current == $slug` },
]);

export const documentLocations = {
  marketingV3Page: defineLocations({select:{page:"pageKey",locale:"locale"},resolve:(doc)=>!doc?.page?null:({locations:[{title:`${doc.page} · ${doc.locale}`,href:(doc.locale==="ko"?"/ko":"")+(doc.page==="home"||doc.page==="shared"?"/":`/${doc.page}`)}]})}),
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
