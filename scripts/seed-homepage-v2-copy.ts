/**
 * Seed default copy into the homepage v2 (LIVE) Sanity fields — heroV2 + betaV2.
 *
 * Why: those fields fall back to hardcoded defaults when empty (see
 * src/pages/index.astro), so a brand-new editor opening Studio sees blank
 * boxes with no indication of what's currently live on teamrollouts.com.
 * This script fills heroV2/betaV2 with the exact copy shipped in
 * src/lib/homepage-v2-body.html, so editors start from the real text
 * instead of guessing.
 *
 * SAFE BY DESIGN — unlike scripts/seed-sanity.ts (which `createOrReplace`s
 * whole documents and is meant as a one-time initial seed), this uses
 * `.patch(...).set(...)` scoped to ONLY the `heroV2` and `betaV2` keys.
 * Every other field on the homepage document (hero, uploadSection,
 * rolesTabs, engineSection, guidelinesSection, brainSection,
 * integrationsMarquee, faq, stories, chrome, finalCta, seo, ...) is left
 * completely untouched, even if an editor has customized them.
 *
 * Idempotent for a first run, but NOT safe to blindly re-run forever:
 * re-running always resets heroV2/betaV2 back to these hardcoded
 * defaults, overwriting any v2-copy edits marketing has since made
 * (nothing outside heroV2/betaV2 is ever touched). Run this once, right
 * after the Studio schema deploy that introduced these fields — not
 * again after editors start customizing the v2 copy.
 *
 * Usage:
 *   cd team-website
 *   SANITY_WRITE_TOKEN=<editor-or-write-token> npm run seed:homepage-v2-copy
 *
 * Get a write token: https://www.sanity.io/manage → team-website-cms →
 * API → Tokens → Add API token → Editor permissions.
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

// Mirrors the fallback defaults in src/pages/index.astro and the copy
// currently shipped in src/lib/homepage-v2-body.html.
const heroV2 = {
  eyebrow: "Meet Team.",
  titleLead: "A",
  titleEmphasis: "brain",
  titleTail: "for music operations.",
  subhead:
    "Team connects the systems your music operation already runs on, turning every tool, file, message, plan, and data point into one living intelligence layer.",
  // Must match the fallback in src/pages/index.astro — see the note there.
  primaryCtaLabel: "Sign up free",
  secondaryCtaLabel: "Book a walkthrough",
};

const betaV2 = {
  titleLead: "Try it on your",
  titleEmphasis: "next release.",
  subhead: "The Team beta program is now open. Sign up today.",
  submitLabel: "Sign me up",
};

// Patch both the published doc and its draft (if one exists) — Studio
// shows the draft over the published version when a draft is present, so
// patching only "homepage" could leave an editor staring at an
// already-empty draft that masks the seeded published values.
const TARGET_IDS = ["homepage", "drafts.homepage"];

async function seed() {
  console.log(`Patching heroV2 + betaV2 on homepage (${PROJECT_ID}/${DATASET})...`);
  let patched = 0;
  for (const id of TARGET_IDS) {
    try {
      await client.patch(id).set({ heroV2, betaV2 }).commit();
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
  console.log("\nDone. Reload Studio's Homepage document to see the seeded copy.");
}

seed().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
