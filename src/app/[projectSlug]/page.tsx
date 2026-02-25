import { notFound } from "next/navigation";
import { format } from "date-fns";
import { marked } from "marked";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

async function subscribe(formData: FormData) {
  "use server";

  const projectId = String(formData.get("projectId") ?? "");
  // projectSlug is included in form for future confirmation flow.
  const email = String(formData.get("email") ?? "").toLowerCase();

  const supabase = await createClient();
  await supabase.from("subscribers").upsert({ project_id: projectId, email, confirmed: true });
}

export default async function PublicChangelogPage({ params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id,name,description")
    .eq("slug", projectSlug)
    .maybeSingle();

  if (!project) notFound();

  const { data: changelogs } = await supabase
    .from("changelogs")
    .select("id,title,content,version,published_at")
    .eq("project_id", project.id)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#0A0F1E] px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-white">{project.name} Changelog</h1>
          <p className="mt-2 text-slate-300">{project.description}</p>
        </header>

        <Card className="mb-8 border-slate-700/60 bg-slate-900/60">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Subscribe to updates</h2>
            <form action={subscribe} className="mt-4 flex gap-3">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="projectSlug" value={projectSlug} />
              <Input name="email" required type="email" placeholder="you@company.com" />
              <Button type="submit">Subscribe</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {changelogs?.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6">
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
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
