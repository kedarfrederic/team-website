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
      name: "headlineTop",
      type: "string",
      description: "First line — sans font.",
    }),
    defineField({
      name: "headlineBottom",
      type: "string",
      description: "Second line — serif italic (Nyght).",
    }),
    defineField({
      name: "headline",
      type: "string",
      description: "Legacy single-line headline. Prefer headlineTop + headlineBottom.",
      hidden: true,
    }),
    defineField({
      name: "subhead",
      type: "text",
      rows: 2,
      description: "Optional microcopy below the headline.",
    }),
    defineField({
      name: "rows",
      type: "array",
      of: [{ type: "painRow" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { titleTop: "headlineTop", titleLegacy: "headline" },
    prepare: ({ titleTop, titleLegacy }) => ({ title: titleTop || titleLegacy || "Pain section" }),
  },
});
