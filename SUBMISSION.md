# ShipFeed — AI-Powered Changelog Platform

## The Problem
Product teams struggle to communicate updates effectively. Release notes are often buried in GitHub or changelog docs nobody reads. This hurts feature adoption, user engagement, and retention.

## The Solution
ShipFeed is an AI-native changelog platform. Teams connect product changes, generate high-quality release-note drafts, publish beautiful updates, and automatically notify subscribers. It turns release notes into a growth and retention channel.

## Who I Am
Tol Shekoni — Full-stack developer focused on developer tools, growth products, and AI-assisted workflows.

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth + Postgres + RLS)
- Stripe (Free/Pro billing + webhooks)
- Resend (transactional email pipeline hooks)
- Venice AI (cost-optimized draft generation)

## Key Features
- AI-generated release note drafts from change descriptions
- Public, beautiful changelog feed by project slug
- Subscriber capture and notification-ready workflow
- Protected dashboard for project/changelog management
- Stripe-powered Pro upgrade flow
- Responsive, animated landing page built for conversion

## Demo Notes
- Landing page: `/`
- Auth: `/login`, `/signup`
- Dashboard: `/dashboard`
- Pricing: `/pricing`
- Public changelog feed: `/{projectSlug}`

## Why This Matters
ShipFeed helps teams ship visibly. Better update communication drives adoption, trust, and revenue by keeping users informed and engaged.

## Routes Manifest

```
src/app/
├── page.tsx                                   → GET  /
├── layout.tsx
├── globals.css
├── pricing/
│   └── page.tsx                               → GET  /pricing
├── [projectSlug]/
│   └── page.tsx                               → GET  /:projectSlug  (public changelog feed)
├── (auth)/
│   ├── actions.ts                             (server actions: signIn, signUp, signOut)
│   ├── login/
│   │   └── page.tsx                           → GET  /login
│   └── signup/
│       └── page.tsx                           → GET  /signup
├── dashboard/
│   ├── page.tsx                               → GET  /dashboard
│   ├── new-project/
│   │   └── page.tsx                           → GET  /dashboard/new-project
│   └── [projectSlug]/
│       └── page.tsx                           → GET  /dashboard/:projectSlug
└── api/
    ├── auth/
    │   ├── google/
    │   │   └── route.ts                       → GET  /api/auth/google      (OAuth redirect)
    │   └── callback/
    │       └── route.ts                       → GET  /api/auth/callback    (OAuth callback)
    ├── projects/
    │   └── route.ts                           → GET  /api/projects
    │                                          → POST /api/projects
    ├── changelogs/
    │   └── route.ts                           → GET  /api/changelogs?projectId=
    │                                          → POST /api/changelogs
    │                                          → PATCH /api/changelogs
    │                                          → DELETE /api/changelogs?id=
    ├── subscribers/
    │   └── route.ts                           → POST   /api/subscribers
    │                                          → PATCH  /api/subscribers
    │                                          → DELETE /api/subscribers?projectId=&email=
    ├── ai/
    │   └── generate-changelog/
    │       └── route.ts                       → POST /api/ai/generate-changelog  (Pro only)
    └── stripe/
        ├── checkout/
        │   └── route.ts                       → POST /api/stripe/checkout
        ├── portal/
        │   └── route.ts                       → POST /api/stripe/portal
        └── webhook/
            └── route.ts                       → POST /api/stripe/webhook
```

### Middleware
`src/middleware.ts` — protects `/dashboard/*` routes, redirects unauthenticated users to `/login`.

## Plan Limits (enforced server-side)
| Feature              | Free  | Pro       |
|----------------------|-------|-----------|
| Projects             | 1     | Unlimited |
| Changelogs / month   | 10    | Unlimited |
| Subscribers          | 100   | Unlimited |
| AI draft generation  | ✗     | ✓         |

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_PRO_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
OPENAI_API_KEY=           # optional; Venice AI fallback used if absent
NEXT_PUBLIC_APP_URL=
```

## Stripe Test Flow
1. Use card `4242 4242 4242 4242` (any future expiry, any CVC) to test Pro checkout.
2. Webhook events handled: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
3. Set `STRIPE_WEBHOOK_SECRET` from `stripe listen --forward-to localhost:3000/api/stripe/webhook` during local dev.

## AI Mode
Venice AI is used for changelog draft generation (Pro plan only). If `OPENAI_API_KEY` is absent or Venice is unavailable, a deterministic markdown fallback is returned — the draft flow never hard-fails.

