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
    /**
     * Per-input labels and placeholders. The technical `name=` attribute
     * the website-leads CRM endpoint reads stays hardcoded in the Astro
     * template — only the visible copy is editable here.
     * For role / artistCount (dropdowns), `placeholder` is the disabled
     * prompt option (e.g. "Select your role").
     */
    defineField({
      name: "formCopy",
      title: "Form labels & placeholders",
      type: "object",
      group: "form",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "firstName",    title: "First name",      type: "formFieldCopy" }),
        defineField({ name: "lastName",     title: "Last name",       type: "formFieldCopy" }),
        defineField({ name: "email",        title: "Email address",   type: "formFieldCopy" }),
        defineField({ name: "organization", title: "Organization",    type: "formFieldCopy" }),
        defineField({ name: "role",         title: "Role (dropdown)", type: "formFieldCopy" }),
        defineField({ name: "artistCount",  title: "Artist count (dropdown)", type: "formFieldCopy" }),
        defineField({ name: "interest",     title: "Interest (textarea)",     type: "formFieldCopy" }),
      ],
    }),
    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Demo", subtitle: "/demo" }) },
});
