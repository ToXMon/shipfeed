import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { projectId, email } = body;

  const { data, error } = await supabase
    .from("subscribers")
    .upsert({ project_id: projectId, email: String(email).toLowerCase(), confirmed: true })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { projectId, email, confirmed } = body;

  const { data, error } = await supabase
    .from("subscribers")
    .update({ confirmed: Boolean(confirmed) })
    .eq("project_id", projectId)
    .eq("email", String(email).toLowerCase())
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
  const projectId = searchParams.get("projectId");
  const email = searchParams.get("email");
  if (!projectId || !email) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const { error } = await supabase
    .from("subscribers")
    .delete()
    .eq("project_id", projectId)
    .eq("email", email.toLowerCase());

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
