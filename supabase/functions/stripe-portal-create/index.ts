/**
 * stripe-portal-create
 * POST /functions/v1/stripe-portal-create
 *
 * Creates a Stripe Customer Portal session URL.
 * Auth: Bearer supabase user JWT.
 * Returns: { url: string }
 */
import Stripe from 'npm:stripe@17.4.0';
import { createClient } from 'jsr:@supabase/supabase-js@2.45.4';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' });

function createUserClient(auth: string) {
  return createClient(
    SUPABASE_URL,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: auth } } },
  );
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const auth = req.headers.get('Authorization');
  if (!auth) {
    return new Response(JSON.stringify({ error: 'STRIPE_PORTAL_LINK_FAILED', detail: 'no auth' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseUser = createUserClient(auth);
  const { data: { user }, error: userErr } = await supabaseUser.auth.getUser();
  if (userErr || !user) {
    return new Response(JSON.stringify({ error: 'STRIPE_PORTAL_LINK_FAILED', detail: 'invalid auth' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { returnUrl } = await req.json().catch(() => ({ returnUrl: req.headers.get('origin') ?? 'https://app.example.com' }));

  const supabaseAdmin = createClient(
    SUPABASE_URL,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );

  const { data: sub, error: subErr } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (subErr || !sub?.stripe_customer_id) {
    return new Response(JSON.stringify({ error: 'STRIPE_SUBSCRIPTION_NOT_FOUND' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: returnUrl,
    });
    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Portal session create failed:', err);
    return new Response(JSON.stringify({ error: 'STRIPE_PORTAL_LINK_FAILED', detail: (err as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
