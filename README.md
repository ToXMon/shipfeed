# ShipFeed

> AI-powered changelog and release notes platform for product teams — "Substack for product updates"

## 🎯 Problem

Product teams struggle to communicate updates effectively. Developers hate writing release notes, and users miss important product changes buried in GitHub commits or Slack messages.

## 💡 Solution

**ShipFeed** is an AI-powered changelog platform where teams publish polished release notes and users subscribe to product updates via email. AI generates release note drafts from commits and change descriptions.

## 📸 Screenshots

### Landing Page with Animated Features

![Landing page with navbar](https://github.com/user-attachments/assets/d767040f-d6ee-41e4-9315-aa8a764f5c84)

### Feature Cards with Scroll Animations

![Feature and step cards on scroll](https://github.com/user-attachments/assets/abeeb0cc-35a3-47a9-9f6a-98c6e68f4578)

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API Routes + Supabase (PostgreSQL + Auth)
- **AI:** Venice AI (cost-optimized model routing)
- **Payments:** Stripe (free/pro plans)
- **Email:** Resend (notifications)
- **Deployment:** Vercel-ready

## ✨ Features

- 🎨 Beautiful landing page with Framer Motion animations
- 🔐 Supabase authentication (email + Google OAuth)
- 📝 AI-powered changelog generation
- 💳 Stripe billing (Free and Pro plans)
- 📧 Email notifications via Resend
- 📊 Dashboard for project management
- 🌐 Public changelog pages

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/ToXMon/shipfeed.git
cd shipfeed

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📋 Environment Variables

Create `.env.local` with:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STRIPE_SECRET_KEY=your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_PRO_PRICE_ID=your_price_id
STRIPE_WEBHOOK_SECRET=your_webhook_secret

RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=noreply@shipfeed.dev

VENICE_API_KEY=your_venice_key
VENICE_MODEL_PROFILE=cost
```

## 🤖 AI Model Profiles

ShipFeed supports cost-aware model routing:
- `cost` → `qwen3-4b` (cheapest)
- `balanced` → `llama-3.3-70b`
- `quality` → `qwen3-235b-a22b-instruct-2507`

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run lint     # Run ESLint
npm run build    # Production build
```

## 🔮 Future Roadmap

- Rich markdown editor with preview
- Advanced analytics dashboard
- Team collaboration features
- Webhook integrations
- API for programmatic changelog creation

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

---

Built with ❤️ for the 48-Hour Vibe Code Hackathon
