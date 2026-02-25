"use client";

import { format } from "date-fns";
import { marked } from "marked";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { subscribe } from "./actions";

/* ─────────────────────────────────────────────────────────
 * PUBLIC CHANGELOG STORYBOARD
 *
 *    0ms   header fades in + rises
 *  200ms   subscribe card appears with breathing animation
 *  400ms   changelog articles begin staggered reveal
 *  +120ms  each subsequent article (staggered)
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  header: 0,
  subscribeCard: 0.2,
  articlesStart: 0.4,
};

const SPRING = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
  mass: 0.8,
};

const ARTICLE_STAGGER = 0.12; // 120ms between each article

const ENTER = {
  initialY: 22,
  initialOpacity: 0,
  targetY: 0,
  targetOpacity: 1,
};

const CARD_HOVER = {
  y: -4,
  scale: 1.005,
};

type Changelog = {
  id: string;
  title: string;
  content: string;
  version: string;
  published_at: string | null;
};

type Project = {
  id: string;
  name: string;
  description: string | null;
};

export function PublicChangelogContent({
  project,
  projectSlug,
  changelogs,
}: {
  project: Project;
  projectSlug: string;
  changelogs: Changelog[];
}) {
  return (
    <main className="min-h-screen bg-[#0A0F1E] px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-3xl">
        <motion.header
          initial={{ opacity: ENTER.initialOpacity, y: ENTER.initialY }}
          animate={{ opacity: ENTER.targetOpacity, y: ENTER.targetY }}
          transition={{ ...SPRING, delay: TIMING.header }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-white">{project.name} Changelog</h1>
          <p className="mt-2 text-slate-300">{project.description}</p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...SPRING, delay: TIMING.subscribeCard }}
        >
          <Card className="mb-8 border-slate-700/60 bg-slate-900/60 overflow-hidden relative">
            {/* Breathing/pulse glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-blue-500/5"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <CardContent className="p-6 relative z-10">
              <h2 className="text-xl font-semibold">Subscribe to updates</h2>
              <form action={subscribe} className="mt-4 flex gap-3">
                <input type="hidden" name="projectId" value={project.id} />
                <input type="hidden" name="projectSlug" value={projectSlug} />
                <Input name="email" required type="email" placeholder="you@company.com" className="flex-1" />
                <Button type="submit">Subscribe</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          {changelogs.map((entry, idx) => (
            <ChangelogArticle key={entry.id} entry={entry} idx={idx} />
          ))}
        </div>

        {changelogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: TIMING.articlesStart }}
            className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-12 text-center"
          >
            <p className="text-lg text-slate-300">No changelogs yet.</p>
            <p className="mt-2 text-slate-400">Check back soon for updates.</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}

function ChangelogArticle({ entry, idx }: { entry: Changelog; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      whileHover={CARD_HOVER}
      transition={{ ...SPRING, delay: TIMING.articlesStart + idx * ARTICLE_STAGGER }}
      className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-white">{entry.title}</h3>
        <span className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-200">{entry.version}</span>
      </div>
      <p className="mb-4 text-sm text-slate-400">
        {entry.published_at ? format(new Date(entry.published_at), "PPP") : "Draft"}
      </p>
      <div
        className="prose prose-invert max-w-none prose-p:text-slate-200"
        dangerouslySetInnerHTML={{ __html: marked.parse(entry.content) as string }}
      />
    </motion.article>
  );
}
