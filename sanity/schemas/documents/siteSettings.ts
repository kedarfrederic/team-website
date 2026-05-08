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
        "Top-level nav dropdowns (Product / Solutions / Resources). Each has 2 column groups + a right-side promo card.",
      of: [
        {
          type: "object",
          name: "navGroup",
          fields: [
            defineField({ name: "label", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "columns",
              title: "Column groups",
              type: "array",
              description: "2 columns inside the dropdown — each has an uppercase label and 2-3 links.",
              of: [
                {
                  type: "object",
                  name: "navColumn",
                  fields: [
                    defineField({ name: "label", type: "string", description: "Small uppercase label above the links (e.g. \"Platform\", \"Extend\", \"By role\")." }),
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
                  ],
                  preview: { select: { title: "label" } },
                },
              ],
              validation: (Rule) => Rule.max(4),
            }),
            defineField({
              name: "links",
              title: "Legacy flat links",
              type: "array",
              hidden: true,
              of: [
                {
                  type: "object",
                  name: "navLink",
                  fields: [
                    defineField({ name: "label", type: "string" }),
                    defineField({ name: "description", type: "string" }),
                    defineField({ name: "href", type: "string" }),
                  ],
                },
              ],
            }),
            defineField({
              name: "promoCard",
              title: "Promo card (right side of dropdown)",
              type: "object",
              fields: [
                defineField({ name: "kicker", type: "string", description: "Small uppercase label (e.g. \"Get started\")." }),
                defineField({ name: "headline", type: "string" }),
                defineField({ name: "body", type: "text", rows: 2 }),
                defineField({ name: "ctaLabel", type: "string" }),
                defineField({ name: "ctaHref", type: "string" }),
              ],
            }),
            defineField({
              name: "featuredCard",
              title: "Legacy featured card",
              type: "object",
              hidden: true,
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
      name: "navStatus",
      title: "Nav status indicator",
      type: "object",
      group: "nav",
      description: "Small dot + label on the left side of the nav (e.g. \"Operational\").",
      fields: [
        defineField({ name: "label", type: "string", initialValue: "Operational" }),
        defineField({ name: "href", type: "string", initialValue: "#status" }),
      ],
    }),
    defineField({
      name: "navPricingLink",
      title: "Nav pricing link (right side)",
      type: "object",
      group: "nav",
      fields: [
        defineField({ name: "label", type: "string", initialValue: "Pricing" }),
        defineField({ name: "href", type: "string", initialValue: "/pricing" }),
      ],
    }),
    defineField({
      name: "navLogin",
      title: "Nav login link (right side)",
      type: "object",
      group: "nav",
      fields: [
        defineField({ name: "label", type: "string", initialValue: "Login" }),
        defineField({ name: "href", type: "string" }),
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
