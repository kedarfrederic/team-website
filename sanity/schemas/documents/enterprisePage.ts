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
    // ── Hero ──────────────────────────────────────────────────
    defineField({
      name: "hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "pillLabel", type: "string", initialValue: "Enterprise" }),
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

    // ── Why-enterprise ───────────────────────────────────────
    defineField({
      name: "whySection",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headline", type: "string" }),
        defineField({ name: "body", type: "text", rows: 4 }),
      ],
    }),

    defineField({ name: "painSection", type: "painSection", group: "sections" }),

    // ── Security callout ─────────────────────────────────────
    defineField({
      name: "securityCallout",
      title: "Security callout",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headline", type: "string" }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({ name: "ctaLabel", type: "string", initialValue: "Read security overview" }),
        defineField({ name: "ctaHref", type: "string", initialValue: "/security" }),
      ],
    }),

    // ── Included ──────────────────────────────────────────────
    defineField({
      name: "includedSection",
      type: "object",
      group: "sections",
      description: "\"Everything in Team plus so much more\" — 6-block grid.",
      fields: [
        defineField({ name: "headline", type: "string" }),
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

    defineField({ name: "rolesGrid", type: "rolesGrid", group: "sections" }),

    // ── Bottom of page ────────────────────────────────────────
    defineField({ name: "finalCta", type: "ctaBlock", group: "footer" }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Enterprise", subtitle: "/enterprise" }) },
});
