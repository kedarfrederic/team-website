import { defineType, defineField } from "sanity";

/**
 * Singleton — there should only ever be ONE siteSettings document.
 * Holds nav structure, footer content, and global SEO defaults.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Hide from "Create new" — the desk structure pins the single instance.
  groups: [
    { name: "nav", title: "Navigation" },
    { name: "footer", title: "Footer" },
    { name: "seo", title: "Default SEO" },
  ],
  fields: [
    // ── Navigation ────────────────────────────────────────────
    defineField({
      name: "navGroups",
      title: "Nav dropdown groups",
      type: "array",
      group: "nav",
      description:
        "Top-level nav dropdowns (e.g. Platform, Extend, By Role, Ecosystem, Learn, Connect). Each group contains links shown when hovered.",
      of: [
        {
          type: "object",
          name: "navGroup",
          fields: [
            defineField({ name: "label", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "links",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "navLink",
                  fields: [
                    defineField({ name: "label", type: "string", validation: (R) => R.required() }),
                    defineField({ name: "description", type: "string" }),
                    defineField({ name: "href", type: "string", validation: (R) => R.required() }),
                  ],
                  preview: { select: { title: "label", subtitle: "href" } },
                },
              ],
            }),
            defineField({
              name: "featuredCard",
              title: "Featured card (optional)",
              type: "object",
              description: "Right-side highlighted card in the dropdown.",
              fields: [
                defineField({ name: "label", type: "string" }),
                defineField({ name: "body", type: "text", rows: 2 }),
                defineField({ name: "ctaLabel", type: "string" }),
                defineField({ name: "ctaHref", type: "string" }),
              ],
            }),
          ],
          preview: { select: { title: "label" } },
        },
      ],
    }),
    defineField({
      name: "navPrimaryCta",
      title: "Nav primary CTA (right side)",
      type: "object",
      group: "nav",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "href", type: "string" }),
      ],
    }),
    defineField({
      name: "navSecondaryCta",
      title: "Nav secondary link (right side)",
      type: "object",
      group: "nav",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "href", type: "string" }),
      ],
    }),

    // ── Footer ────────────────────────────────────────────────
    defineField({
      name: "footerNewsletter",
      title: "Footer newsletter block",
      type: "object",
      group: "footer",
      fields: [
        defineField({ name: "headlineTop", type: "string", initialValue: "Get release intel" }),
        defineField({ name: "headlineBottom", type: "string", description: "Italic Nyght-serif phrase.", initialValue: "in your inbox" }),
        defineField({ name: "body", type: "text", rows: 2, initialValue: "Monthly insights on rollout strategy, industry trends, and how the best teams ship releases. No spam." }),
        defineField({ name: "placeholder", type: "string", initialValue: "you@yourlabel.com" }),
        defineField({ name: "buttonLabel", type: "string", initialValue: "Subscribe" }),
        defineField({ name: "successMessage", type: "string", initialValue: "Thanks for joining us on this wild ride!" }),
      ],
    }),
    defineField({
      name: "footerBrandDescription",
      title: "Footer brand description (under logo)",
      type: "text",
      group: "footer",
      rows: 3,
      initialValue: "The operating system for music releases. Plan, coordinate, and execute your entire rollout from one platform.",
    }),
    defineField({
      name: "footerWordmark",
      title: "Footer wordmark",
      type: "string",
      group: "footer",
      description: "Big script wordmark at very bottom of footer.",
      initialValue: "team",
    }),
    defineField({
      name: "footerColumns",
      title: "Footer columns",
      type: "array",
      group: "footer",
      of: [
        {
          type: "object",
          name: "footerColumn",
          fields: [
            defineField({ name: "heading", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "links",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "footerLink",
                  fields: [
                    defineField({ name: "label", type: "string", validation: (R) => R.required() }),
                    defineField({ name: "href", type: "string", validation: (R) => R.required() }),
                  ],
                  preview: { select: { title: "label" } },
                },
              ],
            }),
          ],
          preview: { select: { title: "heading" } },
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "footer",
      of: [
        {
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: {
                list: [
                  "Twitter",
                  "LinkedIn",
                  "Instagram",
                  "TikTok",
                  "YouTube",
                  "Spotify",
                  "GitHub",
                ].map((v) => ({ title: v, value: v.toLowerCase() })),
              },
            }),
            defineField({ name: "href", type: "string", validation: (R) => R.required() }),
          ],
          preview: { select: { title: "platform", subtitle: "href" } },
        },
      ],
    }),
    defineField({
      name: "footerLegal",
      title: "Footer legal text",
      type: "string",
      group: "footer",
      description: "© text or similar shown at bottom of footer.",
    }),

    // ── Default SEO ───────────────────────────────────────────
    defineField({
      name: "defaultSeo",
      type: "seoBlock",
      group: "seo",
      description:
        "Used when a specific page has no SEO meta of its own. metaTitle here becomes the site-wide template suffix.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings", subtitle: "Nav · Footer · Default SEO" }) },
});
