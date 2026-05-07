import { defineType, defineField } from "sanity";

/**
 * One row of the alternating pain/feature pattern.
 * Heading + body + a structured "mock visual" on the side.
 */
export const painRow = defineType({
  name: "painRow",
  title: "Pain row",
  type: "object",
  fields: [
    defineField({
      name: "metadataPill",
      title: "Pill label",
      type: "string",
      description: "Small uppercase tag above the headline (e.g. \"Pre-release\").",
    }),
    defineField({
      name: "headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mock",
      title: "Mock visual",
      type: "array",
      of: [
        { type: "mockGantt" },
        { type: "mockBudget" },
        { type: "mockChat" },
        { type: "mockTimeline" },
      ],
      validation: (Rule) => Rule.max(1).warning("Pick a single mock variant"),
      description:
        "Pick ONE mock variant. The marketer-editable structured data renders into a visual on the page.",
    }),
  ],
  preview: {
    select: { title: "headline", subtitle: "metadataPill" },
    prepare: ({ title, subtitle }) => ({
      title: title || "(untitled pain row)",
      subtitle: subtitle ? subtitle.toString().toUpperCase() : undefined,
    }),
  },
});
