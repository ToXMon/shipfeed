import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangelogEditor } from "@/components/changelog-editor";

async function createChangelog(formData: FormData) {
  "use server";
  const { supabase, user } = await requireUser();

  const projectId = String(formData.get("projectId"));
  const title = String(formData.get("title"));
  const version = String(formData.get("version"));
  const content = String(formData.get("content"));
  const status = String(formData.get("status")) as "draft" | "published";

  const { data: project } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", projectId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!project) redirect("/dashboard");

  const { error } = await supabase.from("changelogs").insert({
    project_id: projectId,
    title,
    version,
    content,
    status,
    author_id: user.id,
    published_at: status === "published" ? new Date().toISOString() : null,
  });

  if (error) {
    redirect(`/dashboard/${project.slug}/new?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/dashboard/${project.slug}`);
}

export default async function NewChangelogPage({ params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = await params;
  const { supabase, user } = await requireUser();
  const { data: project } = await supabase
    .from("projects")
    .select("id,name,slug")
    .eq("slug", projectSlug)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!project) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-[#0A0F1E] px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-3xl">
        <Card className="border-slate-700/60 bg-slate-900/60">
          <CardHeader>
            <CardTitle>New changelog for {project.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChangelogEditor projectId={project.id} onSubmit={createChangelog} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
