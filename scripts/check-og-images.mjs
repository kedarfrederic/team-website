#!/usr/bin/env node
/**
 * Every page's social preview image must actually exist.
 *
 * `og:image` fails in the one place nobody looks: the page renders perfectly,
 * `astro build` is silent, and the only symptom is a blank card in Slack,
 * iMessage, LinkedIn or X — seen by the people you most wanted to impress, and
 * never by you.
 *
 * That is exactly what shipped. BaseLayout's site-wide fallback was
 * `https://teamrollouts.com/og-image.png`, a file that has never existed in
 * `public/` in this repo's history. Only `index.astro` passed its own
 * `ogImageUrl`, so the homepage was fine and **20 of 22 live pages** — pricing,
 * enterprise, for-artists, teammate, security, every legal page — advertised a
 * 404 as their preview image. Meanwhile `public/v2/assets/og.png` sat there,
 * 1200x630, correct, and referenced by nothing.
 *
 * This runs over the BUILT output, so it does not care how the URL was set —
 * Sanity image, page prop, or the default. If a crawler would fetch it, this
 * checks it.
 *
 * Usage:  node scripts/check-og-images.mjs        (after `astro build`)
 * Exits non-zero if any page points at an image that is not there.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE_ORIGINS = ["https://teamrollouts.com", "https://www.teamrollouts.com"];

/** Sanity's CDN serves images we do not build; only our own origin is ours to verify. */
const EXTERNAL_OK = [/^https:\/\/cdn\.sanity\.io\//];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error("[og] no dist/ — run `pnpm build` first. Refusing to pass without looking.");
  process.exit(2);
}

const pages = walk(DIST).filter((f) => f.endsWith(".html"));
if (pages.length === 0) {
  console.error("[og] dist/ contains no HTML. Refusing to pass without looking.");
  process.exit(2);
}

const META = /<meta[^>]+(?:property|name)=["'](og:image|twitter:image)["'][^>]*content=["']([^"']+)["']/gi;
const broken = [];
const checked = new Set();
let declarations = 0;

for (const page of pages) {
  const route = "/" + relative(DIST, page).replace(/index\.html$/, "").replace(/\.html$/, "");
  const html = readFileSync(page, "utf8");
  for (const m of html.matchAll(META)) {
    const [, prop, url] = m;
    declarations++;
    if (EXTERNAL_OK.some((re) => re.test(url))) continue;

    const origin = SITE_ORIGINS.find((o) => url.startsWith(o));
    if (!origin && /^https?:\/\//i.test(url)) {
      broken.push({ route, prop, url, why: "points off-site" });
      continue;
    }
    const path = origin ? url.slice(origin.length) : url;
    const onDisk = join(DIST, decodeURIComponent(path.split("?")[0]));
    checked.add(path);
    if (!existsSync(onDisk) || !statSync(onDisk).isFile()) {
      broken.push({ route, prop, url, why: "no such file in dist/" });
    }
  }
}

console.log(`[og] ${pages.length} pages, ${declarations} image declarations, ${checked.size} distinct images`);

// Reported, not failed: the standalone demo/tour HTML files under dashboard-tour/,
// team-brain/ and signature/ are not marketing routes and owe nobody a preview card.
const silent = pages.filter((p) => !/(?:property|name)=["']og:image["']/i.test(readFileSync(p, "utf8")));
if (silent.length) {
  console.log(`[og] note: ${silent.length} page(s) declare no og:image (standalone pages, not gated):`);
  for (const p of silent) console.log(`    ${"/" + relative(DIST, p)}`);
}

if (broken.length) {
  console.error(`\n[og] FAIL — ${broken.length} declaration(s) point at an image that is not there.`);
  console.error(`A blank preview card is invisible to everyone who works here and visible to everyone else.\n`);
  for (const b of broken) console.error(`    ${b.route}  ${b.prop} → ${b.url}  (${b.why})`);
}

/**
 * The SSR gap. This site runs on the Cloudflare adapter, so `dist/` contains only
 * the prerendered pages — /pricing, /enterprise, /for-artists and the rest are
 * rendered per request and are invisible to the walk above. What every one of them
 * renders is BaseLayout's site-wide default, so check that constant directly.
 * This is the check that would have caught the original bug on 20 live pages.
 */
const LAYOUT = join(ROOT, "src/layouts/BaseLayout.astro");
const layout = readFileSync(LAYOUT, "utf8");
const fallback = layout.match(/:\s*(?:new URL\()?["'`]([^"'`]+\.(?:png|jpe?g|webp|gif))["'`]/i);
if (!fallback) {
  console.error("\n[og] FAIL — could not find the site-wide og:image default in src/layouts/BaseLayout.astro.");
  console.error("Refusing to pass a check that cannot see the thing it exists to check.");
  process.exit(2);
}
const fallbackPath = fallback[1].replace(/^https?:\/\/(?:www\.)?teamrollouts\.com/, "");
const fallbackFile = join(ROOT, "public", decodeURIComponent(fallbackPath));
if (!existsSync(fallbackFile)) {
  broken.push({
    route: "(every server-rendered page)",
    prop: "og:image default",
    url: fallback[1],
    why: `no such file at public${fallbackPath}`,
  });
  console.error(`\n[og] FAIL — the site-wide default points at a file that does not exist.`);
  console.error(`Every server-rendered page inherits it: ${fallback[1]}`);
} else {
  console.log(`[og] site-wide default resolves: ${fallbackPath}`);
}

if (broken.length) process.exit(1);
console.log("[og] OK — every social preview image resolves");
