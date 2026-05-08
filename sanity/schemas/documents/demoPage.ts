import { defineType, defineField } from "sanity";

/**
 * /demo page singleton.
 *
 * Form mechanics + posting are wired in the marketing-site Astro code,
 * not here. This schema is just the surrounding marketing copy + form
 * field labels that editors might want to tweak.
 */
export const demoPage = defineType({
  name: "demoPage",
  title: "Demo page",
  type: "document",
  groups: [
    { name: "copy", title: "Copy", default: true },
    { name: "form", title: "Form labels" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "headlineTop",
      type: "string",
      group: "copy",
      description: "First line — sans font.",
    }),
    defineField({
      name: "headlineBottom",
      type: "string",
      group: "copy",
      description: "Second line — serif italic (Nyght).",
    }),
    defineField({
      name: "headline",
      type: "string",
      group: "copy",
      description: "Legacy single-line headline. Prefer headlineTop + headlineBottom.",
      hidden: true,
    }),
    defineField({
      name: "subhead",
      type: "text",
      rows: 2,
      group: "copy",
    }),
    defineField({
      name: "backgroundVideo",
      type: "object",
      group: "copy",
      fields: [
        defineField({ name: "src", type: "string", description: "Background video URL." }),
        defineField({ name: "poster", type: "image" }),
      ],
    }),
    defineField({
      name: "submitLabel",
      type: "string",
      group: "form",
      initialValue: "Continue to pick a time",
    }),
    defineField({
      name: "formHint",
      type: "string",
      group: "form",
      description: "Small text below the submit button.",
    }),
    defineField({
      name: "emailFallbackText",
      type: "string",
      group: "form",
      description: "Shown after a successful submit (e.g. \"We'll email you at <email>...\").",
    }),
    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Demo", subtitle: "/demo" }) },
});
