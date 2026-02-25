import { NextResponse } from "next/server";
import { canUseAi, getUserPlan } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";

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

  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ markdown: fallbackMarkdown(changes) });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You write concise, polished SaaS release notes in markdown with sections: Highlights, Improvements, Fixes.",
          },
          {
            role: "user",
            content: `Turn these changes into release notes:\n${changes}`,
          },
        ],
      }),
    });

    if (!response.ok) return NextResponse.json({ markdown: fallbackMarkdown(changes) });
    const data = await response.json();
    const markdown = data.choices?.[0]?.message?.content ?? fallbackMarkdown(changes);
    return NextResponse.json({ markdown });
  } catch {
    return NextResponse.json({ markdown: fallbackMarkdown(changes) });
  }
}
