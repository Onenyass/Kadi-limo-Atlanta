/**
 * Content access layer.
 *
 * When NEXT_PUBLIC_SANITY_PROJECT_ID is set, content is read from Sanity.
 * Otherwise (or if a CMS field is empty / the request fails) the seed content
 * in src/content/seed.ts is used, so the site always renders.
 */
import { cache } from "react";
import { seedFleet, seedServices, seedSettings } from "@/content/seed";
import type { ImageAsset, Service, SiteSettings, Vehicle, VehicleCategory } from "@/content/types";
import { getSanityClient, sanityImageUrl } from "./sanity";

/** Revalidate CMS content every 5 minutes (ISR). */
const REVALIDATE_SECONDS = 300;

type SanityImage = {
  asset?: { _ref?: string; metadata?: { dimensions?: { width: number; height: number } } };
  alt?: string;
  isRepresentative?: boolean;
} | null;

const imageProjection = `{ ..., asset->{ _id, metadata { dimensions } }, alt, isRepresentative }`;

function mapImage(img: SanityImage | undefined, fallbackAlt: string): ImageAsset | undefined {
  if (!img?.asset) return undefined;
  const url = sanityImageUrl(img, 1800);
  if (!url) return undefined;
  const dims = img.asset.metadata?.dimensions;
  return {
    url,
    alt: img.alt?.trim() || fallbackAlt,
    width: dims?.width,
    height: dims?.height,
    isRepresentative: img.isRepresentative ?? true,
  };
}

async function fetchSanity<T>(query: string): Promise<T | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    return await client.fetch<T>(query, {}, { next: { revalidate: REVALIDATE_SECONDS } });
  } catch (error) {
    console.error("[content] Sanity fetch failed, using seed content.", error);
    return null;
  }
}

const str = (v: unknown, fallback: string) =>
  typeof v === "string" && v.trim() ? v.trim() : fallback;
const strOrNull = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
const strList = (v: unknown, fallback: string[]) =>
  Array.isArray(v) && v.length ? v.filter((x): x is string => typeof x === "string" && !!x.trim()) : fallback;

/* ---------------------------------------------------------------- settings */

type SanitySettings = {
  businessName?: string;
  phone?: string;
  email?: string;
  serviceArea?: string;
  seoDescription?: string;
  heroEyebrow?: string;
  heroHeading?: string;
  heroIntro?: string;
  heroImage?: SanityImage;
  introHeading?: string;
  introBody?: string[];
  aboutHeading?: string;
  aboutIntro?: string;
  aboutBody?: string[];
  principles?: { title?: string; body?: string }[];
  contactIntro?: string;
  privacyPolicy?: string[];
};

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const s = await fetchSanity<SanitySettings | null>(
    `*[_type == "siteSettings"][0]{ ..., heroImage${imageProjection} }`,
  );
  if (!s) return seedSettings;
  const d = seedSettings;
  const principles = (s.principles ?? [])
    .filter((p) => p?.title && p?.body)
    .map((p) => ({ title: p.title!.trim(), body: p.body!.trim() }));
  return {
    ...d,
    businessName: str(s.businessName, d.businessName),
    phone: strOrNull(s.phone),
    email: strOrNull(s.email),
    serviceArea: strOrNull(s.serviceArea),
    seoDescription: str(s.seoDescription, d.seoDescription),
    hero: {
      eyebrow: str(s.heroEyebrow, d.hero.eyebrow),
      heading: str(s.heroHeading, d.hero.heading),
      intro: str(s.heroIntro, d.hero.intro),
      image: mapImage(s.heroImage, "Black chauffeured vehicle"),
    },
    homeIntro: {
      heading: str(s.introHeading, d.homeIntro.heading),
      body: strList(s.introBody, d.homeIntro.body),
    },
    about: {
      heading: str(s.aboutHeading, d.about.heading),
      intro: str(s.aboutIntro, d.about.intro),
      body: strList(s.aboutBody, d.about.body),
      principles: principles.length ? principles : d.about.principles,
    },
    contactIntro: str(s.contactIntro, d.contactIntro),
    privacyPolicy: Array.isArray(s.privacyPolicy) && s.privacyPolicy.length ? strList(s.privacyPolicy, []) : null,
  };
});

/* ---------------------------------------------------------------- services */

type SanityService = {
  slug?: string;
  title?: string;
  summary?: string;
  description?: string;
  goodFor?: string[];
  note?: string;
  image?: SanityImage;
  featured?: boolean;
};

export const getServices = cache(async (): Promise<Service[]> => {
  const rows = await fetchSanity<SanityService[]>(
    `*[_type == "service" && defined(slug.current)] | order(coalesce(order, 999) asc, title asc){
      "slug": slug.current, title, summary, description, goodFor, note, featured, image${imageProjection}
    }`,
  );
  if (!rows || rows.length === 0) return seedServices;
  return rows
    .filter((r) => r.slug && r.title)
    .map((r) => ({
      slug: r.slug!,
      title: r.title!,
      summary: str(r.summary, ""),
      description: str(r.description, ""),
      goodFor: strList(r.goodFor, []),
      note: strOrNull(r.note) ?? undefined,
      image: mapImage(r.image, r.title!),
      featured: Boolean(r.featured),
    }));
});

/* ------------------------------------------------------------------- fleet */

type SanityVehicle = {
  slug?: string;
  name?: string;
  category?: VehicleCategory;
  kind?: string;
  description?: string;
  confirmedDetails?: string[];
  image?: SanityImage;
  featured?: boolean;
};

const categories: VehicleCategory[] = ["suv", "sedan", "limousine", "luxury"];

export const getFleet = cache(async (): Promise<Vehicle[]> => {
  const rows = await fetchSanity<SanityVehicle[]>(
    `*[_type == "vehicle" && defined(slug.current)] | order(coalesce(order, 999) asc, name asc){
      "slug": slug.current, name, category, kind, description, confirmedDetails, featured, image${imageProjection}
    }`,
  );
  if (!rows || rows.length === 0) return seedFleet;
  return rows
    .filter((r) => r.slug && r.name)
    .map((r) => ({
      slug: r.slug!,
      name: r.name!,
      category: r.category && categories.includes(r.category) ? r.category : "suv",
      kind: str(r.kind, ""),
      description: str(r.description, ""),
      confirmedDetails: strList(r.confirmedDetails, []),
      image: mapImage(r.image, `${r.name} — black chauffeured vehicle`),
      featured: Boolean(r.featured),
    }));
});
