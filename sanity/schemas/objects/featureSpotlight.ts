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
      name: "headline",
      type: "string",
      validation: (Rule) => Rule.required(),
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
    select: { title: "headline", count: "cards" },
    prepare: ({ title, count }) => ({
      title: title || "Feature spotlight",
      subtitle: `${(count as unknown[] | undefined)?.length ?? 0} cards`,
    }),
  },
});
