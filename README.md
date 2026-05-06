# Maryna's Job Tracker

A small Next.js app that tracks job applications across data-annotation, language-QA, and remote-CS platforms. Maryna sees the pipeline; the local AI bot writes to it via API.

```
docs/                 ← CV, profile, LinkedIn guide (reference, not deployed)
app/                  ← Next.js App Router pages
components/           ← UI components (server + client)
lib/                  ← schema, db client, auth, server actions, seed
middleware.ts         ← password gate for Maryna's UI
```

## Local development

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Copy `.env.example` to `.env.local` and fill in:
   - `DATABASE_URL` — a Neon Postgres connection string (free tier branch is fine for dev)
   - `APP_PASSWORD` — anything; this is what Maryna will type to sign in
   - `BOT_TOKEN` — anything; the bot uses this as a bearer token
3. Push the schema to your dev DB:
   ```bash
   pnpm db:push
   ```
4. (Optional) Seed wave-1/2 jobs:
   ```bash
   pnpm db:seed
   ```
5. Run the dev server:
   ```bash
   pnpm dev
   ```

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New… → Project** → import the repo. Framework auto-detected as Next.js.
3. Before the first deploy, install Neon Postgres from the Vercel Marketplace:
   - **Integrations → Browse Marketplace → Neon → Install**
   - Connect to your Vercel project. This auto-provisions `DATABASE_URL` as an environment variable.
4. Add two more env vars manually under **Settings → Environment Variables**:
   - `APP_PASSWORD` — Maryna's sign-in password
   - `BOT_TOKEN` — token your local AI bot will use
5. Deploy. The first deploy will succeed but show an empty DB.
6. Push the schema to production once:
   ```bash
   # From a local checkout with the production DATABASE_URL exported:
   DATABASE_URL='<production-url>' pnpm db:push
   ```
7. (Optional) Seed:
   ```bash
   DATABASE_URL='<production-url>' pnpm db:seed
   ```

That's it. Hand the deployed URL to Maryna with the `APP_PASSWORD`.

## Bot integration

The bot writes via REST. All endpoints expect `Authorization: Bearer $BOT_TOKEN`.

### Add a job
```bash
curl -X POST https://<your-deploy>/api/jobs \
  -H "Authorization: Bearer $BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "Outlier",
    "role": "EU PT annotator",
    "url": "https://outlier.ai/...",
    "status": "applied",
    "tier": "tier1",
    "payRate": "$25/hr",
    "paymentMethod": "Wise",
    "appliedAt": "2026-05-06",
    "notes": "Submitted via auto-application bot"
  }'
```

### Update a job
```bash
curl -X PATCH https://<your-deploy>/api/jobs/123 \
  -H "Authorization: Bearer $BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "in_test", "qualTestAt": "2026-05-12" }'
```

### List jobs (bot reads its own state)
```bash
curl https://<your-deploy>/api/jobs \
  -H "Authorization: Bearer $BOT_TOKEN"
```

### Status values
`found`, `applied`, `in_test`, `active`, `closed`, `withdrawn`

### Tier values
`tier1`, `tier2`, `microtask`, `adjacent`

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Neon Postgres + Drizzle ORM
- Server Components for reads, Server Actions for Maryna's edits
- REST API routes for the bot, gated by `BOT_TOKEN`
- Cookie-based password gate for the UI, gated by `APP_PASSWORD`
