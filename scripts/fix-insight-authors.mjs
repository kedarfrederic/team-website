#!/usr/bin/env node
/**
 * Correct the `authorName` on the v2 insight posts in Sanity.
 *
 * WHY THIS EXISTS
 * The source repo is internally inconsistent about authorship:
 *   • content/insights/<slug>.md frontmatter says `author: Team` for all six
 *   • the GENERATED insights/<slug>.html shows named bylines (Simon Lodge,
 *     Kedar Frederic, Jake) — build-insights.js does `data.author || 'Team'`,
 *     so the HTML was built from an earlier version of the frontmatter and the
 *     markdown was later flattened to "Team" without regenerating
 *   • HANDOFF.md §8 explicitly specifies "named author — Simon Lodge / Kedar
 *     Frederic / Jake" for the BlogPosting schema
 *
 * Two of the three sources agree on named authors, and "Team" is precisely the
 * fallback value in build-insights.js — so the flattened markdown is the
 * outlier. scripts/import-insights-v2.mjs read the markdown and therefore
 * published all six under "Team", dropping the bylines.
 *
 * This reads the author back out of the source's rendered HTML (the same
 * artifact the article bodies were taken from, so they stay consistent) and
 * patches only `authorName`. Nothing else is touched.
 *
 * Authorship is a factual claim, so this is deliberately a separate, reviewable
 * step rather than folded into the content import.
 *
 * Usage:
 *   node scripts/fix-insight-authors.mjs --source=<multipager path>
 *   SANITY_WRITE_TOKEN=<token> node scripts/fix-insight-authors.mjs --source=<path> --write
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { createClient } from "@sanity/client";

const WRITE = process.argv.includes("--write");
const srcArg = process.argv.find((a) => a.startsWith("--source="));
if (!srcArg) {
  console.error("error: --source=<path to team-july2026-multipager> is required.");
  process.exit(1);
}
const SRC = resolve(srcArg.slice("--source=".length));

const TOKEN = process.env.SANITY_WRITE_TOKEN;
if (WRITE && !TOKEN) {
  console.error("error: SANITY_WRITE_TOKEN is required with --write.");
  process.exit(1);
}

const client = createClient({
  projectId: "g1olb5am",
  dataset: "production",
  apiVersion: "2024-12-01",
  token: TOKEN,
  useCdn: false,
});

// slug -> Sanity _id, mirroring import-insights-v2.mjs
const POSTS = [
  { slug: "ai-music-industry-nuanced", id: "post-ai" },
  { slug: "stop-treating-release-as-project", id: "post-stop" },
  { slug: "release-day-checklist", id: "post-checklist" },
  { slug: "the-88-percent-problem", id: "post-88-percent" },
  { slug: "real-ai-problem-in-music", id: "post-real-ai-problem" },
  { slug: "music-release-management-software", id: "post-release-mgmt-software" },
];

const ids = POSTS.map((p) => p.id);
const current = await client.fetch(
  `*[_type=="insightPost" && _id in $ids]{_id, authorName, "slug": slug.current}`,
  { ids }
);
const currentById = new Map(current.map((c) => [c._id, c]));

console.log(`\n${WRITE ? "WRITE MODE" : "DRY RUN (nothing written)"}\n`);
const plan = [];
for (const p of POSTS) {
  const file = join(SRC, "insights", `${p.slug}.html`);
  if (!existsSync(file)) {
    console.log(`  – ${p.slug}: no generated HTML, skipping`);
    continue;
  }
  const m = /<span>By ([^<]+)<\/span>/.exec(readFileSync(file, "utf8"));
  if (!m) {
    console.log(`  – ${p.slug}: no byline found in HTML, skipping`);
    continue;
  }
  const author = m[1].trim();
  const before = currentById.get(p.id)?.authorName ?? "(missing doc)";
  const changed = before !== author;
  plan.push({ id: p.id, author, changed });
  console.log(
    `  ${changed ? "UPDATE" : "same  "} ${p.id.padEnd(28)} ${JSON.stringify(before)} -> ${JSON.stringify(author)}`
  );
}

const todo = plan.filter((p) => p.changed);
if (!WRITE) {
  console.log(`\n${todo.length} would change. Re-run with --write to apply.`);
  process.exit(0);
}
if (!todo.length) {
  console.log("\nNothing to change.");
  process.exit(0);
}

let ok = 0;
for (const p of todo) {
  try {
    await client.patch(p.id).set({ authorName: p.author }).commit();
    console.log(`  ✓ ${p.id} -> ${p.author}`);
    ok++;
  } catch (err) {
    console.error(`  ✗ ${p.id}: ${err?.message ?? err}`);
    process.exitCode = 1;
  }
}
console.log(`\nDone. ${ok}/${todo.length} patched.`);
