import { defineType, defineField } from "sanity";

/**
 * Per-document SEO meta. Embed this on every page document.
 * Falls back to global defaults from siteSettings if fields are blank.
 */
export const seoBlock = defineType({
  name: "seoBlock",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description:
        "Page <title>. Falls back to the page name if blank. ~50–60 chars is ideal.",
      validation: (Rule) => Rule.max(70).warning("Long titles get truncated in search results"),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "Search-result snippet. ~150–160 chars is ideal.",
      validation: (Rule) =>
        Rule.max(180).warning("Long descriptions get truncated in search results"),
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description: "Shown when the page is shared on social. 1200×630 recommended.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      description: "Adds <meta name=\"robots\" content=\"noindex\"> to this page.",
      initialValue: false,
    }),
  ],
});
