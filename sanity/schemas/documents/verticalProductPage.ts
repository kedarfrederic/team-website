import { defineType, defineField } from "sanity";

/**
 * Vertical product page template — used by /intelligence and /orchestration.
 *
 * Same shape with two singleton instances. The `verticalKey` field picks
 * which one this document represents.
 */
export const verticalProductPage = defineType({
  name: "verticalProductPage",
  title: "Vertical product page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Page sections" },
    { name: "footer", title: "Bottom of page" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "verticalKey",
      type: "string",
      options: {
        list: [
          { title: "Intelligence (TeamMate AI)", value: "intelligence" },
          { title: "Orchestration (release platform)", value: "orchestration" },
        ],
        layout: "radio",
      },
      readOnly: true,
    }),

    defineField({
      name: "hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "pillLabel", type: "string" }),
        defineField({ name: "headlineTop", type: "string", description: "First line — sans font." }),
        defineField({ name: "headlineBottom", type: "string", description: "Second line — serif italic (Nyght)." }),
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

    defineField({
      name: "problemSection",
      title: "Scroll-reveal problem section",
      type: "object",
      group: "sections",
      description: "3 paragraphs animated word-by-word as the user scrolls.",
      fields: [
        defineField({ name: "headlineTop", type: "string" }),
        defineField({ name: "headlineBottom", type: "string" }),
        defineField({
          name: "paragraphs",
          type: "array",
          of: [{ type: "text", rows: 4 }],
          validation: (Rule) => Rule.min(1).max(5),
        }),
      ],
    }),

    defineField({ name: "painSection", type: "painSection", group: "sections" }),

    defineField({
      name: "featureSpotlight",
      title: "6-card feature spotlight",
      type: "object",
      group: "sections",
      description: "6 feature cards with title + description (used on /orchestration). Preview panels are hardcoded product illustrations keyed by card index.",
      fields: [
        defineField({ name: "headlineTop", type: "string" }),
        defineField({ name: "headlineBottom", type: "string", description: "Italic Nyght-serif phrase." }),
        defineField({ name: "subhead", type: "text", rows: 2 }),
        defineField({
          name: "cards",
          type: "array",
          of: [{ type: "featureCard" }],
          validation: (Rule) => Rule.min(1).max(6),
        }),
      ],
    }),

    defineField({
      name: "tabbedSpotlight",
      title: "4-tab feature spotlight",
      type: "object",
      group: "sections",
      description:
        "4 tabs (Planning / Mid-Campaign / Post-Release / At Scale on Intelligence; Build / Coordinate / Track / Optimize on Orchestration), each with 4 features.",
      fields: [
        defineField({ name: "headlineTop", type: "string" }),
        defineField({ name: "headlineBottom", type: "string" }),
        defineField({ name: "subhead", type: "text", rows: 2 }),
        defineField({
          name: "tabs",
          type: "array",
          of: [
            {
              type: "object",
              name: "spotlightTab",
              fields: [
                defineField({ name: "label", type: "string", validation: (R) => R.required() }),
                defineField({
                  name: "tabKey",
                  type: "string",
                  description:
                    "Stable id matching the mock fixtures (e.g. plan, mid, post, scale on intelligence).",
                }),
                defineField({
                  name: "features",
                  type: "array",
                  of: [
                    {
                      type: "object",
                      name: "spotlightFeature",
                      fields: [
                        defineField({ name: "title", type: "string", validation: (R) => R.required() }),
                        defineField({ name: "description", type: "text", rows: 3 }),
                      ],
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

    defineField({
      name: "trustCallout",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string" }),
        defineField({ name: "headlineBottom", type: "string" }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({ name: "ctaLabel", type: "string", initialValue: "Read security overview" }),
        defineField({ name: "ctaHref", type: "string", initialValue: "/security" }),
      ],
    }),

    defineField({
      name: "bridgeSection",
      title: "Bridge to other product",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string" }),
        defineField({ name: "headlineBottom", type: "string" }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({ name: "ctaLabel", type: "string" }),
        defineField({ name: "ctaHref", type: "string" }),
      ],
    }),

    defineField({ name: "rolesGrid", type: "rolesGrid", group: "sections" }),

    defineField({ name: "finalCta", type: "ctaBlock", group: "footer" }),

    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: {
    select: { verticalKey: "verticalKey", headlineTop: "hero.headlineTop" },
    prepare: ({ verticalKey, headlineTop }) => ({
      title: verticalKey === "intelligence" ? "Intelligence" : verticalKey === "orchestration" ? "Orchestration" : "Vertical page",
      subtitle: headlineTop,
    }),
  },
});
