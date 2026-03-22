# Space Heard Us Website

Next.js 15 site for Space Heard Us.

## Local development

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: start the dev server
- `npm run build`: build the site for Next.js and OpenNext Cloudflare
- `npm run deploy`: deploy with Wrangler
- `npm run lint`: run lint checks

## Content files

- Homepage content: `content/site-content.json`
- Team: `content/team.json`
- Events: `content/events.json`
- Event media: `content/events-media.ts`
- External links: `content/links.ts`

## Admin panel

- URL: `/admin-panel`
- Login type: admin ID + password
- Editable homepage fields:
  - hero picture
  - hero statement
  - mission statement
  - featured YouTube title and link
  - volunteer form link
  - landing-page contact form recipient email
  - Book Us form recipient email

Set these environment variables before using the admin panel:

- `ADMIN_ID`
- `ADMIN_PASSWORD`
- `ADMIN_JWT_SECRET`
- `GITHUB_TOKEN`
- `GITHUB_REPO` (optional, defaults to `soldisn2025-png/spaceheardus-v3`)
- `GITHUB_BRANCH` (optional, defaults to `main`)
- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`

When an admin uploads a new homepage or gallery image, it is committed to GitHub under `public/images/...`.
When an admin saves content, the public site reads the latest JSON and image paths from GitHub at runtime, so homepage, schedule, gallery, and form-recipient changes do not require a redeploy.
The public contact forms send email through the live recipient addresses saved in `content/site-content.json`.

Code changes still require a normal Cloudflare deploy. The optional `.github/workflows/deploy-worker.yml` workflow covers code deploys if you add `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` as GitHub repository secrets.

See `ADMIN.md` for the setup walkthrough.

## Cloudflare deploy

This project deploys with OpenNext + Cloudflare Workers.
See `CLOUDFLARE_DEPLOY.md`.
