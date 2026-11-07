import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/fleet", "/services", "/about", "/contact", "/privacy"].map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
