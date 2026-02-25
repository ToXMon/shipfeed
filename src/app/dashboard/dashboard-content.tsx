"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* ─────────────────────────────────────────────────────────
 * DASHBOARD STORYBOARD
 *
 *    0ms   header fades in + rises
 *  150ms   "New project" button appears
 *  250ms   project cards begin staggered reveal (80ms each)
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  header: 0,
  button: 0.15,
  cardsStart: 0.25,
};

const SPRING = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
  mass: 0.8,
};

const CARD_STAGGER = 0.08; // 80ms between each card

const ENTER = {
  initialY: 22,
  initialOpacity: 0,
  targetY: 0,
  targetOpacity: 1,
};

const CARD_HOVER = {
  y: -4,
  scale: 1.01,
  boxShadow: "0 12px 40px -12px rgba(59, 130, 246, 0.25)",
};

type Project = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  changelogs: { count: number }[];
  subscribers: { count: number }[];
};

export function DashboardContent({ projects }: { projects: Project[] }) {
  return (
    <main className="min-h-screen bg-[#0A0F1E] px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <motion.div
            initial={{ opacity: ENTER.initialOpacity, y: ENTER.initialY }}
            animate={{ opacity: ENTER.targetOpacity, y: ENTER.targetY }}
            transition={{ ...SPRING, delay: TIMING.header }}
          >
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-400">Manage your products and changelogs.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: TIMING.button }}
          >
            <Button asChild>
              <Link href="/dashboard/new-project">
                <Plus className="mr-2 h-4 w-4" /> New project
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: TIMING.cardsStart + idx * CARD_STAGGER }}
              whileHover={CARD_HOVER}
            >
              <Card className="border-slate-700/60 bg-slate-900/60 transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <span>{project.name}</span>
                    <Link className="text-sm text-blue-300" href={`/dashboard/${project.slug}`}>
                      Open
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-300">
                  <p>/{project.slug}</p>
                  <p className="mt-2">Changelogs: {project.changelogs?.[0]?.count ?? 0}</p>
                  <p>Subscribers: {project.subscribers?.[0]?.count ?? 0}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: TIMING.cardsStart }}
            className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-12 text-center"
          >
            <p className="text-lg text-slate-300">No projects yet.</p>
            <p className="mt-2 text-slate-400">Create your first project to get started.</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
