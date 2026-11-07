import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "kadi-limo",
  title: "Kadi Limo & Transportation",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // Site settings is a single document; hide it from the "create new" menu.
    templates: (templates) => templates.filter(({ schemaType }) => schemaType !== "siteSettings"),
  },
  document: {
    actions: (actions, { schemaType }) =>
      schemaType === "siteSettings"
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
});
