# Kadi Limo & Transportation — website

Marketing website for **Kadi Limo & Transportation**, a private chauffeured
transportation business in Atlanta, Georgia.

- **Framework:** Next.js (App Router) + TypeScript, plain CSS design system
- **CMS:** Sanity (optional — the site runs on built-in seed content until a Sanity project is connected)
- **Hosting:** Netlify (Next.js runtime + Netlify Forms for the ride-request form)

> **Status:** preview build. The live domain `kadilimoatl.com` is **not** connected
> to this project, and its WordPress "Coming Soon" page and DNS are untouched.
> Preview deployments are `noindex` until `NEXT_PUBLIC_SITE_INDEXABLE=true`.

## Pages

| Route       | Purpose                                                                        |
| ----------- | ------------------------------------------------------------------------------ |
| `/`         | Hero, introduction, featured services, selected vehicles, booking steps, CTA   |
| `/fleet`    | One card per planned vehicle, each with a "Request availability" link          |
| `/services` | Nine services, each with description and "Request a quote" link                |
| `/about`    | Company overview and how Kadi works (no invented history or credentials)       |
| `/contact`  | Contact placeholders + ride-request form (prefills from `?service=` / `?vehicle=`) |
| `/privacy`  | Placeholder until the owner supplies a reviewed privacy policy                 |

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
