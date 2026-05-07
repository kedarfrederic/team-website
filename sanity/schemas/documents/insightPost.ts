import { defineType, defineField } from "sanity";

export const insightPost = defineType({
  name: "insightPost",
  title: "Insight (blog post)",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Meta + SEO" },
  ],
  fields: [
    // ── Content ───────────────────────────────────────────────
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description: "1–2 sentences. Shown on the insights index card.",
      validation: (Rule) => Rule.max(280),
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "insightCategory" }],
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImage",
      type: "image",
      group: "content",
      options: { hotspot: true },
      description: "Used on the post page header AND as the index card thumbnail.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({ name: "href", type: "url", validation: (R) => R.required() }),
                  defineField({
                    name: "openInNew",
                    type: "boolean",
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        },
        { type: "image", options: { hotspot: true } },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaOverride",
      title: "Override end-of-post CTA",
      type: "ctaBlock",
      group: "content",
      description: "Optional. If blank, the post uses the global insight CTA from siteSettings.",
    }),
    defineField({
      name: "relatedPosts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "insightPost" }] }],
      group: "content",
      validation: (Rule) => Rule.max(3),
      description: "Up to 3 related posts shown at the bottom.",
    }),

    // ── Meta + SEO ────────────────────────────────────────────
    defineField({
      name: "authorName",
      type: "string",
      group: "meta",
      initialValue: "Team",
    }),
    defineField({
      name: "publishDate",
      type: "datetime",
      group: "meta",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "readMinutes",
      title: "Read time (minutes)",
      type: "number",
      group: "meta",
      validation: (Rule) => Rule.min(1).integer(),
    }),
    defineField({
      name: "seo",
      type: "seoBlock",
      group: "meta",
    }),
  ],
  orderings: [
    {
      title: "Published (newest first)",
      name: "publishDateDesc",
      by: [{ field: "publishDate", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category.title", media: "heroImage" },
  },
});
