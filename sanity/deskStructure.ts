import type { StructureBuilder } from "sanity/structure";

/**
 * Custom Studio sidebar — pages on top, collections + settings underneath.
 *
 * Default Sanity sidebar groups by *type* ("All ICP pages", "All insight posts").
 * For a marketing CMS that's the wrong mental model — editors think in pages,
 * not types. This structure puts each editable page directly in the sidebar
 * (Homepage, Pricing, For Artists, …) and groups collections (Insights,
 * Categories, Integrations, Changelog, Site Settings) into a "Library".
 *
 * Singleton pattern: pages with `documentId === pageKey` (e.g.
 * `documentId: "homepage"`) are pinned — there's only ever ONE document per
 * page slot, never multiple.
 *
 * To add a new page: insert into the correct section below.
 */
export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Marketing CMS")
    .items([
      // ── Top-level / hero ────────────────────────────────────
      S.listItem()
        .title("Homepage")
        .id("homepage")
        .child(
          S.editor().id("homepage").schemaType("homepage").documentId("homepage")
        ),
      S.listItem()
        .title("Pricing")
        .id("pricingPage")
        .child(
          S.editor()
            .id("pricingPage")
            .schemaType("pricingPage")
            .documentId("pricingPage")
        ),

      S.divider(),

      // ── ICP role pages ──────────────────────────────────────
      S.listItem()
        .title("For Artists")
        .id("forArtistsPage")
        .child(
          S.editor()
            .id("forArtistsPage")
            .schemaType("icpPage")
            .documentId("forArtistsPage")
        ),
      S.listItem()
        .title("For Labels")
        .id("forLabelsPage")
        .child(
          S.editor()
            .id("forLabelsPage")
            .schemaType("icpPage")
            .documentId("forLabelsPage")
        ),
      S.listItem()
        .title("For Managers")
        .id("forManagersPage")
        .child(
          S.editor()
            .id("forManagersPage")
            .schemaType("icpPage")
            .documentId("forManagersPage")
        ),
      S.listItem()
        .title("For Partners")
        .id("forPartnersPage")
        .child(
          S.editor()
            .id("forPartnersPage")
            .schemaType("partnerPage")
            .documentId("forPartnersPage")
        ),

      S.divider(),

      // ── Vertical product pages ──────────────────────────────
      S.listItem()
        .title("Intelligence")
        .id("intelligencePage")
        .child(
          S.editor()
            .id("intelligencePage")
            .schemaType("verticalProductPage")
            .documentId("intelligencePage")
        ),
      S.listItem()
        .title("Orchestration")
        .id("orchestrationPage")
        .child(
          S.editor()
            .id("orchestrationPage")
            .schemaType("verticalProductPage")
            .documentId("orchestrationPage")
        ),

      S.divider(),

      // ── Other product / trust pages ─────────────────────────
      S.listItem()
        .title("Enterprise")
        .id("enterprisePage")
        .child(
          S.editor()
            .id("enterprisePage")
            .schemaType("enterprisePage")
            .documentId("enterprisePage")
        ),
      S.listItem()
        .title("Integrations")
        .id("integrationsPage")
        .child(
          S.editor()
            .id("integrationsPage")
            .schemaType("integrationsPage")
            .documentId("integrationsPage")
        ),
      S.listItem()
        .title("Security")
        .id("securityPage")
        .child(
          S.editor()
            .id("securityPage")
            .schemaType("securityPage")
            .documentId("securityPage")
        ),
      S.listItem()
        .title("About")
        .id("aboutPage")
        .child(
          S.editor()
            .id("aboutPage")
            .schemaType("aboutPage")
            .documentId("aboutPage")
        ),

      S.divider(),

      // ── Forms ───────────────────────────────────────────────
      S.listItem()
        .title("Demo (form copy)")
        .id("demoPage")
        .child(
          S.editor()
            .id("demoPage")
            .schemaType("demoPage")
            .documentId("demoPage")
        ),
      S.listItem()
        .title("Contact (form copy)")
        .id("contactPage")
        .child(
          S.editor()
            .id("contactPage")
            .schemaType("contactPage")
            .documentId("contactPage")
        ),

      S.divider(),

      // ── Index pages (read collections) ──────────────────────
      S.listItem()
        .title("Insights index")
        .id("insightsIndexPage")
        .child(
          S.editor()
            .id("insightsIndexPage")
            .schemaType("insightsIndexPage")
            .documentId("insightsIndexPage")
        ),
      S.listItem()
        .title("Changelog index")
        .id("changelogPage")
        .child(
          S.editor()
            .id("changelogPage")
            .schemaType("changelogPage")
            .documentId("changelogPage")
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
                .title("Changelog entries")
                .schemaType("changelogEntry")
                .child(
                  S.documentTypeList("changelogEntry")
                    .title("Changelog entries")
                    .defaultOrdering([{ field: "releaseDate", direction: "desc" }])
                ),
              S.divider(),
              S.listItem()
                .title("Integrations grid")
                .schemaType("integration")
                .child(
                  S.documentTypeList("integration")
                    .title("Integrations")
                    .defaultOrdering([{ field: "sortOrder", direction: "asc" }])
                ),
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
