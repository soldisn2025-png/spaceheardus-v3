# Deploy to Cloudflare Workers (OpenNext)

This project is configured for **OpenNext + Cloudflare Workers**, not `out/` static export.

## Why deploys were failing

- Old instructions used **Pages / Static HTML Export / out**.
- Current build script creates **`.open-next/`** and `wrangler.jsonc` points to `.open-next/worker.js`.
- Using static Pages settings causes repeated build/deploy mismatch failures.

## Correct deployment

1. Install dependencies:
   - `npm install`
2. Build:
   - `npm run build`
3. Authenticate Wrangler (first time):
   - `npx wrangler login`
4. Deploy:
   - `npm run deploy`

## Notes

- Worker name is controlled by `wrangler.jsonc` (`name` field).
- If GitHub Actions / Cloudflare CI is used, run `npm run build` then `wrangler deploy`.
- Do not set Cloudflare Pages output directory to `out`; this project does not generate `out`.
