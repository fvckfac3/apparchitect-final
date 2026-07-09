/**
 * subscription-get
 * GET /functions/v1/subscription-get
 *
 * Returns the current user's subscription, quota usage, and tier.
 * Auth: Bearer supabase user JWT.
 * Returns: { subscription: Subscription | null, quotaUsage: QuotaUsage | null, tier: SubscriptionTier }
 */
import { createClient } from 'jsr:@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;

const supabaseUser = createClient(
  SUPABASE_URL,
  Deno.env.get('SUPABASE_ANON_KEY')!,
  { global: { headers: { Authorization: req => req.headers.get('Authorization') ?? '' } } },
);

const supabaseAdmin = createClient(
  SUPABASE_URL,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } },
);

function startOfMonthIso(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
}

Deno.serve(async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { data: { user }, error: userErr } = await supabaseUser.auth.getUser();
  if (userErr || !user) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data: sub, error: subErr } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (subErr) {
    return new Response(JSON.stringify({ error: subErr.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Quota usage for current month
  const { data: usageRows, error: usageErr } = await supabaseAdmin
    .from('quota_usage')
    .select('package, units_consumed')
    .eq('user_id', user.id)
    .gte('created_at', startOfMonthIso());

  if (usageErr) {
    console.error('quota_usage fetch error:', usageErr);
  }

  const unitsUsed = (usageRows ?? []).reduce((acc, r) => acc + r.units_consumed, 0);
  const ultimateUsed = (usageRows ?? []).filter((r) => r.package === 'ultimate').length;

  const tier = sub?.tier ?? 'free';

  return new Response(
    JSON.stringify({
      subscription: sub ?? null,
      quotaUsage: tier === 'free' ? null : { unitsUsed, ultimateUsed, unitsRemaining: tier === 'pro' ? Math.max(0, 10 - unitsUsed) : null, ultimateRemaining: tier === 'team' ? Math.max(0, 10 - ultimateUsed) : null },
      tier,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
});
