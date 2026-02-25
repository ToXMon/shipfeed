# ShipFeed

AI-powered changelog and release notes platform for product teams.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind + shadcn/ui
- Supabase (Auth + Postgres)
- Stripe (billing)
- Venice AI (cost-optimized AI drafting)

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` with at least:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRO_PRICE_ID=
STRIPE_WEBHOOK_SECRET=

RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@shipfeed.dev

VENICE_API_KEY=
# cost | balanced | quality
VENICE_MODEL_PROFILE=cost
```

## Venice Model Profiles

ShipFeed supports cost-aware model routing in `src/lib/ai.ts`:
- `cost` → `qwen3-4b` (cheapest)
- `balanced` → `llama-3.3-70b`
- `quality` → `qwen3-235b-a22b-instruct-2507`

The AI changelog endpoint (`/api/ai/generate-changelog`) uses Venice first and falls back safely when unavailable.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```
