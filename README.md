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

Set these environment variables before using the admin panel:

- `ADMIN_ID`
- `ADMIN_PASSWORD`
- `ADMIN_JWT_SECRET`
- `GITHUB_TOKEN`
- `GITHUB_REPO` (optional, defaults to `soldisn2025-png/spaceheardus-v3`)
- `GITHUB_BRANCH` (optional, defaults to `main`)

When an admin uploads a new homepage image, it is committed to `public/images/admin/`.
When an admin saves the form, `content/site-content.json` is committed to GitHub and your deploy pipeline can publish it automatically.

See `ADMIN.md` for the setup walkthrough.

## Cloudflare deploy

This project deploys with OpenNext + Cloudflare Workers.
See `CLOUDFLARE_DEPLOY.md`.
