import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

async function createProject(formData: FormData) {
  "use server";
  const { supabase, user } = await requireUser();

  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");
  const slug = slugify(name);

  const { error } = await supabase.from("projects").insert({
    name,
    slug,
    description,
    owner_id: user.id,
  });

  if (error) {
    redirect(`/dashboard/new-project?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/dashboard/${slug}`);
}

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-2xl">
        <Card className="border-slate-700/60 bg-slate-900/60">
          <CardHeader>
            <CardTitle>Create project</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createProject} className="space-y-4">
              <Input name="name" placeholder="ShipFeed" required />
              <Textarea name="description" placeholder="What does this product do?" />
              <Button type="submit">Create project</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
