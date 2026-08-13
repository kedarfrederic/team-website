/**
 * Two guards over the locale system, in one command. Both cover failures that
 * are completely silent — no build error, no broken page, nothing to notice.
 *
 * PART 1 — path logic. localeFromPath / stripLocale / localizePath decide what
 * every Korean URL resolves to. The dangerous bug here is not a crash, it is a
 * prefix match that is too eager: a naive `startsWith("/ko")` also swallows
 * `/korean-market` and `/kombucha`, silently routing real English pages into a
 * locale that does not own them. Expectations are hand-written rather than
 * derived from the implementation, so this cannot pass merely by agreeing with
 * the code it is checking.
 *
 * PART 2 — the TRANSLATED_PATHS registry against the filesystem. That registry
 * drives hreflang, and Google discards an ENTIRE annotation cluster when one
 * alternate 404s. So a single stale entry doesn't weaken the signal for one
 * page — it removes the signal for every language version of it.
 *
 * Checks both directions, because both are silent:
 *   registered but no file  → FAIL. hreflang points at a 404.
 *   file but not registered → WARN. The translation exists and is reachable,
 *                             but no hreflang links it to the English version,
 *                             so search engines treat them as unrelated pages.
 *
 * Prints what it matched, not just a verdict — a check whose output is only
 * "ok" teaches you nothing about whether it was looking in the right place.
 *
 * Run: pnpm check:i18n
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  DEFAULT_LOCALE,
  LOCALES,
  TRANSLATED_PATHS,
  alternateLinks,
  hasTranslation,
  localeFromPath,
  localizePath,
  normalizePath,
  stripLocale,
  suggestLocale,
  type Locale,
} from "../src/lib/i18n";

// ── Part 1: path logic ──────────────────────────────────────────────────────

let assertionFailures = 0;
let assertionPasses = 0;

function eq(label: string, got: unknown, want: unknown) {
  if (JSON.stringify(got) === JSON.stringify(want)) {
    assertionPasses++;
    return;
  }
  assertionFailures++;
  console.error(
    `  FAIL ${label}\n         got  ${JSON.stringify(got)}\n         want ${JSON.stringify(want)}`,
  );
}

// A path that merely BEGINS with the locale's letters is not that locale.
eq('localeFromPath("/ko")', localeFromPath("/ko"), "ko");
eq('localeFromPath("/ko/")', localeFromPath("/ko/"), "ko");
eq('localeFromPath("/ko/pricing")', localeFromPath("/ko/pricing"), "ko");
eq('localeFromPath("/KO/pricing")', localeFromPath("/KO/pricing"), "ko");
eq('localeFromPath("/korean-market")', localeFromPath("/korean-market"), "en");
eq('localeFromPath("/kombucha")', localeFromPath("/kombucha"), "en");
eq('localeFromPath("/insights/ko")', localeFromPath("/insights/ko"), "en");
eq('localeFromPath("/")', localeFromPath("/"), "en");

eq('stripLocale("/ko/pricing")', stripLocale("/ko/pricing"), "/pricing");
eq('stripLocale("/ko")', stripLocale("/ko"), "/");
eq('stripLocale("/ko/")', stripLocale("/ko/"), "/");
eq('stripLocale("/pricing/")', stripLocale("/pricing/"), "/pricing");
eq('stripLocale("/korean-market")', stripLocale("/korean-market"), "/korean-market");
eq('stripLocale("/ko/a/b")', stripLocale("/ko/a/b"), "/a/b");

// Idempotent: re-projecting an already-localised path must not stack prefixes.
eq('localizePath("/pricing","ko")', localizePath("/pricing", "ko"), "/ko/pricing");
eq('localizePath("/","ko")', localizePath("/", "ko"), "/ko/");
eq('localizePath("/ko/pricing","ko")', localizePath("/ko/pricing", "ko"), "/ko/pricing");
eq('localizePath("/ko/pricing","en")', localizePath("/ko/pricing", "en"), "/pricing");

eq('normalizePath("pricing")', normalizePath("pricing"), "/pricing");
eq('normalizePath("/a///")', normalizePath("/a///"), "/a");
eq('normalizePath("/")', normalizePath("/"), "/");

// The offer must never point somewhere that does not exist, and an explicit
// choice must end the conversation in either direction.
eq("suggestLocale US", suggestLocale({ country: "US", pathname: "/" }), null);
eq("suggestLocale no country", suggestLocale({ country: null, pathname: "/" }), null);
eq(
  "suggestLocale honours preference",
  suggestLocale({ country: "KR", pathname: "/", storedPreference: "en" }),
  null,
);
eq(
  "suggestLocale ignores garbage preference",
  suggestLocale({ country: "KR", pathname: "/", storedPreference: "zz" }),
  TRANSLATED_PATHS.has("/") ? "ko" : null,
);
eq("hasTranslation(default) always true", hasTranslation("/anything", DEFAULT_LOCALE), true);

// An untranslated path must produce NO hreflang, not a lone self-reference.
eq(
  "alternateLinks on an untranslated path",
  alternateLinks("/definitely-not-translated", "https://teamrollouts.com"),
  [],
);

if (assertionFailures > 0) {
  console.error(`\nFAILED — ${assertionFailures} path-logic assertion(s) failed.`);
  process.exit(1);
}
console.log(`Path logic: ${assertionPasses} assertions passed.\n`);

// ── Part 2: registry vs filesystem ──────────────────────────────────────────

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagesDir = path.join(projectRoot, "src", "pages");

const PAGE_EXTENSIONS = [".astro", ".md", ".mdx", ".html"];

/** Every on-disk file Astro would serve at this route, if any. */
function pageFilesFor(routePath: string): string[] {
  const trimmed = routePath.replace(/^\/+|\/+$/g, "");
  const candidates: string[] = [];

  for (const ext of PAGE_EXTENSIONS) {
    candidates.push(
      trimmed === ""
        ? path.join(pagesDir, `index${ext}`)
        : path.join(pagesDir, `${trimmed}${ext}`),
    );
    candidates.push(
      trimmed === ""
        ? path.join(pagesDir, `index${ext}`)
        : path.join(pagesDir, trimmed, `index${ext}`),
    );
  }

  return [...new Set(candidates)].filter((file) => fs.existsSync(file));
}

const rel = (file: string) => path.relative(projectRoot, file);

const failures: string[] = [];
const warnings: string[] = [];
const matched: string[] = [];

const registered = [...TRANSLATED_PATHS].sort();

console.log(`Checking ${registered.length} registered translated path(s) across ${LOCALES.length} locale(s).\n`);

for (const basePath of registered) {
  for (const locale of LOCALES) {
    const routePath = localizePath(basePath, locale);
    const files = pageFilesFor(routePath);

    if (files.length === 0) {
      failures.push(
        `  ${routePath}  — registered in TRANSLATED_PATHS ("${basePath}"), but no page file exists.\n` +
          `      hreflang would advertise this URL and it would 404.\n` +
          `      Expected one of: src/pages${routePath === "/" ? "/index.astro" : `${routePath.replace(/\/$/, "")}.astro`} (or /index.astro under it)`,
      );
      continue;
    }

    if (files.length > 1) {
      warnings.push(
        `  ${routePath}  — ${files.length} files resolve to this route: ${files.map(rel).join(", ")}`,
      );
    }

    matched.push(`  ${routePath.padEnd(28)} → ${rel(files[0])}`);
  }
}

/**
 * Reverse sweep: a translated page on disk that nobody registered. Only the
 * non-default locales are walked — an English page without a translation is the
 * normal case, not a finding.
 */
for (const locale of LOCALES) {
  if (locale === DEFAULT_LOCALE) continue;
  const localeDir = path.join(pagesDir, locale);
  if (!fs.existsSync(localeDir)) continue;

  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return PAGE_EXTENSIONS.includes(path.extname(entry.name)) ? [full] : [];
    });

  for (const file of walk(localeDir)) {
    const routePath =
      "/" +
      path
        .relative(pagesDir, file)
        .replace(new RegExp(`(${PAGE_EXTENSIONS.map((e) => `\\${e}`).join("|")})$`), "")
        .replace(/\/index$/, "")
        .replace(/^index$/, "");

    const basePath = routePath.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

    if (!TRANSLATED_PATHS.has(basePath)) {
      warnings.push(
        `  ${rel(file)}  — page exists at "${routePath}" but "${basePath}" is not in TRANSLATED_PATHS.\n` +
          `      It is reachable, but no hreflang links it to the ${DEFAULT_LOCALE} version, so search engines\n` +
          `      will treat them as unrelated pages rather than translations.`,
      );
    }
  }
}

if (matched.length > 0) {
  console.log("Resolved:");
  console.log(matched.join("\n"));
  console.log("");
}

if (warnings.length > 0) {
  console.log(`Warnings (${warnings.length}):`);
  console.log(warnings.join("\n"));
  console.log("");
}

if (failures.length > 0) {
  console.error(`FAILED — ${failures.length} registered path(s) have no page file:\n`);
  console.error(failures.join("\n\n"));
  console.error("\nFix: create the page, or remove the entry from TRANSLATED_PATHS in src/lib/i18n.ts.");
  process.exit(1);
}

console.log(
  registered.length === 0
    ? "PASSED — TRANSLATED_PATHS is empty, so no hreflang is emitted anywhere. Correct while no translations exist."
    : `PASSED — all ${matched.length} locale route(s) resolve to a page file.`,
);
