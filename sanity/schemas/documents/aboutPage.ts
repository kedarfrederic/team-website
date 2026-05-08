import { defineType, defineField } from "sanity";

/**
 * About page document.
 *
 * Two-line headline pattern: every section uses `headlineTop` (sans) +
 * `headlineBottom` (serif italic, the "nyght" face). Editors see two
 * separate fields rather than one HTML blob with inline tags — easier to
 * proofread, easier for Visual Editing to highlight individually.
 */
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Page sections" },
    { name: "footer", title: "Bottom of page" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ── Hero ──────────────────────────────────────────────────
    defineField({
      name: "hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "pillLabel", type: "string", initialValue: "About" }),
        defineField({
          name: "headlineTop",
          type: "string",
          description: "First line — sans font.",
          validation: (R) => R.required(),
        }),
        defineField({
          name: "headlineBottom",
          type: "string",
          description: "Second line — serif italic (Nyght).",
          validation: (R) => R.required(),
        }),
        defineField({ name: "subhead", type: "text", rows: 3 }),
        defineField({
          name: "backgroundImage",
          type: "image",
          options: { hotspot: true },
          description: "Hero background — full-bleed behind the headline.",
        }),
      ],
    }),

    // ── Mission ───────────────────────────────────────────────
    defineField({
      name: "mission",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string" }),
        defineField({ name: "headlineBottom", type: "string" }),
        defineField({
          name: "body",
          type: "array",
          of: [{ type: "block" }],
          description: "Rich text — supports paragraphs, bold, italic, links.",
        }),
      ],
    }),

    // ── Story ─────────────────────────────────────────────────
    defineField({
      name: "story",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string" }),
        defineField({ name: "headlineBottom", type: "string" }),
        defineField({
          name: "body",
          type: "array",
          of: [{ type: "block" }],
        }),
      ],
    }),

    // ── Values ────────────────────────────────────────────────
    defineField({
      name: "valuesSection",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string" }),
        defineField({ name: "headlineBottom", type: "string" }),
        defineField({
          name: "values",
          type: "array",
          of: [
            {
              type: "object",
              name: "valueCard",
              fields: [
                defineField({ name: "title", type: "string", validation: (R) => R.required() }),
                defineField({ name: "body", type: "text", rows: 4, validation: (R) => R.required() }),
              ],
              preview: { select: { title: "title", subtitle: "body" } },
            },
          ],
          validation: (Rule) => Rule.min(1).max(6),
        }),
      ],
    }),

    // ── Contact CTA (about page-specific — not the shared ctaBlock) ──
    defineField({
      name: "contactCta",
      type: "object",
      group: "footer",
      fields: [
        defineField({ name: "headlineTop", type: "string", initialValue: "Want to" }),
        defineField({ name: "headlineBottom", type: "string", initialValue: "get in touch?" }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({ name: "linkLabel", type: "string", initialValue: "Contact us" }),
        defineField({ name: "linkHref", type: "string", initialValue: "/contact" }),
      ],
    }),

    defineField({ name: "rolesGrid", title: "Roles grid", type: "rolesGrid", group: "sections" }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "About", subtitle: "/about" }) },
});
