/**
 * Billing.tsx - /settings/billing
 *
 * Implements the upgrade/downgrade/cancel flows from Monetization & Pricing
 * PRD section 6.2, 6.3, 6.4. Server-authoritative for tier changes (see
 * supabase/functions/stripe-portal-create).
 */
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/use-subscription';
import { startCheckout, openPortal } from '@/lib/billing/stripe-client';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { SubscriptionTier } from '@/lib/billing/types';

const TIER_LABEL: Record<SubscriptionTier, string> = {
  free: 'Free',
  pro: 'Pro',
  team: 'Team',
};

const TIER_PRICE: Record<SubscriptionTier, string> = {
  free: '$0',
  pro: '$49/month',
  team: '$149/month',
};

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  trialing: { label: 'Trial', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  past_due: { label: 'Payment failed', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  unpaid: { label: 'Unpaid', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  canceled: { label: 'Canceled', color: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40' },
  incomplete: { label: 'Incomplete', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  none: { label: 'No subscription', color: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40' },
};

export default function Billing() {
  const { user } = useAuth();
  const { subscription, quotaUsage, loading, refetch } = useSubscription();
  const [interval, setInterval] = useState<'month' | 'year'>('month');
  const [working, setWorking] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<'downgrade' | 'cancel' | null>(null);

  const tier = subscription?.tier ?? 'free';
  const status = subscription?.status ?? 'none';
  const statusInfo = STATUS_BADGE[status] ?? STATUS_BADGE.none;

  async function handleUpgrade(target: 'pro' | 'team') {
    if (!user) return;
    setWorking('upgrade-' + target);
    try {
      const { url } = await startCheckout({
        targetTier: target,
        interval,
        successUrl: window.location.origin + '/settings/billing?upgraded=true',
        cancelUrl: window.location.origin + '/settings/billing?cancelled=true',
      });
      window.location.href = url;
    } catch (err) {
      alert('Could not start checkout: ' + (err as Error).message);
    } finally {
      setWorking(null);
    }
  }

  async function handlePortal() {
    if (!user) return;
    setWorking('portal');
    try {
      const { url } = await openPortal({ returnUrl: window.location.href });
      window.location.href = url;
    } catch (err) {
      alert('Could not open billing portal: ' + (err as Error).message);
    } finally {
      setWorking(null);
    }
  }

  function handleConfirm() {
    setConfirm(null);
    handlePortal();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-4xl mx-auto">Loading billing…</div>
      </main>
    );
  }

  const upgraded = new URLSearchParams(window.location.search).get('upgraded');

  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-balance">Billing</h1>
          <p className="text-muted-foreground mt-2">Manage your subscription, payment method, and invoices.</p>
        </header>

        <Card className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Current plan</div>
              <div className="text-2xl font-semibold mt-1">{TIER_LABEL[tier]}</div>
              <div className="text-sm text-muted-foreground mt-1">{TIER_PRICE[tier]}</div>
            </div>
            <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs border', statusInfo.color)}>
              {statusInfo.label}
            </span>
          </div>

          {subscription?.trialEndsAt && subscription.status === 'trialing' && (
            <div className="mt-4 p-3 rounded-md bg-amber-500/10 border border-amber-500/30 text-sm">
              Your trial ends {new Date(subscription.trialEndsAt).toLocaleDateString()}. Add a payment method to continue.
            </div>
          )}

          {status === 'past_due' && (
            <div className="mt-4 p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-sm">
              Your last payment failed. Update your payment method to avoid losing Pro access.
            </div>
          )}

          {subscription?.currentPeriodEnd && subscription?.cancelAtPeriodEnd && (
            <div className="mt-4 p-3 rounded-md bg-zinc-500/10 border border-zinc-500/30 text-sm">
              Your subscription is set to end on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}. You will keep access until then.
            </div>
          )}
        </Card>
        {quotaUsage && tier !== 'free' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Quota usage this month</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Units used</div>
                <div className="text-2xl font-semibold mt-1">{quotaUsage.unitsUsed}</div>
              </div>
              {tier === 'pro' && (
                <div>
                  <div className="text-muted-foreground">Units remaining</div>
                  <div className="text-2xl font-semibold mt-1">{Math.max(0, 10 - quotaUsage.unitsUsed)} / 10</div>
                </div>
              )}
              {tier === 'team' && (
                <div>
                  <div className="text-muted-foreground">Ultimate used</div>
                  <div className="text-2xl font-semibold mt-1">{quotaUsage.ultimateUsed} / 10</div>
                </div>
              )}
            </div>
          </Card>
        )}

        {tier === 'free' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2">Upgrade</h2>
            <p className="text-sm text-muted-foreground mb-6">Choose a plan to start your subscription.</p>
            <div className="flex gap-2 mb-4">
              <Button variant={interval === 'month' ? 'primary' : 'ghost'} size="sm" onClick={() => setInterval('month')}>
                Monthly
              </Button>
              <Button variant={interval === 'year' ? 'primary' : 'ghost'} size="sm" onClick={() => setInterval('year')}>
                Yearly (Save 20%)
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="font-semibold">Pro</div>
                <div className="text-2xl font-bold mt-2">{interval === 'month' ? '$49' : '$468'}</div>
                <div className="text-xs text-muted-foreground">per {interval === 'month' ? 'month' : 'year'}</div>
                <Button className="w-full mt-4" onClick={() => handleUpgrade('pro')} disabled={working === 'upgrade-pro'}>
                  {working === 'upgrade-pro' ? 'Loading…' : 'Upgrade to Pro'}
                </Button>
              </Card>
              <Card className="p-4">
                <div className="font-semibold">Team</div>
                <div className="text-2xl font-bold mt-2">{interval === 'month' ? '$149' : '$1,428'}</div>
                <div className="text-xs text-muted-foreground">per {interval === 'month' ? 'month' : 'year'}</div>
                <Button className="w-full mt-4" onClick={() => handleUpgrade('team')} disabled={working === 'upgrade-team'}>
                  {working === 'upgrade-team' ? 'Loading…' : 'Upgrade to Team'}
                </Button>
              </Card>
            </div>
          </Card>
        )}

        {tier !== 'free' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Manage subscription</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={handlePortal} disabled={working === 'portal'}>
                {working === 'portal' ? 'Opening…' : 'Open billing portal'}
              </Button>
              {(tier === 'pro' || tier === 'team') && (
                <Button variant="ghost" onClick={() => setConfirm('downgrade')}>
                  Downgrade to Free
                </Button>
              )}
              <Button variant="ghost" onClick={() => setConfirm('cancel')}>
                Cancel subscription
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Subscription self-service is handled by Stripe's Customer Portal for compliance and PCI coverage.
            </p>
          </Card>
        )}

        {confirm && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setConfirm(null)}>
            <Card className="p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold">
                {confirm === 'downgrade' ? 'Downgrade to Free?' : 'Cancel subscription?'}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {confirm === 'downgrade'
                  ? 'You will keep Pro access until the end of your billing period, then move to Free tier limits. You can re-subscribe anytime.'
                  : 'Your subscription will end at the close of your current billing period. You can resubscribe later. No refunds for partial periods.'}
              </p>
              <div className="flex gap-3 mt-6 justify-end">
                <Button variant="ghost" onClick={() => setConfirm(null)}>Keep my plan</Button>
                <Button variant="primary" onClick={handleConfirm}>
                  {confirm === 'downgrade' ? 'Downgrade at period end' : 'Cancel at period end'}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {upgraded && (
          <div className="p-4 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-sm">
            Welcome to Pro! Your subscription is active.
            <button className="ml-3 underline" onClick={() => refetch()}>Refresh now</button>
          </div>
        )}
      </div>
    </main>
  );
}
