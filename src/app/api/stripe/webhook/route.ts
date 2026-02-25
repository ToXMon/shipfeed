import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing webhook configuration" }, { status: 400 });
  }

  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Use the service-role client so webhook writes bypass RLS (no user session available)
  const supabase = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email;
    if (email) {
      const { data: profile } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
      if (profile?.id) {
        await supabase.from("subscriptions").upsert({
          user_id: profile.id,
          stripe_customer_id: String(session.customer ?? ""),
          stripe_subscription_id: String(session.subscription ?? ""),
          plan: "pro",
          status: "active",
        });
      }
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object;
    const isActive = subscription.status === "active" || subscription.status === "trialing";
    await supabase
      .from("subscriptions")
      .update({ plan: isActive ? "pro" : "free", status: subscription.status })
      .eq("stripe_subscription_id", subscription.id);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    await supabase
      .from("subscriptions")
      .update({ plan: "free", status: subscription.status })
      .eq("stripe_subscription_id", subscription.id);
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object;
    const invoiceSubscription = (invoice as { subscription?: string | { id?: string } }).subscription;
    const subscriptionId = typeof invoiceSubscription === "string" ? invoiceSubscription : invoiceSubscription?.id;
    if (subscriptionId) {
      await supabase
        .from("subscriptions")
        .update({ status: "past_due" })
        .eq("stripe_subscription_id", subscriptionId);
    }
  }

  return NextResponse.json({ received: true });
}
