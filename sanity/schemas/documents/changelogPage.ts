import { defineType, defineField } from "sanity";

/**
 * /changelog index page singleton. Entries themselves are `changelogEntry`
 * documents; this page just controls hero copy and filter UI.
 */
export const changelogPage = defineType({
  name: "changelogPage",
  title: "Changelog page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "headline", type: "string", validation: (R) => R.required() }),
        defineField({ name: "subhead", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "search",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "placeholder", type: "string", initialValue: "Search changelog…" }),
      ],
    }),
    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Changelog", subtitle: "/changelog" }) },
});
