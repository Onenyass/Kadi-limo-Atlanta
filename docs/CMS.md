# Content management (Sanity)

**Status: not connected.** No Sanity project or credentials were available when this was
built. Until a project ID is configured, the site uses the seed content in
`src/content/seed.ts`. The CMS integration is complete in code and only needs a
project to point at.

## What the owner can edit

| Studio section    | Controls |
| ----------------- | -------- |
| **Site settings** | Phone, email, service area, search description, home hero and intro, About page copy, contact intro, privacy policy |
| **Services**      | Title, summary, description, "good for" tags, availability note, image, home-page feature, sort order |
| **Fleet**         | Name, type label, description, confirmed details (seating etc.), photo, home-page feature, sort order |

Empty CMS fields fall back to the seed text. Phone, email and service area show
"coming soon" placeholders until they're filled in.

## One-time setup

You need a free Sanity account (<https://www.sanity.io>) and Node.js 20.19+.

```bash
cd studio
npm install
npx sanity login
npx sanity init --env      # choose "Create new project", dataset "production"
                           # writes SANITY_STUDIO_PROJECT_ID to studio/.env
npm run import-seed        # pre-fills the CMS with the current site content
npm run deploy             # hosts the Studio at https://<name>.sanity.studio
```

Then, at <https://www.sanity.io/manage> → your project → **API**:

1. **CORS origins:** add the Netlify preview URL (and `http://localhost:3000` for local
   development). Credentials are not required.
2. Keep the dataset **public** (simplest; it holds only public website content). If you
   make it private, create a **Viewer** token and set it as `SANITY_API_READ_TOKEN` in
   Netlify (marked secret).

Finally, in Netlify, set `NEXT_PUBLIC_SANITY_PROJECT_ID` (and
`NEXT_PUBLIC_SANITY_DATASET=production`) and redeploy. Published CMS changes appear on
the site within about 5 minutes (incremental revalidation). To make them appear
instantly, add a Netlify build hook as a Sanity webhook.

Invite other editors under **Members** in Sanity manage.

## Replacing vehicle images

The fleet currently uses **representative images** stored in `public/images/fleet/`
(`cadillac-escalade.webp`, `chevrolet-suburban.webp`, `gmc-yukon.webp`,
`cadillac-sedan.webp`, `stretch-limousine.webp`, `rolls-royce.webp`). Each one is
labelled "Representative image" on the site. To replace them, either:

- **Without the CMS:** overwrite the file in `public/images/fleet/` (same name,
  landscape, about 4:3), and update its alt text or `isRepresentative` flag in
  `src/content/seed.ts` if needed. Set `isRepresentative: false` only for photos of
  Kadi's own vehicles.
- **With the CMS:** upload a photo to the vehicle in Sanity, as below. A CMS photo
  takes the place of the built-in image.

1. Open **Fleet** → a vehicle → **Photo** and upload the image.
2. Write descriptive **alt text** (e.g. "Black Chevrolet Suburban outside a hotel entrance").
3. **Representative image** switch:
   - **On** (default) for stock/licensed photos. The site labels them "Representative image".
   - **Off** only for photos of Kadi's own vehicles.
4. Publish.

Use landscape photos about 2000 px wide. The site crops cards to 3:2 and uses the
hotspot you set in the Studio.

## Developer notes

- Schemas: `studio/schemaTypes/*`. Queries and field mapping: `src/lib/content.ts`.
- Keep the two in sync when adding fields.
- `node scripts/export-seed.mts` regenerates `studio/seed/seed.ndjson` from the seed file.
