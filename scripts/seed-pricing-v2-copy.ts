/**
 * Seed the v2 pricing copy (hero, billing toggle, tiers, comparison
 * table, FAQ, final CTA) into the live Sanity pricingPage document.
 *
 * Why: pricing.astro already has this exact copy as its fallback values
 * (see src/pages/pricing.astro), but a real pricingPage document already
 * exists in Sanity with the OLD copy — fallbacks never activate while
 * real content is present. This script pushes the new copy into Sanity
 * itself, so it's both live on the site AND editable in Studio.
 *
 * SAFE BY DESIGN — like scripts/seed-homepage-v2-copy.ts, this is a
 * `.patch().set()` scoped to ONLY the fields listed below (hero,
 * billingToggle, tiers, comparisonTable, faq, finalCta). Nothing else on
 * the pricingPage document (e.g. seo) is touched.
 *
 * Idempotent for a first run, but re-running always resets these fields
 * back to this hardcoded copy — don't run it again after an editor has
 * customized the v2 pricing copy in Studio.
 *
 * Usage:
 *   cd team-website
 *   SANITY_WRITE_TOKEN=<editor-or-write-token> npm run seed:pricing-v2-copy
 */

import { createClient } from "@sanity/client";

const PROJECT_ID = "g1olb5am";
const DATASET = "production";
const API_VERSION = "2024-12-01";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN env var.");
  console.error("  → https://www.sanity.io/manage → team-website-cms → API → Tokens");
  console.error("  → Add API token → Editor → copy → re-run with SANITY_WRITE_TOKEN=<token>");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
});

const hero = {
  headlineTop: "Start free.",
  headlineBottom: "Upgrade when you're ready.",
  subhead:
    "Team gives you access to Rollouts and Assets for free, forever. Ready to go further? Pro adds Tours, TeamMate — your AI brain — and connects your whole stack.",
  note: "Take advantage of our limited-time Beta pricing today",
  cta: { label: "Start for free", href: "https://app.teamrollouts.com/onboarding?plan=free" },
};

const billingToggle = {
  yearlyLabel: "Yearly",
  monthlyLabel: "Monthly",
  yearlySaveTag: "Save ~20%",
};

const tiers = [
  {
    _key: "free",
    tierKey: "free",
    name: "Free",
    who: "The core platform, designed for every artist, manager and team",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    period: "forever",
    seatsIncludedNote: "1 seat · unlimited artists, releases & collaborators",
    ctaLabel: "Start for free",
    ctaHref: "https://app.teamrollouts.com/onboarding?plan=free",
    includesLabel: "Includes",
    features: [
      feat("Rollouts — release management"),
      feat("Assets — the creative library"),
      feat("Unlimited artists & releases"),
      feat("Unlimited collaborators & workspaces"),
    ],
  },
  {
    _key: "pro",
    tierKey: "pro",
    name: "Pro",
    who: "For teams who want to connect the whole stack",
    monthlyPrice: "$49.95",
    yearlyPrice: "$39.96",
    priceWasMonthly: "$99.95",
    priceWasYearly: "$79.96",
    period: "/mo · billed yearly",
    periodMonthly: "/mo",
    seatsIncludedNote: "Includes 2 seats",
    extraSeatWasMonthly: "$39.95",
    extraSeatWasYearly: "$31.96",
    extraSeatPriceMonthly: "$29.95/mo",
    extraSeatPriceYearly: "$23.96/mo",
    badge: "Beta pricing · ~50% off",
    ctaLabel: "Start 14-day free trial",
    ctaHref: "https://app.teamrollouts.com/onboarding?plan=pro",
    includesLabel: "Everything in Free, plus",
    features: [
      feat("Tours — tour management", true),
      feat("TeamMate AI — the intelligence layer", true),
      feat("Connections — connect your whole stack", true),
      feat("TeamMate Email & Text", true),
      feat("First access to new betas", true),
      feat("Priority support", true),
    ],
  },
];

// `features` accepts plain strings (✓ bullet) or tierFeature objects that can
// flag a Pro-only line (✦ bullet). Objects need _key + _type like any Sanity
// array member.
function feat(text: string, pro = false) {
  return {
    _type: "tierFeature",
    _key: `feat-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`,
    text,
    pro,
  };
}

function checkCell() { return { _type: "comparisonCell", type: "check" }; }
function dashCell() { return { _type: "comparisonCell", type: "dash" }; }
function textCell(text: string) { return { _type: "comparisonCell", type: "text", text }; }
function groupRow(label: string) {
  return { _type: "comparisonRow", _key: `grp-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, label, isGroupHeader: true };
}
function row(label: string, cells: any[]) {
  return { _type: "comparisonRow", _key: `row-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`, label, valueByColumn: cells };
}

const comparisonTable = {
  heading: "Compare plans",
  columns: ["Free", "Pro"],
  rows: [
    groupRow("The platform"),
    row("Rollouts — release management", [checkCell(), checkCell()]),
    row("Assets — creative library", [checkCell(), checkCell()]),
    row("Tours — tour management", [dashCell(), checkCell()]),
    row("Artists / roster", [textCell("Unlimited"), textCell("Unlimited")]),
    row("Releases", [textCell("Unlimited"), textCell("Unlimited")]),
    row("Collaborators", [textCell("Unlimited"), textCell("Unlimited")]),
    row("Workspaces", [textCell("Unlimited"), textCell("Unlimited")]),
    row("Seats included", [textCell("1"), textCell("2, then per seat")]),
    groupRow("The brain — Pro"),
    row("TeamMate AI", [dashCell(), checkCell()]),
    row("Connections", [dashCell(), checkCell()]),
    row("TeamMate Email & Text", [dashCell(), checkCell()]),
    row("Comprehensive intelligence", [dashCell(), checkCell()]),
    row("First access to new betas", [dashCell(), checkCell()]),
    row("Support", [textCell("Standard"), textCell("Priority")]),
  ],
};

function faqItem(question: string, answerText: string) {
  return {
    _type: "faqItem",
    _key: `faq-${question.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`,
    question,
    answer: [
      { _type: "block", _key: "b1", style: "normal", children: [{ _type: "span", _key: "s1", text: answerText }] },
    ],
  };
}

const faq = {
  eyebrow: "Pricing",
  headlineTop: "Questions?",
  headlineBottom: "We've got answers.",
  footerCta: { label: "Talk to a founder", href: "https://calendly.com/teamrollouts-demo/30min" },
  items: [
    faqItem(
      "Is the platform really free?",
      "Yes. Rollouts and Assets are free — unlimited artists, releases, collaborators and workspaces, with no card. It's the real platform, not a stripped-down taster."
    ),
    faqItem(
      "What's in Pro?",
      "Pro adds Tours, TeamMate — your AI brain — plus the integrations that connect your whole stack, TeamMate Email & Text, comprehensive intelligence, and first access to new betas."
    ),
    faqItem(
      "What's this \"beta pricing\"?",
      "Team is in early access, so Pro is offered at a beta discount off its standard price. Sign up now and you lock in that early-access rate. Both plans start with a 14-day free trial."
    ),
    faqItem(
      "Do I need a card to start?",
      "Not for Free — it's no card, ever. Pro starts with a 14-day free trial and takes a card so it can continue seamlessly if you stay."
    ),
    faqItem(
      "Is my data mine?",
      "Always. Connections are permissioned and revocable, nothing is used to train models, and everything you build is portable and exportable."
    ),
  ],
};

const finalCta = {
  headlineTop: "Run your next release",
  headlineBottom: "on Team, for free.",
  primaryCta: { label: "Start for free", href: "https://app.teamrollouts.com/onboarding?plan=free" },
  secondaryCta: { label: "Book a demo", href: "https://calendly.com/teamrollouts-demo/30min" },
  footnote: "Free platform · no card required",
};

const TARGET_IDS = ["pricingPage", "drafts.pricingPage"];

async function seed() {
  console.log(`Patching v2 pricing copy on pricingPage (${PROJECT_ID}/${DATASET})...`);
  let patched = 0;
  for (const id of TARGET_IDS) {
    try {
      await client
        .patch(id)
        .set({ hero, billingToggle, tiers, comparisonTable, faq, finalCta })
        .commit();
      console.log(`  ✓ patched ${id}`);
      patched++;
    } catch (err: any) {
      const msg = String(err?.message ?? err);
      if (err?.statusCode === 404 || /does ?n[o']t exist|not found/i.test(msg)) {
        console.log(`  – ${id} does not exist, skipping`);
      } else {
        console.error(`  ✗ ${id} failed:`, msg);
        process.exitCode = 1;
      }
    }
  }
  if (patched === 0) {
    console.error("Nothing was patched — check SANITY_WRITE_TOKEN has Editor permissions.");
    process.exitCode = 1;
    return;
  }
  console.log("\nDone. Reload Studio's Pricing page document, or reload /pricing, to see the new copy.");
}

seed().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
