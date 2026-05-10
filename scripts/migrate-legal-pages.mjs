#!/usr/bin/env node
// One-shot codemod: migrate the platform's React legal pages
// (PrivacyPolicy, TermsOfService, SMSTerms) into Astro pages on the
// marketing site. The conversion is mostly JSX → Astro template:
// strip <T> i18n wrappers, className → class, inline the meta values
// that the platform pulled from useCmsContent.
//
// Run from repo root:
//   node scripts/migrate-legal-pages.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLATFORM = path.resolve(ROOT, "../team-pilot-1/client/src/pages");

const META = {
  companyName: "Team Rollouts, Inc.",
  contactEmail: "legal@teamrollouts.com",
  lastUpdated: "December 18, 2025",
};

const PAGES = [
  { src: "PrivacyPolicy.tsx", dest: "privacy.astro", title: "Privacy Policy" },
  { src: "TermsOfService.tsx", dest: "terms.astro", title: "Terms of Service" },
  { src: "SMSTerms.tsx", dest: "sms-terms.astro", title: "SMS Terms" },
];

function extractBody(tsx) {
  // Grab the JSX inside `return ( ... );` — the first <MarketingLayout ...>
  // block through its closing </MarketingLayout>.
  const start = tsx.indexOf("<MarketingLayout");
  const end = tsx.lastIndexOf("</MarketingLayout>");
  if (start === -1 || end === -1) throw new Error("MarketingLayout markers not found");
  // Skip past the opening tag (find the > that closes it, accounting for attrs)
  let depth = 0;
  let i = start;
  while (i < tsx.length) {
    if (tsx[i] === ">") { depth++; if (depth === 1) { i++; break; } }
    i++;
  }
  return tsx.slice(i, end);
}

function transform(jsx) {
  // Strip <T> ... </T> wrappers (preserve inner text/HTML).
  // Handle nested too. Iterate until no <T> tags remain.
  let prev;
  do {
    prev = jsx;
    jsx = jsx.replace(/<T>([\s\S]*?)<\/T>/g, "$1");
  } while (jsx !== prev);

  // className → class
  jsx = jsx.replace(/className=/g, "class=");

  // Inline meta values
  jsx = jsx.replace(/\{meta\.companyName\}/g, META.companyName);
  jsx = jsx.replace(/\{meta\.contactEmail\}/g, META.contactEmail);
  jsx = jsx.replace(/\{meta\.lastUpdated\}/g, META.lastUpdated);
  jsx = jsx.replace(/\{lastUpdated\}/g, META.lastUpdated);

  // Strip self-closing-tag-with-no-content patterns Astro tolerates.
  // (No-op for now — let Astro parse and complain if anything breaks.)
  return jsx.trim();
}

function buildAstro(title, body) {
  return `---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="${title}">
  <main class="legal-page">
${body
  .split("\n")
  .map((l) => (l.trim() ? `    ${l}` : l))
  .join("\n")}
  </main>
</BaseLayout>

<style>
  .legal-page {
    background: var(--bg);
    padding: 6rem 2rem 4rem;
  }
  .legal-page :global(h1) {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.1;
    color: var(--black);
    margin-bottom: 0.5rem;
  }
  .legal-page :global(h2) {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--black);
    margin: 2.5rem 0 1rem;
  }
  .legal-page :global(h3) {
    font-size: 1.0625rem;
    font-weight: 500;
    color: var(--black);
    margin: 1.5rem 0 0.75rem;
  }
  .legal-page :global(p),
  .legal-page :global(li) {
    color: var(--text-secondary);
    line-height: 1.6;
    font-size: 0.9375rem;
    margin-bottom: 0.75rem;
  }
  .legal-page :global(ul) {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  .legal-page :global(strong) {
    color: var(--black);
    font-weight: 600;
  }
  .legal-page :global(.max-w-3xl) {
    max-width: 48rem;
    margin-inline: auto;
  }
  .legal-page :global(.text-xs) {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
</style>
`;
}

for (const { src, dest, title } of PAGES) {
  const tsx = readFileSync(path.join(PLATFORM, src), "utf8");
  const body = transform(extractBody(tsx));
  const astro = buildAstro(title, body);
  const out = path.join(ROOT, "src/pages", dest);
  writeFileSync(out, astro);
  console.log(`migrated ${src} → src/pages/${dest} (${astro.length} chars)`);
}
