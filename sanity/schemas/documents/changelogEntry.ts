import { defineType, defineField } from "sanity";

/**
 * One row in the changelog timeline. Editors create one per entry; the page
 * groups them by `releaseDate` (entries sharing the same date render under
 * the same dated heading + groupHeadline).
 */
export const changelogEntry = defineType({
  name: "changelogEntry",
  title: "Changelog entry",
  type: "document",
  fields: [
    defineField({
      name: "releaseDate",
      type: "date",
      validation: (Rule) => Rule.required(),
      description: "Entries sharing a date are grouped together on the page.",
    }),
    defineField({
      name: "groupHeadline",
      type: "string",
      description:
        "Optional headline for the date group (e.g. \"Smart links & analytics\"). Used when the first entry of a date is rendered.",
    }),
    defineField({
      name: "type",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Improved", value: "improved" },
          { title: "Fixed", value: "fixed" },
          { title: "Performance", value: "performance" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
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
      name: "sortWithinDate",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first within a date group.",
    }),
  ],
  orderings: [
    {
      title: "Date (newest first)",
      name: "dateDesc",
      by: [
        { field: "releaseDate", direction: "desc" },
        { field: "sortWithinDate", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", date: "releaseDate", type: "type" },
    prepare: ({ title, date, type }) => ({
      title,
      subtitle: `${date ?? "(no date)"} · ${type ?? "(no type)"}`,
    }),
  },
});
