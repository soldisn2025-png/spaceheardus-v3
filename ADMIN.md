# Admin Panel Setup

The site now includes a custom admin panel at `/admin-panel`.

## What the admin can edit

- Homepage picture
- Hero statement
- Mission statement
- Featured YouTube section title
- Featured YouTube link
- Volunteer form button URL
- Homepage contact form recipient email
- Book Us form recipient email

## Required environment variables

Add these values in your local `.env` file and in your hosting provider:

```env
ADMIN_ID=your-admin-id
ADMIN_PASSWORD=your-strong-password
ADMIN_JWT_SECRET=replace-this-with-a-long-random-secret
GITHUB_TOKEN=github-personal-access-token
GITHUB_REPO=soldisn2025-png/spaceheardus-v3
GITHUB_BRANCH=main
RESEND_API_KEY=re_xxx
CONTACT_FROM_EMAIL=Space Heard Us <onboarding@resend.dev>
```

## GitHub token permissions

The `GITHUB_TOKEN` should be a personal access token that can update the repo contents.
Make sure it can write to `content/site-content.json` and upload files under `public/images/admin/`.

## Live content updates

Saving in the admin panel commits content changes to GitHub. The public site reads the latest content and uploaded image paths from GitHub at runtime, so homepage, schedule, gallery, and form-recipient changes do not require a redeploy.

Code changes still need a normal Cloudflare deploy. To enable automatic code deploys from GitHub, add these repository secrets and keep the `deploy-worker.yml` workflow enabled:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

## How it works

1. Open `/admin-panel`
2. Sign in with your admin ID and password
3. Upload a new homepage picture if needed
4. Update the statement text, volunteer link, or form recipient emails
5. Click `Save & Publish`

The admin panel writes the updates to GitHub. Content edits should appear on the public site after a refresh within a few seconds.

## Notes

- Uploaded homepage images are stored in `public/images/admin/`
- The live homepage reads from `content/site-content.json`
- The older Decap CMS at `/admin/` can remain in the repo, but `/admin-panel` is the new custom login flow
