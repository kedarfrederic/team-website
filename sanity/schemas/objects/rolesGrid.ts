import { defineType, defineField } from "sanity";

/**
 * "Designed for how you work" 4-card roles grid. Appears on enterprise,
 * about, intelligence, orchestration, integrations.
 */
export const rolesGrid = defineType({
  name: "rolesGrid",
  title: "Roles grid",
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
      name: "cards",
      type: "array",
      of: [{ type: "roleCard" }],
      validation: (Rule) => Rule.min(2).max(6),
    }),
  ],
  preview: {
    select: { title: "headline" },
    prepare: ({ title }) => ({ title: title || "Roles grid" }),
  },
});
