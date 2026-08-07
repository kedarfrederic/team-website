#!/usr/bin/env node
/**
 * Import the v2 Insights content (team-july2026-multipager) into Sanity as
 * `insightPost` documents, and refresh the `insightCategory` docs.
 *
 * Usage:
 *   node scripts/import-insights-v2.mjs --source=<path-to-multipager-repo>
 *   SANITY_WRITE_TOKEN=<editor-token> node scripts/import-insights-v2.mjs --source=<path> --write
 *
 * Dry-run by default: prints exactly what WOULD change (per field) and writes
 * nothing. Pass --write to commit.
 *
 * Where the data comes from, per post:
 *   • metadata ← content/insights/<slug>.md frontmatter (maps ~1:1 to the
 *     insightPost schema — see the source repo's INSIGHTS.md)
 *   • body     ← insights/<slug>.html, the `.prose` element, converted to
 *     Portable Text with @sanity/block-tools (same approach as the existing
 *     scripts/import-insight-bodies.mjs). We use the GENERATED HTML rather
 *     than re-implementing a Markdown parser, so what lands in Sanity matches
 *     what the source site renders.
 *   • categories ← content/insights/_categories.json
 *
 * SAFETY — this script cannot remove content:
 *   • It only ever createOrReplace()s the 6 posts listed in POSTS and
 *     patch()es the 4 category docs. No delete() call exists anywhere.
 *   • The 4 live posts that are NOT part of the v2 set (introducing-teammate,
 *     independent-label-playbook-2026, playlist-pitching-2026,
 *     dsp-pitch-timeline-guide) are never referenced and stay exactly as they
 *     are — they're live and indexed.
 *   • The 3 overlapping slugs reuse their EXISTING _id, so they update in
 *     place. That keeps every incoming reference (relatedPosts) and the
 *     published URL intact instead of creating a duplicate at a new id.
 *   • Bodies are replaced deliberately: the v2 markdown is the newer, rewritten
 *     copy. Run with no --write first and read the diff summary.
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { htmlToBlocks } from "@sanity/block-tools";
import { Schema } from "@sanity/schema";
import { createClient } from "@sanity/client";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "..");

// ── args ────────────────────────────────────────────────────────────────
const WRITE = process.argv.includes("--write");
const sourceArg = process.argv.find((a) => a.startsWith("--source="));
if (!sourceArg) {
  console.error("error: --source=<path to team-july2026-multipager checkout> is required.");
  console.error("  e.g. node scripts/import-insights-v2.mjs --source=/tmp/team-july2026-multipager");
  process.exit(1);
}
const SRC = resolve(sourceArg.slice("--source=".length));
if (!existsSync(join(SRC, "content/insights/_categories.json"))) {
  console.error(`error: ${SRC} doesn't look like the multipager repo (no content/insights/_categories.json).`);
  process.exit(1);
}

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

// ── slug → Sanity _id ───────────────────────────────────────────────────
// The first three already exist in Sanity; reuse their ids so they update in
// place rather than duplicating. The last three are new.
const POSTS = [
  { slug: "ai-music-industry-nuanced", id: "post-ai", existing: true },
  { slug: "stop-treating-release-as-project", id: "post-stop", existing: true },
  { slug: "release-day-checklist", id: "post-checklist", existing: true },
  { slug: "the-88-percent-problem", id: "post-88-percent", existing: false },
  { slug: "real-ai-problem-in-music", id: "post-real-ai-problem", existing: false },
  { slug: "music-release-management-software", id: "post-release-mgmt-software", existing: false },
];

// ── portable-text target type (mirrors insightPost.body) ────────────────
const blockContentType = Schema.compile({
  name: "default",
  types: [
    {
      name: "post",
      type: "object",
      fields: [
        {
          name: "body",
          type: "array",
          of: [
            {
              type: "block",
              styles: [
                { title: "Normal", value: "normal" },
                { title: "H2", value: "h2" },
                { title: "H3", value: "h3" },
                { title: "Quote", value: "blockquote" },
              ],
              lists: [
                { title: "Bullet", value: "bullet" },
                { title: "Numbered", value: "number" },
              ],
              marks: {
                decorators: [
                  { title: "Strong", value: "strong" },
                  { title: "Emphasis", value: "em" },
                ],
                annotations: [
                  { name: "link", type: "object", fields: [{ name: "href", type: "url" }] },
                ],
              },
            },
            { type: "image" },
          ],
        },
      ],
    },
  ],
})
  .get("post")
  .fields.find((f) => f.name === "body").type;

// ── tiny frontmatter parser (key: value, no nesting needed here) ────────
function parseFrontmatter(raw) {
  const m = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  if (!m) throw new Error("no frontmatter");
  const data = {};
  for (const line of m[1].split("\n")) {
    const mm = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!mm) continue;
    let v = mm[2].trim();
    // strip matching surrounding quotes
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    data[mm[1]] = v;
  }
  return { data, body: m[2] };
}

// Matches build-insights.js: readTime = given || max(1, round(words / 200))
function readTime(markdownBody, given) {
  if (given) return Number(given);
  return Math.max(1, Math.round(markdownBody.trim().split(/\s+/).length / 200));
}

// Existing docs use 09:00:00Z; keep that so ordering stays stable.
function toDateTime(ymd) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return `${ymd}T09:00:00Z`;
  return ymd;
}

// ── categories ──────────────────────────────────────────────────────────
const catFile = JSON.parse(readFileSync(join(SRC, "content/insights/_categories.json"), "utf8"));
const CATEGORIES = catFile.categories;

// ── build docs ──────────────────────────────────────────────────────────
const built = [];
for (const p of POSTS) {
  const mdPath = join(SRC, "content/insights", `${p.slug}.md`);
  const htmlPath = join(SRC, "insights", `${p.slug}.html`);
  if (!existsSync(mdPath)) { console.log(`SKIP  ${p.slug} — no markdown`); continue; }
  if (!existsSync(htmlPath)) { console.log(`SKIP  ${p.slug} — no generated HTML`); continue; }

  const { data, body: mdBody } = parseFrontmatter(readFileSync(mdPath, "utf8"));

  const dom = new JSDOM(readFileSync(htmlPath, "utf8"));
  const prose = dom.window.document.querySelector(".prose");
  if (!prose) { console.log(`MISS  ${p.slug} — no .prose in HTML`); continue; }
  // Drop any in-article CTA/promo — the live site renders its own CtaBlock.
  prose.querySelectorAll(".post-cta, .post-cta__card, .ctaband").forEach((el) => el.remove());

  const blocks = htmlToBlocks(prose.innerHTML, blockContentType, {
    parseHtml: (h) => new JSDOM(h).window.document,
  });

  const catSlug = data.category;
  if (!CATEGORIES.some((c) => c.slug === catSlug)) {
    console.error(`FAIL  ${p.slug} — unknown category "${catSlug}"`);
    process.exitCode = 1;
    continue;
  }

  built.push({
    meta: p,
    listCounts: blocks.filter((b) => b.listItem).length,
    doc: {
      _id: p.id,
      _type: "insightPost",
      title: data.title,
      slug: { _type: "slug", current: p.slug },
      excerpt: data.excerpt,
      category: { _type: "reference", _ref: `cat-${catSlug}` },
      authorName: data.author || "Team",
      publishDate: toDateTime(data.publishDate),
      readMinutes: readTime(mdBody, data.readMinutes),
      hiddenFromIndex: data.hidden === "true",
      seo: {
        _type: "seoBlock",
        metaTitle: data.seoTitle || data.title,
        metaDescription: data.seoDescription || data.excerpt,
      },
      body: blocks,
    },
  });
}

// ── report (and, with --write, commit) ──────────────────────────────────
const ids = built.map((b) => b.doc._id);
const existing = await client.fetch(
  `*[_type=="insightPost" && _id in $ids]{_id, title, "slug": slug.current, publishDate, readMinutes, hiddenFromIndex, "blocks": count(body)}`,
  { ids }
);
const existingById = new Map(existing.map((e) => [e._id, e]));

// Everything currently in Sanity that we are NOT touching — printed so it's
// visible that live posts are being preserved, not replaced.
const untouched = await client.fetch(
  `*[_type=="insightPost" && !(_id in $ids)]{_id, "slug": slug.current} | order(_id asc)`,
  { ids }
);

// Drafts are invisible to the published/CDN view but very much real content,
// and this dataset has orphan drafts under an older `insightPost.<slug>` id
// convention plus drafts from earlier v2 import attempts. Surface them BEFORE
// writing: a draft sharing a slug with an incoming post is a duplicate that a
// human has to reconcile, and a draft sitting at one of our target ids must
// never be clobbered.
const draftDocs = await client.fetch(
  `*[_type=="insightPost" && _id in path("drafts.**")]{_id, "slug": slug.current} | order(_id asc)`
);
const draftIds = new Set(draftDocs.map((d) => d._id));
const incomingSlugs = new Set(built.map((b) => b.doc.slug.current));
const draftSlugClashes = draftDocs.filter((d) => incomingSlugs.has(d.slug));
const draftIdClashes = built
  .filter((b) => !b.meta.existing && draftIds.has(`drafts.${b.doc._id}`))
  .map((b) => `drafts.${b.doc._id}`);

console.log(`\n${WRITE ? "WRITE MODE" : "DRY RUN (no changes written)"} — ${built.length} posts\n`);
for (const b of built) {
  const before = existingById.get(b.doc._id);
  const tag = before ? "UPDATE" : "CREATE";
  console.log(`${tag}  ${b.doc._id}  (${b.doc.slug.current})`);
  console.log(`        title       ${before ? `${JSON.stringify(before.title)} →` : ""} ${JSON.stringify(b.doc.title)}`);
  if (before && before.publishDate !== b.doc.publishDate) {
    console.log(`        publishDate ${before.publishDate} → ${b.doc.publishDate}`);
  }
  if (before && before.readMinutes !== b.doc.readMinutes) {
    console.log(`        readMinutes ${before.readMinutes} → ${b.doc.readMinutes}`);
  }
  console.log(`        body        ${before ? `${before.blocks} → ` : ""}${b.doc.body.length} blocks (${b.listCounts} list items)`);
  console.log(`        category    cat-${b.doc.category._ref.replace(/^cat-/, "")}   hiddenFromIndex=${b.doc.hiddenFromIndex}`);
}

console.log(`\nCategories to refresh (color + sortOrder): ${CATEGORIES.map((c) => c.slug).join(", ")}`);
console.log(`\nPRESERVED — ${untouched.length} existing docs not touched by this import:`);
for (const u of untouched) console.log(`        ${u._id}  (${u.slug})`);

if (draftIdClashes.length) {
  console.log(`\n!! DRAFT AT A TARGET ID — will NOT be deleted, reconcile by hand:`);
  for (const id of draftIdClashes) console.log(`        ${id}`);
}
if (draftSlugClashes.length) {
  console.log(`\n!! DRAFTS SHARING A SLUG with an incoming post (duplicates a human must reconcile in Studio;`);
  console.log(`   harmless to the built site, which only reads published docs):`);
  for (const d of draftSlugClashes) console.log(`        ${d._id}  (${d.slug})`);
}

if (!WRITE) {
  // Persist the built docs so the dry run is inspectable.
  const outDir = join(ROOT, ".sanity-backups");
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, "insights-v2-dryrun.json");
  writeFileSync(out, JSON.stringify(built.map((b) => b.doc), null, 2));
  console.log(`\nDry run — nothing written to Sanity. Built docs saved to:\n  ${out}\nRe-run with --write to commit.`);
  process.exit(process.exitCode ?? 0);
}

// Back up every document we're about to overwrite, before overwriting it.
const backupDir = join(ROOT, ".sanity-backups");
mkdirSync(backupDir, { recursive: true });
// Back up EVERY insightPost — published and draft — not just the ids we're
// writing. A targeted backup missed a pre-existing draft the first time this
// ran, so the safety net now covers the whole type; it's a few hundred KB.
const fullBefore = await client.fetch(`*[_type=="insightPost"]`);
writeFileSync(
  join(backupDir, "insightPosts.before-v2-import.json"),
  JSON.stringify(fullBefore, null, 2)
);
console.log(
  `\nBacked up ALL ${fullBefore.length} insightPost docs (published + draft) to .sanity-backups/insightPosts.before-v2-import.json`
);

let ok = 0;
for (const c of CATEGORIES) {
  try {
    await client
      .patch(`cat-${c.slug}`)
      .set({ title: c.title, color: c.color, sortOrder: c.sortOrder })
      .commit();
    console.log(`  ✓ category cat-${c.slug}`);
    ok++;
  } catch (err) {
    console.error(`  ✗ category cat-${c.slug}: ${err?.message ?? err}`);
    process.exitCode = 1;
  }
}
for (const b of built) {
  try {
    const tx = client.transaction().createOrReplace(b.doc);
    // Only clear the draft when we're UPDATING a doc that already had a
    // published version — there, `drafts.<id>` is genuinely a stale draft of
    // the thing we just replaced, and leaving it would mask the import in
    // Studio.
    //
    // For a NEW id we must NOT delete `drafts.<id>`: a draft at that id is
    // independent, unpublished work by someone else, and deleting it destroys
    // content this script has no business touching. (Learned the hard way —
    // an earlier version deleted drafts.post-real-ai-problem, a prior import
    // attempt's draft; recovered from Sanity's history API and saved to
    // .sanity-backups/RECOVERED-drafts.post-real-ai-problem.json.)
    if (b.meta.existing) {
      tx.delete(`drafts.${b.doc._id}`);
    } else if (draftIds.has(`drafts.${b.doc._id}`)) {
      console.warn(
        `  ! ${b.doc._id}: a draft already exists at drafts.${b.doc._id} — LEFT IN PLACE. Reconcile it by hand in Studio.`
      );
    }
    await tx.commit();
    console.log(`  ✓ ${b.doc._id}`);
    ok++;
  } catch (err) {
    console.error(`  ✗ ${b.doc._id}: ${err?.message ?? err}`);
    process.exitCode = 1;
  }
}
console.log(`\nDone. ${ok} writes succeeded.`);
