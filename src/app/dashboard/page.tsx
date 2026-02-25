import Link from "next/link";
import { Plus } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const { supabase, user } = await requireUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("id,name,slug,created_at,changelogs(count),subscribers(count)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#0A0F1E] px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-400">Manage your products and changelogs.</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/new-project"><Plus className="mr-2 h-4 w-4" /> New project</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects?.map((project) => (
            <Card key={project.id} className="border-slate-700/60 bg-slate-900/60">
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
          ))}
        </div>
      </div>
    </main>
  );
}
