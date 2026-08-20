/**
 * Compile the investor deck template into a render-ready artifact.
 *
 * Reads  src/lib/investor-deck/template.html   (the designed deck markup)
 * Writes src/lib/investor-deck/compiled.json   (committed; imported by the page)
 *
 * What it does:
 *  1. Finds every "editable leaf" — an element that contains visible text and
 *     whose element children are all inline formatting tags — and assigns it a
 *     stable slug: <section data-label> slugified + a per-section counter.
 *  2. Emits the deck as an alternating parts array [html, {s:slug}, html, …]
 *     plus a default innerHTML per slug. The server renders by concatenating
 *     parts, substituting stored overrides (falling back to the default), so
 *     no DOM library is needed in the Worker.
 *
 * Slug stability: slugs derive from each section's data-label (stable across
 * slide reordering/insertion) plus the order of text leaves WITHIN that
 * section. Inserting a new text element mid-slide shifts later slugs in that
 * slide only — re-run this script and re-publish after structural edits.
 *
 * Run: node scripts/compile-investor-deck.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";

const ROOT = path.join(import.meta.dirname, "..");
const TEMPLATE = path.join(ROOT, "src/lib/investor-deck/template.html");
const OUT = path.join(ROOT, "src/lib/investor-deck/compiled.json");

// Inline tags allowed INSIDE an editable leaf. Anything else makes the
// element structural, and we descend instead.
const INLINE = new Set(["EM", "STRONG", "B", "I", "BR", "SPAN", "SUP", "SUB"]);
const TOKEN = (slug) => `SLOT:${slug}`;

const html = fs.readFileSync(TEMPLATE, "utf8");
const dom = new JSDOM(`<body>${html}</body>`);
const doc = dom.window.document;
const stage = doc.querySelector("deck-stage");
if (!stage) throw new Error("template.html has no <deck-stage> root");

const isInlineOnly = (el) => {
  for (const child of el.children) {
    if (!INLINE.has(child.tagName)) return false;
    if (!isInlineOnly(child)) return false;
  }
  return true;
};
const hasText = (el) => {
  for (const node of el.childNodes) {
    if (node.nodeType === 3 && node.textContent.trim()) return true;
    if (node.nodeType === 1 && hasText(node)) return true;
  }
  return false;
};

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const slots = [];
const sections = [...stage.querySelectorAll(":scope > section")];
const seenSection = new Map();
for (const section of sections) {
  const label = section.getAttribute("data-label") || "slide";
  let base = slugify(label);
  // Guard against duplicate labels — suffix a copy counter.
  const n = (seenSection.get(base) || 0) + 1;
  seenSection.set(base, n);
  if (n > 1) base = `${base}-${n}`;

  let i = 0;
  const walk = (el) => {
    if (el.tagName === "SVG" || el.closest("svg")) return;
    if (hasText(el) && isInlineOnly(el)) {
      i += 1;
      const slug = `${base}.${i}`;
      el.setAttribute("data-e", slug);
      slots.push({ slug, default: el.innerHTML });
      return; // leaf claimed — do not descend
    }
    for (const child of el.children) walk(child);
  };
  walk(section);
}

// Second pass: swap each leaf's content for a token, serialize, split.
for (const { slug } of slots) {
  const el = [...stage.querySelectorAll("[data-e]")].find((e) => e.getAttribute("data-e") === slug);
  el.innerHTML = TOKEN(slug);
}
const serialized = stage.outerHTML;
const parts = [];
const re = /SLOT:([^]+)/g;
let last = 0;
let m;
while ((m = re.exec(serialized))) {
  parts.push(serialized.slice(last, m.index));
  parts.push({ s: m[1] });
  last = m.index + m[0].length;
}
parts.push(serialized.slice(last));

const defaults = Object.fromEntries(slots.map((s) => [s.slug, s.default]));
fs.writeFileSync(
  OUT,
  JSON.stringify({ generatedFrom: "template.html", slotCount: slots.length, parts, defaults })
);
console.log(
  `compiled ${sections.length} slides, ${slots.length} editable slots -> ${path.relative(ROOT, OUT)} (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`
);
