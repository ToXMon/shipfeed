type VeniceModelProfile = {
  draftModel: string;
  temperature: number;
  maxTokens: number;
};

const PROFILES: Record<string, VeniceModelProfile> = {
  cost: {
    draftModel: "qwen3-4b",
    temperature: 0.35,
    maxTokens: 700,
  },
  balanced: {
    draftModel: "llama-3.3-70b",
    temperature: 0.3,
    maxTokens: 900,
  },
  quality: {
    draftModel: "qwen3-235b-a22b-instruct-2507",
    temperature: 0.25,
    maxTokens: 1200,
  },
};

export function getVeniceProfile() {
  const mode = (process.env.VENICE_MODEL_PROFILE ?? "cost").toLowerCase();
  return PROFILES[mode] ?? PROFILES.cost;
}

export function veniceEnabled() {
  return Boolean(process.env.VENICE_API_KEY);
}

export async function generateDraftWithVenice(changes: string) {
  const profile = getVeniceProfile();

  const response = await fetch("https://api.venice.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VENICE_API_KEY}`,
    },
    body: JSON.stringify({
      model: profile.draftModel,
      messages: [
        {
          role: "system",
          content:
            "You write concise product release notes in markdown with sections: Highlights, Improvements, Fixes. Use crisp SaaS language.",
        },
        {
          role: "user",
          content: `Convert these changes into polished release notes:\n${changes}`,
        },
      ],
      temperature: profile.temperature,
      max_tokens: profile.maxTokens,
      extra_body: {
        venice_parameters: {
          include_venice_system_prompt: false,
          disable_thinking: true,
          strip_thinking_response: true,
        },
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Venice request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return String(data?.choices?.[0]?.message?.content ?? "").trim();
}
