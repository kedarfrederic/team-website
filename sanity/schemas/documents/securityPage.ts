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
        defineField({ name: "headline", type: "string", validation: (R) => R.required() }),
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
      ],
    }),

    // ── 4 pillars ────────────────────────────────────────────
    defineField({
      name: "pillarsSection",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headline", type: "string" }),
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

    // ── AI privacy section ───────────────────────────────────
    defineField({
      name: "aiPrivacySection",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "metadataPill", type: "string" }),
        defineField({ name: "headline", type: "string" }),
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
          description: "Small text pills shown under the body (e.g. \"No model training\", \"Data isolated by tenant\").",
          validation: (Rule) => Rule.max(8),
        }),
      ],
    }),

    // ── Enterprise blocks ────────────────────────────────────
    defineField({
      name: "enterpriseSection",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headline", type: "string" }),
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

    // ── Compliance ────────────────────────────────────────────
    defineField({
      name: "complianceSection",
      type: "object",
      group: "sections",
      description: "Scroll-driven card stack of certifications.",
      fields: [
        defineField({ name: "headline", type: "string" }),
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

    // ── Bottom of page ────────────────────────────────────────
    defineField({ name: "finalCta", type: "ctaBlock", group: "footer" }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Security", subtitle: "/security" }) },
});
