import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { deskStructure } from "./deskStructure";

/**
 * Sanity Studio config for the Team marketing site CMS.
 *
 * Project: g1olb5am
 * Dataset: public (read access does not require a token)
 *
 * Run locally:
 *   cd sanity
 *   npm install
 *   npm run dev      # http://localhost:3333
 *
 * Deploy hosted Studio (optional, gives editors a stable URL):
 *   npm run deploy   # publishes to <studio-host>.sanity.studio
 */
export default defineConfig({
  name: "team-website-cms",
  title: "Team Marketing CMS",

  projectId: "g1olb5am",
  dataset: "public",

  plugins: [
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
