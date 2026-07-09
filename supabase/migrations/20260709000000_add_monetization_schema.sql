-- ============================================================================
-- 20260709000000_add_monetization_schema.sql
--
-- AppArchitect — Monetization schema (per Monetization & Pricing PRD §8).
-- Adds: subscriptions, quota_usage, webhook_events, tier_change_audit.
-- Existing tables: profiles, projects, document_versions, ai_calls.
--
-- This migration is idempotent: safe to re-run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- §0. handle_updated_at — generic trigger function. Defined first so all
--    tables below can use it.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- §1. subscriptions — one row per user, mirrors Stripe state.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free'
    CHECK (tier IN ('free', 'pro', 'team')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'trialing', 'past_due', 'unpaid', 'canceled', 'incomplete')),
  interval TEXT
    CHECK (interval IS NULL OR interval IN ('month', 'year')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  grace_period_ends_at TIMESTAMP WITH TIME ZONE,
  package TEXT NOT NULL DEFAULT 'standard'
    CHECK (package IN ('standard', 'ultimate')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_idx ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS subscriptions_tier_idx ON public.subscriptions(tier);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Inserts/updates/deletes are done by the service role (webhook handler).
-- No user-facing write policies.

DROP TRIGGER IF EXISTS subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- §2. quota_usage — per-user, per-month, unit consumption for flex quota.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quota_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  standard_units_used INTEGER NOT NULL DEFAULT 0,
  ultimate_units_used INTEGER NOT NULL DEFAULT 0,
  -- Total cost in standard-equivalent units (1 ultimate = 3 standard).
  standard_equivalent_used INTEGER NOT NULL DEFAULT 0,
  last_generation_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, period_start)
);

CREATE INDEX IF NOT EXISTS quota_usage_user_id_idx ON public.quota_usage(user_id);
CREATE INDEX IF NOT EXISTS quota_usage_period_idx ON public.quota_usage(period_start, period_end);

ALTER TABLE public.quota_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own quota usage" ON public.quota_usage;
CREATE POLICY "Users can view own quota usage"
  ON public.quota_usage FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ----------------------------------------------------------------------------
-- §3. webhook_events — idempotency log for Stripe webhooks.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id TEXT PRIMARY KEY,  -- Stripe event ID
  type TEXT NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  result TEXT,
  error_message TEXT,
  payload JSONB
);

CREATE INDEX IF NOT EXISTS webhook_events_received_at_idx ON public.webhook_events(received_at);
CREATE INDEX IF NOT EXISTS webhook_events_type_idx ON public.webhook_events(type);

-- Webhook events are not user-visible; only the service role reads them.

-- ----------------------------------------------------------------------------
-- §4. tier_change_audit — append-only log of every tier transition.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tier_change_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_tier TEXT NOT NULL,
  to_tier TEXT NOT NULL,
  reason TEXT NOT NULL,  -- 'upgrade', 'downgrade', 'cancel', 'payment_failure', 'trial_expired', 'admin'
  stripe_event_id TEXT,
  metadata JSONB,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tier_change_audit_user_id_idx ON public.tier_change_audit(user_id);
CREATE INDEX IF NOT EXISTS tier_change_audit_changed_at_idx ON public.tier_change_audit(changed_at);

ALTER TABLE public.tier_change_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tier change audit" ON public.tier_change_audit;
CREATE POLICY "Users can view own tier change audit"
  ON public.tier_change_audit FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ----------------------------------------------------------------------------
-- §5. Auto-create a free subscription row on profile creation.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created_subscription ON public.profiles;
CREATE TRIGGER on_profile_created_subscription
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_subscription();

-- ----------------------------------------------------------------------------
-- §6. handle_updated_at — generic trigger function (used by subscriptions +
--    quota_usage). Idempotent: only created if it doesn't exist.
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- §7. Row-level comments for documentation / future agents.
-- ----------------------------------------------------------------------------
COMMENT ON TABLE public.subscriptions IS
  'AppArchitect subscription state, mirrored from Stripe webhooks. One row per user. Source of truth for tier, status, and current billing period.';
COMMENT ON TABLE public.quota_usage IS
  'Per-user, per-month generation quota consumption. Reset on the 1st of each month. 1 Ultimate = 3 Standard-equivalent units.';
COMMENT ON TABLE public.webhook_events IS
  'Idempotency log for Stripe webhook events. event.id is the primary key. Duplicate events are skipped on retry.';
COMMENT ON TABLE public.tier_change_audit IS
  'Append-only audit log of every tier transition (upgrade, downgrade, cancel, payment failure, trial expired).';

COMMENT ON COLUMN public.subscriptions.tier IS
  'Effective tier: free | pro | team. Defaults to free. Updated by Stripe webhook handler.';
COMMENT ON COLUMN public.subscriptions.status IS
  'Stripe subscription status. NULL would be unusual — defaults to active for free tier.';
COMMENT ON COLUMN public.subscriptions.package IS
  'Last selected package for the next generation. Resets to standard on tier change.';
COMMENT ON COLUMN public.subscriptions.grace_period_ends_at IS
  'When set, the subscription is in payment-failure grace. Tier auto-downgrades to free when this passes.';
COMMENT ON COLUMN public.quota_usage.standard_equivalent_used IS
  'Total units consumed: standard_units_used + (ultimate_units_used * 3).';
