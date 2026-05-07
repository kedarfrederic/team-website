import { defineType, defineField } from "sanity";

export const faqBlock = defineType({
  name: "faqBlock",
  title: "FAQ section",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow label (optional)",
      type: "string",
    }),
    defineField({
      name: "headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subhead",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [{ type: "faqItem" }],
      validation: (Rule) => Rule.min(1).error("Add at least one FAQ item"),
    }),
    defineField({
      name: "footerCta",
      title: "Footer CTA (optional)",
      type: "object",
      description: "Link below the FAQ items (e.g. \"Still have questions? Contact us\").",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "href", type: "string" }),
      ],
    }),
  ],
  preview: {
    select: { title: "headline", count: "items" },
    prepare: ({ title, count }) => ({
      title: title || "FAQ section",
      subtitle: `${(count as unknown[] | undefined)?.length ?? 0} question${
        (count as unknown[] | undefined)?.length === 1 ? "" : "s"
      }`,
    }),
  },
});
