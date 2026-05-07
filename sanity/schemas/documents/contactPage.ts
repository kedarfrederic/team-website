import { defineType, defineField } from "sanity";

/**
 * /contact page singleton.
 *
 * Form mechanics + posting are wired in the marketing-site Astro code,
 * not here. This schema controls the surrounding copy + form labels +
 * the interest-checkbox options.
 */
export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  groups: [
    { name: "copy", title: "Copy", default: true },
    { name: "form", title: "Form labels" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "headline",
      type: "string",
      group: "copy",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subhead",
      type: "text",
      rows: 2,
      group: "copy",
    }),
    defineField({
      name: "backgroundImage",
      type: "image",
      group: "copy",
      options: { hotspot: true },
    }),
    defineField({
      name: "interestOptions",
      title: "Interest checkbox options",
      type: "array",
      group: "form",
      of: [
        {
          type: "object",
          name: "interestOption",
          fields: [
            defineField({ name: "label", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "value",
              type: "string",
              description:
                "Sent to /api/forms/contact in the `interest` array (e.g. \"artists\"). Keep stable; avoid renaming.",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
      validation: (Rule) => Rule.min(1).max(8),
    }),
    defineField({
      name: "submitLabel",
      type: "string",
      group: "form",
      initialValue: "Send message",
    }),
    defineField({
      name: "emailFallbackText",
      type: "string",
      group: "form",
    }),
    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Contact", subtitle: "/contact" }) },
});
