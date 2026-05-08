import { defineType, defineField } from "sanity";

/**
 * Pricing page singleton.
 *
 * Sections: hero · billing toggle (yearly/monthly) · 2 tier cards
 * (Free + Pro) with monthly/yearly prices · 18-row comparison table
 * · 4-item FAQ · final CTA.
 */
export const pricingPage = defineType({
  name: "pricingPage",
  title: "Pricing page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "tiers", title: "Tiers" },
    { name: "compare", title: "Comparison table" },
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
        defineField({ name: "headlineTop", type: "string", description: "First line — sans font." }),
        defineField({ name: "headlineBottom", type: "string", description: "Second line — serif italic (Nyght)." }),
        defineField({ name: "headline", type: "string", description: "Legacy single-line headline.", hidden: true }),
        defineField({ name: "subhead", type: "text", rows: 2 }),
        defineField({
          name: "cta",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "href", type: "string" }),
          ],
        }),
      ],
    }),

    // ── Billing toggle copy ───────────────────────────────────
    defineField({
      name: "billingToggle",
      type: "object",
      group: "tiers",
      fields: [
        defineField({ name: "yearlyLabel", type: "string", initialValue: "Yearly" }),
        defineField({ name: "monthlyLabel", type: "string", initialValue: "Monthly" }),
        defineField({
          name: "yearlySaveTag",
          type: "string",
          description: "Badge text shown next to the yearly option.",
          initialValue: "Save ~20%",
        }),
      ],
    }),

    // ── Tiers ─────────────────────────────────────────────────
    defineField({
      name: "tiers",
      type: "array",
      group: "tiers",
      of: [
        {
          type: "object",
          name: "pricingTier",
          fields: [
            defineField({
              name: "tierKey",
              type: "string",
              description: "Stable id (e.g. \"free\", \"pro\"). Used in URL params: /sign-up?plan=<tierKey>.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "name", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "who",
              type: "string",
              description: "1-line description of who this tier is for.",
            }),
            defineField({
              name: "monthlyPrice",
              type: "string",
              description: "Display price (e.g. \"$0\", \"$49\").",
            }),
            defineField({
              name: "yearlyPrice",
              type: "string",
              description: "Display price when billed yearly.",
            }),
            defineField({
              name: "priceMonthlyValue",
              type: "string",
              description:
                "Numeric monthly value used by the toggle JS (e.g. \"24.99\"). Powers data-monthly on the card.",
            }),
            defineField({
              name: "priceYearlyValue",
              type: "string",
              description:
                "Numeric yearly value used by the toggle JS (e.g. \"19.99\"). Powers data-yearly on the card.",
            }),
            defineField({
              name: "priceUnit",
              type: "string",
              description:
                "Unit for toggle pricing (e.g. \"seat\"). Powers data-unit on the card; controls how the \"Then $X/...\" line reads.",
            }),
            defineField({
              name: "period",
              type: "string",
              description: "Period label (e.g. \"/mo\", \"per seat\").",
              initialValue: "/mo",
            }),
            defineField({
              name: "trialNote",
              type: "string",
              description: "Small text near the price (e.g. \"Free 30-day trial\").",
            }),
            defineField({
              name: "thenText",
              type: "string",
              description: "After-trial copy (e.g. \"Then $49/mo\").",
            }),
            defineField({
              name: "billingNote",
              type: "string",
              description: "Billing detail (e.g. \"Billed annually\").",
            }),
            defineField({
              name: "ctaLabel",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "ctaHref",
              type: "string",
              validation: (Rule) => Rule.required(),
              description: "Usually /sign-up?plan=<tierKey>&period=monthly|yearly",
            }),
            defineField({
              name: "includesLabel",
              type: "string",
              description: "\"Includes:\" label above the feature list.",
              initialValue: "Includes:",
            }),
            defineField({
              name: "features",
              type: "array",
              of: [{ type: "string" }],
              description: "Bulleted feature list shown under the price.",
            }),
            defineField({
              name: "badge",
              type: "string",
              description: "Optional badge (e.g. \"Limited time pricing\").",
            }),
            defineField({
              name: "compareLink",
              type: "string",
              description: "Optional anchor link to the comparison table.",
            }),
          ],
          preview: { select: { title: "name", subtitle: "monthlyPrice" } },
        },
      ],
      validation: (Rule) => Rule.min(1).max(4),
    }),

    // ── Comparison table ──────────────────────────────────────
    defineField({
      name: "comparisonTable",
      type: "object",
      group: "compare",
      fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({
          name: "columns",
          type: "array",
          of: [{ type: "string" }],
          description: "Column headers (e.g. [\"Free\", \"Pro\"]). Order matches valueByColumn order in each row.",
          validation: (Rule) => Rule.min(1).max(4),
        }),
        defineField({
          name: "rows",
          type: "array",
          of: [
            {
              type: "object",
              name: "comparisonRow",
              fields: [
                defineField({ name: "label", type: "string", validation: (R) => R.required() }),
                defineField({
                  name: "tooltip",
                  type: "string",
                  description: "Optional helper tooltip shown on hover.",
                }),
                defineField({
                  name: "valueByColumn",
                  type: "array",
                  description: "One entry per column (matches columns above).",
                  of: [
                    {
                      type: "object",
                      name: "comparisonCell",
                      fields: [
                        defineField({
                          name: "type",
                          type: "string",
                          options: {
                            list: [
                              { title: "Check (✓)", value: "check" },
                              { title: "Dash (—)", value: "dash" },
                              { title: "Text", value: "text" },
                            ],
                            layout: "radio",
                          },
                          initialValue: "check",
                        }),
                        defineField({
                          name: "text",
                          type: "string",
                          description: "Only used when type = text (e.g. \"Unlimited\", \"5 GB\").",
                          hidden: ({ parent }) => parent?.type !== "text",
                        }),
                      ],
                      preview: {
                        select: { type: "type", text: "text" },
                        prepare: ({ type, text }) => ({
                          title: type === "text" ? text || "(empty)" : type,
                        }),
                      },
                    },
                  ],
                }),
              ],
              preview: { select: { title: "label" } },
            },
          ],
        }),
      ],
    }),

    // ── FAQ + Final CTA ──────────────────────────────────────
    defineField({ name: "faq", type: "faqBlock", group: "footer" }),
    defineField({ name: "finalCta", type: "ctaBlock", group: "footer" }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({ name: "seo", type: "seoBlock", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Pricing", subtitle: "/pricing" }) },
});
