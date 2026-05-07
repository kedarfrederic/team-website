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
      name: "headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "steps",
      type: "array",
      of: [{ type: "stepItem" }],
      validation: (Rule) => Rule.min(1).max(6),
    }),
  ],
  preview: {
    select: { title: "headline", count: "steps" },
    prepare: ({ title, count }) => ({
      title: title || "Steps",
      subtitle: `${(count as unknown[] | undefined)?.length ?? 0} steps`,
    }),
  },
});
