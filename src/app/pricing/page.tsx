"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────────────────
 * PRICING PAGE STORYBOARD
 *
 *    0ms   header fades in + rises
 *  200ms   pricing cards begin staggered reveal
 *  +100ms  each subsequent card (staggered)
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  header: 0,
  cardsStart: 0.2,
};

const CARD_STAGGER = 0.1; // 100ms between each card

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

const CARD_HOVER = {
  y: -8,
  scale: 1.02,
};

const PLANS = [
  {
    tier: "Free",
    price: "$0",
    subtitle: "Great for early-stage teams",
    items: ["1 project", "100 subscribers", "10 changelogs/month", "Community support"],
    buttonText: "Start Free",
    isPro: false,
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
    buttonText: "Upgrade to Pro",
    isPro: true,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  async function upgrade() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0A0F1E] px-6 py-16 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.12),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: ENTER.initialOpacity, y: ENTER.initialY }}
          animate={{ opacity: ENTER.targetOpacity, y: ENTER.targetY }}
          transition={{ ...SPRING, delay: TIMING.header }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Simple pricing, clear value
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Start free. Upgrade only when you need scale and AI automation.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {PLANS.map((plan, idx) => (
            <motion.div
n              key={plan.tier}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={CARD_HOVER}
              transition={{ ...SPRING, delay: TIMING.cardsStart + idx * CARD_STAGGER }}
              className={`relative rounded-2xl border p-7 ${
                plan.isPro
                  ? "border-blue-500/60 bg-slate-900/50"
                  : "border-slate-700/60 bg-slate-900/40"
              }`}
            >
              {/* Pro card glow effect */}
              {plan.isPro && (
                <motion.div
                  className="absolute -inset-px rounded-2xl bg-gradient-to-b from-blue-500/20 via-transparent to-transparent opacity-75"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              <div className="relative z-10">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">
                  {plan.tier}
                </p>
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
                  variant={plan.isPro ? "default" : "outline"}
                  onClick={plan.isPro ? upgrade : undefined}
                  disabled={plan.isPro && loading}
                >
                  {plan.isPro && loading ? "Redirecting..." : plan.buttonText}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...SPRING, delay: TIMING.cardsStart + PLANS.length * CARD_STAGGER + 0.2 }}
          className="mt-8 text-center text-sm text-slate-400"
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </main>
  );
}
