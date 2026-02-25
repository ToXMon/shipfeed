import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicChangelogContent } from "./changelog-content";

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

  return <PublicChangelogContent project={project} projectSlug={projectSlug} changelogs={changelogs ?? []} />;
}
