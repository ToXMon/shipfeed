# ShipFeed — Copilot Build Context

## Project Objective
Build **ShipFeed**, an AI-powered changelog and release notes SaaS for startup/dev-tools teams.

Positioning: **"Substack for product updates"**
- Teams publish polished release notes
- Users subscribe to product updates via email
- AI generates release note drafts from commits/change descriptions

This project targets a hackathon submission and must optimize for:
1. Landing page design quality
2. Working database + features
3. Code quality/structure
4. Clear business value

---

## Required Stack
- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth + Postgres)
- Stripe (free/pro plans)
- Resend (email notifications)
- Vercel deployment-ready

---

## Current State (Implemented)
- Next.js scaffold completed
- shadcn/ui base components installed
- Supabase schema + RLS migration in `supabase/migrations/001_init.sql`
- Landing page implemented in `src/app/page.tsx` with animation constants/storyboard style
- Auth flows:
  - `/login`, `/signup`
  - Google OAuth route
  - auth callback route
  - middleware protection for `/dashboard/*`
- Dashboard + project/changelog management pages:
  - `/dashboard`
  - `/dashboard/new-project`
  - `/dashboard/[projectSlug]`
  - `/dashboard/[projectSlug]/new`
  - `/dashboard/[projectSlug]/settings`
- Public changelog page:
  - `/[projectSlug]`
- API routes:
  - `/api/auth/callback`
  - `/api/auth/google`
  - `/api/projects`
  - `/api/changelogs`
  - `/api/subscribers`
  - `/api/ai/generate-changelog`
  - `/api/stripe/checkout`
  - `/api/stripe/webhook`
  - `/api/stripe/portal`
- Pricing page:
  - `/pricing`

---

## Database Model
Use migration source of truth: `supabase/migrations/001_init.sql`

Tables:
- `profiles`
- `projects`
- `changelogs`
- `subscribers`
- `subscriptions`

Enums:
- `changelog_status` = `draft | published`
- `subscription_plan` = `free | pro`

RLS is enabled; preserve ownership/public-read intent when extending.

---

## Product Rules
- Free plan: 1 project, 100 subscribers, 10 changelogs/month
- Pro plan: unlimited projects/subscribers + AI draft features + advanced options
- AI features should be gated by subscription plan

---

## Implementation Guidance for Copilot

### 1) Keep architecture clean
- Prefer server actions for simple form mutations in dashboard pages
- Keep route handlers thin; move reusable logic to `src/lib/*`
- Add typed helpers for plan checks and role/ownership checks

### 2) Preserve API quality
- Return clear JSON envelopes (`{ data }` or `{ error }`)
- Use proper HTTP status codes
- Validate request payloads (add zod if needed)

### 3) Landing page quality bar
- Keep animation values extracted to named constants
- Use spring defaults for entrance motion
- Avoid generic layout regressions
- Maintain responsive polish (mobile + desktop)

### 4) Accessibility standards
- 44x44 target size for touch controls where possible
- Visible focus states
- Keyboard reachable interactions
- Good contrast on dark backgrounds

### 5) Security/data safety
- Never expose service role keys to the client
- Use server-side access for privileged updates
- Validate ownership on project/changelog write paths

---

## Skill-Informed UI/Animation Notes
(Adapted from Interface Craft approach)

### Storyboard Animation pattern
- At top of animated files, define sequence comments + constants:
  - stage timings
  - spring configs
  - distances/scales/opacities
- Drive related animations with shared constants to keep motion coherent.

### DialKit mindset (without runtime panel)
- Treat tuneable values as named constants so they can be quickly adjusted
- Keep hover/press/focus transitions consistent across card/button families

### Design critique rubric
Before shipping any major page, check:
- Hierarchy clarity (headline > section > body > metadata)
- Rhythm/spacing consistency
- CTA prominence and scan path
- State completeness (hover/focus/active/disabled)
- Mobile usability and readability

---

## Remaining Work Checklist
- [ ] Tighten auth UX (errors/success messages, redirect consistency)
- [ ] Enforce free/pro limits in create flows and API routes
- [ ] Implement production-ready Resend email notifications for publish/subscribe
- [ ] Harden Stripe webhook handling (idempotency + fuller event coverage)
- [ ] Add richer markdown editor UX (preview parity, tags/categories UX)
- [ ] Design critique pass across landing/dashboard/public pages
- [ ] Final submission assets:
  - full-page landing screenshot PNG
  - `SUBMISSION.md`
  - final ZIP excluding `node_modules`, `.next`, `.env.local`

---

## Environment Variables
See `.env.example` and local `.env.local`.

Primary required keys:
- Supabase URL/anon/service role
- Stripe secret/publishable/price/webhook
- Resend API key + sender
- OpenAI key for AI drafting endpoint

---

## Development Conventions
- Commit per milestone step
- Keep PR-sized changes focused
- Run `npm run lint` before commit
- Prefer explicit, descriptive commit messages

---

## Quick Start Commands
```bash
npm install
npm run dev
npm run lint
npm run build
```

---

## Note to Copilot
Treat this repository as an in-progress production-minded hackathon build. Favor correctness and clean structure over shortcuts, while preserving speed and momentum.
