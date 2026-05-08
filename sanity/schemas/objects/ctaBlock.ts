import { defineType, defineField } from "sanity";

/**
 * "Final CTA" pattern — appears at the bottom of nearly every product/role page.
 * Headline + optional subhead + 1–2 buttons + optional footnote.
 */
export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "CTA section",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow label (optional)",
      type: "string",
      description: "Small uppercase label above the headline (e.g. \"Get started\").",
    }),
    defineField({
      name: "headlineTop",
      title: "Headline (top line)",
      type: "string",
      description: "First line — sans font.",
    }),
    defineField({
      name: "headlineBottom",
      title: "Headline (bottom line)",
      type: "string",
      description: "Second line — serif italic (Nyght).",
    }),
    defineField({
      name: "headline",
      title: "Legacy headline",
      type: "string",
      description: "Legacy single-line headline. Prefer headlineTop + headlineBottom.",
      hidden: true,
    }),
    defineField({
      name: "body",
      title: "Body copy (optional)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "object",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({ name: "label", type: "string", validation: (R) => R.required() }),
        defineField({
          name: "href",
          type: "string",
          description: "Internal path (/sign-up?plan=pro) or absolute URL.",
          validation: (R) => R.required(),
        }),
      ],
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA (optional)",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "href", type: "string" }),
      ],
    }),
    defineField({
      name: "footnote",
      title: "Footnote (optional)",
      type: "string",
      description: "Small text below the buttons (e.g. \"No credit card required\").",
    }),
  ],
  preview: {
    select: { titleTop: "headlineTop", titleLegacy: "headline", subtitle: "primaryCta.label" },
    prepare: ({ titleTop, titleLegacy, subtitle }) => ({
      title: titleTop || titleLegacy || "(untitled CTA)",
      subtitle: subtitle ? `→ ${subtitle}` : "(no primary CTA set)",
    }),
  },
});
