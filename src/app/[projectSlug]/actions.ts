"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribe(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const email = String(formData.get("email") ?? "").toLowerCase();

  const supabase = await createClient();
  await supabase.from("subscribers").upsert({ project_id: projectId, email, confirmed: true });
}
