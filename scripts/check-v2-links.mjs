#!/usr/bin/env node
/**
 * Dead-link + missing-asset check for the ported v2 pages.
 *
 * The v2 pages are injection ports: their markup is authored in
 * src/lib/v2-*-body.html and served from a route, NOT from the source repo's
 * flat directory. Two whole classes of breakage follow from that, and both
 * already shipped to production once:
 *
 *   1. Relative paths. `src="assets/logo/x.png"` resolved fine in the source
 *      repo and 404s here. Same for `href="pricing"`.
 *   2. Links to pages that don't exist yet. The design references Rollouts /
 *      TeamMate / Assets / Connections / Tours; those routes aren't built, so
 *      any link to them is a live 404.
 *
 * Neither is caught by `astro build` or tsc — the markup is an opaque string.
 *
 * Usage:  node scripts/check-v2-links.mjs
 * Exits non-zero if anything is wrong, so it can gate a push.
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LIB = join(ROOT, "src/lib");
const PAGES = join(ROOT, "src/pages");
const PUBLIC = join(ROOT, "public");

// Routes that exist as Astro pages, plus known dynamic ones.
const routes = new Set(
  readdirSync(PAGES)
    .filter((f) => f.endsWith(".astro"))
    .map((f) => "/" + f.replace(/\.astro$/, "").replace(/^index$/, ""))
);
routes.add("/");
routes.add("/insights"); // index
const DYNAMIC = [/^\/insights\/[a-z0-9-]+$/];

const bodies = readdirSync(LIB).filter((f) => /^v2-.*-body\.html$|^homepage-v2-body\.html$/.test(f));
let problems = 0;

for (const file of bodies) {
  const html = readFileSync(join(LIB, file), "utf8");
  const report = (kind, value, hint) => {
    problems++;
    console.error(`  ✗ ${file}: ${kind} ${JSON.stringify(value)}${hint ? ` — ${hint}` : ""}`);
  };

  // ── assets: every src/href pointing at a local file must exist
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const raw = m[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(raw)) continue;

    if (!raw.startsWith("/")) {
      report("RELATIVE path (won't resolve from a route)", raw, "make it root-relative");
      continue;
    }
    // Looks like a file (has an extension) → must exist under public/
    if (/\.[a-z0-9]{2,5}(\?|$)/i.test(raw)) {
      const p = join(PUBLIC, raw.split("?")[0]);
      if (!existsSync(p)) report("MISSING asset", raw, `no file at public${raw}`);
      continue;
    }
    // Otherwise it's an internal route
    const path = raw.split("#")[0].replace(/\/$/, "") || "/";
    if (routes.has(path) || DYNAMIC.some((re) => re.test(path))) continue;
    report("DEAD internal link", raw, "no such route — build the page or retarget the link");
  }
}

console.log(
  problems === 0
    ? `✓ v2 link check passed (${bodies.length} bodies, ${routes.size} known routes)`
    : `\n${problems} problem(s) found across ${bodies.length} v2 bodies.`
);
process.exit(problems === 0 ? 0 : 1);
