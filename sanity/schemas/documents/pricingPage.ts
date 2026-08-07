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
          name: "note",
          type: "string",
          description: "Small mono label under the billing toggle (e.g. \"Take advantage of our limited-time Beta pricing today\").",
        }),
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
              description:
                "Period label shown with the YEARLY price (e.g. \"/mo · billed yearly\", \"forever\").",
              initialValue: "/mo",
            }),
            defineField({
              name: "periodMonthly",
              type: "string",
              description:
                "Period label shown with the MONTHLY price (e.g. \"/mo\"). Leave blank to reuse the yearly label — only set this when the two differ, otherwise the monthly view can contradict itself (\"/mo · billed yearly\" while Monthly is selected).",
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
              // Objects only — Sanity REJECTS an `of` that mixes primitive and
              // object types ("can't have both object types and primitive
              // types"), which fails `sanity schema validate` and breaks
              // manifest extraction on deploy. The live document was migrated
              // to tierFeature objects by seed-pricing-v2-copy.ts. The page's
              // normalizeFeatures() still accepts bare strings defensively, so
              // restoring an older revision degrades gracefully rather than
              // rendering empty bullets.
              of: [
                {
                  type: "object",
                  name: "tierFeature",
                  title: "Feature",
                  fields: [
                    defineField({ name: "text", type: "string", validation: (R) => R.required() }),
                    defineField({
                      name: "pro",
                      type: "boolean",
                      title: "Pro-only line",
                      description: "Renders the ✦ bullet instead of ✓ — used for Pro-tier additions.",
                      initialValue: false,
                    }),
                  ],
                  preview: {
                    select: { title: "text", pro: "pro" },
                    prepare: ({ title, pro }: { title?: string; pro?: boolean }) => ({
                      title: title || "(empty)",
                      subtitle: pro ? "✦ Pro-only" : "✓ included",
                    }),
                  },
                },
              ],
              description:
                "Bulleted feature list shown under the price. Each line renders a ✓ bullet — tick \"Pro-only line\" to render ✦ instead (used for the Pro tier's additions).",
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
            defineField({
              name: "priceWasMonthly",
              type: "string",
              description: "Optional strikethrough \"was\" price shown next to the current monthly price (beta/launch discount display). Leave blank to hide.",
            }),
            defineField({
              name: "priceWasYearly",
              type: "string",
              description: "Optional strikethrough \"was\" price shown next to the current yearly price. Leave blank to hide.",
            }),
            defineField({
              name: "seatsIncludedNote",
              type: "string",
              description: "1-line seat summary shown below the price (e.g. \"1 seat · unlimited artists, releases & collaborators\").",
            }),
            defineField({
              name: "extraSeatPriceMonthly",
              type: "string",
              description: "Per-extra-seat monthly price (e.g. \"$29.95/mo\"). Leave blank if this tier doesn't sell extra seats.",
            }),
            defineField({
              name: "extraSeatPriceYearly",
              type: "string",
              description: "Per-extra-seat yearly-billed price (e.g. \"$23.96/mo\").",
            }),
            defineField({
              name: "extraSeatWasMonthly",
              type: "string",
              description: "Optional strikethrough \"was\" price for an extra seat, monthly billing.",
            }),
            defineField({
              name: "extraSeatWasYearly",
              type: "string",
              description: "Optional strikethrough \"was\" price for an extra seat, yearly billing.",
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
                  name: "isGroupHeader",
                  type: "boolean",
                  description: "Render this row as a section divider (e.g. \"The platform\", \"The brain — Pro\") spanning all columns, instead of a normal comparison row. When true, tooltip/valueByColumn are ignored.",
                  initialValue: false,
                }),
                defineField({
                  name: "tooltip",
                  type: "string",
                  description: "Optional helper tooltip shown on hover.",
                  hidden: ({ parent }) => !!parent?.isGroupHeader,
                }),
                defineField({
                  name: "valueByColumn",
                  type: "array",
                  description: "One entry per column (matches columns above).",
                  hidden: ({ parent }) => !!parent?.isGroupHeader,
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
