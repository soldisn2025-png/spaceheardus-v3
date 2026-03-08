# Space Heard Us Website

Next.js 15 site for Space Heard Us.

## Local development

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: start dev server
- `npm run build`: Next build + OpenNext Cloudflare build
- `npm run deploy`: deploy worker via Wrangler
- `npm run lint`: lint checks

## Content files

- Team: `content/team.json`
- Events: `content/events.json`
- Event media: `content/events-media.ts`
- External links (including volunteer form): `content/links.ts`

## Team photos

Put team images in `public/images/team/`:

- `courtney-lee.png`
- `kaden-joo.png`
- `eric-kim.png`

## Schedule media

- Group photo expected at `public/images/events/group-photo.jpg`
- Videos expected at:
  - `public/videos/performances/event-sample-1.mp4`
  - `public/videos/performances/event-sample-2.mp4`

If filenames differ, update `content/events-media.ts`.

## Admin

Decap CMS is available at `/admin/` using `public/admin/config.yml`.

## Cloudflare deploy

This project deploys with **OpenNext + Cloudflare Workers**.
See `CLOUDFLARE_DEPLOY.md`.
