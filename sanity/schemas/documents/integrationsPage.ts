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
        defineField({
          name: "headlineTop",
          type: "string",
          description: "First line — sans font.",
        }),
        defineField({
          name: "headlineBottom",
          type: "string",
          description: "Second line — serif italic (Nyght).",
        }),
        defineField({ name: "subhead", type: "text", rows: 3 }),
        defineField({
          name: "primaryCta",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "href", type: "string" }),
          ],
        }),
        defineField({
          name: "secondaryCta",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "href", type: "string" }),
          ],
        }),
        defineField({
          name: "backgroundImage",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),

    defineField({
      name: "gridSection",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string" }),
        defineField({ name: "headlineBottom", type: "string" }),
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
        defineField({ name: "headlineTop", type: "string", initialValue: "Build your own" }),
        defineField({ name: "headlineBottom", type: "string", initialValue: "integrations" }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({ name: "ctaLabel", type: "string", initialValue: "View API documentation" }),
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
