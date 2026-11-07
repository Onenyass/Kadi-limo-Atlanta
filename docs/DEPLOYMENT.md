# Deployment (Netlify)

This project has **not** been deployed yet — no Netlify access was available when it
was built. These steps deploy a **preview** on a `*.netlify.app` address. They do not
touch `kadilimoatl.com`.

## 1. Create the Netlify site

1. Sign in at <https://app.netlify.com>.
2. **Add new site → Import an existing project → GitHub**, and pick
   `onenyass/kadi-limo-atlanta`.
3. Branch to deploy: `main` (or the review branch `claude/kadi-limo-website-cj9hfl`
   until it is merged).
4. Build settings are read from `netlify.toml` (`npm run build`, Node 22). Netlify
   detects Next.js and applies its Next.js runtime automatically.
5. **Do not add a custom domain.** Leave the site on its `*.netlify.app` address
   until the owner approves launch.

## 2. Environment variables

**Site configuration → Environment variables** (see `.env.example`):

| Variable                         | Value for preview                     | Notes |
| -------------------------------- | ------------------------------------- | ----- |
| `NEXT_PUBLIC_SITE_URL`           | your `https://<name>.netlify.app` URL | Canonical/OG links and sitemap |
| `NEXT_PUBLIC_SITE_INDEXABLE`     | `false`                               | Keeps the preview out of search engines |
| `NEXT_PUBLIC_FORM_MODE`          | `preview`, then `netlify` after step 3 | See below |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | *(empty until Sanity is set up)*      | See [CMS.md](CMS.md) |
| `NEXT_PUBLIC_SANITY_DATASET`     | `production`                          | |
| `SANITY_API_READ_TOKEN`          | *(only for a private dataset)*        | Mark as secret in Netlify |

`NEXT_PUBLIC_*` values are compiled into the build, so **trigger a new deploy** after
changing them.

## 3. Turn on the ride-request form (Netlify Forms)

How it works:

- `public/__forms.html` declares a hidden form named `ride-request`. Netlify registers
  it at deploy time.
- The visible form (`src/components/RideRequestForm.tsx`) validates input, then POSTs to
  `/__forms.html`. A success message appears **only** when Netlify returns a 2xx response.
  On any failure, the visitor sees an error and a copyable summary of the request.
- Spam protection: a hidden honeypot field (`bot-field`, declared with
  `netlify-honeypot`) and Netlify's built-in spam filtering.

In `preview` mode (the default) nothing is sent. The form is labelled "Preview", and
submitting produces a copyable request summary.

To enable sending:

1. Deploy once, then open **Forms** in the Netlify dashboard. Enable form detection if
   it asks, and redeploy.
2. Confirm a form named **ride-request** is listed.
3. Set `NEXT_PUBLIC_FORM_MODE=netlify` and redeploy.
4. Submit a test request on the preview site. Confirm it appears under
   **Forms → ride-request** and that the site shows "your request was received".
5. **Notifications:** in **Site configuration → Notifications → Emails and webhooks →
   Form submission notifications**, add an email notification to the owner's address
   (the owner chooses the address; it is not stored in this repo).
6. Optional: under **Forms → Settings**, review spam filtering or add reCAPTCHA if spam
   becomes a problem.

## 4. Before going live (owner approval required)

- Replace placeholders (see [OWNER-CHECKLIST.md](OWNER-CHECKLIST.md)) and add a reviewed
  privacy policy.
- Set `NEXT_PUBLIC_SITE_INDEXABLE=true` and `NEXT_PUBLIC_SITE_URL=https://kadilimoatl.com`.
- Only then, and only with the owner's go-ahead, add `kadilimoatl.com` as a custom domain
  in Netlify and update DNS where the domain is managed. This replaces the current
  WordPress Coming Soon page, so plan it deliberately.
