import { defineType, defineField } from "sanity";

export const painSection = defineType({
  name: "painSection",
  title: "Pain / feature alternating section",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
    }),
    defineField({
      name: "headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rows",
      type: "array",
      of: [{ type: "painRow" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: "headline" },
    prepare: ({ title }) => ({ title: title || "Pain section" }),
  },
});
