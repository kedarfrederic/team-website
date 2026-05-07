import { defineType, defineField } from "sanity";

/**
 * /integrations page singleton — hero + filterable grid + API section + roles grid.
 * The grid items themselves are stored as separate `integration` documents
 * so editors can add/remove integrations without touching the page schema.
 */
export const integrationsPage = defineType({
  name: "integrationsPage",
  title: "Integrations page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Page sections" },
    { name: "footer", title: "Bottom of page" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "pillLabel", type: "string", initialValue: "Integrations" }),
        defineField({ name: "headline", type: "string", validation: (R) => R.required() }),
        defineField({ name: "subhead", type: "text", rows: 3 }),
      ],
    }),

    defineField({
      name: "gridSection",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headline", type: "string" }),
        defineField({ name: "subhead", type: "text", rows: 2 }),
        defineField({
          name: "searchPlaceholder",
          type: "string",
          initialValue: "Search integrations…",
        }),
      ],
    }),

    defineField({
      name: "apiSection",
      title: "API CTA section",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headline", type: "string", initialValue: "Build your own integrations" }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({ name: "ctaLabel", type: "string", initialValue: "View API docs" }),
        defineField({ name: "ctaHref", type: "string" }),
      ],
    }),

    defineField({ name: "rolesGrid", type: "rolesGrid", group: "sections" }),

    // ── Bottom of page ────────────────────────────────────────
    defineField({ name: "finalCta", type: "ctaBlock", group: "footer" }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Integrations", subtitle: "/integrations" }) },
});
