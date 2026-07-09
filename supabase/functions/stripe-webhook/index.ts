/**
 * stripe-webhook
 * POST /functions/v1/stripe-webhook
 *
 * Handles Stripe webhook events. Verifies signature using the raw body
 * and STRIPE_WEBHOOK_SECRET. Idempotent: tracks processed event IDs.
 *
 * Handles:
 *   - checkout.session.completed          -> activate sub
 *   - customer.subscription.updated       -> sync tier + status
 *   - customer.subscription.deleted       -> cancel
 *   - invoice.payment_failed              -> mark past_due + grace
 *   - invoice.payment_succeeded           -> clear grace, extend period
 *   - customer.subscription.trial_will_end -> log only (UI handles prompt)
 *
 * PRD: Monetization §7.3 (webhook events), §10.2 (decision logic).
 */
import Stripe from 'npm:stripe@17.4.0';
import { createClient } from 'jsr:@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' });

const supabaseAdmin = createClient(
  SUPABASE_URL,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } },
);

const processedEvents = new Map<string, number>();
const EVENT_TTL_MS = 24 * 60 * 60 * 1000;

function markProcessed(id: string) {
  processedEvents.set(id, Date.now());
  for (const [key, ts] of processedEvents) {
    if (Date.now() - ts > EVENT_TTL_MS) processedEvents.delete(key);
  }
}

function tierFromPriceId(priceId: string | null | undefined): 'pro' | 'team' | null {
  const proMonthly = Deno.env.get('STRIPE_PRICE_ID_PRO_MONTHLY');
  const proYearly = Deno.env.get('STRIPE_PRICE_ID_PRO_YEARLY');
  const teamMonthly = Deno.env.get('STRIPE_PRICE_ID_TEAM_MONTHLY');
  const teamYearly = Deno.env.get('STRIPE_PRICE_ID_TEAM_YEARLY');
  if (priceId === proMonthly || priceId === proYearly) return 'pro';
  if (priceId === teamMonthly || priceId === teamYearly) return 'team';
  return null;
}

function intervalFromPriceId(priceId: string | null | undefined): 'month' | 'year' | null {
  const yearly = [
    Deno.env.get('STRIPE_PRICE_ID_PRO_YEARLY'),
    Deno.env.get('STRIPE_PRICE_ID_TEAM_YEARLY'),
  ];
  if (priceId && yearly.includes(priceId)) return 'year';
  return 'month';
}

async function upsertSubscription(args: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  trialEnd: number | null;
}) {
  const tier = tierFromPriceId(args.stripePriceId) ?? 'pro';
  const interval = intervalFromPriceId(args.stripePriceId) ?? 'month';
  const now = new Date().toISOString();
  const trialEndsAt = args.trialEnd ? new Date(args.trialEnd * 1000).toISOString() : null;

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(
      {
        user_id: args.userId,
        tier,
        status: args.status,
        interval,
        stripe_customer_id: args.stripeCustomerId,
        stripe_subscription_id: args.stripeSubscriptionId,
        stripe_price_id: args.stripePriceId,
        trial_ends_at: trialEndsAt,
        current_period_start: new Date(args.currentPeriodStart * 1000).toISOString(),
        current_period_end: new Date(args.currentPeriodEnd * 1000).toISOString(),
        cancel_at_period_end: args.cancelAtPeriodEnd,
        updated_at: now,
      },
      { onConflict: 'stripe_subscription_id' },
    );
  if (error) {
    console.error('Subscription upsert error:', error);
    throw error;
  }
}
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET not set');
    return new Response('Webhook not configured', { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature', { status: 401 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Signature verification failed:', (err as Error).message);
    return new Response(`STRIPE_SIGNATURE_INVALID: ${(err as Error).message}`, { status: 401 });
  }

  if (processedEvents.has(event.id)) {
    return new Response(JSON.stringify({ received: true, skipped: 'duplicate' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id ?? session.client_reference_id;
        if (!userId) {
          console.error('No user id in checkout session', session.id);
          break;
        }
        const subscriptionId = session.subscription as string;
        if (!subscriptionId) break;
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = sub.items.data[0]?.price.id;
        await upsertSubscription({
          userId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscriptionId,
          stripePriceId: priceId ?? '',
          status: sub.status,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          currentPeriodStart: sub.current_period_start,
          currentPeriodEnd: sub.current_period_end,
          trialEnd: sub.trial_end ?? null,
        });
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        if (!userId) {
          console.warn('No user id in subscription', sub.id);
          break;
        }
        const priceId = sub.items.data[0]?.price.id;
        await upsertSubscription({
          userId,
          stripeCustomerId: sub.customer as string,
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId ?? '',
          status: sub.status,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          currentPeriodStart: sub.current_period_start,
          currentPeriodEnd: sub.current_period_end,
          trialEnd: sub.trial_end ?? null,
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const now = new Date().toISOString();
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'canceled', tier: 'free', updated_at: now })
          .eq('stripe_subscription_id', sub.id);
        if (error) {
          console.error('Subscription delete error:', error);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string | null;
        if (!subscriptionId) break;
        const graceEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'past_due',
            grace_period_ends_at: graceEnd,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId);
        if (error) {
          console.error('Payment failed update error:', error);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string | null;
        if (!subscriptionId) break;
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'active',
            grace_period_ends_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId);
        if (error) {
          console.error('Payment succeeded update error:', error);
        }
        break;
      }

      case 'customer.subscription.trial_will_end': {
        console.log('trial_will_end received:', (event.data.object as Stripe.Subscription).id);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    markProcessed(event.id);
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return new Response(`Webhook handler error: ${(err as Error).message}`, { status: 500 });
  }
});
