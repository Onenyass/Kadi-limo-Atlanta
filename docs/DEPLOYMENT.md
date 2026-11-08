# Deployment (Netlify)

**Current preview:** <https://kadi-limo-atl-preview.netlify.app>. This is Netlify site
`kadi-limo-atl-preview`, linked to `Onenyass/Kadi-limo-Atlanta` on branch
`claude/kadi-limo-website-cj9hfl`. Every push to that branch redeploys it. Netlify
Forms is enabled and the `ride-request` form is registered. The steps below document
how it was set up, and how to recreate it if needed. They do not touch `kadilimoatl.com`.

## 1. Create the Netlify site

1. Sign in at <https://app.netlify.com>.
2. **Add new site → Import an existing project → GitHub**, and pick
   `onenyass/kadi-limo-atlanta`.
3. Branch to deploy: `claude/kadi-limo-website-cj9hfl`, the branch that holds the site.
4. Build settings are read from `netlify.toml` (`npm run build`, Node 22). Netlify
   detects Next.js and applies its Next.js runtime automatically.
5. **Do not add a custom domain.** Leave the site on its `*.netlify.app` address
   until the owner approves launch.

## 2. Environment variables

No dashboard variables are required for the preview. `netlify.toml` already sets:

| Variable                     | Value     | Effect |
| ---------------------------- | --------- | ------ |
| `NEXT_PUBLIC_SITE_INDEXABLE` | `false`   | `noindex` meta tags + `robots.txt` disallow (plus an `X-Robots-Tag` header) |
| `NEXT_PUBLIC_FORM_MODE`      | `netlify` | Ride-request form submits to Netlify Forms |

The site URL for canonical/Open Graph links comes automatically from Netlify's
`URL` / `DEPLOY_PRIME_URL`. Set `NEXT_PUBLIC_SITE_URL` only to override it.

Optional, in **Site configuration → Environment variables** (see `.env.example`):

| Variable                        | When |
| ------------------------------- | ---- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | After the Sanity project exists ([CMS.md](CMS.md)) |
| `NEXT_PUBLIC_SANITY_DATASET`    | `production` (default) |
| `SANITY_API_READ_TOKEN`         | Only for a private dataset; mark it secret |

Variables in `netlify.toml` take precedence over dashboard variables with the same
name, so change the two values above in `netlify.toml` itself. `NEXT_PUBLIC_*`
values are compiled into the build, so **redeploy** after changing any of them.

## 3. Ride-request form (Netlify Forms)

How it works:

- `public/__forms.html` declares a hidden form named `ride-request`. Netlify registers
  it at deploy time.
- The visible form (`src/components/RideRequestForm.tsx`) validates input, then POSTs to
  `/__forms.html`. A success message appears **only** when Netlify returns a 2xx response.
  On any failure, the visitor sees an error and a copyable summary of the request.
- Spam protection: a hidden honeypot field (`bot-field`, declared with
  `netlify-honeypot`) and Netlify's built-in spam filtering.

After the first deploy:

1. Open **Forms** in the Netlify dashboard. If it shows **Enable form detection**,
   click it, then **Deploys → Trigger deploy** so the form is registered.
2. Confirm a form named **ride-request** is listed.
3. Submit a test request on the preview site. It should say "your request was received",
   and the entry should appear under **Forms → ride-request**. Obvious test entries
   (e.g. "TEST", example.com emails) may land in the **Spam** tab; check there too.
   Until form detection is
   enabled, the site shows "could not be sent" instead. That is expected and honest.
4. **Notifications:** under **Site configuration → Notifications → Emails and webhooks →
   Form submission notifications**, add an email notification to the owner's address.
   The address is chosen by the owner and is not stored in this repo.
5. Optional: under **Forms → Settings**, review spam filtering or add reCAPTCHA if spam
   becomes a problem.

For local development, `NEXT_PUBLIC_FORM_MODE=preview` (the `.env.example` default)
turns the form into a copyable-summary preview that sends nothing.

## 4. Before going live (owner approval required)

- Replace placeholders (see [OWNER-CHECKLIST.md](OWNER-CHECKLIST.md)) and add a reviewed
  privacy policy.
- Set `NEXT_PUBLIC_SITE_INDEXABLE=true` and `NEXT_PUBLIC_SITE_URL=https://kadilimoatl.com`.
- Only then, and only with the owner's go-ahead, add `kadilimoatl.com` as a custom domain
  in Netlify and update DNS where the domain is managed. This replaces the current
  WordPress Coming Soon page, so plan it deliberately.
