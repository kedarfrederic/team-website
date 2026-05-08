import { defineType, defineField } from "sanity";

/**
 * Homepage singleton.
 *
 * Mirrors the section sequence of the current homepage.html so editors who
 * know the page can navigate the schema by feel:
 *   1. Hero (typewriter + 3-tile pin)
 *   2. Upload "One platform. One team."
 *   3. Roles tabs (4 tabs × stack rows)
 *   4. Engine / TeamMate search demo
 *   5. Guidelines / AI Assistant demo (releases → timeline)
 *   6. Features spotlight
 *   7. Brain video section
 *   8. Integrations marquee (logos)
 *   9. FAQ
 *  10. Stories carousel (testimonials)
 *  11. Final CTA
 */
export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
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
      title: "Hero section",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "typewriterWords",
          title: "Typewriter words",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Words that cycle in the headline (e.g. \"Command Center\", \"Strategy hub\", \"Single source of truth\"). Order = cycle order.",
          validation: (Rule) => Rule.min(1).max(8),
        }),
        defineField({
          name: "headlineSuffix",
          title: "Headline suffix",
          type: "string",
          description: "Italicized phrase after the typewriter (e.g. \"for your music releases\").",
          initialValue: "for your music releases",
        }),
        defineField({
          name: "subhead",
          type: "text",
          rows: 2,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "primaryCta",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (R) => R.required() }),
            defineField({ name: "href", type: "string", validation: (R) => R.required() }),
          ],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "secondaryCta",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({
              name: "type",
              type: "string",
              options: {
                list: [
                  { title: "Link", value: "link" },
                  { title: "Open video lightbox", value: "video" },
                ],
                layout: "radio",
              },
              initialValue: "link",
            }),
            defineField({
              name: "href",
              type: "string",
              description: "If type = link, the URL. If type = video, the video URL/ID.",
            }),
          ],
        }),
        defineField({
          name: "backgroundImage",
          type: "image",
          options: { hotspot: true },
          description: "Full-bleed hero background.",
        }),
        defineField({
          name: "tileLabels",
          title: "Excerpt tile labels",
          type: "object",
          description: "Labels under the 3 scroll-pinned tiles in the hero.",
          fields: [
            defineField({ name: "left", type: "string", initialValue: "Single" }),
            defineField({ name: "center", type: "string", initialValue: "EP" }),
            defineField({ name: "right", type: "string", initialValue: "Album" }),
          ],
        }),
      ],
    }),

    // ── Sections ──────────────────────────────────────────────
    defineField({
      name: "uploadSection",
      title: "\"One platform. One team.\" section",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string", description: "First line — sans font." }),
        defineField({ name: "headlineBottom", type: "string", description: "Second line — serif italic (Nyght)." }),
        defineField({ name: "headline", type: "string", description: "Legacy single-line headline.", hidden: true }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({
          name: "cta",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({
              name: "type",
              type: "string",
              options: {
                list: [
                  { title: "Link", value: "link" },
                  { title: "Open video lightbox", value: "video" },
                ],
                layout: "radio",
              },
              initialValue: "video",
            }),
            defineField({ name: "href", type: "string" }),
          ],
        }),
      ],
    }),

    defineField({
      name: "rolesTabs",
      title: "Roles tabs section",
      type: "object",
      group: "sections",
      description:
        "4 tabs (Artists / Managers / Labels / Marketing & A&R). Each has a featured item + 3 stack rows + Learn-more link.",
      fields: [
        defineField({
          name: "label",
          type: "string",
          description: "Small uppercase eyebrow above the headline (e.g. \"BUILT FOR EVERY ROLE\").",
        }),
        defineField({
          name: "headlineSuffixA",
          title: "Headline — first italic phrase",
          type: "string",
          description: "Italic phrase rendered between \"From\" and \"to\" (e.g. \"independent artists\").",
        }),
        defineField({
          name: "headlineSuffixB",
          title: "Headline — second italic phrase",
          type: "string",
          description: "Italic phrase rendered after \"to\" (e.g. \"major labels\").",
        }),
        defineField({ name: "headlineTop", type: "string", description: "First line — sans font.", hidden: true }),
        defineField({ name: "headlineBottom", type: "string", description: "Second line — serif italic (Nyght).", hidden: true }),
        defineField({ name: "headline", type: "string", description: "Legacy single-line headline.", hidden: true }),
        defineField({ name: "subhead", type: "text", rows: 2 }),
        defineField({
          name: "tabs",
          type: "array",
          of: [
            {
              type: "object",
              name: "rolesTab",
              fields: [
                defineField({ name: "label", type: "string", validation: (R) => R.required() }),
                defineField({ name: "featuredHeading", type: "string" }),
                defineField({ name: "featuredBody", type: "text", rows: 3 }),
                defineField({
                  name: "stackRows",
                  type: "array",
                  of: [
                    {
                      type: "object",
                      name: "stackRow",
                      fields: [
                        defineField({ name: "number", type: "string" }),
                        defineField({ name: "title", type: "string" }),
                        defineField({ name: "description", type: "text", rows: 2 }),
                      ],
                      preview: { select: { title: "title", subtitle: "number" } },
                    },
                  ],
                  validation: (Rule) => Rule.max(3),
                }),
                defineField({ name: "learnMoreLabel", type: "string" }),
                defineField({ name: "learnMoreHref", type: "string" }),
              ],
              preview: { select: { title: "label" } },
            },
          ],
          validation: (Rule) => Rule.min(1).max(6),
        }),
      ],
    }),

    defineField({
      name: "engineSection",
      title: "Engine / TeamMate search demo",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string", description: "First line of headline — sans font (e.g. \"Find your personal\")." }),
        defineField({ name: "headlineMid", type: "string", description: "Second line, before italic word — sans font (e.g. \"release companion in\")." }),
        defineField({ name: "headlineItalic", type: "string", description: "Italic word at end of headline — Nyght serif (e.g. \"TeamMate\")." }),
        defineField({ name: "headlineBottom", type: "string", description: "Legacy serif-italic bottom line.", hidden: true }),
        defineField({ name: "headline", type: "string", description: "Legacy single-line headline.", hidden: true }),
        defineField({ name: "subhead", type: "text", rows: 2 }),
        defineField({
          name: "searchPlaceholder",
          type: "string",
          description: "Placeholder shown in the fake search bar.",
        }),
        defineField({
          name: "buttonLabel",
          type: "string",
          description: "Label on the search submit button (e.g. \"Ask TeamMate\").",
        }),
        defineField({
          name: "searchDialog",
          type: "string",
          description: "Tooltip shown after submitting the search (e.g. \"To try the search, book a demo\").",
        }),
        defineField({
          name: "ponderingLabel",
          type: "string",
          description: "Loading state label (e.g. \"TeamMate is pondering\").",
          initialValue: "TeamMate is pondering",
        }),
        defineField({
          name: "resultLabels",
          type: "array",
          of: [{ type: "string" }],
          description: "Labels shown on the 6 demo result cards (e.g. \"Portrait_01.jpg\").",
          validation: (Rule) => Rule.max(8),
        }),
      ],
    }),

    defineField({
      name: "guidelinesSection",
      title: "Guidelines / AI Assistant section",
      type: "object",
      group: "sections",
      description:
        "Scroll-driven demo: releases grid → loading → timeline view. Demo data is content-controlled.",
      fields: [
        defineField({ name: "headlineTop", type: "string", description: "First line — sans font." }),
        defineField({ name: "headlineBottom", type: "string", description: "Second line — serif italic (Nyght)." }),
        defineField({ name: "headline", type: "string", description: "Legacy single-line headline.", hidden: true }),
        defineField({ name: "subhead", type: "text", rows: 2 }),
        defineField({
          name: "demoReleases",
          title: "Demo release cards",
          type: "array",
          of: [
            {
              type: "object",
              name: "demoRelease",
              fields: [
                defineField({ name: "title", type: "string", validation: (R) => R.required() }),
                defineField({ name: "artist", type: "string" }),
                defineField({
                  name: "releaseDate",
                  type: "string",
                  description: "Display label (e.g. \"Mar 14\").",
                }),
                defineField({
                  name: "status",
                  type: "string",
                  options: {
                    list: ["Planning", "In progress", "Pre-release", "Released"],
                  },
                }),
                defineField({
                  name: "progressPercent",
                  type: "number",
                  validation: (Rule) => Rule.min(0).max(100),
                }),
              ],
              preview: { select: { title: "title", subtitle: "artist" } },
            },
          ],
          validation: (Rule) => Rule.max(12),
        }),
        defineField({
          name: "demoTimeline",
          title: "Demo timeline (zoomed-in view)",
          type: "mockTimeline",
        }),
      ],
    }),

    defineField({
      name: "featureSpotlight",
      type: "featureSpotlight",
      group: "sections",
    }),

    defineField({
      name: "brainSection",
      title: "Brain video section",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string", description: "First line — sans font." }),
        defineField({ name: "headlineBottom", type: "string", description: "Second line — serif italic (Nyght)." }),
        defineField({ name: "headline", type: "string", description: "Legacy single-line headline.", hidden: true }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({
          name: "video",
          type: "object",
          fields: [
            defineField({
              name: "src",
              type: "string",
              description: "Video URL (R2 / Sanity asset / external CDN).",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "poster",
              type: "image",
              description: "Poster image shown before video plays.",
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "integrationsMarquee",
      title: "Integrations marquee",
      type: "object",
      group: "sections",
      description: "Two-row infinite marquee of integration logos.",
      fields: [
        defineField({ name: "headlineTop", type: "string", description: "First line — sans font." }),
        defineField({ name: "headlineBottom", type: "string", description: "Second line — serif italic (Nyght)." }),
        defineField({ name: "headline", type: "string", description: "Legacy single-line headline.", hidden: true }),
        defineField({ name: "subhead", type: "text", rows: 2 }),
        defineField({
          name: "logos",
          type: "array",
          of: [
            {
              type: "object",
              name: "marqueeLogo",
              fields: [
                defineField({ name: "name", type: "string", validation: (R) => R.required() }),
                defineField({
                  name: "logo",
                  type: "image",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "title",
                  type: "string",
                  description: "Tooltip / alt text shown on hover.",
                }),
              ],
              preview: { select: { title: "name", media: "logo" } },
            },
          ],
          validation: (Rule) => Rule.min(6).max(40),
        }),
      ],
    }),

    defineField({
      name: "faq",
      type: "faqBlock",
      group: "sections",
    }),

    defineField({
      name: "stories",
      title: "Stories / testimonials carousel",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string", description: "First line — sans font." }),
        defineField({ name: "headlineBottom", type: "string", description: "Second line — serif italic (Nyght)." }),
        defineField({ name: "headline", type: "string", description: "Legacy single-line headline.", hidden: true }),
        defineField({
          name: "slides",
          type: "array",
          of: [
            {
              type: "object",
              name: "testimonialSlide",
              fields: [
                defineField({
                  name: "tier",
                  type: "string",
                  options: {
                    list: [
                      { title: "Enterprise", value: "enterprise" },
                      { title: "Team", value: "team" },
                      { title: "Artist", value: "artist" },
                    ],
                    layout: "radio",
                  },
                  initialValue: "team",
                }),
                defineField({ name: "name", type: "string", validation: (R) => R.required() }),
                defineField({ name: "role", type: "string" }),
                defineField({ name: "quote", type: "text", rows: 4, validation: (R) => R.required() }),
                defineField({ name: "photo", type: "image", options: { hotspot: true } }),
              ],
              preview: { select: { title: "name", subtitle: "role", media: "photo" } },
            },
          ],
          validation: (Rule) => Rule.min(1),
        }),
      ],
    }),

    // ── Bottom of page ────────────────────────────────────────
    defineField({
      name: "finalCta",
      type: "ctaBlock",
      group: "footer",
    }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({
      name: "seo",
      type: "seoBlock",
      group: "seo",
    }),
  ],
  preview: { prepare: () => ({ title: "Homepage", subtitle: "/" }) },
});
