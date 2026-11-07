# Notes for contributors and coding agents

- This repository is only the Kadi Limo & Transportation website. Do not modify the
  owner's WordPress site, the `kadilimoatl.com` domain, or its DNS.
- **No invented business facts.** Contact details, service area, prices, capacities,
  model years, amenities, history, licenses, insurance, chauffeur credentials,
  testimonials, ratings, statistics, "24/7", flight tracking and guarantees must come
  from the owner. Leave fields empty (`null`) so the site shows placeholders.
- Vehicle images: illustrations are labelled "Illustration"; stock photos must keep
  `isRepresentative: true` so they show a "Representative image" label.
- Use "request availability" / "request a quote" wording. Never state a booking is confirmed.
- The ride-request form must never claim a request was sent unless the endpoint returned
  success. Keep `public/__forms.html` field names in sync with `RideRequestForm.tsx`.
- Keep secrets out of the repo; use `.env.local` or Netlify environment variables.
- Before committing: `npm run lint && npm run typecheck && npm run build`.
- If seed content changes, run `node scripts/export-seed.mts` to refresh the CMS import file.
