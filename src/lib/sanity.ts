import { createClient, type SanityClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import { isSanityConfigured, siteConfig } from "./config";

let client: SanityClient | null = null;

export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured) return null;
  if (!client) {
    client = createClient({
      projectId: siteConfig.sanity.projectId,
      dataset: siteConfig.sanity.dataset,
      apiVersion: siteConfig.sanity.apiVersion,
      token: siteConfig.sanity.token,
      useCdn: !siteConfig.sanity.token,
      perspective: "published",
    });
  }
  return client;
}

type SanityImageSource = Parameters<ReturnType<typeof createImageUrlBuilder>["image"]>[0];

export function sanityImageUrl(source: SanityImageSource, width = 1600): string | null {
  const c = getSanityClient();
  if (!c) return null;
  return createImageUrlBuilder(c).image(source).width(width).auto("format").fit("max").url();
}
