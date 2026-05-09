import { defineType, defineField } from "sanity";

/**
 * Polymorphic mock-illustration panel used inside the intelligence /
 * orchestration / homepage product demos. Each panel has a `kind`
 * discriminator and per-kind content fields. Studio's `hidden`
 * conditional on each per-kind block means editors only see the
 * fields relevant to whatever variant they picked.
 */
export const mockPanel = defineType({
  name: "mockPanel",
  title: "Mock illustration panel",
  type: "object",
  fields: [
    defineField({
      name: "kind",
      type: "string",
      validation: (R) => R.required(),
      options: {
        list: [
          { title: "Chat (TeamMate AI conversation)", value: "chat" },
          { title: "Dashboard (4 stat tiles)", value: "dashboard" },
          { title: "Budget bars", value: "budget" },
          { title: "Timeline rows", value: "timeline" },
          { title: "Checklist", value: "checklist" },
          { title: "Tasks (label + status pill)", value: "tasks" },
          { title: "Alerts list", value: "alerts" },
          { title: "Report (title + stats)", value: "report" },
          { title: "Command grid (artist cards)", value: "command" },
        ],
        layout: "dropdown",
      },
    }),

    // ── chat ─────────────────────────────────────────
    defineField({
      name: "chatRows",
      title: "Chat rows",
      type: "array",
      hidden: ({ parent }) => parent?.kind !== "chat",
      of: [
        {
          type: "object",
          name: "mockChatRow",
          fields: [
            defineField({
              name: "side",
              type: "string",
              options: {
                list: [
                  { title: "User (right, dark bubble)", value: "user" },
                  { title: "AI (left, with avatar)", value: "ai" },
                ],
                layout: "radio",
              },
              initialValue: "user",
            }),
            defineField({
              name: "text",
              type: "text",
              rows: 3,
              validation: (R) => R.required(),
            }),
          ],
          preview: { select: { title: "text", subtitle: "side" } },
        },
      ],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: "chatInputPlaceholder",
      type: "string",
      hidden: ({ parent }) => parent?.kind !== "chat",
      initialValue: "Ask TeamMate anything...",
    }),

    // ── dashboard ────────────────────────────────────
    defineField({
      name: "dashboardCards",
      title: "Dashboard cards (2x2 grid)",
      type: "array",
      hidden: ({ parent }) => parent?.kind !== "dashboard",
      of: [
        {
          type: "object",
          name: "mockDashboardCard",
          fields: [
            defineField({ name: "title", type: "string", validation: (R) => R.required() }),
            defineField({ name: "value", type: "string", validation: (R) => R.required() }),
            defineField({ name: "pillLabel", type: "string" }),
            defineField({
              name: "pillTone",
              type: "string",
              options: {
                list: [
                  { title: "Green", value: "green" },
                  { title: "Blue", value: "blue" },
                  { title: "Amber", value: "amber" },
                  { title: "Red", value: "red" },
                ],
                layout: "dropdown",
              },
              initialValue: "green",
            }),
          ],
          preview: { select: { title: "title", subtitle: "value" } },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // ── budget ───────────────────────────────────────
    defineField({
      name: "budgetBars",
      title: "Budget bars",
      type: "array",
      hidden: ({ parent }) => parent?.kind !== "budget",
      of: [
        {
          type: "object",
          name: "mockBudgetBar",
          fields: [
            defineField({ name: "label", type: "string", validation: (R) => R.required() }),
            defineField({ name: "value", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "percent",
              type: "number",
              description: "Bar fill percentage (0–100).",
              validation: (R) => R.min(0).max(100),
              initialValue: 50,
            }),
            defineField({
              name: "color",
              type: "string",
              options: {
                list: [
                  { title: "Blue", value: "blue" },
                  { title: "Purple", value: "purple" },
                  { title: "Green", value: "green" },
                  { title: "Orange", value: "orange" },
                  { title: "Red", value: "red" },
                ],
                layout: "dropdown",
              },
              initialValue: "blue",
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: "budgetTotalLeft",
      type: "string",
      description: "Optional left total (e.g. \"vs Target\").",
      hidden: ({ parent }) => parent?.kind !== "budget",
    }),
    defineField({
      name: "budgetTotalRight",
      type: "string",
      description: "Optional right total (e.g. \"Week 2 of 4\").",
      hidden: ({ parent }) => parent?.kind !== "budget",
    }),
    defineField({
      name: "budgetSuggestion",
      type: "text",
      rows: 2,
      description: "Optional suggestion card under the bars (renders bold-prefix + body).",
      hidden: ({ parent }) => parent?.kind !== "budget",
    }),
    defineField({
      name: "budgetSuggestionPrefix",
      type: "string",
      description: "Bold prefix for suggestion (e.g. \"Suggested:\").",
      hidden: ({ parent }) => parent?.kind !== "budget",
      initialValue: "Suggested:",
    }),

    // ── timeline ─────────────────────────────────────
    defineField({
      name: "timelineRows",
      title: "Timeline rows",
      type: "array",
      hidden: ({ parent }) => parent?.kind !== "timeline",
      of: [
        {
          type: "object",
          name: "mockTimelineRow",
          fields: [
            defineField({ name: "label", type: "string", validation: (R) => R.required() }),
            defineField({ name: "leftPct", type: "number", initialValue: 10, validation: (R) => R.min(0).max(100) }),
            defineField({ name: "widthPct", type: "number", initialValue: 30, validation: (R) => R.min(0).max(100) }),
            defineField({
              name: "color",
              type: "string",
              options: {
                list: [
                  { title: "Orange", value: "orange" },
                  { title: "Blue", value: "blue" },
                  { title: "Purple", value: "purple" },
                  { title: "Pink", value: "pink" },
                  { title: "Green", value: "green" },
                  { title: "Yellow", value: "yellow" },
                ],
                layout: "dropdown",
              },
              initialValue: "orange",
            }),
          ],
          preview: { select: { title: "label", subtitle: "color" } },
        },
      ],
      validation: (Rule) => Rule.max(8),
    }),

    // ── checklist ────────────────────────────────────
    defineField({
      name: "checklistItems",
      title: "Checklist items",
      type: "array",
      hidden: ({ parent }) => parent?.kind !== "checklist",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(8),
    }),

    // ── tasks ────────────────────────────────────────
    defineField({
      name: "tasksRows",
      title: "Task rows",
      type: "array",
      hidden: ({ parent }) => parent?.kind !== "tasks",
      of: [
        {
          type: "object",
          name: "mockTaskRow",
          fields: [
            defineField({ name: "label", type: "string", validation: (R) => R.required() }),
            defineField({ name: "status", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "statusTone",
              type: "string",
              options: {
                list: [
                  { title: "Green", value: "green" },
                  { title: "Blue", value: "blue" },
                  { title: "Amber", value: "amber" },
                  { title: "Red", value: "red" },
                ],
                layout: "dropdown",
              },
              initialValue: "green",
            }),
          ],
          preview: { select: { title: "label", subtitle: "status" } },
        },
      ],
      validation: (Rule) => Rule.max(8),
    }),

    // ── alerts ───────────────────────────────────────
    defineField({
      name: "alertItems",
      title: "Alert items",
      type: "array",
      hidden: ({ parent }) => parent?.kind !== "alerts",
      of: [
        {
          type: "object",
          name: "mockAlert",
          fields: [
            defineField({ name: "text", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "dotTone",
              type: "string",
              options: {
                list: [
                  { title: "Green", value: "green" },
                  { title: "Amber", value: "amber" },
                  { title: "Red", value: "red" },
                ],
                layout: "dropdown",
              },
              initialValue: "green",
            }),
          ],
          preview: { select: { title: "text", subtitle: "dotTone" } },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // ── report ───────────────────────────────────────
    defineField({
      name: "reportTitle",
      type: "string",
      hidden: ({ parent }) => parent?.kind !== "report",
    }),
    defineField({
      name: "reportDateLabel",
      type: "string",
      hidden: ({ parent }) => parent?.kind !== "report",
    }),
    defineField({
      name: "reportStats",
      type: "array",
      hidden: ({ parent }) => parent?.kind !== "report",
      of: [
        {
          type: "object",
          name: "mockReportStat",
          fields: [
            defineField({ name: "value", type: "string", validation: (R) => R.required() }),
            defineField({ name: "label", type: "string", validation: (R) => R.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // ── command (artist cards) ───────────────────────
    defineField({
      name: "commandCards",
      title: "Command cards",
      type: "array",
      hidden: ({ parent }) => parent?.kind !== "command",
      of: [
        {
          type: "object",
          name: "mockCommandCard",
          fields: [
            defineField({ name: "artist", type: "string", validation: (R) => R.required() }),
            defineField({ name: "release", type: "string", validation: (R) => R.required() }),
            defineField({ name: "status", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "statusTone",
              type: "string",
              options: {
                list: [
                  { title: "Green (On Track)", value: "green" },
                  { title: "Amber (At Risk)", value: "amber" },
                  { title: "Blue (Planning)", value: "blue" },
                  { title: "Red (Late)", value: "red" },
                ],
                layout: "dropdown",
              },
              initialValue: "green",
            }),
          ],
          preview: { select: { title: "artist", subtitle: "release" } },
        },
      ],
      validation: (Rule) => Rule.max(8),
    }),
  ],
  preview: {
    select: { kind: "kind" },
    prepare: ({ kind }) => ({ title: kind ? `${kind} mock` : "Mock panel (kind not set)" }),
  },
});
