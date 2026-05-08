import { defineType, defineField } from "sanity";

export const securityPage = defineType({
  name: "securityPage",
  title: "Security page",
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
        defineField({ name: "pillLabel", type: "string", initialValue: "Security" }),
        defineField({
          name: "headlineTop",
          type: "string",
          description: "First line — sans font.",
          initialValue: "Your releases. Your data.",
        }),
        defineField({
          name: "headlineBottom",
          type: "string",
          description: "Second line — serif italic (Nyght).",
          initialValue: "Your rules.",
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
      name: "pillarsSection",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string", description: "First line — sans font." }),
        defineField({ name: "headlineBottom", type: "string", description: "Second line — serif italic (Nyght)." }),
        defineField({ name: "headline", type: "string", description: "Legacy single-line headline.", hidden: true }),
        defineField({
          name: "pillars",
          type: "array",
          of: [
            {
              type: "object",
              name: "securityPillar",
              fields: [
                defineField({ name: "title", type: "string", validation: (R) => R.required() }),
                defineField({ name: "body", type: "text", rows: 3 }),
                defineField({
                  name: "tag",
                  type: "string",
                  description: "Small label (e.g. \"AES-256\", \"99.9% uptime\").",
                }),
              ],
              preview: { select: { title: "title", subtitle: "tag" } },
            },
          ],
          validation: (Rule) => Rule.min(1).max(8),
        }),
      ],
    }),

    defineField({
      name: "aiPrivacySection",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "metadataPill", type: "string", initialValue: "AI & Data Privacy" }),
        defineField({
          name: "headlineTop",
          type: "string",
          initialValue: "TeamMate AI works for you.",
        }),
        defineField({
          name: "headlineBottom",
          type: "string",
          initialValue: "Only you.",
        }),
        defineField({
          name: "paragraphs",
          type: "array",
          of: [{ type: "text", rows: 3 }],
          validation: (Rule) => Rule.max(5),
        }),
        defineField({
          name: "trustPills",
          type: "array",
          of: [{ type: "string" }],
          description: "Small text pills shown under the body.",
          validation: (Rule) => Rule.max(8),
        }),
      ],
    }),

    defineField({
      name: "enterpriseSection",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string", description: "First line — sans font." }),
        defineField({ name: "headlineBottom", type: "string", description: "Second line — serif italic (Nyght)." }),
        defineField({ name: "headline", type: "string", description: "Legacy single-line headline.", hidden: true }),
        defineField({ name: "subhead", type: "text", rows: 2 }),
        defineField({
          name: "blocks",
          type: "array",
          of: [
            {
              type: "object",
              name: "enterpriseBlock",
              fields: [
                defineField({ name: "tag", type: "string" }),
                defineField({ name: "title", type: "string", validation: (R) => R.required() }),
                defineField({ name: "body", type: "text", rows: 3 }),
              ],
              preview: { select: { title: "title", subtitle: "tag" } },
            },
          ],
          validation: (Rule) => Rule.min(1).max(6),
        }),
        defineField({
          name: "enterpriseCta",
          type: "object",
          fields: [
            defineField({ name: "headline", type: "string" }),
            defineField({ name: "body", type: "text", rows: 2 }),
            defineField({ name: "ctaLabel", type: "string" }),
            defineField({ name: "ctaHref", type: "string" }),
          ],
        }),
      ],
    }),

    defineField({
      name: "complianceSection",
      type: "object",
      group: "sections",
      description: "3-column compliance grid.",
      fields: [
        defineField({ name: "headlineTop", type: "string", initialValue: "Compliance" }),
        defineField({ name: "headlineBottom", type: "string", initialValue: "& certifications" }),
        defineField({
          name: "cards",
          type: "array",
          of: [
            {
              type: "object",
              name: "complianceCard",
              fields: [
                defineField({ name: "title", type: "string", validation: (R) => R.required() }),
                defineField({ name: "body", type: "text", rows: 3 }),
                defineField({
                  name: "status",
                  type: "string",
                  options: {
                    list: [
                      { title: "Active", value: "active" },
                      { title: "Available on request", value: "on_request" },
                      { title: "Coming soon", value: "coming_soon" },
                    ],
                    layout: "radio",
                  },
                  initialValue: "active",
                }),
              ],
              preview: { select: { title: "title", subtitle: "status" } },
            },
          ],
          validation: (Rule) => Rule.min(1).max(8),
        }),
      ],
    }),

    defineField({ name: "faq", type: "faqBlock", group: "sections" }),

    defineField({ name: "finalCta", type: "ctaBlock", group: "footer" }),

    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Security", subtitle: "/security" }) },
});
