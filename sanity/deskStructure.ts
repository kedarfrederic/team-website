import type { StructureBuilder } from "sanity/structure";

/**
 * Custom Studio sidebar.
 *
 * Default Sanity sidebar groups by *type* ("All Homepage documents", "All
 * Insight Posts"). For a marketing CMS that's the wrong mental model —
 * editors think in pages, not types. This structure puts each editable page
 * directly in the sidebar (Homepage, Pricing, For Artists, …) and groups
 * collections (Insights, Categories, Site Settings) into a "Library".
 *
 * Add new pages to PAGES_ORDER below. For singletons, use `documentList`-
 * style or pinned `editor` — pattern shown in the Homepage entry.
 */
export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Marketing CMS")
    .items([
      // ── Singleton: Homepage ─────────────────────────────────
      S.listItem()
        .title("Homepage")
        .id("homepage")
        .child(
          S.editor()
            .id("homepage")
            .schemaType("homepage")
            .documentId("homepage")
        ),

      S.divider(),

      // ── Library (collections + global settings) ─────────────
      S.listItem()
        .title("Library")
        .child(
          S.list()
            .title("Library")
            .items([
              S.listItem()
                .title("Insights (blog posts)")
                .schemaType("insightPost")
                .child(
                  S.documentTypeList("insightPost")
                    .title("Insights")
                    .defaultOrdering([{ field: "publishDate", direction: "desc" }])
                ),
              S.listItem()
                .title("Insight categories")
                .schemaType("insightCategory")
                .child(S.documentTypeList("insightCategory").title("Categories")),
              S.divider(),
              S.listItem()
                .title("Site Settings (nav · footer · default SEO)")
                .id("siteSettings")
                .child(
                  S.editor()
                    .id("siteSettings")
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                ),
            ])
        ),
    ]);
