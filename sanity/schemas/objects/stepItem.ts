import { defineType, defineField } from "sanity";

export const stepItem = defineType({
  name: "stepItem",
  title: "Step",
  type: "object",
  fields: [
    defineField({
      name: "number",
      type: "string",
      description: "Display label (e.g. \"01\").",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "number" } },
});
