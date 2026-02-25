import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plans";

const FREE_PROJECT_LIMIT = 1;

export async function GET() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(userData.user.id);
  if (plan !== "pro") {
    const { count } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userData.user.id);
    if ((count ?? 0) >= FREE_PROJECT_LIMIT) {
      return NextResponse.json(
        { error: `Free plan is limited to ${FREE_PROJECT_LIMIT} project. Upgrade to Pro for unlimited projects.` },
        { status: 403 },
      );
    }
  }

  const body = await req.json();
  const { name, slug, description } = body;
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Missing or invalid name" }, { status: 400 });
  }

  const payload = { name, slug, description, owner_id: userData.user.id };
  const { data, error } = await supabase.from("projects").insert(payload).select("*").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}
