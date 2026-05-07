import { defineType, defineField } from "sanity";

/**
 * Fake budget breakdown — horizontal bars with labels, percentages, dollar values.
 * Used to illustrate Team's budget tracking visualizations.
 */
export const mockBudget = defineType({
  name: "mockBudget",
  title: "Mock — Budget bars",
  type: "object",
  fields: [
    defineField({
      name: "totalLabel",
      type: "string",
      description: "Header label (e.g. \"Q1 Spend\").",
    }),
    defineField({
      name: "totalValue",
      type: "string",
      description: "Header value (e.g. \"$24,500\").",
    }),
    defineField({
      name: "bars",
      title: "Budget bars",
      type: "array",
      of: [
        {
          type: "object",
          name: "budgetBar",
          fields: [
            defineField({ name: "label", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "value",
              type: "string",
              description: "Display dollar amount (e.g. \"$3,200\").",
            }),
            defineField({
              name: "percent",
              type: "number",
              description: "Bar fill 0–100.",
              validation: (Rule) => Rule.required().min(0).max(100),
            }),
            defineField({
              name: "color",
              type: "string",
              options: {
                list: [
                  { title: "Lime (primary)", value: "lime" },
                  { title: "Orange (accent)", value: "orange" },
                  { title: "Teal", value: "teal" },
                  { title: "Steel", value: "steel" },
                  { title: "Rose", value: "rose" },
                  { title: "Amber", value: "amber" },
                  { title: "Foreground", value: "foreground" },
                ],
                layout: "radio",
              },
              initialValue: "lime",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(8),
    }),
  ],
  preview: {
    select: { count: "bars" },
    prepare: ({ count }) => ({
      title: "Mock — Budget",
      subtitle: `${(count as unknown[] | undefined)?.length ?? 0} bars`,
    }),
  },
});
