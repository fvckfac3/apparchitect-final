/**
 * stripe-client.ts — Browser-side wrapper for the Stripe-backed edge functions.
 *
 * The actual Stripe API calls live in supabase/functions/stripe-*.ts (Deno
 * edge functions). This module is the typed client the React app uses to:
 *   - start a Checkout session for upgrade (PRD §6.1)
 *   - open the Customer Portal for self-service (PRD §7.4)
 *   - fetch live subscription state
 *   - record a free-tier conversion click (PRD §11)
 *
 * Why edge functions and not direct browser calls: the Stripe secret key and
 * webhook secret must never ship to the browser (PCI, PRD §15.2). The
 * publishable key is safe to expose but the Checkout session creation
 * requires the secret.
 */

import { supabase } from '@/integrations/supabase/client';
import { getErrorCode, BillingError } from './errors';
import type { SubscriptionTier } from './types';

const FN_CHECKOUT = 'stripe-checkout';
const FN_PORTAL = 'stripe-portal';
const FN_SUBSCRIPTION = 'stripe-subscription';

export interface CheckoutInput {
  targetTier: Exclude<SubscriptionTier, 'free'>;
  interval: 'month' | 'year';
  successUrl: string;
  cancelUrl: string;
  trial?: boolean;
}

export interface CheckoutResult {
  url: string;
  sessionId: string;
}

export interface PortalResult {
  url: string;
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  status: 'active' | 'trialing' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | null;
  interval: 'month' | 'year' | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  trialEndsAt: string | null;
  gracePeriodEndsAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

async function callEdge<TIn, TOut>(
  functionName: string,
  body: TIn,
  accessToken: string,
): Promise<TOut> {
  const { data, error } = await supabase.functions.invoke<TOut>(functionName, {
    body,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (error) {
    const code = getErrorCode(error);
    throw new BillingError(code, error.message);
  }
  if (!data) {
    throw new BillingError('STRIPE_CHECKOUT_FAILED', 'No response from edge function');
  }
  return data;
}

export async function startCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  if (!supabase) throw new BillingError('SUPABASE_UNAVAILABLE', 'Database is not enabled');
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new BillingError('AUTH_REQUIRED', 'You must be signed in to upgrade');
  }
  return callEdge<CheckoutInput, CheckoutResult>(FN_CHECKOUT, input, session.access_token);
}

export async function openPortal(returnUrl: string): Promise<PortalResult> {
  if (!supabase) throw new BillingError('SUPABASE_UNAVAILABLE', 'Database is not enabled');
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new BillingError('AUTH_REQUIRED', 'You must be signed in to manage billing');
  }
  return callEdge<{ returnUrl: string }, PortalResult>(
    FN_PORTAL,
    { returnUrl },
    session.access_token,
  );
}

export async function fetchSubscription(): Promise<SubscriptionState | null> {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return null;
  try {
    return await callEdge<Record<string, never>, SubscriptionState>(
      FN_SUBSCRIPTION,
      {},
      session.access_token,
    );
  } catch (err) {
    if (err instanceof BillingError && err.code === 'STRIPE_SUBSCRIPTION_NOT_FOUND') {
      return null;
    }
    throw err;
  }
}
