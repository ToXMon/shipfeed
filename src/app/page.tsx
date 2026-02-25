"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Mail,
  PenSquare,
  Rocket,
  Sparkles,
} from "lucide-react";
import { useMemo, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/* ─────────────────────────────────────────────────────────
 * LANDING PAGE STORYBOARD
 *
 * 0ms   hero fades + rises
 * 150ms headline + subhead
 * 250ms CTA row
 * 350ms mockup cards stagger
 * 650ms social proof/logos
 * 850ms features grid
 * 1100ms timeline steps
 * 1400ms pricing cards
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  heroContainer: 0,
  heroText: 0.15,
  heroCta: 0.25,
  heroMockup: 0.35,
  socialProof: 0.65,
  features: 0.85,
  timeline: 1.1,
  pricing: 1.4,
};

const SPRING = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
  mass: 0.8,
};

const ENTER = {
  initialY: 22,
  initialOpacity: 0,
  targetY: 0,
  targetOpacity: 1,
};

const MOCKUP_STAGGER = 0.12;
const PARALLAX_RANGE = 80;

const LOGOS = ["Nova", "ArcLayer", "PulseKit", "FoundryOS", "HexScale"];

const FEATURES = [
  {
    title: "AI Draft Generation",
    description:
      "Connect your GitHub repo. ShipFeed turns commits and PRs into polished release notes in seconds.",
    icon: Sparkles,
  },
  {
    title: "Beautiful Publishing",
    description:
      "Markdown editor with live preview. Version badges, categories, and rich media. Your changelog, your brand.",
    icon: PenSquare,
  },
  {
    title: "Subscriber Notifications",
    description:
      "Users subscribe via widget or email. Every published update triggers instant, beautiful email notifications.",
    icon: Mail,
  },
];

const STEPS = [
  { title: "Connect", description: "Link GitHub in one click.", icon: GitBranch },
  {
    title: "Write (or let AI)",
    description: "Draft manually or generate from commits.",
    icon: PenSquare,
  },
  {
    title: "Publish & Notify",
    description: "Ship updates and notify subscribers instantly.",
    icon: Rocket,
  },
];

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <h2 className="text-3xl font-bold tracking-tight text-slate-50 md:text-5xl">{title}</h2>
      <p className="mt-4 text-base text-slate-300 md:text-lg">{subtitle}</p>
    </div>
  );
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -PARALLAX_RANGE]);
  const grainX = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const counter = useMemo(() => 237, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0F1E] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.16),transparent_30%)]" />
      <motion.div
        style={{ x: grainX }}
        className="pointer-events-none fixed inset-0 opacity-[0.06] [background-image:radial-gradient(#fff_0.4px,transparent_0.4px)] [background-size:3px_3px]"
      />

      <main className="relative z-10">
        <motion.section
          style={{ y: heroY }}
          initial={{ opacity: ENTER.initialOpacity, y: ENTER.initialY }}
          animate={{ opacity: ENTER.targetOpacity, y: ENTER.targetY }}
          transition={{ ...SPRING, delay: TIMING.heroContainer }}
          className="mx-auto grid min-h-[90vh] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-10"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: TIMING.heroText }}
            >
              <Badge className="mb-6 border-blue-400/30 bg-blue-500/15 text-blue-200">
                AI changelog platform for product teams
              </Badge>
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
                Ship updates your users actually read.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
                AI-powered changelogs that turn release notes into a growth channel. Publish beautiful
                product updates, notify subscribers instantly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: TIMING.heroCta }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Button size="lg" className="h-12 rounded-xl bg-blue-500 px-6 text-white hover:bg-blue-400">
                Start Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-slate-500/60 bg-slate-800/20 px-6 text-slate-100 hover:bg-slate-700/40"
              >
                See Demo
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...SPRING, delay: TIMING.heroMockup }}
            className="rounded-3xl border border-slate-700/60 bg-slate-900/50 p-5 shadow-[0_0_80px_rgba(59,130,246,0.15)] backdrop-blur"
          >
            {["v1.9.0", "v1.8.5", "v1.8.0"].map((version, idx) => (
              <motion.div
                key={version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: TIMING.heroMockup + idx * MOCKUP_STAGGER }}
                className="mb-4 rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4 last:mb-0"
              >
                <div className="mb-2 flex items-center justify-between">
                  <Badge className="bg-blue-600/20 text-blue-200">{version}</Badge>
                  <span className="text-xs text-slate-400">Jan {22 - idx}, 2026</span>
                </div>
                <h3 className="font-semibold text-slate-100">Search relevancy improvements</h3>
                <p className="mt-1 text-sm text-slate-300">
                  Faster filters, cleaner onboarding, and better telemetry for conversion tracking.
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...SPRING, delay: TIMING.socialProof }}
          className="mx-auto max-w-7xl px-6 py-8 md:px-10"
        >
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 px-6 py-5 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-base text-slate-200">
                Trusted by <span className="font-bold text-white">{counter}+</span> product teams
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                {LOGOS.map((logo) => (
                  <span key={logo} className="rounded-md border border-slate-700/60 px-3 py-1">
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <SectionHeading
            title="Built for teams that ship every week"
            subtitle="Replace boring release notes with polished updates that users actually open."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ ...SPRING, delay: TIMING.features + idx * 0.08 }}
                >
                  <Card className="h-full rounded-2xl border-slate-700/60 bg-slate-900/50">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <SectionHeading
            title="How ShipFeed works"
            subtitle="From code changes to polished, subscriber-ready updates in three steps."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ ...SPRING, delay: TIMING.timeline + idx * 0.1 }}
                  className="relative rounded-2xl border border-slate-700/60 bg-slate-900/45 p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{step.description}</p>
                  {idx < STEPS.length - 1 && (
                    <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-slate-600 md:block" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <SectionHeading
            title="Simple pricing, clear value"
            subtitle="Start free. Upgrade only when you need scale and AI automation."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                tier: "Free",
                price: "$0",
                subtitle: "Great for early-stage teams",
                items: ["1 project", "100 subscribers", "10 changelogs/month", "Community support"],
              },
              {
                tier: "Pro",
                price: "$29/mo",
                subtitle: "For serious product organizations",
                items: [
                  "Unlimited projects",
                  "Unlimited subscribers",
                  "AI draft generation",
                  "Custom domains + priority support",
                ],
              },
            ].map((plan, idx) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, scale: 1.01 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ ...SPRING, delay: TIMING.pricing + idx * 0.1 }}
                className="rounded-2xl border border-slate-700/60 bg-slate-900/45 p-7"
              >
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">{plan.tier}</p>
                <h3 className="mt-2 text-4xl font-bold text-white">{plan.price}</h3>
                <p className="mt-2 text-sm text-slate-300">{plan.subtitle}</p>
                <ul className="mt-6 space-y-3">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-200">
                      <CheckCircle2 className="h-4 w-4 text-blue-300" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-7 w-full rounded-xl"
                  variant={plan.tier === "Pro" ? "default" : "outline"}
                >
                  {plan.tier === "Pro" ? "Upgrade to Pro" : "Start Free"}
                </Button>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-800/80 px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} ShipFeed. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white">Pricing</a>
            <a href="#" className="hover:text-white">Docs</a>
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
