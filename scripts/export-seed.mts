/**
 * Generates studio/seed/seed.ndjson from src/content/seed.ts so the CMS can be
 * pre-filled with the same content the site shows today.
 * Run: node scripts/export-seed.mts   (Node 22.18+ runs TypeScript directly)
 */
import { writeFileSync } from "node:fs";
import { seedFleet, seedServices, seedSettings } from "../src/content/seed.ts";

const s = seedSettings;
const docs: Record<string, unknown>[] = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    businessName: s.businessName,
    seoDescription: s.seoDescription,
    heroEyebrow: s.hero.eyebrow,
    heroHeading: s.hero.heading,
    heroIntro: s.hero.intro,
    introHeading: s.homeIntro.heading,
    introBody: s.homeIntro.body,
    aboutHeading: s.about.heading,
    aboutIntro: s.about.intro,
    aboutBody: s.about.body,
    principles: s.about.principles.map((p, i) => ({ _key: `p${i}`, _type: "principle", ...p })),
    contactIntro: s.contactIntro,
  },
  ...seedServices.map((x, i) => ({
    _id: `service-${x.slug}`,
    _type: "service",
    title: x.title,
    slug: { _type: "slug", current: x.slug },
    summary: x.summary,
    description: x.description,
    goodFor: x.goodFor,
    ...(x.note ? { note: x.note } : {}),
    featured: x.featured,
    order: (i + 1) * 10,
  })),
  ...seedFleet.map((x, i) => ({
    _id: `vehicle-${x.slug}`,
    _type: "vehicle",
    name: x.name,
    slug: { _type: "slug", current: x.slug },
    category: x.category,
    kind: x.kind,
    description: x.description,
    confirmedDetails: x.confirmedDetails,
    featured: x.featured,
    order: (i + 1) * 10,
  })),
];

writeFileSync(
  new URL("../studio/seed/seed.ndjson", import.meta.url),
  docs.map((d) => JSON.stringify(d)).join("\n") + "\n",
);
console.log(`Wrote ${docs.length} documents to studio/seed/seed.ndjson`);
