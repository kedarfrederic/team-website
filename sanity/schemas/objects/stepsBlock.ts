import { defineType, defineField } from "sanity";

export const stepsBlock = defineType({
  name: "stepsBlock",
  title: "Steps section",
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
      name: "steps",
      type: "array",
      of: [{ type: "stepItem" }],
      validation: (Rule) => Rule.min(1).max(6),
    }),
  ],
  preview: {
    select: { titleTop: "headlineTop", titleLegacy: "headline", count: "steps" },
    prepare: ({ titleTop, titleLegacy, count }) => ({
      title: titleTop || titleLegacy || "Steps",
      subtitle: `${(count as unknown[] | undefined)?.length ?? 0} steps`,
    }),
  },
});
