/**
 * billing/types.ts — TypeScript types mirroring the Supabase schema in
 * 20260709000000_add_monetization_schema.sql. Kept in sync manually; the
 * migration is authoritative.
 */

import type { SubscriptionTier, SubscriptionStatus, BillingInterval, ErrorCode } from './tiers';

export interface SubscriptionRow {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  interval: BillingInterval | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  grace_period_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Row of public.quota_usage. */
export interface QuotaUsageRow {
  id: string;
  user_id: string;
  period_start: string;        // ISO date — first of month
  units_used: number;           // 1 per Standard, 3 per Ultimate
  ultimate_used: number;        // count of Ultimate generations
  standard_used: number;        // count of Standard generations
  updated_at: string;
}

export type WebhookEventType =
  | 'checkout.session.completed'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed'
  | 'customer.subscription.trial_will_end';

export type WebhookResult =
  | { status: 'processed' }
  | { status: 'duplicate_skipped' }
  | { status: 'unknown_subscription' }
  | { status: 'invalid_signature' }
  | { status: 'error'; message: string };

export interface WebhookLogRow {
  id: string;
  event_id: string;             // Stripe event.id — idempotency key
  event_type: WebhookEventType | string;
  stripe_subscription_id: string | null;
  payload_hash: string;
  result: WebhookResult['status'];
  error_message: string | null;
  processed_at: string;
}

export interface TierChangeAuditRow {
  id: string;
  user_id: string;
  from_tier: SubscriptionTier;
  to_tier: SubscriptionTier;
  reason: string;                // 'upgrade' | 'downgrade' | 'cancel' | 'payment_failed' | 'trial_expired'
  triggered_by: string;          // 'user' | 'webhook' | 'admin' | 'system'
  metadata: Record<string, unknown>;
  created_at: string;
}

/** Decision returned by the FeatureGate helper. */
export interface GateResult {
  allowed: boolean;
  errorCode: ErrorCode | null;
  feature: string;
  requiredTier: SubscriptionTier;
  currentTier: SubscriptionTier;
}
