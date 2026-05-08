import { defineType, defineField } from "sanity";

export const enterprisePage = defineType({
  name: "enterprisePage",
  title: "Enterprise page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Page sections" },
    { name: "footer", title: "Bottom of page" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "pillLabel", type: "string", initialValue: "Enterprise" }),
        defineField({
          name: "headlineTop",
          type: "string",
          initialValue: "Scale without compromise.",
        }),
        defineField({
          name: "headlineBottom",
          type: "string",
          initialValue: "Security without sacrifice.",
        }),
        defineField({ name: "subhead", type: "text", rows: 3 }),
        defineField({
          name: "primaryCta",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "href", type: "string" }),
          ],
        }),
        defineField({
          name: "secondaryCta",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "href", type: "string" }),
          ],
        }),
        defineField({
          name: "backgroundImage",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),

    defineField({
      name: "whySection",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string", initialValue: "Built for the complexity" }),
        defineField({ name: "headlineBottom", type: "string", initialValue: "of scale" }),
        defineField({ name: "body", type: "text", rows: 4 }),
      ],
    }),

    defineField({ name: "painSection", type: "painSection", group: "sections" }),

    defineField({
      name: "securityCallout",
      title: "Security callout",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string", initialValue: "Enterprise-grade" }),
        defineField({ name: "headlineBottom", type: "string", initialValue: "security" }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({ name: "ctaLabel", type: "string", initialValue: "Read more about our security" }),
        defineField({ name: "ctaHref", type: "string", initialValue: "/security" }),
      ],
    }),

    defineField({
      name: "includedSection",
      type: "object",
      group: "sections",
      description: "\"Everything in Team plus so much more\" — 6-block grid.",
      fields: [
        defineField({ name: "headlineTop", type: "string", initialValue: "Everything in Team" }),
        defineField({ name: "headlineBottom", type: "string", initialValue: "plus so much more" }),
        defineField({
          name: "blocks",
          type: "array",
          of: [
            {
              type: "object",
              name: "includedBlock",
              fields: [
                defineField({ name: "title", type: "string", validation: (R) => R.required() }),
                defineField({ name: "description", type: "text", rows: 3 }),
              ],
              preview: { select: { title: "title", subtitle: "description" } },
            },
          ],
          validation: (Rule) => Rule.min(1).max(8),
        }),
      ],
    }),

    defineField({
      name: "bridgeSection",
      title: "Bridge to product pages",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string", initialValue: "Ready to see Team" }),
        defineField({ name: "headlineBottom", type: "string", initialValue: "in action?" }),
        defineField({ name: "body", type: "text", rows: 2 }),
        defineField({
          name: "links",
          type: "array",
          of: [
            {
              type: "object",
              name: "bridgeLink",
              fields: [
                defineField({ name: "label", type: "string", validation: (R) => R.required() }),
                defineField({ name: "href", type: "string", validation: (R) => R.required() }),
              ],
              preview: { select: { title: "label", subtitle: "href" } },
            },
          ],
          validation: (Rule) => Rule.max(4),
        }),
      ],
    }),

    defineField({ name: "rolesGrid", type: "rolesGrid", group: "sections" }),

    defineField({ name: "finalCta", type: "ctaBlock", group: "footer" }),

    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Enterprise", subtitle: "/enterprise" }) },
});
