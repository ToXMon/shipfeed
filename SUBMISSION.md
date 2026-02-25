# ShipFeed - 48-Hour Vibe Code Hackathon Submission

## 🚀 Project Overview

**ShipFeed** is an AI-powered changelog and release notes SaaS platform for startup and dev-tools teams. Think of it as "Substack for product updates" - teams publish polished release notes and users subscribe to product updates via email.

### The Problem
Product teams struggle to communicate updates effectively. Developers hate writing release notes, and users miss important product changes buried in GitHub commits or Slack messages.

### Our Solution
ShipFeed uses AI to generate release note drafts from commits and change descriptions, making it effortless for teams to keep their users informed.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎨 **Beautiful Landing Page** | Framer Motion animations, responsive design, polished UI |
| 🔐 **Authentication** | Supabase Auth with email + Google OAuth |
| 📝 **AI Changelog Generation** | Venice AI with cost-optimized model routing |
| 💳 **Stripe Billing** | Free and Pro plans with checkout and portal |
| 📊 **Dashboard** | Project management, changelog CRUD, settings |
| 🌐 **Public Pages** | SEO-friendly public changelog pages |
| 📧 **Email Notifications** | Resend integration for subscriber notifications |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| **UI Components** | shadcn/ui + Framer Motion |
| **Backend** | Next.js API Routes |
| **Database** | Supabase PostgreSQL with RLS |
| **Auth** | Supabase Auth (email + OAuth) |
| **AI** | Venice AI (cost-aware model routing) |
| **Payments** | Stripe (checkout + webhooks + portal) |
| **Email** | Resend |
| **Deployment** | Vercel-ready |

---

## 🤖 AI Model Routing (Vibe Coding)

ShipFeed demonstrates the vibe coding philosophy with intelligent AI model routing:

```typescript
// Cost-aware model selection
const PROFILES = {
  cost: 'qwen3-4b',           // Cheapest - drafts & iterations
  balanced: 'llama-3.3-70b',  // Balance of quality/speed
  quality: 'qwen3-235b-a22b-instruct-2507' // Best quality
};
```

The AI changelog endpoint (`/api/ai/generate-changelog`) uses Venice first and falls back safely when unavailable.

---

## 📸 Screenshots

### Landing Page with Animated Features
![Landing page with navbar](https://github.com/user-attachments/assets/d767040f-d6ee-41e4-9315-aa8a764f5c84)

### Feature Cards with Scroll Animations
![Feature and step cards on scroll](https://github.com/user-attachments/assets/abeeb0cc-35a3-47a9-9f6a-98c6e68f4578)

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page with animations
│   ├── pricing/                 # Pricing page
│   ├── dashboard/               # Protected dashboard routes
│   ├── (auth)/                  # Login/signup pages
│   ├── api/                     # API routes
│   │   ├── ai/                  # AI generation endpoints
│   │   ├── stripe/              # Stripe webhooks & checkout
│   │   ├── projects/            # Project CRUD
│   │   └── changelogs/          # Changelog CRUD
│   └── [projectSlug]/           # Public changelog pages
├── components/
│   ├── ui/                      # shadcn/ui components
│   └── navbar.tsx               # Shared navigation
├── lib/
│   ├── ai.ts                    # Venice AI integration
│   ├── stripe.ts                 # Stripe integration
│   └── supabase/                # Database clients
└── middleware.ts                # Auth protection
```

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/ToXMon/shipfeed.git
cd shipfeed

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

---

## ✅ Hackathon Submission Checklist

- [x] **Working Application** - Full-stack app with all core features
- [x] **GitHub Repository** - Public repo at github.com/ToXMon/shipfeed
- [x] **README with Screenshots** - Complete with feature descriptions
- [x] **LICENSE File** - MIT License
- [x] **Clean Code Structure** - Organized, maintainable codebase
- [x] **AI Integration** - Venice AI for changelog generation
- [x] **Authentication** - Supabase Auth working
- [x] **Payments** - Stripe integration complete
- [x] **Responsive Design** - Mobile + desktop polish

---

## 🔮 Future Roadmap

1. **Rich Markdown Editor** - Live preview, syntax highlighting
2. **Advanced Analytics** - Open rates, click tracking
3. **Team Collaboration** - Multiple team members per project
4. **Webhook Integrations** - Slack, Discord notifications
5. **API Access** - Programmatic changelog creation

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file.

---

**Built with ❤️ for the 48-Hour Vibe Code Hackathon**

*This project demonstrates the vibe coding philosophy: AI-powered development with cost-aware model routing, beautiful UI with animations, and production-ready architecture.*
