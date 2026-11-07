import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // Hosted studio address: https://<studioHost>.sanity.studio (chosen on first deploy if unset).
  studioHost: process.env.SANITY_STUDIO_HOSTNAME || undefined,
  deployment: { autoUpdates: true },
});
