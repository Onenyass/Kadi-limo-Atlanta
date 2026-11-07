import type { Metadata } from "next";
import type { SiteSettings } from "@/content/types";
import { siteConfig } from "./config";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: title ? `${title} | Kadi Limo & Transportation` : "Kadi Limo & Transportation",
      description,
      url: path,
      siteName: "Kadi Limo & Transportation",
      locale: "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * LocalBusiness structured data built only from confirmed facts.
 * Phone/email are included only once the owner has entered them.
 * No street address, prices, hours or ratings are emitted.
 */
export function localBusinessJsonLd(settings: SiteSettings) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.businessName,
    description: settings.seoDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.city,
      addressRegion: "GA",
      addressCountry: "US",
    },
  };
  if (siteConfig.hasSiteUrl) data.url = siteConfig.siteUrl;
  if (settings.phone) data.telephone = settings.phone;
  if (settings.email) data.email = settings.email;
  if (settings.serviceArea) data.areaServed = settings.serviceArea;
  return data;
}
