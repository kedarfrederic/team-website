import { defineType, defineField } from "sanity";

export const insightCategory = defineType({
  name: "insightCategory",
  title: "Insight category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "color",
      type: "string",
      description: "Hex color used for the category badge on cards.",
      initialValue: "#191919",
    }),
    defineField({
      name: "sortOrder",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Sort order", name: "sortAsc", by: [{ field: "sortOrder", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
