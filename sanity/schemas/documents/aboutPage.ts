import { defineType, defineField } from "sanity";

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
        defineField({ name: "headline", type: "string", validation: (R) => R.required() }),
        defineField({ name: "subhead", type: "text", rows: 3 }),
      ],
    }),

    // ── Mission ───────────────────────────────────────────────
    defineField({
      name: "mission",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headline", type: "string" }),
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
        defineField({ name: "headline", type: "string" }),
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
        defineField({ name: "headline", type: "string" }),
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

    defineField({ name: "rolesGrid", title: "Roles grid", type: "rolesGrid", group: "sections" }),

    // ── Bottom of page ────────────────────────────────────────
    defineField({ name: "finalCta", type: "ctaBlock", group: "footer" }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "About", subtitle: "/about" }) },
});
