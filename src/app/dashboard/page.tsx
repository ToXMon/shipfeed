import { requireUser } from "@/lib/auth";
import { DashboardContent } from "./dashboard-content";

export default async function DashboardPage() {
  const { supabase, user } = await requireUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("id,name,slug,created_at,changelogs(count),subscribers(count)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return <DashboardContent projects={projects ?? []} />;
}
