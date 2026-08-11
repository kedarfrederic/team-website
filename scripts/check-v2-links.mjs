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
const COMPONENTS = join(ROOT, "public/components");

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

/* ── the same check over the SHIPPED SCRIPTS ──
   This existed only for the body HTML, and that gap shipped 29 broken images:
   v2-connections.js builds its tile logos at runtime as
   `src="assets/logos/${…}.svg"`, which resolves against the ROUTE (/connections)
   and 404s. The bodies were clean, so the check passed and reported success
   while a page was visibly broken. A guard that only looks where the bug isn't
   is worse than no guard, because it certifies.

   Only flags string literals that look like an asset path, so template
   expressions inside the path (`${slug}.svg`) are still caught by the
   leading-`assets/` test without needing to resolve the interpolation. */
const scripts = readdirSync(COMPONENTS).filter((f) => /^(v2-|homepage-v2).*\.js$/.test(f));
for (const file of scripts) {
  const js = readFileSync(join(COMPONENTS, file), "utf8");
  for (const m of js.matchAll(/["'`](assets\/[^"'`]+)["'`]/g)) {
    problems++;
    console.error(
      `  ✗ ${file}: RELATIVE asset path in JS ${JSON.stringify(m[1])} —` +
        " resolves against the route and 404s; prefix with /v2/",
    );
  }
  // Root-relative literals with no interpolation must also exist on disk.
  for (const m of js.matchAll(/["'`](\/v2\/assets\/[^"'`${]+\.[a-z0-9]{2,5})["'`]/gi)) {
    if (!existsSync(join(PUBLIC, m[1]))) {
      problems++;
      console.error(`  ✗ ${file}: MISSING asset ${JSON.stringify(m[1])} — no file at public${m[1]}`);
    }
  }
}

console.log(
  problems === 0
    ? `✓ v2 link check passed (${bodies.length} bodies, ${scripts.length} scripts, ${routes.size} known routes)`
    : `\n${problems} problem(s) found across ${bodies.length} v2 bodies and ${scripts.length} scripts.`
);
process.exit(problems === 0 ? 0 : 1);
