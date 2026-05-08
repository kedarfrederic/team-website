import { defineType, defineField } from "sanity";

export const featureSpotlight = defineType({
  name: "featureSpotlight",
  title: "Feature spotlight section",
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
    }),
    defineField({
      name: "cards",
      type: "array",
      of: [{ type: "featureCard" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { titleTop: "headlineTop", titleLegacy: "headline", count: "cards" },
    prepare: ({ titleTop, titleLegacy, count }) => ({
      title: titleTop || titleLegacy || "Feature spotlight",
      subtitle: `${(count as unknown[] | undefined)?.length ?? 0} cards`,
    }),
  },
});
