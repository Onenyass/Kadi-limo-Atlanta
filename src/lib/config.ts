/** Runtime configuration read from environment variables (see .env.example). */

// On Netlify, URL (main site address) and DEPLOY_PRIME_URL (branch/preview address)
// are provided at build time, so canonical links work without manual setup.
const rawSiteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.CONTEXT === "production" ? process.env.URL : process.env.DEPLOY_PRIME_URL) ||
  process.env.URL
)?.trim();

export const siteConfig = {
  /** Base URL for canonical/OG links. Falls back to localhost when unset. */
  siteUrl: (rawSiteUrl || "http://localhost:3000").replace(/\/$/, ""),
  hasSiteUrl: Boolean(rawSiteUrl),
  /** Preview deployments stay out of search engines until launch. */
  indexable: process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true",
  formMode: (process.env.NEXT_PUBLIC_FORM_MODE === "netlify" ? "netlify" : "preview") as
    | "netlify"
    | "preview",
  sanity: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2025-02-19",
    token: process.env.SANITY_API_READ_TOKEN?.trim() || undefined,
  },
};

export const isSanityConfigured = Boolean(siteConfig.sanity.projectId);

/** Name of the Netlify form. Must match public/__forms.html. */
export const NETLIFY_FORM_NAME = "ride-request";
