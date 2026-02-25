import { createClient } from "@/lib/supabase/server";

export async function getUserPlan(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("plan,status")
    .eq("user_id", userId)
    .maybeSingle();

  return data?.plan ?? "free";
}

export function canUseAi(plan: string) {
  return plan === "pro";
}
