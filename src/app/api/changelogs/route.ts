import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plans";

const FREE_CHANGELOG_MONTHLY_LIMIT = 10;

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  const query = supabase.from("changelogs").select("*").order("created_at", { ascending: false });
  const { data, error } = projectId ? await query.eq("project_id", projectId) : await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(userData.user.id);
  if (plan !== "pro") {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("changelogs")
      .select("*", { count: "exact", head: true })
      .eq("author_id", userData.user.id)
      .gte("created_at", monthStart.toISOString());
    if ((count ?? 0) >= FREE_CHANGELOG_MONTHLY_LIMIT) {
      return NextResponse.json(
        { error: `Free plan is limited to ${FREE_CHANGELOG_MONTHLY_LIMIT} changelogs per month. Upgrade to Pro for unlimited changelogs.` },
        { status: 403 },
      );
    }
  }

  const body = await req.json();
  const { project_id, title } = body;
  if (!project_id || typeof project_id !== "string") {
    return NextResponse.json({ error: "Missing or invalid project_id" }, { status: 400 });
  }
  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Missing or invalid title" }, { status: 400 });
  }

  const payload = { ...body, author_id: userData.user.id };
  const { data, error } = await supabase.from("changelogs").insert(payload).select("*").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...updates } = body;

  const { data, error } = await supabase
    .from("changelogs")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("changelogs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
