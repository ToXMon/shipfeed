import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProjectPage({ params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = await params;
  const { supabase, user } = await requireUser();

  const { data: project } = await supabase
    .from("projects")
    .select("id,name,slug,description")
    .eq("slug", projectSlug)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!project) notFound();

  const { data: changelogs } = await supabase
    .from("changelogs")
    .select("id,title,version,status,created_at")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <main className="min-h-screen bg-[#0A0F1E] px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-slate-400">{project.description}</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline"><Link href={`/${project.slug}`}>Public page</Link></Button>
            <Button asChild><Link href={`/dashboard/${project.slug}/new`}>New changelog</Link></Button>
          </div>
        </div>

        <Card className="border-slate-700/60 bg-slate-900/60">
          <CardHeader>
            <CardTitle>Recent changelogs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {changelogs?.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-slate-700/60 p-4">
                <p className="font-medium text-white">{entry.title}</p>
                <p className="text-sm text-slate-400">{entry.version} • {entry.status}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
