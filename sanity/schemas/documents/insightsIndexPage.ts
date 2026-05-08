import { defineType, defineField } from "sanity";

/**
 * /insights index page singleton — hero + filterable post grid.
 * Posts themselves are `insightPost` documents; this page just controls
 * the hero copy and filter UI labels. The post grid is rendered by
 * Astro from the `insightPost` collection.
 */
export const insightsIndexPage = defineType({
  name: "insightsIndexPage",
  title: "Insights index page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "footer", title: "Bottom of page" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "headlineTop",
          type: "string",
          description: "First line — sans font.",
          initialValue: "Insights",
        }),
        defineField({
          name: "headlineBottom",
          type: "string",
          description: "Second line — serif italic (Nyght).",
          initialValue: "& ideas",
        }),
        defineField({ name: "subhead", type: "text", rows: 2 }),
      ],
    }),

    defineField({
      name: "search",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "placeholder",
          type: "string",
          initialValue: "Search posts...",
        }),
      ],
    }),

    defineField({
      name: "globalCta",
      title: "End-of-post CTA (global default)",
      type: "ctaBlock",
      group: "footer",
      description: "Used at the bottom of every insightPost unless that post overrides it.",
    }),

    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Insights index", subtitle: "/insights" }) },
});
