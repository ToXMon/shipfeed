"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

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
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6">
          <h2 className="text-2xl font-bold">Free</h2>
          <p className="mt-2 text-slate-300">1 project, 100 subscribers, 10 changelogs/month.</p>
        </div>
        <div className="rounded-2xl border border-blue-500/60 bg-slate-900/50 p-6">
          <h2 className="text-2xl font-bold">Pro — $29/mo</h2>
          <p className="mt-2 text-slate-300">Unlimited projects, unlimited subscribers, AI drafts, priority support.</p>
          <Button className="mt-6" onClick={upgrade} disabled={loading}>{loading ? "Redirecting..." : "Upgrade to Pro"}</Button>
        </div>
      </div>
    </main>
  );
}
