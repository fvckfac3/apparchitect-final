/**
 * quota.ts — Flex quota tracking for Pro/Team tiers.
 *
 * Implements Monetization & Pricing PRD §3.4:
 *   - 1 Ultimate generation = 3 Standard-equivalent units.
 *   - Pro: 10 units / month (mixable).
 *   - Team: unlimited Standard, capped 10 Ultimate / month.
 *   - Free: 1 Standard project, lifetime.
 *
 * The unit reset is on the 1st of each calendar month in the user's timezone.
 * For backend enforcement, the canonical source is the public.quota_usage
 * row. The UI calls getCurrentUsage() for display only.
 */

import { supabase } from '@/integrations/supabase/client';
import { TIER_LIMITS, type PackageType, type SubscriptionTier, FEATURE_GATES, type ErrorCode } from './tiers';
import type { GateResult } from './types';

export type PackageCost = 1 | 3;  // Standard=1, Ultimate=3

export const PACKAGE_COST: Record<PackageType, PackageCost> = {
  standard: 1,
  ultimate: 3,
};

export interface QuotaSnapshot {
  tier: SubscriptionTier;
  periodStart: string;          // ISO date (YYYY-MM-01)
  periodEnd: string;            // ISO date (first of next month)
  unitsUsed: number;
  unitsAllowed: number;         // Infinity for Team Standard
  ultimateUsed: number;
  ultimateAllowed: number;      // 0, 10, or Infinity
  standardUsed: number;
  standardAllowed: number;      // 1, 10, or Infinity
  remainingUnits: number;       // Infinity when unlimited
  remainingUltimate: number;
  remainingStandard: number;
}

function firstOfMonth(d: Date = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}-01`;
}

function firstOfNextMonth(d: Date = new Date()): string {
  const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
  return firstOfMonth(next);
}

export function getCurrentPeriod(): { periodStart: string; periodEnd: string } {
  return { periodStart: firstOfMonth(), periodEnd: firstOfNextMonth() };
}

export function emptyQuotaSnapshot(tier: SubscriptionTier): QuotaSnapshot {
  const limits = TIER_LIMITS[tier];
  const { periodStart, periodEnd } = getCurrentPeriod();
  return {
    tier,
    periodStart,
    periodEnd,
    unitsUsed: 0,
    unitsAllowed: limits.unitsPerMonth,
    ultimateUsed: 0,
    ultimateAllowed: tier === 'free' ? 0 : tier === 'team' ? 10 : Infinity,
    standardUsed: 0,
    standardAllowed: tier === 'free' ? 1 : Infinity,
    remainingUnits: limits.unitsPerMonth,
    remainingUltimate: tier === 'free' ? 0 : tier === 'team' ? 10 : Infinity,
    remainingStandard: tier === 'free' ? 1 : Infinity,
  };
}

/** Fetches the current month's quota row for a user. Creates one if missing. */
export async function getCurrentUsage(userId: string): Promise<QuotaSnapshot | null> {
  if (!supabase) return null;
  const { periodStart } = getCurrentPeriod();

  const { data, error } = await supabase
    .from('quota_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('period_start', periodStart)
    .maybeSingle();

  if (error) {
    console.error('[quota] getCurrentUsage error:', error.message);
    return null;
  }

  if (!data) return emptyQuotaSnapshot('free');

  const tier = 'free' as SubscriptionTier;
  return buildSnapshot(tier, data);
}

function buildSnapshot(
  tier: SubscriptionTier,
  data: { standard_equivalent_used: number; ultimate_units_used: number; standard_units_used: number }
): QuotaSnapshot {
  const limits = TIER_LIMITS[tier];
  const { periodStart, periodEnd } = getCurrentPeriod();
  const inf = Infinity;
  const unitsUsed = data.standard_equivalent_used ?? 0;
  const ultimateUsed = data.ultimate_units_used ?? 0;
  const standardUsed = data.standard_units_used ?? 0;
  const unitsAllowed = limits.unitsPerMonth;
  const ultimateAllowed = limits.tier === 'free' ? 0 : tier === 'team' ? 10 : Infinity;
  const standardAllowed = limits.tier === 'free' ? 1 : Infinity;
  return {
    tier,
    periodStart,
    periodEnd,
    unitsUsed,
    unitsAllowed,
    ultimateUsed,
    ultimateAllowed,
    standardUsed,
    standardAllowed,
    remainingUnits: unitsAllowed === inf ? inf : Math.max(0, unitsAllowed - unitsUsed),
    remainingUltimate: ultimateAllowed === inf ? inf : Math.max(0, ultimateAllowed - ultimateUsed),
    remainingStandard: standardAllowed === inf ? inf : Math.max(0, standardAllowed - standardUsed),
  };
}

/** Atomically increments usage if there's room. Returns false if quota exceeded. */
export async function consumeQuota(
  userId: string,
  pkg: PackageType,
): Promise<{ ok: boolean; errorCode: ErrorCode | null; snapshot: QuotaSnapshot | null }> {
  if (!supabase) {
    return { ok: false, errorCode: 'BIZ_FEATURE_TEAM_ONLY' as ErrorCode, snapshot: null };
  }

  // 1. Read current state
  const snapshot = await getCurrentUsage(userId);
  if (!snapshot) {
    return { ok: false, errorCode: 'BIZ_FEATURE_PRO_ONLY' as ErrorCode, snapshot: null };
  }

  // 2. Decide (matches the decision logic in PRD §3.4)
  const cost = PACKAGE_COST[pkg];
  if (snapshot.tier === 'free' && pkg === 'ultimate') {
    return { ok: false, errorCode: 'BIZ_FEATURE_PRO_ONLY', snapshot };
  }
  if (snapshot.tier === 'free') {
    // Free: 1 Standard project, lifetime. Enforced at project creation, not here.
    return { ok: true, errorCode: null, snapshot };
  }
  if (snapshot.remainingUnits !== Infinity && snapshot.remainingUnits < cost) {
    return { ok: false, errorCode: 'BIZ_REGEN_LIMIT_REACHED' as ErrorCode, snapshot };
  }
  if (pkg === 'ultimate' && snapshot.ultimateAllowed !== Infinity && snapshot.remainingUltimate < 1) {
    return { ok: false, errorCode: 'BIZ_FEATURE_TEAM_ONLY' as ErrorCode, snapshot };
  }

  // 3. Atomic upsert via RPC (handled by the INSERT ON CONFLICT trigger on quota_usage)
  const { periodStart } = getCurrentPeriod();
  const { error } = await supabase.from('quota_usage').upsert(
    {
      user_id: userId,
      period_start: periodStart,
      period_end: getCurrentPeriod().periodEnd,
      standard_units_used: snapshot.standardUsed + (pkg === 'standard' ? 1 : 0),
      ultimate_units_used: snapshot.ultimateUsed + (pkg === 'ultimate' ? 1 : 0),
      standard_equivalent_used: snapshot.unitsUsed + cost,
      last_generation_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,period_start' }
  );

  if (error) {
    console.error('[quota] consumeQuota error:', error.message);
    return { ok: false, errorCode: 'BIZ_FEATURE_TEAM_ONLY' as ErrorCode, snapshot };
  }

  return { ok: true, errorCode: null, snapshot: { ...snapshot, unitsUsed: snapshot.unitsUsed + cost } };
}

/** Pure gate check used by the UI to decide whether to render a paywall. */
export function checkGate(
  feature: keyof typeof FEATURE_GATES,
  userTier: SubscriptionTier
): GateResult {
  const gate = FEATURE_GATES[feature];
  return {
    allowed: tierRank(userTier) >= tierRank(gate.tier),
    errorCode: null,
    feature: String(feature),
    requiredTier: gate.tier,
    currentTier: userTier,
  };
}

const TIER_ORDER: SubscriptionTier[] = ['free', 'pro', 'team'];
function tierRank(t: SubscriptionTier): number {
  return TIER_ORDER.indexOf(t);
}
