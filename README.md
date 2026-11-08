# Kadi Limo & Transportation — website

Marketing website for **Kadi Limo & Transportation**, a private chauffeured
transportation business in Atlanta, Georgia.

- **Framework:** Next.js (App Router) + TypeScript, plain CSS design system
- **CMS:** Sanity (optional — the site runs on built-in seed content until a Sanity project is connected)
- **Hosting:** Netlify (Next.js runtime + Netlify Forms for the ride-request form)

> **Preview:** <https://kadi-limo-atl-preview.netlify.app> (Netlify, auto-deploys from
> `claude/kadi-limo-website-cj9hfl`).
>
> **Status:** preview build. The live domain `kadilimoatl.com` is **not** connected
> to this project, and its WordPress "Coming Soon" page and DNS are untouched.
> Preview deployments are `noindex` until `NEXT_PUBLIC_SITE_INDEXABLE=true`.

## Pages

| Route       | Purpose                                                                        |
| ----------- | ------------------------------------------------------------------------------ |
| `/`         | Hero, introduction, featured services, selected vehicles, booking steps, CTA   |
| `/fleet`    | One card per planned vehicle, each with a "Request availability" link          |
| `/services` | Nine services in an expandable index, each with a "Request a quote" link       |
| `/about`    | Company overview and how Kadi works (no invented history or credentials)       |
| `/contact`  | Three-step ride request (prefills from `?service=` / `?vehicle=`) + contact placeholders |
| `/privacy`  | Placeholder until the owner supplies a reviewed privacy policy                 |

## Design: "Night Route"

Cinematic, editorial art direction: deep black-green, warm ivory and restrained brass,
with Instrument Serif display type over Manrope.

- **Signature:** a hairline brass route with numbered stops. Each page starts at stop 00,
  and its chapters count up from there. On wide screens, a fixed route rail fills as you scroll.
- **Opening scene:** a full-bleed vehicle that "lights up" while the headline rises line by line.
- **Fleet:** the home page stage is an accessible tab list (click, arrow keys, Home/End, or
  swipe on phones). The Fleet page uses editorial plates with parallax imagery.
- **Services:** an expandable index; `/services#slug` opens that service.
- **Request:** a three-step flow (Occasion → Journey → Details) with a review before
  sending. It uses the same Netlify field names as before.
- **Motion:** page entrance, masked headings, curtain image reveals and parallax. It is
  short and eased, and fully disabled under `prefers-reduced-motion`.
- **Imagery:** all vehicle images are representative and carry a visible label.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional; all values have safe defaults
npm run dev                  # http://localhost:3000
npm run build                # production build
npm run lint && npm run typecheck
```

## Project layout

```
src/
  app/            Routes, layout, metadata, robots, sitemap, global CSS
  components/     Header, footer, cards, form, vehicle illustrations
  content/        Content types + seed content (used when Sanity isn't connected)
  lib/            Config, Sanity client, content loaders, SEO helpers
public/__forms.html  Static Netlify Forms definition for the ride-request form
studio/           Sanity Studio (separate package; deploys to *.sanity.studio)
scripts/          export-seed.mts → studio/seed/seed.ndjson
docs/             Deployment, CMS and owner checklist
```

## Documentation

- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Netlify setup, environment variables, form notifications, going live
- [docs/CMS.md](docs/CMS.md) — creating/connecting the Sanity project, editing content, replacing images
- [docs/OWNER-CHECKLIST.md](docs/OWNER-CHECKLIST.md) — information the owner still needs to provide

## Content rules

The site intentionally avoids unconfirmed claims. Do not add prices, passenger or
luggage capacities, model years, amenities, testimonials, ratings, client logos,
statistics, "24/7", flight tracking, certifications or guarantees unless the owner
confirms them. See [AGENTS.md](AGENTS.md).
