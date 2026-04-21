import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.CheckoutSession;
        const userId = session.metadata?.supabase_user_id;
        const plan = session.metadata?.plan as "starter" | "pro";

        if (userId && plan && PLANS[plan]) {
          await supabase
            .from("profiles")
            .update({
              plan,
              credits_remaining: PLANS[plan].credits,
              stripe_subscription_id: session.subscription as string,
            })
            .eq("id", userId);
        }
        break;
      }

      case "invoice.paid": {
        // Monthly renewal — reset credits
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile?.plan && profile.plan !== "free") {
          const plan = profile.plan as "starter" | "pro";
          await supabase
            .from("profiles")
            .update({ credits_remaining: PLANS[plan].credits })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabase
          .from("profiles")
          .update({
            plan: "free",
            credits_remaining: 0,
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
