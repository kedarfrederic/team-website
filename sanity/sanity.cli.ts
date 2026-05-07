import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "g1olb5am",
    dataset: "public",
  },
  // Hosted Studio URL after `sanity deploy` — pick a unique subdomain.
  // Editors can access at https://team-cms.sanity.studio
  studioHost: "team-cms",
  autoUpdates: true,
});
