import { NextResponse } from "next/server";
import { canUseAi, getUserPlan } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";
import { generateDraftWithVenice, veniceEnabled } from "@/lib/ai";

function fallbackMarkdown(input: string) {
  return `## Highlights\n\n${input
    .split("\n")
    .filter(Boolean)
    .map((line) => `- ${line.replace(/^[-*]\s?/, "")}`)
    .join("\n")}\n\n## Notes\n\n- Performance and stability improvements\n- Internal tooling refinements`;
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(userData.user.id);
  if (!canUseAi(plan)) {
    return NextResponse.json({ error: "AI drafting is a Pro feature" }, { status: 403 });
  }

  const body = await req.json();
  const changes = String(body.changes ?? "").trim();
  if (!changes) return NextResponse.json({ error: "Missing changes" }, { status: 400 });

  if (!veniceEnabled()) return NextResponse.json({ markdown: fallbackMarkdown(changes) });

  try {
    const markdown = await generateDraftWithVenice(changes);
    return NextResponse.json({ markdown: markdown || fallbackMarkdown(changes) });
  } catch {
    return NextResponse.json({ markdown: fallbackMarkdown(changes) });
  }
}

