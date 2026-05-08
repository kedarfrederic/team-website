import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { deskStructure } from "./deskStructure";
import { mainDocuments, documentLocations } from "./presentation/resolve";

/**
 * Sanity Studio config for the Team marketing site CMS.
 *
 * Project: g1olb5am
 * Dataset: production (with public visibility — read access does not require a token)
 *
 * Run locally:
 *   cd sanity
 *   npm install
 *   npm run dev      # http://localhost:3333
 *
 * Deploy hosted Studio (optional, gives editors a stable URL):
 *   npm run deploy   # publishes to <studio-host>.sanity.studio
 *
 * Visual Editing:
 *   - Presentation tool gives editors a side-by-side preview of the
 *     marketing site with click-to-edit overlays.
 *   - SANITY_STUDIO_PREVIEW_URL points at the deployed marketing site (or
 *     http://localhost:4321 in dev). The Studio appends a secret-protected
 *     `/api/preview/enable` redirect to flip the iframe into preview mode.
 *   - SANITY_STUDIO_PREVIEW_SECRET must match the marketing site's
 *     SANITY_PREVIEW_SECRET env var.
 */
const PREVIEW_URL =
  process.env.SANITY_STUDIO_PREVIEW_URL ?? "http://localhost:4321";
const PREVIEW_SECRET = process.env.SANITY_STUDIO_PREVIEW_SECRET ?? "";

export default defineConfig({
  name: "team-website-cms",
  title: "Team Marketing CMS",

  projectId: "g1olb5am",
  dataset: "production",

  plugins: [
    presentationTool({
      previewUrl: {
        origin: PREVIEW_URL,
        preview: "/",
        previewMode: {
          enable: PREVIEW_SECRET
            ? `/api/preview/enable?secret=${encodeURIComponent(PREVIEW_SECRET)}`
            : "/api/preview/enable",
          disable: "/api/preview/disable",
        },
      },
      resolve: {
        mainDocuments,
        locations: documentLocations,
      },
    }),
    structureTool({ structure: deskStructure }),
    visionTool(), // GROQ playground at /vision — useful for debugging queries
  ],

  schema: {
    types: schemaTypes,
  },

  // Custom Studio chrome — hide the default avatar from the corner so the
  // brand identity dominates. Brand kit colors applied in studio.css later.
  studio: {
    components: {},
  },
});
