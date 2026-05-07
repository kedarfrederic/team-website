import { defineType, defineField } from "sanity";

/**
 * Fake chat thread shown in TeamMate AI feature illustrations.
 * Alternating sender/assistant messages.
 */
export const mockChat = defineType({
  name: "mockChat",
  title: "Mock — Chat conversation",
  type: "object",
  fields: [
    defineField({
      name: "headerLabel",
      type: "string",
      description: "Top-of-card label (e.g. \"TeamMate\").",
    }),
    defineField({
      name: "messages",
      type: "array",
      of: [
        {
          type: "object",
          name: "chatMessage",
          fields: [
            defineField({
              name: "from",
              type: "string",
              options: {
                list: [
                  { title: "User", value: "user" },
                  { title: "TeamMate (assistant)", value: "assistant" },
                ],
                layout: "radio",
              },
              initialValue: "user",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "text",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "richBody",
              title: "Rich body (optional)",
              type: "array",
              of: [{ type: "block" }],
              description: "Use instead of text when the message needs lists or bold.",
            }),
          ],
          preview: {
            select: { title: "text", subtitle: "from" },
            prepare: ({ title, subtitle }) => ({
              title: title?.toString().slice(0, 60) ?? "(empty)",
              subtitle: subtitle === "assistant" ? "→ TeamMate" : "← User",
            }),
          },
        },
      ],
      validation: (Rule) => Rule.min(2).max(10),
    }),
  ],
  preview: {
    select: { count: "messages" },
    prepare: ({ count }) => ({
      title: "Mock — Chat",
      subtitle: `${(count as unknown[] | undefined)?.length ?? 0} messages`,
    }),
  },
});
