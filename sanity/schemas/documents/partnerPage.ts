import { defineType, defineField } from "sanity";

/**
 * For-partners page singleton.
 *
 * Same shape as icpPage EXCEPT the feature section uses tabbed layout:
 * 4 tabs (Marketing & PR / Distribution / A&R / Creative Services), each
 * with 4 feature items + a separate preview panel per tab.
 */
export const partnerPage = defineType({
  name: "partnerPage",
  title: "For Partners page",
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
        defineField({ name: "pillLabel", type: "string" }),
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
        defineField({ name: "backgroundImage", type: "image", options: { hotspot: true } }),
      ],
    }),

    // ── Sections ──────────────────────────────────────────────
    defineField({ name: "painSection", type: "painSection", group: "sections" }),

    defineField({
      name: "tabbedFeatures",
      title: "Tabbed feature spotlight",
      type: "object",
      group: "sections",
      description: "4-tab feature spotlight unique to /for-partners.",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "headline", type: "string", validation: (R) => R.required() }),
        defineField({ name: "subhead", type: "text", rows: 2 }),
        defineField({
          name: "tabs",
          type: "array",
          of: [
            {
              type: "object",
              name: "partnerTab",
              fields: [
                defineField({ name: "label", type: "string", validation: (R) => R.required() }),
                defineField({
                  name: "features",
                  type: "array",
                  of: [
                    {
                      type: "object",
                      name: "partnerTabFeature",
                      fields: [
                        defineField({ name: "title", type: "string", validation: (R) => R.required() }),
                        defineField({ name: "description", type: "text", rows: 3 }),
                      ],
                      preview: { select: { title: "title" } },
                    },
                  ],
                  validation: (Rule) => Rule.min(1).max(6),
                }),
                defineField({
                  name: "previewMock",
                  title: "Tab preview mock",
                  type: "array",
                  of: [
                    { type: "mockGantt" },
                    { type: "mockBudget" },
                    { type: "mockChat" },
                    { type: "mockTimeline" },
                  ],
                  validation: (Rule) => Rule.max(1),
                }),
              ],
              preview: { select: { title: "label" } },
            },
          ],
          validation: (Rule) => Rule.min(2).max(6),
        }),
      ],
    }),

    defineField({ name: "stepsBlock", type: "stepsBlock", group: "sections" }),
    defineField({ name: "rolesGrid", title: "Cross-link to other ICPs", type: "rolesGrid", group: "sections" }),

    // ── Bottom of page ────────────────────────────────────────
    defineField({ name: "finalCta", type: "ctaBlock", group: "footer" }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "For Partners", subtitle: "/for-partners" }) },
});
