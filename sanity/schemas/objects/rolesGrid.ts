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
      name: "headlineTop",
      type: "string",
      description: "First line — sans font.",
    }),
    defineField({
      name: "headlineBottom",
      type: "string",
      description: "Second line — serif italic (Nyght).",
    }),
    defineField({
      name: "headline",
      type: "string",
      description: "Legacy single-line headline. Prefer headlineTop + headlineBottom.",
      hidden: true,
    }),
    defineField({
      name: "cards",
      type: "array",
      of: [{ type: "roleCard" }],
      validation: (Rule) => Rule.min(2).max(6),
    }),
  ],
  preview: {
    select: { titleTop: "headlineTop", titleLegacy: "headline" },
    prepare: ({ titleTop, titleLegacy }) => ({
      title: titleTop || titleLegacy || "Roles grid",
    }),
  },
});
