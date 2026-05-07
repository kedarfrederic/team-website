import { defineType, defineField } from "sanity";

/**
 * Fake Gantt-style timeline shown inside pain rows / feature cards.
 * Each row = one task bar with a label, start week, and span.
 *
 * The component renders this as styled DIVs — no real Gantt library.
 * Marketers edit the labels/positions; engineering doesn't touch it.
 */
export const mockGantt = defineType({
  name: "mockGantt",
  title: "Mock — Gantt timeline",
  type: "object",
  fields: [
    defineField({
      name: "weeks",
      title: "Number of week columns",
      type: "number",
      initialValue: 8,
      validation: (Rule) => Rule.min(2).max(16).integer(),
    }),
    defineField({
      name: "rows",
      title: "Task rows",
      type: "array",
      of: [
        {
          type: "object",
          name: "ganttRow",
          fields: [
            defineField({ name: "label", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "category",
              type: "string",
              options: {
                list: [
                  { title: "Marketing", value: "marketing" },
                  { title: "Production", value: "production" },
                  { title: "Distribution", value: "distribution" },
                  { title: "Promotion", value: "promotion" },
                  { title: "Other", value: "other" },
                ],
                layout: "radio",
              },
              initialValue: "marketing",
            }),
            defineField({
              name: "startWeek",
              type: "number",
              description: "1-indexed.",
              validation: (Rule) => Rule.required().min(1).integer(),
            }),
            defineField({
              name: "spanWeeks",
              type: "number",
              validation: (Rule) => Rule.required().min(1).integer(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "category" },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { count: "rows" },
    prepare: ({ count }) => ({
      title: "Mock — Gantt",
      subtitle: `${(count as unknown[] | undefined)?.length ?? 0} rows`,
    }),
  },
});
