/**
 * Surgical patch: remove SOC 2 claims from the LIVE Sanity content.
 *
 * Unlike `seed-sanity.ts` (which createOrReplaces every document and resets
 * the whole CMS to baseline), this script reads the two affected singletons,
 * changes ONLY the SOC 2 strings, and writes them back — preserving every
 * other edit anyone has made in Studio.
 *
 * What it changes:
 *   1. securityPage.complianceSection.cards — the "SOC 2 Type II" card is
 *      replaced with an "Enterprise-grade security" card (status: active).
 *   2. homepage.faq.items — the "Is my data secure?" answer drops the
 *      "SOC 2 Type II compliant" phrase from its first paragraph.
 *
 * Usage:
 *   cd team-website
 *   SANITY_WRITE_TOKEN=<editor-or-write-token> npx tsx scripts/patch-soc2.ts
 *
 * Get a write token: https://www.sanity.io/manage → team-website-cms →
 * API → Tokens → Add API token → Editor permissions.
 *
 * Idempotent: re-running after a successful patch is a no-op (it matches on
 * the OLD text, which no longer exists once patched).
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

const NEW_CARD = {
  title: "Enterprise-grade security",
  body:
    "End-to-end encryption in transit and at rest, role-based access controls, " +
    "full audit logging, and continuous monitoring.",
  status: "active" as const,
};

const OLD_FAQ_TEXT =
  "Yes. SOC 2 Type II compliant, end-to-end encryption in transit and at rest, " +
  "role-based access controls, and full audit logs. Enterprise customers get SSO, " +
  "custom data residency, and dedicated support.";
const NEW_FAQ_TEXT =
  "Yes. End-to-end encryption in transit and at rest, role-based access controls, " +
  "and full audit logs. Enterprise customers get SSO, custom data residency, and " +
  "dedicated support.";

async function patchSecurityPage() {
  const doc = await client.fetch<any>(`*[_id == "securityPage"][0]`);
  if (!doc) return console.warn("⚠ securityPage not found — skipping.");
  const cards: any[] = doc?.complianceSection?.cards ?? [];
  let hit = false;
  const next = cards.map((c) => {
    if (typeof c?.title === "string" && /soc\s*2/i.test(c.title)) {
      hit = true;
      return { ...c, title: NEW_CARD.title, body: NEW_CARD.body, status: NEW_CARD.status };
    }
    return c;
  });
  if (!hit) return console.log("• securityPage: no SOC 2 card found (already patched?).");
  await client.patch("securityPage").set({ "complianceSection.cards": next }).commit();
  console.log("✓ securityPage: SOC 2 card → Enterprise-grade security.");
}

async function patchHomepageFaq() {
  const doc = await client.fetch<any>(`*[_id == "homepage"][0]`);
  if (!doc) return console.warn("⚠ homepage not found — skipping.");
  const items: any[] = doc?.faq?.items ?? [];
  let hit = false;
  const next = items.map((item) => {
    const answer: any[] = Array.isArray(item?.answer) ? item.answer : [];
    const newAnswer = answer.map((blk) => {
      const children: any[] = Array.isArray(blk?.children) ? blk.children : [];
      const newChildren = children.map((span) => {
        if (typeof span?.text === "string" && span.text.trim() === OLD_FAQ_TEXT) {
          hit = true;
          return { ...span, text: NEW_FAQ_TEXT };
        }
        return span;
      });
      return { ...blk, children: newChildren };
    });
    return { ...item, answer: newAnswer };
  });
  if (!hit) return console.log("• homepage: no SOC 2 FAQ text found (already patched?).");
  await client.patch("homepage").set({ "faq.items": next }).commit();
  console.log("✓ homepage: 'Is my data secure?' answer de-SOC-2'd.");
}

await patchSecurityPage();
await patchHomepageFaq();
console.log("\nDone. Publish/verify in Studio, then check teamrollouts.com/security and the homepage FAQ.");
