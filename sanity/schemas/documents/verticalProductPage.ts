import { defineType, defineField } from "sanity";

/**
 * Vertical product page template — used by /intelligence and /orchestration.
 *
 * Same shape with two singleton instances (documentId = "intelligencePage"
 * or "orchestrationPage"). The `verticalKey` field picks which one this
 * document represents and drives URL routing in Astro.
 *
 * Sections: hero · scroll-reveal problem section · pain rows · 4-tab
 * spotlight (16 mocks) · trust callout · final CTA · roles grid.
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
      ],
    }),

    // ── Scroll-reveal problem section ─────────────────────────
    defineField({
      name: "problemSection",
      title: "Scroll-reveal problem section",
      type: "object",
      group: "sections",
      description: "3 paragraphs animated word-by-word as the user scrolls.",
      fields: [
        defineField({ name: "headline", type: "string" }),
        defineField({
          name: "paragraphs",
          type: "array",
          of: [{ type: "text", rows: 4 }],
          validation: (Rule) => Rule.min(1).max(5),
        }),
      ],
    }),

    defineField({ name: "painSection", type: "painSection", group: "sections" }),

    // ── 4-tab spotlight ──────────────────────────────────────
    defineField({
      name: "tabbedSpotlight",
      title: "4-tab feature spotlight",
      type: "object",
      group: "sections",
      description:
        "4 tabs (Planning / Mid-Campaign / Post-Release / At Scale on Intelligence; or your equivalent for Orchestration), each with 4 features + a preview mock.",
      fields: [
        defineField({ name: "headline", type: "string", validation: (R) => R.required() }),
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
                defineField({
                  name: "previewMock",
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

    // ── Trust callout ────────────────────────────────────────
    defineField({
      name: "trustCallout",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headline", type: "string" }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({ name: "ctaLabel", type: "string", initialValue: "Read security overview" }),
        defineField({ name: "ctaHref", type: "string", initialValue: "/security" }),
      ],
    }),

    defineField({ name: "rolesGrid", type: "rolesGrid", group: "sections" }),

    // ── Bottom of page ────────────────────────────────────────
    defineField({ name: "finalCta", type: "ctaBlock", group: "footer" }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: {
    select: { verticalKey: "verticalKey", headline: "hero.headline" },
    prepare: ({ verticalKey, headline }) => ({
      title: verticalKey === "intelligence" ? "Intelligence" : verticalKey === "orchestration" ? "Orchestration" : "Vertical page",
      subtitle: headline,
    }),
  },
});
