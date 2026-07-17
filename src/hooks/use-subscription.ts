/**
 * use-subscription.ts — React hook exposing the current user's tier,
 * subscription state, and quota usage. Drives the paywall modal and the
 * pricing page.
 *
 * Source of truth:
 *   - Tier + status: public.subscriptions row (per PRD §8.1 schema)
 *   - Project count: public.projects (for the BIZ_PROJECT_LIMIT_REACHED check)
 *   - Quota usage: public.quota_usage row (monthly flex units, PRD §3.4)
 *
 * Refreshes when:
 *   - Supabase auth state changes (login / logout)
 *   - The user re-mounts a tree that needs tier info
 *   - A checkout completion event fires (see useSubscription().refresh())
 */

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SubscriptionState, QuotaUsage, QuotaUsageRow } from '@/lib/billing/types';
import { fetchSubscription } from '@/lib/billing/stripe-client';
import { useAuth } from '@/contexts/AuthContext';

interface UseSubscriptionResult {
  loading: boolean;
  authenticated: boolean;
  subscription: SubscriptionState | null;
  quota: QuotaUsageRow | null;
  quotaUsage: QuotaUsage | null;
  projectCount: number;
  refresh: () => Promise<void>;
  refetch: () => Promise<void>;
}

const EMPTY: SubscriptionState = {
  tier: 'free',
  status: null,
  interval: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  trialEndsAt: null,
  gracePeriodEndsAt: null,
  stripeCustomerId: null,
  stripeSubscriptionId: null,
};

export function useSubscription(): UseSubscriptionResult {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionState | null>(null);
  const [quota, setQuota] = useState<QuotaUsageRow | null>(null);
  const [projectCount, setProjectCount] = useState(0);

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setAuthenticated(false);
      setSubscription(EMPTY);
      setQuota(null);
      setProjectCount(0);
      setLoading(false);
      return;
    }
    setAuthenticated(true);

    const subPromise = fetchSubscription().catch(() => null);

    const [{ data: subRow }, { data: quotaRow }, { count: projCount }] = await Promise.all([
      supabase
        .from('subscriptions')
        .select('tier, status, interval, current_period_end, cancel_at_period_end, trial_ends_at, grace_period_ends_at, stripe_customer_id, stripe_subscription_id')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabase
        .from('quota_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('period_start', new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)).toISOString())
        .maybeSingle(),
      supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
    ]);

    const live = await subPromise;

    if (subRow) {
      setSubscription({
        tier: subRow.tier,
        status: subRow.status,
        interval: subRow.interval,
        currentPeriodEnd: subRow.current_period_end,
        cancelAtPeriodEnd: subRow.cancel_at_period_end,
        trialEndsAt: subRow.trial_ends_at,
        gracePeriodEndsAt: subRow.grace_period_ends_at,
        stripeCustomerId: subRow.stripe_customer_id,
        stripeSubscriptionId: subRow.stripe_subscription_id,
      });
    } else if (live) {
      setSubscription(live);
    } else {
      setSubscription(EMPTY);
    }

    setQuota(quotaRow ? {
      unitsUsed: quotaRow.standard_equivalent_used ?? 0,
      ultimateUsed: quotaRow.ultimate_units_used ?? 0,
      standardUsed: quotaRow.standard_units_used ?? 0,
      unitsRemaining: null,
      ultimateRemaining: null,
    } : null);
    setProjectCount(projCount ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, _session) => {
      void load();
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  return { loading, authenticated, subscription, quota, quotaUsage: quota, projectCount, refresh: load, refetch: load };
}
