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
import { localizeHrefs } from "../src/lib/koLocalize";

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
// The locale root must match normalizePath's output, or the homepage's
// canonical and its own hreflang self-reference disagree. See i18n.ts.
eq('localizePath("/","ko")', localizePath("/", "ko"), "/ko");
eq("locale root matches normalizePath", localizePath("/", "ko"), normalizePath(localizePath("/", "ko")));
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

/**
 * normalizePath must stay LINEAR.
 *
 * It previously stripped trailing slashes with `replace(/\/+$/, "")`, which has
 * no start anchor and so backtracks quadratically over a run of slashes: 16k
 * slashes took ~115ms. Middleware calls this on every request before route
 * matching, and BaseLayout several more times, so one 16KB URL — well within
 * what Cloudflare accepts — could burn most a second of Worker CPU from a
 * single anonymous GET.
 *
 * This asserts the shape of the cost, not a wall-clock number: 16x the input
 * must not cost anywhere near 16x-squared the time. A regex reintroduced here
 * fails this rather than being discovered as a Worker CPU-limit incident.
 */
{
  const measure = (n: number) => {
    const input = "/".repeat(n) + "a";
    const start = process.hrtime.bigint();
    for (let i = 0; i < 20; i++) normalizePath(input);
    return Number(process.hrtime.bigint() - start) / 1e6;
  };
  measure(1000); // warm up, so JIT compilation isn't counted as growth

  const small = Math.max(measure(1000), 0.001);
  const large = measure(16000);
  const growth = large / small;

  // Linear would be ~16x. Quadratic is ~256x. 40x is comfortably clear of
  // measurement noise on a loaded machine while still catching the real thing.
  if (growth > 40) {
    assertionFailures++;
    console.error(
      `  FAIL normalizePath is super-linear — 16x input cost ${growth.toFixed(0)}x time ` +
        `(${small.toFixed(2)}ms → ${large.toFixed(2)}ms).\n` +
        `         A backtracking regex was almost certainly reintroduced. See src/lib/i18n.ts.`,
    );
  } else {
    assertionPasses++;
  }
}

/**
 * PART 1b — the i18n components' <style> blocks must have balanced braces.
 *
 * An unterminated CSS rule does not fail a build, does not warn, and does not
 * throw in the browser. It silently swallows every rule after it as part of the
 * malformed declaration. That is exactly what happened here: removing an
 * animation took a rule's closing brace with it, which killed the rule that
 * stops the locale bar covering the site nav — `astro build` stayed green
 * throughout and the page looked fine until it was hit-tested.
 *
 * Comments are stripped before counting, because these files deliberately carry
 * long explanatory comments (which may contain braces) inside the style block.
 */
const componentDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "components");
for (const file of ["LocaleSuggestionBanner.astro", "KoreanTypography.astro"]) {
  const full = path.join(componentDir, file);
  if (!fs.existsSync(full)) continue;
  const src = fs.readFileSync(full, "utf8");
  const styleMatch = src.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  if (!styleMatch) continue;
  const raw = styleMatch[1];

  /* Comment delimiters FIRST. A brace count alone misses the failure that
     actually shipped twice: an early `*​/` closes the comment, the prose after
     it becomes CSS garbage, and the parser swallows the NEXT rule during error
     recovery. Braces stay balanced throughout, so the brace check passes while
     a rule silently does nothing. */
  const opens = (raw.match(/\/\*/g) ?? []).length;
  const closes = (raw.match(/\*\//g) ?? []).length;
  if (opens !== closes) {
    assertionFailures++;
    console.error(
      `  FAIL ${file} — unbalanced CSS comments in <style>: ${opens} '/*' vs ${closes} '*/'.\n` +
        `         Prose left outside a comment is parsed as CSS and eats the rule after it.`,
    );
  } else {
    assertionPasses++;
  }

  const withoutComments = raw.replace(/\/\*[\s\S]*?\*\//g, "");

  /* Anything left that is not a rule, an at-rule or whitespace is stray prose —
     the residue of a mis-closed comment even when the delimiters happen to
     balance. */
  let flattened = withoutComments;
  // Collapse innermost blocks repeatedly so nested at-rules (@media { .x{} })
  // reduce cleanly — a single pass leaves the wrapper's closing brace behind
  // and reports valid CSS as stray text.
  for (let i = 0; i < 20; i++) {
    const next = flattened.replace(/[^{}]*\{[^{}]*\}/g, "");
    if (next === flattened) break;
    flattened = next;
  }
  const residue = flattened.trim();
  if (residue.length > 0) {
    assertionFailures++;
    console.error(
      `  FAIL ${file} — text outside any CSS rule in <style>: ${JSON.stringify(residue.slice(0, 70))}\n` +
        `         Almost always a comment closed early; the parser discards the following rule.`,
    );
  } else {
    assertionPasses++;
  }

  const open = (withoutComments.match(/\{/g) ?? []).length;
  const close = (withoutComments.match(/\}/g) ?? []).length;
  if (open !== close) {
    assertionFailures++;
    console.error(
      `  FAIL ${file} — unbalanced CSS braces in <style>: ${open} '{' vs ${close} '}'.\n` +
        `         An unterminated rule silently swallows every rule after it, and the build stays green.`,
    );
  } else {
    assertionPasses++;
  }
}

// ── Part 3: the homepage translation map, against the page it translates ────

/**
 * Two files told maintainers this check covered them, and it did not — a
 * comment asserting a guard that does not exist is worse than no comment,
 * because it stops the next person looking. So the guard now exists.
 *
 * ORPHAN KEYS. A map key that matches no text node is inert: the translation
 * was written, is carried forever, and renders nothing. Usually it means the
 * body copy changed underneath it, which also means that sentence is now
 * silently English on the Korean page.
 *
 * UNSUBSTITUTED TOKENS. Any {{V2_*}} left in the body after the page's token
 * map is applied renders as literal braces to the reader.
 *
 * LEAKED HREFS. A link to a path that HAS a Korean version but is still
 * pointing at the English one — the defect that shipped Korean CTAs into the
 * English pricing page.
 */
{
  // Derived from componentDir (declared above) rather than projectRoot, which
  // is initialised further down in Part 2 — referencing it here is a TDZ error.
  const root = path.resolve(componentDir, "..", "..");
  const bodyPath = path.join(root, "src", "lib", "homepage-v2-body.html");
  const mapPath = path.join(root, "src", "lib", "koHomepageCopy.ts");
  const pagePath = path.join(root, "src", "pages", "ko", "index.astro");

  if (fs.existsSync(bodyPath) && fs.existsSync(mapPath) && fs.existsSync(pagePath)) {
    const body = fs.readFileSync(bodyPath, "utf8");
    const mapSrc = fs.readFileSync(mapPath, "utf8");
    const pageSrc = fs.readFileSync(pagePath, "utf8");

    const textNodes = new Set(
      [...body.matchAll(/>([^<>]+)</g)].map((m) => m[1].trim()).filter(Boolean),
    );

    // Keys from KO_HOMEPAGE_COPY only — stop at the closing brace so the
    // separate attribute map is not counted as text-node keys.
    const copyStart = mapSrc.indexOf("export const KO_HOMEPAGE_COPY");
    const copyEnd = mapSrc.indexOf("\n};", copyStart);
    const copyBlock = mapSrc.slice(copyStart, copyEnd);
    // Unescape via JSON so \n, \u2019 and \" all resolve to the characters the
    // text node actually contains. A naive replace of \" only would report a
    // multi-line key as an orphan purely because it never unescaped the newline.
    const keys = [...copyBlock.matchAll(/\n  "((?:[^"\\]|\\.)*)":/g)].map((m) => {
      try {
        return JSON.parse(`"${m[1]}"`) as string;
      } catch {
        return m[1];
      }
    });

    const orphans = keys.filter((k) => !textNodes.has(k));
    if (orphans.length > 0) {
      assertionFailures++;
      console.error(
        `  FAIL koHomepageCopy has ${orphans.length} orphan key(s) — translated, carried, and rendering nothing:`,
      );
      orphans.slice(0, 10).forEach((o) => console.error(`         ${JSON.stringify(o.slice(0, 70))}`));
      console.error("         The body copy likely changed; that sentence is now English on /ko/.");
    } else {
      assertionPasses++;
    }

    // Every token in the body must have a value in the Korean page.
    const bodyTokens = new Set([...body.matchAll(/\{\{V2_[A-Z_]*\}\}/g)].map((m) => m[0]));
    const missingTokens = [...bodyTokens].filter((t) => !pageSrc.includes(t));
    if (missingTokens.length > 0) {
      assertionFailures++;
      console.error(
        `  FAIL src/pages/ko/index.astro leaves ${missingTokens.length} token(s) unsubstituted — they render as literal braces:`,
      );
      missingTokens.forEach((t) => console.error(`         ${t}`));
    } else {
      assertionPasses++;
    }

    // Any body href whose path has a Korean version must be rewritten.
    /* Match a CALL, not the identifier. Checking `pageSrc.includes(
       "localizeHrefs")` passed even with the call deleted, because the import
       statement still contained the word — a guard that reported success on
       the exact defect it existed to catch. */
    const callsLocalizeHrefs = /localizeHrefs\s*\(/.test(pageSrc);
    const leaked = callsLocalizeHrefs
      ? []
      : [...TRANSLATED_PATHS].filter((p2) => p2 !== "/" && body.includes(`href="${p2}"`));
    if (leaked.length > 0) {
      assertionFailures++;
      console.error(
        `  FAIL the Korean homepage injects href(s) to ${leaked.join(", ")} without localizeHrefs —\n` +
          `         Korean labels would navigate to the English page.`,
      );
    } else {
      assertionPasses++;
    }
  }
}

// ── Part 3a: localizeHrefs, on the shapes that actually appear in a body ────

/**
 * "/" was skipped here for months on the stated grounds that rewriting it
 * "would also catch every href='/…' prefix". It cannot: the replacement matches
 * the whole attribute including its closing quote. The cost of that unfounded
 * skip was that the Korean 404's back-to-home button sent a lost Korean reader
 * to the English homepage — the one control on the page whose entire job is to
 * recover them.
 *
 * These assert the behaviour rather than the reasoning, so restoring the skip
 * fails here instead of shipping.
 */
{
  const sample = `<a href="/">h</a><a href="/pricing">p</a><a href="/insights">i</a>`;
  eq(
    'localizeHrefs sends "/" to the Korean home, not the English one',
    localizeHrefs(sample, "ko"),
    `<a href="/ko">h</a><a href="/ko/pricing">p</a><a href="/insights">i</a>`,
  );
  eq(
    "localizeHrefs leaves English untouched",
    localizeHrefs(sample, "en"),
    sample,
  );
  // The prefix hazard that justified the skip, asserted as absent.
  eq(
    'rewriting "/" does not touch a longer path that starts with it',
    localizeHrefs(`<a href="/pricing">p</a>`, "ko"),
    `<a href="/ko/pricing">p</a>`,
  );
}

// ── Part 3b: every OTHER Korean copy map, against the pages that consume it ──

/**
 * Part 3 checks the homepage map and nothing else, so fourteen maps — every ICP
 * and product page — shipped with no orphan guard at all. That is exactly the
 * hole the homepage guard was written to close, left open for the pages added
 * after it.
 *
 * The pairing is DERIVED, not listed: each ko page declares its own body via
 * `?raw` and its own maps via import, so a page added tomorrow is covered with
 * no edit here. A hand-maintained table would have been one more thing to
 * forget, which is the failure this whole check exists to catch.
 *
 * A key is judged against every body that consumes it, not just one, because
 * the shared maps (icpCommon, appPreview) are deliberately supersets — "0 wks"
 * belongs on /for-labels and nowhere else. Dead ANYWHERE is the real defect;
 * absent from one consumer is by design.
 *
 * Attribute maps are matched against `="value"` rather than text nodes: their
 * keys are attribute values (data-suffix, aria-label), which by construction
 * never appear between two tags.
 */
{
  const root = path.resolve(componentDir, "..", "..");
  const koPagesDir = path.join(root, "src", "pages", "ko");
  const koLibDir = path.join(root, "src", "lib", "ko");

  if (fs.existsSync(koPagesDir) && fs.existsSync(koLibDir)) {
    // page → the body it injects, and the map files it imports
    const bodiesByMapFile = new Map<string, Set<string>>();

    for (const file of fs.readdirSync(koPagesDir).filter((f) => f.endsWith(".astro"))) {
      const src = fs.readFileSync(path.join(koPagesDir, file), "utf8");

      const bodyMatch = src.match(/import\s+bodyHtml\s+from\s+"([^"]+)\?raw"/);
      if (!bodyMatch) continue;
      const bodyPath = path.resolve(koPagesDir, bodyMatch[1]);
      if (!fs.existsSync(bodyPath)) continue;

      for (const m of src.matchAll(/from\s+"\.\.\/\.\.\/lib\/ko\/([A-Za-z-]+)"/g)) {
        const mapFile = path.join(koLibDir, `${m[1]}.ts`);
        if (!bodiesByMapFile.has(mapFile)) bodiesByMapFile.set(mapFile, new Set());
        bodiesByMapFile.get(mapFile)!.add(bodyPath);
      }
    }

    const textNodesOf = new Map<string, Set<string>>();
    const attrValuesOf = new Map<string, Set<string>>();
    const loadBody = (p2: string) => {
      if (!textNodesOf.has(p2)) {
        const html = fs.readFileSync(p2, "utf8");
        textNodesOf.set(
          p2,
          new Set([...html.matchAll(/>([^<>]+)</g)].map((m) => m[1].trim()).filter(Boolean)),
        );
        attrValuesOf.set(p2, new Set([...html.matchAll(/="([^"]*)"/g)].map((m) => m[1])));
      }
    };

    let filesChecked = 0;
    const dead: string[] = [];

    for (const [mapFile, bodies] of bodiesByMapFile) {
      if (!fs.existsSync(mapFile)) continue;
      const src = fs.readFileSync(mapFile, "utf8");
      bodies.forEach(loadBody);
      filesChecked++;

      /* Split on top-level `const NAME`, so each block's keys are attributed to
         the const that owns them — icpCommon declares a text map AND an
         attribute map, and they are judged against different things. */
      const blocks = [...src.matchAll(/(?:export\s+)?const\s+([A-Z_a-z0-9]+)[^=]*=\s*\{/g)];
      for (let i = 0; i < blocks.length; i++) {
        const name = blocks[i][1];
        const start = blocks[i].index!;
        const end = i + 1 < blocks.length ? blocks[i + 1].index! : src.length;
        const block = src.slice(start, end);

        /* Two-space indent only. Nested maps (KO_CONNECTIONS_JS, KO_APP_PREVIEW)
           key their groups unquoted at this level and their copy deeper, so they
           yield nothing and skip themselves — those are injected into scripts,
           not matched against the body at all. */
        const keys = [...block.matchAll(/\n  "((?:[^"\\]|\\.)*)":/g)].map((m) => {
          try {
            return JSON.parse(`"${m[1]}"`) as string;
          } catch {
            return m[1];
          }
        });
        if (keys.length === 0) continue;

        const isAttrs = name.endsWith("_ATTRS");
        const haystacks = [...bodies].map((b) => (isAttrs ? attrValuesOf : textNodesOf).get(b)!);
        for (const k of keys) {
          if (!haystacks.some((h) => h.has(k))) {
            dead.push(`${path.basename(mapFile)} · ${name} · ${JSON.stringify(k.slice(0, 60))}`);
          }
        }
      }
    }

    if (dead.length > 0) {
      assertionFailures++;
      console.error(
        `  FAIL ${dead.length} Korean copy key(s) match nothing in any page that uses them —\n` +
          `         translated, carried forever, rendering nothing (and that line is English on /ko):`,
      );
      dead.slice(0, 15).forEach((d) => console.error(`         ${d}`));
      if (dead.length > 15) console.error(`         …and ${dead.length - 15} more`);
    } else {
      assertionPasses++;
      console.log(`  ok   ${filesChecked} Korean copy map file(s) — no dead keys`);
    }
  }
}

// ── Part 3c: one English string, two roles, one Korean value ────────────────

/**
 * `Delivered` occurs twice on /for-labels: as the lead of an overnight-log
 * sentence, and as a Distribution status chip. localizeBody keys on exact text,
 * so ONE Korean value has to serve both — and the value written for the
 * sentence ("전달했습니다 —") rendered a past-tense clause with a dangling em
 * dash inside a pill whose neighbours read "정상 진행" and "확정됨".
 *
 * English hides this: "Delivered" is a fine chip AND a fine sentence lead.
 * Korean conjugates, so the two roles pull apart. Nothing in the type system,
 * the build, or the orphan check above can see it — the key matches, both
 * nodes translate, and the page renders.
 *
 * The discriminator is structural, not a word list. A first attempt matched
 * class names against a list of "chip-like" tokens and did not catch the very
 * defect it was written for. What works is asking what ELSE lives in that
 * element: if a sentence-shaped Korean value lands in a parent whose other text
 * nodes are 9 characters long, it is in a label slot, whatever it is called.
 */
{
  const root = path.resolve(componentDir, "..", "..");
  const koPagesDir = path.join(root, "src", "pages", "ko");
  const koLibDir = path.join(root, "src", "lib", "ko");

  const VOID = new Set(["br","img","input","hr","meta","link","source","path","circle","rect","use","area","col","embed","track","wbr"]);
  /** text node → the signatures of every element it appears directly inside. */
  const parentRoles = (html: string): Map<string, Set<string>> => {
    const roles = new Map<string, Set<string>>();
    const stack: string[] = [];
    const token = /<(\/?)([a-zA-Z0-9]+)([^>]*?)(\/?)>|([^<]+)/g;
    for (const m of html.matchAll(token)) {
      if (m[5] !== undefined) {
        const t = m[5].trim();
        if (t && stack.length) {
          const sig = stack[stack.length - 1];
          if (!roles.has(t)) roles.set(t, new Set());
          roles.get(t)!.add(sig);
        }
        continue;
      }
      const tag = m[2].toLowerCase();
      if (m[1]) {
        // Pop to the matching open tag; unbalanced markup must not desync the stack.
        if (stack.some((sg) => sg.split("|")[0] === tag)) {
          while (stack.length) if (stack.pop()!.split("|")[0] === tag) break;
        }
      } else if (!VOID.has(tag) && !m[4]) {
        const cls = /class="([^"]*)"/.exec(m[3]);
        stack.push(`${tag}|${cls ? cls[1] : ""}`);
      }
    }
    return roles;
  };

  const median = (xs: number[]): number => {
    const s2 = [...xs].sort((a, b) => a - b);
    return s2.length % 2 ? s2[(s2.length - 1) / 2] : (s2[s2.length / 2 - 1] + s2[s2.length / 2]) / 2;
  };

  // Korean sentence endings, plus a value left hanging on a connective.
  const SENTENCEY = /(습니다|입니다|다\.|[—·:]\s*$)/;
  const LABEL_SLOT = 15; // chars — a parent whose other text is this short holds labels

  if (fs.existsSync(koPagesDir) && fs.existsSync(koLibDir)) {
    const conflicts: string[] = [];

    for (const file of fs.readdirSync(koPagesDir).filter((f) => f.endsWith(".astro"))) {
      const src = fs.readFileSync(path.join(koPagesDir, file), "utf8");
      const bodyMatch = src.match(/import\s+bodyHtml\s+from\s+"([^"]+)\?raw"/);
      if (!bodyMatch) continue;
      const bodyPath = path.resolve(koPagesDir, bodyMatch[1]);
      if (!fs.existsSync(bodyPath)) continue;

      const copy = new Map<string, string>();
      for (const m of src.matchAll(/from\s+"\.\.\/\.\.\/lib\/ko\/([A-Za-z-]+)"/g)) {
        const mapFile = path.join(koLibDir, `${m[1]}.ts`);
        if (!fs.existsSync(mapFile)) continue;
        const mapSrc = fs.readFileSync(mapFile, "utf8");
        for (const e of mapSrc.matchAll(/\n  "((?:[^"\\]|\\.)*)":\s*\n?\s*"((?:[^"\\]|\\.)*)"/g)) {
          try {
            copy.set(JSON.parse(`"${e[1]}"`) as string, JSON.parse(`"${e[2]}"`) as string);
          } catch { /* not a plain string entry */ }
        }
      }

      const roles = parentRoles(fs.readFileSync(bodyPath, "utf8"));
      const lengthsBySig = new Map<string, number[]>();
      for (const [text, sigs] of roles) {
        for (const sig of sigs) {
          if (!lengthsBySig.has(sig)) lengthsBySig.set(sig, []);
          lengthsBySig.get(sig)!.push(text.length);
        }
      }

      for (const [text, sigs] of roles) {
        if (sigs.size < 2) continue;
        const ko = copy.get(text);
        if (!ko || !SENTENCEY.test(ko)) continue;
        const medians = [...sigs].map((sg) => [sg, median(lengthsBySig.get(sg)!)] as const);
        const tightest = Math.min(...medians.map(([, m2]) => m2));
        if (tightest >= LABEL_SLOT) continue;
        conflicts.push(
          `${file} · ${JSON.stringify(text.slice(0, 45))} → ${JSON.stringify(ko.slice(0, 45))}\n` +
            medians
              .map(([sg, m2]) => `             in <${sg.replace("|", " class=\"")}"> — sibling text median ${m2} chars`)
              .join("\n"),
        );
      }
    }

    if (conflicts.length > 0) {
      assertionFailures++;
      console.error(
        `  FAIL ${conflicts.length} key(s) serve both a sentence and a label slot with one Korean value —\n` +
          `         fine in English, which does not conjugate; a clause in a status pill in Korean:`,
      );
      conflicts.forEach((c) => console.error(`         ${c}`));
    } else {
      assertionPasses++;
    }
  }
}

// ── Part 3d: the chrome table, against the links the chrome actually renders ──

/**
 * V2Nav and V2Footer each carried a one-entry Korean table ("Pricing": "가격")
 * while rendering 57 English strings on every Korean page — the entire
 * mega-menu, both sets of column headings, every audience name. Nothing failed:
 * the rule was correct, the table was simply not filled in, and an unfilled
 * table is indistinguishable from a complete one at build time.
 *
 * So the table is now checked against the components that consume it. A link
 * whose destination HAS a Korean page must have a Korean label, or be listed in
 * CHROME_KEEP_EN as a deliberate decision. Being absent from both is the defect
 * — and it is the only state this can be in that a reader would notice.
 *
 * Links to pages with no Korean version are skipped, not failed: an English
 * label on an English destination is correct, and forcing a translation there
 * would promise Korean and deliver English.
 */
{
  const root = path.resolve(componentDir, "..", "..");
  const chromePath = path.join(root, "src", "lib", "ko", "chrome.ts");
  const navPath = path.join(root, "src", "components", "V2Nav.astro");
  const footerPath = path.join(root, "src", "components", "V2Footer.astro");

  if ([chromePath, navPath, footerPath].every((f) => fs.existsSync(f))) {
    const chromeSrc = fs.readFileSync(chromePath, "utf8");

    const blockKeys = (constName: string): Set<string> => {
      const start = chromeSrc.indexOf(`export const ${constName}`);
      if (start < 0) return new Set();
      const end = chromeSrc.indexOf("\n};", start);
      const block = chromeSrc.slice(start, end);
      const out = new Set<string>();
      // Both `"Some phrase": "…"` and bare-identifier `Pricing: "…"` forms.
      for (const m of block.matchAll(/\n    (?:"((?:[^"\\]|\\.)*)"|([A-Za-z_$][\w$]*)):/g)) {
        out.add(m[1] !== undefined ? (JSON.parse(`"${m[1]}"`) as string) : m[2]);
      }
      return out;
    };
    const linkKeys = blockKeys("CHROME_LINK");
    const uiKeys = blockKeys("CHROME_UI");
    const keepEn = new Set(
      [...chromeSrc.slice(chromeSrc.indexOf("CHROME_KEEP_EN")).matchAll(/\n  "([^"]+)",/g)].map((m) => m[1]),
    );

    const missing: string[] = [];

    // Nav mega-menu rows: `{ href: "/x", …, title: "T", desc: "D" }`
    const navSrc = fs.readFileSync(navPath, "utf8");
    for (const m of navSrc.matchAll(/\{\s*href:\s*"(\/[^"]*)"[^}]*?title:\s*"([^"]*)"[^}]*?desc:\s*"([^"]*)"/g)) {
      const [, href, title, desc] = m;
      if (!hasTranslation(href, "ko")) continue;
      for (const label of [title, desc]) {
        if (!linkKeys.has(label) && !keepEn.has(label)) {
          missing.push(`V2Nav ${href} — ${JSON.stringify(label)}`);
        }
      }
    }

    // Footer links: `{ href: "/x", label: "L" }`
    const footerSrc = fs.readFileSync(footerPath, "utf8");
    for (const m of footerSrc.matchAll(/\{\s*href:\s*"(\/[^"]*)",\s*label:\s*"([^"]*)"/g)) {
      const [, href, label] = m;
      if (!hasTranslation(href, "ko")) continue;
      if (!linkKeys.has(label) && !keepEn.has(label)) {
        missing.push(`V2Footer ${href} — ${JSON.stringify(label)}`);
      }
    }

    /* Interface strings have no destination to gate on, so every one must be
       translated. These are the strings the old rule could never reach: it
       asked whether the href had a Korean page, and a heading has no href. */
    const uiStrings = [
      ...[...navSrc.matchAll(/\n    label:\s*"([^"]*)"/g)].map((m) => m[1]),
      ...[...navSrc.matchAll(/panelLabel:\s*"([^"]*)"/g)].map((m) => m[1]),
      ...[...footerSrc.matchAll(/heading:\s*"([^"]*)"/g)].map((m) => m[1]),
    ];
    for (const t of uiStrings) {
      // A group that is itself a link (Pricing) goes through the link rule.
      if (linkKeys.has(t) || keepEn.has(t)) continue;
      if (!uiKeys.has(t)) missing.push(`chrome UI — ${JSON.stringify(t)}`);
    }

    if (missing.length > 0) {
      assertionFailures++;
      console.error(
        `  FAIL ${missing.length} chrome string(s) render English on a Korean page —\n` +
          `         add to CHROME_LINK/CHROME_UI in src/lib/ko/chrome.ts, or to CHROME_KEEP_EN if that is the decision:`,
      );
      missing.slice(0, 20).forEach((m) => console.error(`         ${m}`));
      if (missing.length > 20) console.error(`         …and ${missing.length - 20} more`);
    } else {
      assertionPasses++;
      console.log(`  ok   chrome: every nav/footer string with a Korean destination is translated or explicitly kept`);
    }
  }
}

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
