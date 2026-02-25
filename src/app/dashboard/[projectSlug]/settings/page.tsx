import { requireUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage({ params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = await params;
  const { supabase, user } = await requireUser();

  const { data: project } = await supabase
    .from("projects")
    .select("id,name,slug")
    .eq("slug", projectSlug)
    .eq("owner_id", user.id)
    .maybeSingle();

  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("email,confirmed,created_at")
    .eq("project_id", project?.id ?? "")
    .order("created_at", { ascending: false });

  const widget = `<script async src="${process.env.NEXT_PUBLIC_APP_URL}/widget.js" data-project="${project?.slug}"></script>`;

  return (
    <main className="min-h-screen bg-[#0A0F1E] px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card className="border-slate-700/60 bg-slate-900/60">
          <CardHeader><CardTitle>Project settings</CardTitle></CardHeader>
          <CardContent>
            <p className="text-slate-300">Embeddable widget code:</p>
            <pre className="mt-3 overflow-auto rounded-lg border border-slate-700/60 bg-slate-950 p-4 text-xs text-slate-300">{widget}</pre>
          </CardContent>
        </Card>

        <Card className="border-slate-700/60 bg-slate-900/60">
          <CardHeader><CardTitle>Subscribers</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            {subscribers?.map((sub) => (
              <div key={sub.email} className="flex items-center justify-between rounded border border-slate-700/60 p-3">
                <span>{sub.email}</span>
                <span>{sub.confirmed ? "confirmed" : "pending"}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
