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
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          description:
            "Small uppercase label above the headline (e.g. \"The operating system for music releases\"). Leave blank to hide.",
          initialValue: "The operating system for music releases",
        }),
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
        "Scroll-driven product demo: releases grid → loading → timeline view + TeamMate chat panel. All labels, release names, chat prompts, and card artwork are editable so marketing can iterate the demo content.",
      fields: [
        defineField({
          name: "interactive",
          type: "boolean",
          title: "Use interactive Releases demo",
          description: "When true, embeds the real Releases dashboard demo via iframe (lifted from the platform). When false, renders the legacy static SVG-illustrated mock release grid + timeline view.",
          initialValue: true,
        }),
        defineField({
          name: "iframeSrc",
          type: "string",
          title: "Demo iframe base path",
          description: "Base PATH (no trailing slash) for the high-fidelity Tour HTML demos. The component loads `${path}/Releases.html` for the dashboard view and `${path}/Timeline.html` for the timeline view, crossfading between them on scroll. Default: `/dashboard-tour`.",
          initialValue: "/dashboard-tour",
          hidden: ({ parent }) => !parent?.interactive,
        }),
        defineField({ name: "headlineTop", type: "string", description: "Optional marketing headline above the demo — first line, sans font." }),
        defineField({ name: "headlineBottom", type: "string", description: "Optional marketing headline above the demo — second line, serif italic (Nyght)." }),
        defineField({ name: "subhead", type: "text", rows: 2, description: "Optional marketing subhead above the demo." }),
        defineField({ name: "headline", type: "string", description: "Legacy single-line headline.", hidden: true }),

        // ── Sidebar / nav copy ─────────────────────────────────
        defineField({
          name: "sidebar",
          title: "Sidebar (fake-app left rail)",
          type: "object",
          fields: [
            defineField({ name: "searchPlaceholder", type: "string", initialValue: "Search releases..." }),
            defineField({ name: "navCommandCenter", type: "string", initialValue: "Command Center" }),
            defineField({ name: "navRecents", type: "string", initialValue: "Recents" }),
            defineField({ name: "navArtists", type: "string", initialValue: "Artists" }),
            defineField({ name: "navPressRuns", type: "string", initialValue: "Press Runs" }),
            defineField({ name: "navTouring", type: "string", initialValue: "Touring" }),
            defineField({ name: "yourReleasesLabel", type: "string", initialValue: "Your Releases" }),
            defineField({ name: "allReleasesLabel", type: "string", initialValue: "All Releases" }),
            defineField({ name: "allReleasesCount", type: "string", initialValue: "99" }),
            defineField({ name: "inProgressLabel", type: "string", initialValue: "In Progress" }),
            defineField({ name: "inProgressCount", type: "string", initialValue: "61" }),
            defineField({ name: "releasedLabel", type: "string", initialValue: "Released" }),
            defineField({ name: "releasedCount", type: "string", initialValue: "38" }),
          ],
        }),

        // ── Content header (Releases / + Add Artist / + New Release / tabs) ───
        defineField({
          name: "contentHeader",
          title: "Content area header",
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", initialValue: "Releases" }),
            defineField({ name: "addArtistLabel", type: "string", initialValue: "+ Add Artist" }),
            defineField({ name: "newReleaseLabel", type: "string", initialValue: "+ New Release" }),
            defineField({ name: "tabAll", type: "string", initialValue: "All Releases" }),
            defineField({ name: "tabInProgress", type: "string", initialValue: "In Progress" }),
            defineField({ name: "tabReleased", type: "string", initialValue: "Released" }),
          ],
        }),

        // ── Demo release cards ─────────────────────────────────
        defineField({
          name: "demoReleases",
          title: "Demo release cards (9 max)",
          type: "array",
          of: [
            {
              type: "object",
              name: "demoRelease",
              fields: [
                defineField({ name: "title", type: "string", validation: (R) => R.required() }),
                defineField({ name: "artist", type: "string" }),
                defineField({ name: "releaseDate", type: "string", description: "Display label (e.g. \"29 May 2026\")." }),
                defineField({
                  name: "status",
                  type: "string",
                  options: { list: ["Planning", "In progress", "Pre-release", "Released", "Active"] },
                }),
                defineField({ name: "progressPercent", type: "number", validation: (Rule) => Rule.min(0).max(100) }),
                defineField({
                  name: "artwork",
                  type: "image",
                  options: { hotspot: true },
                  description: "Card artwork. If empty, falls back to the legacy SVG illustration.",
                }),
              ],
              preview: { select: { title: "title", subtitle: "artist", media: "artwork" } },
            },
          ],
          validation: (Rule) => Rule.max(12),
        }),

        // ── TeamMate chat overlay ──────────────────────────────
        defineField({
          name: "chat",
          title: "TeamMate chat overlay",
          type: "object",
          fields: [
            defineField({ name: "online", type: "string", initialValue: "ONLINE" }),
            defineField({ name: "userTimestamp", type: "string", initialValue: "You · 2m ago" }),
            defineField({ name: "userMessage", type: "text", rows: 2, initialValue: "Plan a comprehensive pre-release strategy focused on fan engagement" }),
            defineField({ name: "aiTimestamp", type: "string", initialValue: "TeamMate · just now" }),
            defineField({ name: "aiPrefix", type: "string", description: "Text before the bold task count (e.g. \"Done. I've added\").", initialValue: "Done. I've added" }),
            defineField({ name: "aiTaskCount", type: "string", description: "Bold count (e.g. \"6 tasks\").", initialValue: "6 tasks" }),
            defineField({ name: "aiSuffix", type: "text", rows: 2, description: "Text after the bold task count.", initialValue: "to the Arcadia timeline covering social teasers, playlist pitch, press run, and launch week." }),
            defineField({
              name: "categoryPills",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "categoryPill",
                  fields: [
                    defineField({ name: "label", type: "string" }),
                    defineField({
                      name: "color",
                      type: "string",
                      options: {
                        list: [
                          { title: "Pink (Social)", value: "pink" },
                          { title: "Green (A&R)", value: "green" },
                          { title: "Orange (Marketing/Events)", value: "orange" },
                          { title: "Blue", value: "blue" },
                          { title: "Purple", value: "purple" },
                        ],
                        layout: "radio",
                      },
                    }),
                  ],
                  preview: { select: { title: "label", subtitle: "color" } },
                },
              ],
              validation: (Rule) => Rule.max(6),
            }),
            defineField({ name: "replyPlaceholder", type: "string", initialValue: "Reply to TeamMate..." }),
          ],
        }),

        // ── Demo timeline (zoomed-in mock — every label, status, task editable) ───
        defineField({
          name: "timelineRelease",
          title: "Timeline · release header",
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", initialValue: "Arcadia" }),
            defineField({ name: "meta", type: "string", description: "Subtitle (e.g. \"Marlowe Sky · Release · 29 May 2026\")", initialValue: "Marlowe Sky · Release · 29 May 2026" }),
            defineField({ name: "artwork", type: "image", description: "Optional artwork override; falls back to the dark gradient SVG." }),
          ],
        }),
        defineField({
          name: "timelineFilters",
          title: "Timeline · filter pills",
          type: "array",
          of: [
            {
              type: "object",
              name: "timelineFilter",
              fields: [
                defineField({ name: "label", type: "string", validation: (R) => R.required() }),
                defineField({ name: "active", type: "boolean", initialValue: false, description: "Active = solid black pill" }),
              ],
              preview: { select: { title: "label", subtitle: "active" } },
            },
          ],
          validation: (Rule) => Rule.max(8),
        }),
        defineField({ name: "timelineWeekLabel", title: "Timeline · week label", type: "string", initialValue: "Week of 13 Mar" }),
        defineField({ name: "timelineWeekSummary", title: "Timeline · week summary", type: "string", initialValue: "11 tasks · 1 late · 3 done" }),
        defineField({
          name: "timelineDays",
          title: "Timeline · 5 day columns",
          type: "array",
          of: [
            {
              type: "object",
              name: "timelineDay",
              fields: [
                defineField({ name: "dayNumber", type: "string", description: "e.g. \"13\"", validation: (R) => R.required() }),
                defineField({ name: "dayLabel", type: "string", description: "e.g. \"Fri\"", validation: (R) => R.required() }),
                defineField({
                  name: "badge",
                  type: "string",
                  description: "Optional badge on the day header (e.g. \"TODAY\", \"RELEASE\").",
                }),
                defineField({
                  name: "badgeStyle",
                  type: "string",
                  options: {
                    list: [
                      { title: "Today (orange on black)", value: "today" },
                      { title: "Release (orange tint)", value: "release" },
                    ],
                    layout: "radio",
                  },
                }),
                defineField({
                  name: "tasks",
                  type: "array",
                  of: [
                    {
                      type: "object",
                      name: "timelineTask",
                      fields: [
                        defineField({
                          name: "status",
                          type: "string",
                          options: {
                            list: [
                              { title: "Done (green)", value: "done" },
                              { title: "Active (orange)", value: "active" },
                              { title: "Late (red)", value: "late" },
                              { title: "Pending (grey)", value: "pending" },
                            ],
                            layout: "radio",
                          },
                          initialValue: "pending",
                        }),
                        defineField({ name: "statusLabel", type: "string", description: "Override the default status text (e.g. \"LATE · 2 DAYS\")." }),
                        defineField({ name: "time", type: "string", description: "e.g. \"9 AM\", \"2 PM\"." }),
                        defineField({ name: "title", type: "string", validation: (R) => R.required() }),
                        defineField({ name: "subtitle", type: "string", description: "Optional second line (e.g. \"28,430 subscribers\")." }),
                        defineField({
                          name: "category",
                          type: "string",
                          description: "Pill label (e.g. \"Marketing\", \"Social\", \"PR\").",
                        }),
                        defineField({
                          name: "categoryColor",
                          type: "string",
                          options: {
                            list: [
                              { title: "Marketing (orange)", value: "marketing" },
                              { title: "Social (pink)", value: "social" },
                              { title: "Distribution (blue)", value: "distribution" },
                              { title: "PR (red)", value: "pr" },
                              { title: "A&R (green)", value: "ar" },
                              { title: "Content (purple)", value: "content" },
                              { title: "Radio (sky)", value: "radio" },
                              { title: "Commerce (lime)", value: "commerce" },
                              { title: "Video (purple)", value: "video" },
                              { title: "Events (orange)", value: "events" },
                            ],
                            layout: "dropdown",
                          },
                        }),
                        defineField({
                          name: "assignees",
                          type: "array",
                          of: [
                            {
                              type: "object",
                              name: "timelineAssignee",
                              fields: [
                                defineField({ name: "initials", type: "string", validation: (R) => R.required().max(3) }),
                                defineField({
                                  name: "color",
                                  type: "string",
                                  options: {
                                    list: [
                                      { title: "Orange/red", value: "orangeRed" },
                                      { title: "Blue/indigo", value: "blueIndigo" },
                                      { title: "Pink/violet", value: "pinkViolet" },
                                      { title: "Cyan/blue", value: "cyanBlue" },
                                      { title: "Orange burst", value: "orangeBurst" },
                                      { title: "Green emerald", value: "greenEmerald" },
                                      { title: "Sky cyan", value: "skyCyan" },
                                      { title: "Lime", value: "lime" },
                                      { title: "Purple/pink", value: "purplePink" },
                                    ],
                                    layout: "dropdown",
                                  },
                                  initialValue: "orangeRed",
                                }),
                              ],
                              preview: { select: { title: "initials", subtitle: "color" } },
                            },
                          ],
                          validation: (Rule) => Rule.max(4),
                        }),
                      ],
                      preview: { select: { title: "title", subtitle: "category" } },
                    },
                  ],
                }),
              ],
              preview: { select: { title: "dayNumber", subtitle: "dayLabel" } },
            },
          ],
          validation: (Rule) => Rule.max(7),
        }),

        defineField({ name: "demoTimeline", title: "Legacy mockTimeline", type: "mockTimeline", hidden: true }),
      ],
    }),

    defineField({
      name: "featureSpotlight",
      type: "featureSpotlight",
      group: "sections",
    }),

    defineField({
      name: "brainSection",
      title: "Brain visualization section",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "headlineTop", type: "string", description: "First line — sans font." }),
        defineField({ name: "headlineBottom", type: "string", description: "Second line — serif italic (Nyght)." }),
        defineField({ name: "headline", type: "string", description: "Legacy single-line headline.", hidden: true }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({
          name: "interactive",
          type: "boolean",
          title: "Use interactive visualization",
          description: "When true, renders the real platform brain graph (live, draggable, zoomable). When false, falls back to the legacy looping video.",
          initialValue: true,
        }),
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
          title: "Marquee logos",
          description: "Up to 40 logos. Provide either an uploaded image OR a logoUrl. Order in the array = order in the marquee.",
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
                  description: "Uploaded logo. If empty, logoUrl is used.",
                }),
                defineField({
                  name: "logoUrl",
                  type: "string",
                  description: "External logo URL (e.g. https://cdn.simpleicons.org/asana). Used when no upload is provided. Many of the seeded logos use simpleicons.org which serves a brand-color SVG by default — append /<hex> to recolor (e.g. /notion/111111).",
                }),
                defineField({
                  name: "title",
                  type: "string",
                  description: "Tooltip / alt text shown on hover.",
                }),
              ],
              preview: { select: { title: "name", subtitle: "logoUrl", media: "logo" } },
            },
          ],
          validation: (Rule) => Rule.max(40),
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
        defineField({ name: "subhead", type: "text", rows: 2, description: "Microcopy beneath the headline (e.g. \"Experience first-hand how Team eliminates the chaos…\")." }),
        defineField({ name: "ctaLabel", type: "string", description: "Primary button label (e.g. \"Start a free trial\")." }),
        defineField({ name: "ctaHref", type: "string", description: "Primary button URL." }),
        defineField({ name: "note", type: "string", description: "Tiny line below the button (e.g. \"No credit card required.\")." }),
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

    // ── Page chrome (side nav, floating CTA, video modal) ────
    defineField({
      name: "chrome",
      title: "Page chrome (side nav · floating CTA · video modal)",
      type: "object",
      group: "footer",
      description: "Persistent UI overlays — vertical section dots, the corner trial button that follows the scroll, and the demo video modal.",
      fields: [
        defineField({
          name: "sideNav",
          title: "Side nav (vertical section dots)",
          type: "object",
          fields: [
            defineField({
              name: "dots",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "sideNavDot",
                  fields: [
                    defineField({ name: "label", type: "string", validation: (R) => R.required() }),
                    defineField({ name: "target", type: "string", description: "DOM id of the section to scroll to (e.g. \"engineSection\").", validation: (R) => R.required() }),
                  ],
                  preview: { select: { title: "label", subtitle: "target" } },
                },
              ],
              validation: (Rule) => Rule.max(12),
            }),
          ],
        }),
        defineField({
          name: "floatingCta",
          title: "Floating CTA (corner trial button)",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", initialValue: "Start a free trial", description: "Shown on the floating button + the floating bar variant." }),
            defineField({ name: "href", type: "string", initialValue: "/pricing" }),
          ],
        }),
        defineField({
          name: "videoModal",
          title: "Video modal (demo player)",
          type: "object",
          fields: [
            defineField({ name: "videoSrc", type: "string", description: "Demo video URL.", initialValue: "/assets/demo.mp4" }),
            defineField({ name: "closeAriaLabel", type: "string", initialValue: "Close video" }),
          ],
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
