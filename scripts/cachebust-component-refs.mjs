#!/usr/bin/env node
// One-shot codemod: rewrite every `<script src="/components/X.js">` and
// `<link href="/components/X.css">` in src/ to use the v() helper so the
// path gets a build-time ?v=<sha> appended. Inserts the import once per
// file. Run from repo root: `node scripts/cachebust-component-refs.mjs`.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (full.endsWith(".astro")) out.push(full);
  }
  return out;
}

const FIND_RE = /(src|href)="\/components\/[^"]+\.(?:js|css)"/;
const files = walk(path.join(ROOT, "src"))
  .filter((f) => FIND_RE.test(readFileSync(f, "utf8")))
  .map((f) => path.relative(ROOT, f));

const REF_RE = /(src|href)="(\/components\/[^"]+\.(?:js|css))"/g;
let totalRefs = 0;

for (const rel of files) {
  const full = path.join(ROOT, rel);
  let src = readFileSync(full, "utf8");
  const before = src;

  // Convert refs.
  src = src.replace(REF_RE, (_, attr, p) => {
    totalRefs++;
    return `${attr}={v("${p}")}`;
  });

  if (src === before) continue;

  // Inject import into frontmatter (between the first `---` and second `---`).
  const importPath = path.relative(path.dirname(rel), "src/lib/asset-url").replace(/\\/g, "/");
  const importLine = `import { v } from "${importPath.startsWith(".") ? importPath : `./${importPath}`}";`;

  if (!src.includes(`from "${importPath}"`) && !src.includes(`'${importPath}'`)) {
    const fmMatch = src.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    if (fmMatch) {
      // Insert after the last existing import within the frontmatter, or at top.
      const fmBody = fmMatch[1];
      const lastImportIdx = fmBody.lastIndexOf("\nimport ");
      let newFm;
      if (lastImportIdx >= 0) {
        const eol = fmBody.indexOf("\n", lastImportIdx + 1);
        newFm = fmBody.slice(0, eol) + `\n${importLine}` + fmBody.slice(eol);
      } else if (fmBody.startsWith("import ")) {
        const eol = fmBody.indexOf("\n");
        newFm = fmBody.slice(0, eol) + `\n${importLine}` + fmBody.slice(eol);
      } else {
        newFm = `${importLine}\n${fmBody}`;
      }
      src = src.replace(fmMatch[0], `---\n${newFm}\n---\n`);
    } else {
      // No frontmatter — add one.
      src = `---\n${importLine}\n---\n${src}`;
    }
  }

  writeFileSync(full, src);
  console.log(`patched ${rel}`);
}

console.log(`\nDone. Rewrote ${totalRefs} refs across ${files.length} files.`);
