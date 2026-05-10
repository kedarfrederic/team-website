#!/usr/bin/env node
/**
 * Import the legacy insight article bodies (HTML in /insights/*.html) into
 * Sanity as Portable Text on the existing insightPost documents.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<editor-token> node scripts/import-insight-bodies.mjs            # dry-run
 *   SANITY_WRITE_TOKEN=<editor-token> node scripts/import-insight-bodies.mjs --write    # patch Sanity
 *
 * What it does for each of the 7 articles:
 *   1. Reads /insights/<slug>.html
 *   2. Extracts the <article class="post-body">…</article> content via jsdom
 *   3. Converts the HTML to Portable Text blocks using @sanity/block-tools
 *   4. Patches the matching insightPost (mapped by slug → _id) with the new body
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { htmlToBlocks } from "@sanity/block-tools";
import { Schema } from "@sanity/schema";
import { createClient } from "@sanity/client";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "..");

// slug → existing Sanity insightPost _id (set in scripts/seed-sanity.ts).
// If we ever rename slugs we'd update this map; for now they're stable.
const POSTS = [
  { slug: "release-day-checklist",         id: "post-checklist" },
  { slug: "dsp-pitch-timeline-guide",      id: "post-dsp" },
  { slug: "ai-music-industry-nuanced",     id: "post-ai" },
  { slug: "introducing-teammate",          id: "post-teammate" },
  { slug: "stop-treating-release-as-project", id: "post-stop" },
  { slug: "independent-label-playbook-2026",  id: "post-indie-2026" },
  { slug: "playlist-pitching-2026",        id: "post-playlist" },
];

// Minimal Sanity schema definition for the block-tools converter — we only
// need the `body` field's allowed types so it can serialise into Portable
// Text blocks. Headings, links, lists, code, and images are all supported.
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
                { title: "H4", value: "h4" },
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
                  { title: "Code", value: "code" },
                ],
                annotations: [
                  {
                    name: "link",
                    type: "object",
                    fields: [{ name: "href", type: "string" }],
                  },
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

const TOKEN = process.env.SANITY_WRITE_TOKEN;
const WRITE = process.argv.includes("--write");

if (WRITE && !TOKEN) {
  console.error("error: SANITY_WRITE_TOKEN env var is required when running with --write.");
  process.exit(1);
}

// Same project/dataset the seed script uses.
const client = createClient({
  projectId: "g1olb5am",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false,
});

let totalBlocks = 0;

for (const p of POSTS) {
  const file = resolve(ROOT, "insights", p.slug + ".html");
  if (!existsSync(file)) {
    console.log(`SKIP   ${p.slug.padEnd(40)}  (no source HTML)`);
    continue;
  }
  const raw = readFileSync(file, "utf8");

  // Parse the page, grab the post-body article. JSDOM gives us a real DOM
  // for block-tools to walk.
  const dom = new JSDOM(raw);
  const article = dom.window.document.querySelector("article.post-body");
  if (!article) {
    console.log(`MISS   ${p.slug.padEnd(40)}  (no <article class="post-body">)`);
    continue;
  }
  // Strip the in-page CTA card — that lives on the live site's CtaBlock,
  // not in the article body.
  article.querySelectorAll(".post-cta, .post-cta__card").forEach((el) => el.remove());
  const html = article.innerHTML;

  // Convert HTML → Portable Text blocks. Pass our own DOM parser so jsdom
  // is used instead of the browser DOM (which doesn't exist in node).
  const blocks = htmlToBlocks(html, blockContentType, {
    parseHtml: (h) => new JSDOM(h).window.document,
  });

  totalBlocks += blocks.length;
  console.log(`${WRITE ? "WRITE " : "dry   "} ${p.slug.padEnd(40)}  ${blocks.length} blocks`);

  if (WRITE) {
    await client
      .patch(p.id)
      .set({ body: blocks })
      .commit({ autoGenerateArrayKeys: true });
  }
}

console.log("─".repeat(60));
console.log(`  ${POSTS.length} posts · ${totalBlocks} total blocks`);
if (!WRITE) console.log("\n  re-run with --write to actually patch Sanity.");
