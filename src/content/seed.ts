/**
 * Seed content used when no Sanity project is configured.
 *
 * Rules for this file (and for content entered in the CMS):
 * - Do not add prices, capacities, model years, trims, amenities, ratings,
 *   testimonials, certifications or "24/7" claims unless the owner confirms them.
 * - Contact fields stay null until the owner provides real values.
 */
import type { Service, SiteSettings, Vehicle } from "./types";

export const seedSettings: SiteSettings = {
  businessName: "Kadi Limo & Transportation",
  shortName: "Kadi Limo",
  city: "Atlanta",
  region: "Georgia",
  phone: null,
  email: null,
  serviceArea: null,
  seoDescription:
    "Private chauffeured transportation in Atlanta, Georgia for airport trips, business travel, weddings, celebrations and events. Request a quote from Kadi Limo & Transportation.",
  hero: {
    eyebrow: "Private transportation · Atlanta, Georgia",
    heading: "Arrive composed.\nWherever the day takes you.",
    intro:
      "Kadi Limo & Transportation provides private, chauffeured rides across Atlanta for airport transfers, business travel, weddings and the occasions worth getting right.",
  },
  homeIntro: {
    heading: "A calmer way to get where you’re going",
    body: [
      "Good transportation is mostly invisible. The car is ready, the route is planned, and you spend the ride on the call, the conversation or the moment — not on directions, parking or timing.",
      "Tell us where you need to be and when. We’ll review the details, confirm what we can offer, and reply with availability and a quote.",
    ],
  },
  about: {
    heading: "About Kadi",
    intro:
      "Kadi Limo & Transportation is a private car service based in Atlanta, Georgia, offering chauffeured transportation in a black fleet of SUVs, sedans and specialty vehicles.",
    body: [
      "We work with individuals, families and organizations who want one less thing to manage — whether that’s an early airport run, a day of client meetings, or a wedding schedule with very little room for error.",
      "Every trip starts with a conversation about what you actually need: who is riding, where, when, and what matters most. From there we recommend a suitable vehicle, confirm availability and send a clear quote before anything is booked.",
    ],
    principles: [
      {
        title: "Clear communication",
        body: "You’ll know what’s confirmed and what isn’t. We reply with availability and a quote, and only confirm a booking once the details are settled.",
      },
      {
        title: "Planned around you",
        body: "Pickup times, stops and timing are planned around your schedule, not the other way round.",
      },
      {
        title: "Quiet professionalism",
        body: "A clean vehicle, a courteous chauffeur and a ride that lets you focus on your day.",
      },
    ],
  },
  contactIntro:
    "Share the details of your trip and we’ll reply with availability and a quote. Nothing is booked until we confirm it with you.",
  privacyPolicy: null,
};

export const seedServices: Service[] = [
  {
    slug: "airport-hotel-transfers",
    title: "Airport & hotel transfers",
    summary:
      "Rides to and from the airport, hotels and your home, planned around your travel times.",
    description:
      "Start or end a trip without searching for parking or waiting in a rideshare line. Share your travel details when you request a quote, and we’ll plan a pickup time that leaves comfortable room for traffic and check-in.",
    goodFor: ["Departures and arrivals", "Hotel check-ins and check-outs", "Visiting guests and family"],
    featured: true,
  },
  {
    slug: "corporate-executive",
    title: "Corporate & executive transportation",
    summary:
      "Dependable transportation for meetings, roadshows, client visits and business travel.",
    description:
      "For days with tight schedules and important people. We can plan single rides or multi-stop itineraries so executives, clients and visiting teams move between meetings without distraction.",
    goodFor: ["Client and executive pickups", "Multi-stop meeting days", "Conferences and corporate events"],
    featured: true,
  },
  {
    slug: "weddings",
    title: "Weddings",
    summary:
      "Transportation for the couple, wedding party and family, coordinated with your day’s timeline.",
    description:
      "Weddings run on timing. We’ll work from your schedule — getting ready, ceremony, photos, reception and the send-off — and recommend vehicles that suit your party and your plans.",
    goodFor: ["The couple’s arrival and departure", "Wedding party transportation", "Family and guest shuttles"],
    featured: true,
  },
  {
    slug: "proms-formal-events",
    title: "Proms & formal events",
    summary: "A memorable, well-organized ride for proms, galas and black-tie evenings.",
    description:
      "Make the arrival part of the evening. Tell us about the group, pickup points and timing, and we’ll help plan a ride that’s organized for the guests and reassuring for parents and hosts.",
    goodFor: ["Prom and homecoming", "Galas and award dinners", "Black-tie events"],
    featured: false,
  },
  {
    slug: "birthdays-celebrations",
    title: "Birthdays & private celebrations",
    summary: "Chauffeured transportation for birthdays, anniversaries and nights out.",
    description:
      "Celebrate without worrying about the drive home. Whether it’s dinner for two or an evening with friends, we’ll plan pickups and stops so everyone can enjoy the occasion.",
    goodFor: ["Milestone birthdays", "Anniversaries", "Dinners and nights out"],
    featured: true,
  },
  {
    slug: "concerts-sporting-events",
    title: "Concerts & sporting events",
    summary: "Skip the parking and traffic stress on game days and show nights.",
    description:
      "Get to the stadium, arena or venue and back again without hunting for parking. Share the event, venue and timing, and we’ll plan drop-off and pickup details with you in advance.",
    goodFor: ["Concerts and shows", "Games and tournaments", "Festivals and live events"],
    featured: false,
  },
  {
    slug: "hourly-chauffeur",
    title: "Hourly chauffeur service",
    summary: "A car and chauffeur at your disposal for a set block of time.",
    description:
      "Useful when your plans include several stops or uncertain timing — errands, appointments, site visits or an evening out. Tell us roughly how long you need and where you expect to go.",
    goodFor: ["Multiple stops", "Flexible schedules", "Shopping, appointments and site visits"],
    featured: false,
  },
  {
    slug: "point-to-point",
    title: "Point-to-point rides",
    summary: "A direct ride from one address to another, booked in advance.",
    description:
      "Simple and direct: we pick you up at one location and take you to the next. A good fit for dinners, appointments, events and any trip where you’d rather not drive.",
    goodFor: ["Dinners and appointments", "Events and venues", "Trips across the metro area"],
    featured: false,
  },
  {
    slug: "group-transportation",
    title: "Group transportation",
    summary: "Moving a group together, when a suitable vehicle is available.",
    description:
      "Keep a group together for weddings, corporate outings, celebrations and events. Share your group size and plans, and we’ll let you know which options are available for your date.",
    goodFor: ["Wedding parties and guests", "Team outings", "Family events"],
    note: "Group options depend on vehicle availability for your date. We’ll confirm what we can offer when we reply.",
    featured: false,
  },
];

export const seedFleet: Vehicle[] = [
  {
    slug: "cadillac-escalade",
    name: "Cadillac Escalade",
    category: "suv",
    kind: "Full-size SUV",
    description:
      "A full-size SUV with a confident presence, well suited to airport transfers, executive travel and evenings out.",
    confirmedDetails: [],
    featured: true,
  },
  {
    slug: "chevrolet-suburban",
    name: "Chevrolet Suburban",
    category: "suv",
    kind: "Full-size SUV",
    description:
      "A practical, spacious SUV that works well for airport runs, family trips and small groups traveling together.",
    confirmedDetails: [],
    featured: false,
  },
  {
    slug: "gmc-yukon",
    name: "GMC Yukon",
    category: "suv",
    kind: "Full-size SUV",
    description:
      "A comfortable full-size SUV for business travel, airport transfers and point-to-point rides around Atlanta.",
    confirmedDetails: [],
    featured: false,
  },
  {
    slug: "cadillac-sedan",
    name: "Cadillac CT5 or XTS sedan",
    category: "sedan",
    kind: "Executive sedan",
    description:
      "A refined sedan for one-on-one business travel, airport transfers and a quiet ride to dinner.",
    confirmedDetails: [],
    featured: true,
  },
  {
    slug: "stretch-limousine",
    name: "Stretch limousine",
    category: "limousine",
    kind: "Stretch limousine",
    description:
      "A classic choice for weddings, proms, birthdays and celebrations where the ride is part of the occasion.",
    confirmedDetails: [],
    featured: true,
  },
  {
    slug: "rolls-royce",
    name: "Rolls-Royce",
    category: "luxury",
    kind: "Luxury sedan",
    description:
      "Reserved for the moments that call for something special — wedding arrivals, anniversaries and milestone events.",
    confirmedDetails: [],
    featured: true,
  },
];
