/** Shared content shapes. Seed content and Sanity content both map to these. */

export type ImageAsset = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  /**
   * True when the photo is a representative/stock image rather than a photo
   * of Kadi's own vehicle. The site then shows a visible "Representative image" note.
   */
  isRepresentative?: boolean;
};

export type VehicleCategory = "suv" | "sedan" | "limousine" | "luxury";

export type Vehicle = {
  slug: string;
  name: string;
  category: VehicleCategory;
  /** Short label shown above the name, e.g. "Full-size SUV". */
  kind: string;
  description: string;
  /**
   * Owner-confirmed facts only (e.g. seating, luggage, amenities).
   * Leave empty until the owner supplies them; nothing is shown when empty.
   */
  confirmedDetails: string[];
  /**
   * Slugs of existing services this vehicle suits, drawn from its description.
   * Descriptive only: not a statement of availability.
   */
  suitedTo: string[];
  /** Short scene line drawn from the description, e.g. "Weddings and formal events". */
  useLine?: string;
  image?: ImageAsset;
  featured: boolean;
};

export type Service = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  /** Situations this service is commonly used for. Descriptive, not a promise. */
  goodFor: string[];
  /** Optional note, e.g. availability caveats. */
  note?: string;
  image?: ImageAsset;
  featured: boolean;
};

export type Principle = { title: string; body: string };

export type SiteSettings = {
  businessName: string;
  shortName: string;
  city: string;
  region: string;
  /** Null until the owner provides it. Placeholders are shown instead. */
  phone: string | null;
  /** Show a "Text" action only when the owner confirms the number accepts texts. */
  textEnabled: boolean;
  /** WhatsApp number, only if Kadi uses WhatsApp for customer inquiries. */
  whatsapp: string | null;
  email: string | null;
  serviceArea: string | null;
  seoDescription: string;
  hero: {
    eyebrow: string;
    heading: string;
    intro: string;
    image?: ImageAsset;
  };
  homeIntro: { heading: string; body: string[] };
  about: {
    heading: string;
    intro: string;
    body: string[];
    principles: Principle[];
  };
  contactIntro: string;
  /** Null until the owner supplies reviewed privacy-policy text. */
  privacyPolicy: string[] | null;
};
