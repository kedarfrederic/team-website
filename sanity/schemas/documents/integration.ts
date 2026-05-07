import { defineType, defineField } from "sanity";

/**
 * One row in the integrations grid on /integrations.
 * Collection — editors add/remove these as integration partnerships change.
 */
export const integration = defineType({
  name: "integration",
  title: "Integration",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(140),
    }),
    defineField({
      name: "logo",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "Distribution", value: "distribution" },
          { title: "Social", value: "social" },
          { title: "Analytics", value: "analytics" },
          { title: "Productivity", value: "productivity" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "comingSoon",
      type: "boolean",
      description: "If true, renders with a \"Coming Soon\" badge and is non-clickable.",
      initialValue: false,
    }),
    defineField({
      name: "href",
      type: "string",
      description: "Optional — link to the integration's marketing page or docs.",
      hidden: ({ parent }) => parent?.comingSoon === true,
    }),
    defineField({
      name: "sortOrder",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first within their category.",
    }),
  ],
  orderings: [
    { title: "Sort order", name: "sortAsc", by: [{ field: "sortOrder", direction: "asc" }] },
    { title: "Name (A→Z)", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "category", media: "logo", comingSoon: "comingSoon" },
    prepare: ({ title, subtitle, media, comingSoon }) => ({
      title,
      subtitle: comingSoon ? `${subtitle} · Coming Soon` : subtitle,
      media,
    }),
  },
});
