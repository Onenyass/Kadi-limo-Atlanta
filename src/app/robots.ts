import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.indexable) {
    // Preview deployments stay out of search results until launch.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/__forms.html"] },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
