/**
 * Schema registry — single source of truth for all types in the Studio.
 *
 * To add a new type:
 *   1. Create the file under `documents/` or `objects/`
 *   2. Import + add to the appropriate group below
 *   3. Restart `npm run dev`
 *   4. If it's a document, also add it to `deskStructure.ts` for sidebar placement
 */

// ── Reusable objects (embedded inside documents) ──────────────
import { seoBlock } from "./objects/seoBlock";
import { ctaBlock } from "./objects/ctaBlock";
import { faqItem } from "./objects/faqItem";
import { faqBlock } from "./objects/faqBlock";
import { roleCard } from "./objects/roleCard";
import { rolesGrid } from "./objects/rolesGrid";
import { painRow } from "./objects/painRow";
import { painSection } from "./objects/painSection";
import { featureCard } from "./objects/featureCard";
import { featureSpotlight } from "./objects/featureSpotlight";
import { stepItem } from "./objects/stepItem";
import { stepsBlock } from "./objects/stepsBlock";
import { formFieldCopy } from "./objects/formFieldCopy";

// ── Mock visuals (polymorphic — used inside painRow + featureCard) ─
import { mockGantt } from "./objects/mockData/mockGantt";
import { mockBudget } from "./objects/mockData/mockBudget";
import { mockChat } from "./objects/mockData/mockChat";
import { mockTimeline } from "./objects/mockData/mockTimeline";

// ── Pages (singletons) ───────────────────────────────────────
import { siteSettings } from "./documents/siteSettings";
import { homepage } from "./documents/homepage";
import { pricingPage } from "./documents/pricingPage";
import { icpPage } from "./documents/icpPage";
import { partnerPage } from "./documents/partnerPage";
import { aboutPage } from "./documents/aboutPage";
import { enterprisePage } from "./documents/enterprisePage";
import { verticalProductPage } from "./documents/verticalProductPage";
import { integrationsPage } from "./documents/integrationsPage";
import { securityPage } from "./documents/securityPage";
import { insightsIndexPage } from "./documents/insightsIndexPage";
import { changelogPage } from "./documents/changelogPage";
import { demoPage } from "./documents/demoPage";
import { contactPage } from "./documents/contactPage";

// ── Collections (many-of) ────────────────────────────────────
import { insightCategory } from "./documents/insightCategory";
import { insightPost } from "./documents/insightPost";
import { changelogEntry } from "./documents/changelogEntry";
import { integration } from "./documents/integration";

export const schemaTypes = [
  // Pages
  siteSettings,
  homepage,
  pricingPage,
  icpPage,
  partnerPage,
  aboutPage,
  enterprisePage,
  verticalProductPage,
  integrationsPage,
  securityPage,
  insightsIndexPage,
  changelogPage,
  demoPage,
  contactPage,

  // Collections
  insightCategory,
  insightPost,
  changelogEntry,
  integration,

  // Reusable objects
  seoBlock,
  ctaBlock,
  faqItem,
  faqBlock,
  roleCard,
  rolesGrid,
  painRow,
  painSection,
  featureCard,
  featureSpotlight,
  stepItem,
  stepsBlock,
  formFieldCopy,

  // Mock visuals
  mockGantt,
  mockBudget,
  mockChat,
  mockTimeline,
];
