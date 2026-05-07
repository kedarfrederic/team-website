import { defineType, defineField } from "sanity";

export const featureCard = defineType({
  name: "featureCard",
  title: "Feature card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mock",
      title: "Mock visual (optional)",
      type: "array",
      of: [
        { type: "mockGantt" },
        { type: "mockBudget" },
        { type: "mockChat" },
        { type: "mockTimeline" },
      ],
      validation: (Rule) => Rule.max(1),
      description: "Optional structured mock to render alongside this feature.",
    }),
    defineField({
      name: "href",
      title: "Link (optional)",
      type: "string",
      description: "If set, the entire card becomes a link.",
    }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});
