import { defineType, defineField } from "sanity";

/**
 * Fake day-by-day rollout timeline. Columns = days; cells = tasks with
 * status, time, title, category, optional assignee initials.
 */
export const mockTimeline = defineType({
  name: "mockTimeline",
  title: "Mock — Day-by-day timeline",
  type: "object",
  fields: [
    defineField({
      name: "columns",
      title: "Day column labels",
      type: "array",
      of: [{ type: "string" }],
      description: "e.g. [\"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\"]. Order = display order.",
      validation: (Rule) => Rule.min(2).max(7),
    }),
    defineField({
      name: "tasks",
      type: "array",
      of: [
        {
          type: "object",
          name: "timelineTask",
          fields: [
            defineField({
              name: "day",
              type: "string",
              description: "Must match one of the column labels above.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "title", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "time",
              type: "string",
              description: "Display label (e.g. \"9:00 AM\" or \"All day\").",
            }),
            defineField({
              name: "status",
              type: "string",
              options: {
                list: [
                  { title: "Done", value: "done" },
                  { title: "In progress", value: "in_progress" },
                  { title: "Upcoming", value: "upcoming" },
                  { title: "Blocked", value: "blocked" },
                ],
                layout: "radio",
              },
              initialValue: "upcoming",
            }),
            defineField({
              name: "category",
              type: "string",
              options: {
                list: [
                  { title: "Marketing", value: "marketing" },
                  { title: "Distribution", value: "distribution" },
                  { title: "Promotion", value: "promotion" },
                  { title: "Production", value: "production" },
                  { title: "Other", value: "other" },
                ],
              },
              initialValue: "marketing",
            }),
            defineField({
              name: "assignees",
              type: "array",
              of: [{ type: "string" }],
              description: "2-letter initials (e.g. [\"JD\", \"AM\"]). Up to 4.",
              validation: (Rule) => Rule.max(4),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "day" },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { count: "tasks" },
    prepare: ({ count }) => ({
      title: "Mock — Timeline",
      subtitle: `${(count as unknown[] | undefined)?.length ?? 0} tasks`,
    }),
  },
});
