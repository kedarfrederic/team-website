import { defineType, defineField } from "sanity";

/**
 * ICP role page template — ONE schema, THREE singleton instances
 * (for-artists, for-labels, for-managers). For-partners uses a separate
 * `partnerPage` schema because of its tabbed feature spotlight variant.
 *
 * Singleton instances are pinned in the desk structure; editors can't
 * accidentally create new ICP pages with this type.
 */
export const icpPage = defineType({
  name: "icpPage",
  title: "ICP role page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Page sections" },
    { name: "footer", title: "Bottom of page" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "icpKey",
      title: "ICP key",
      type: "string",
      options: {
        list: [
          { title: "Artists", value: "artists" },
          { title: "Labels", value: "labels" },
          { title: "Managers", value: "managers" },
        ],
        layout: "radio",
      },
      readOnly: true,
      description: "Set on document creation; used to wire URL routing in Astro.",
    }),

    // ── Hero ──────────────────────────────────────────────────
    defineField({
      name: "hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "pillLabel", type: "string", description: "Small uppercase pill above the headline." }),
        defineField({ name: "headline", type: "string", validation: (R) => R.required() }),
        defineField({ name: "subhead", type: "text", rows: 3 }),
        defineField({
          name: "primaryCta",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (R) => R.required() }),
            defineField({ name: "href", type: "string", validation: (R) => R.required() }),
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
    defineField({ name: "featureSpotlight", type: "featureSpotlight", group: "sections" }),
    defineField({ name: "stepsBlock", type: "stepsBlock", group: "sections" }),
    defineField({ name: "rolesGrid", title: "Cross-link to other ICPs", type: "rolesGrid", group: "sections" }),

    // ── Bottom of page ────────────────────────────────────────
    defineField({ name: "finalCta", type: "ctaBlock", group: "footer" }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: {
    select: { icpKey: "icpKey", headline: "hero.headline" },
    prepare: ({ icpKey, headline }) => ({
      title: `For ${icpKey ?? "(unset)"}`,
      subtitle: headline ?? "(no headline)",
    }),
  },
});
