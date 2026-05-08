import { defineType, defineField } from "sanity";

/**
 * For-partners page singleton.
 *
 * Same general shape as icpPage EXCEPT the feature section uses a tabbed
 * layout: 4 tabs (Marketing & PR / Distribution / A&R / Creative Services),
 * each with 4 features + a separate preview panel per tab.
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
    defineField({
      name: "hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "pillLabel", type: "string" }),
        defineField({
          name: "headlineTop",
          type: "string",
          initialValue: "Your clients are already on Team.",
        }),
        defineField({
          name: "headlineBottom",
          type: "string",
          initialValue: "Now you can be too.",
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
        defineField({ name: "backgroundImage", type: "image", options: { hotspot: true } }),
      ],
    }),

    defineField({ name: "painSection", type: "painSection", group: "sections" }),

    defineField({
      name: "tabbedFeatures",
      title: "Tabbed feature spotlight",
      type: "object",
      group: "sections",
      description: "4-tab feature spotlight unique to /for-partners.",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "headlineTop", type: "string", description: "First line — sans font.", initialValue: "Built for every" }),
        defineField({ name: "headlineBottom", type: "string", description: "Second line — serif italic (Nyght).", initialValue: "kind of partner" }),
        defineField({ name: "headline", type: "string", description: "Legacy single-line headline.", hidden: true }),
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
                  name: "tabKey",
                  type: "string",
                  description: "Stable id for the tab — use \"marketing\", \"distribution\", \"ar\", or \"creative\" to match the corresponding mock previews.",
                }),
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
              ],
              preview: { select: { title: "label", subtitle: "tabKey" } },
            },
          ],
          validation: (Rule) => Rule.min(2).max(6),
        }),
      ],
    }),

    defineField({ name: "stepsBlock", type: "stepsBlock", group: "sections" }),
    defineField({ name: "rolesGrid", title: "Cross-link to other ICPs", type: "rolesGrid", group: "sections" }),

    defineField({ name: "finalCta", type: "ctaBlock", group: "footer" }),

    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "For Partners", subtitle: "/for-partners" }) },
});
