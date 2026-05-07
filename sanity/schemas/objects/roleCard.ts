import { defineType, defineField } from "sanity";

export const roleCard = defineType({
  name: "roleCard",
  title: "Role card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Role label (e.g. \"For Artists\").",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      type: "string",
      description: "Where the card links to (usually /for-artists, /for-labels, etc.).",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});
