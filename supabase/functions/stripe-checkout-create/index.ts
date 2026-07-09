/**
 * stripe-checkout-create
 * POST /functions/v1/stripe-checkout-create
 *
 * Creates a Stripe Checkout session for upgrading to Pro or Team.
 * Body: { targetTier: 'pro' | 'team', interval: 'month' | 'year', successUrl, cancelUrl }
 *
 * Auth: requires an authenticated user via the Authorization header.
 *
 * Env: STRIPE_SECRET_KEY, STRIPE_PRICE_ID_PRO_MONTHLY, STRIPE_PRICE_ID_PRO_YEARLY,
 *      STRIPE_PRICE_ID_TEAM_MONTHLY, STRIPE_PRICE_ID_TEAM_YEARLY
 *
 * Maps to Monetization & Pricing PRD §6.1 (Trigger -> Modal -> Checkout).
 */
import Stripe from 'npm:stripe@17.4.0';
import { createClient } from 'jsr:@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const PRO_MONTHLY = Deno.env.get('STRIPE_PRICE_ID_PRO_MONTHLY')!;
const PRO_YEARLY = Deno.env.get('STRIPE_PRICE_ID_PRO_YEARLY')!;
const TEAM_MONTHLY = Deno.env.get('STRIPE_PRICE_ID_TEAM_MONTHLY')!;
const TEAM_YEARLY = Deno.env.get('STRIPE_PRICE_ID_TEAM_YEARLY')!;

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' });

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function priceIdFor(tier: string, interval: string): string {
  if (tier === 'pro' && interval === 'year') return PRO_YEARLY;
  if (tier === 'pro') return PRO_MONTHLY;
  if (tier === 'team' && interval === 'year') return TEAM_YEARLY;
  if (tier === 'team') return TEAM_MONTHLY;
  throw new Error(`Unknown tier/interval: ${tier}/${interval}`);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!STRIPE_SECRET_KEY) return json({ error: 'Stripe not configured' }, 500);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Missing bearer token' }, 401);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: { targetTier?: string; interval?: string; successUrl?: string; cancelUrl?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { targetTier, interval, successUrl, cancelUrl } = body;
  if (!targetTier || !interval) {
    return json({ error: 'Missing targetTier or interval' }, 400);
  }
  if (!['pro', 'team'].includes(targetTier)) {
    return json({ error: 'Invalid targetTier' }, 400);
  }
  if (!['month', 'year'].includes(interval)) {
    return json({ error: 'Invalid interval' }, 400);
  }

  // Look up or create the Stripe customer for this user.
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  let customerId = existing?.stripe_customer_id as string | null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
  }

  let priceId: string;
  try {
    priceId = priceIdFor(targetTier, interval);
  } catch (err) {
    return json({ error: (err as Error).message }, 400);
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl ?? `${req.headers.get('origin')}/settings/billing?upgraded=true`,
      cancel_url: cancelUrl ?? `${req.headers.get('origin')}/settings/billing?cancelled=true`,
      metadata: { supabase_user_id: user.id, target_tier: targetTier },
      subscription_data: {
        metadata: { supabase_user_id: user.id, target_tier: targetTier },
      },
    });
    return json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return json({ error: `STRIPE_CHECKOUT_FAILED: ${(err as Error).message}` }, 402);
  }
});
