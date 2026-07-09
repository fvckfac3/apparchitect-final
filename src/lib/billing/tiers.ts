/**
 * tiers.ts — single source of truth for AppArchitect subscription tiers and
 * feature gates. Mirrors Monetization & Pricing PRD §3 and §8 exactly.
 *
 * If you change a tier limit or feature gate here, also update the PRD.
 * The Pricing Page, Paywall Modal, Feature Gate middleware, and Quota
 * Tracker all read from this file.
 *
 * Authority: AppArchitect — Monetization & Pricing PRD v1.0
 *   - §3.2 Tier Definitions
 *   - §3.3 Package Definitions
 *   - §8.2 Feature Gate Helper
 *   - §8.3 Free-Tier Limits
 *   - §10.3 Rate Limiting
 */

export type SubscriptionTier = 'free' | 'pro' | 'team';
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'unpaid'
  | 'canceled'
  | 'incomplete'
  | null;
export type BillingInterval = 'month' | 'year';
export type PackageType = 'standard' | 'ultimate';

// ----------------------------------------------------------------------------
// §3.2 Tier Definitions
// ----------------------------------------------------------------------------

export interface TierConfig {
  id: SubscriptionTier;
  displayName: string;
  monthlyPriceCents: number;
  yearlyPriceCents: number;
  /** Unit cost in the unified quota pool. Ultimate = 3 units. */
  unitPerStandard: number;
  /** Max units per month on this tier. Infinity for Team Standard. */
  unitsPerMonth: number;
  trialDays: number;
  stripePriceIdEnv: {
    monthly: string;
    yearly: string;
  };
  description: string;
}

export const TIER_CONFIG: Record<SubscriptionTier, TierConfig> = {
  free: {
    id: 'free',
    displayName: 'Free',
    monthlyPriceCents: 0,
    yearlyPriceCents: 0,
    unitPerStandard: 1,
    unitsPerMonth: 1,
    trialDays: 0,
    stripePriceIdEnv: { monthly: '', yearly: '' },
    description: 'Generate your first PRD suite end-to-end.',
  },
  pro: {
    id: 'pro',
    displayName: 'Pro',
    monthlyPriceCents: 4900,
    yearlyPriceCents: 46800,
    unitPerStandard: 1,
    unitsPerMonth: 10,
    trialDays: 7,
    stripePriceIdEnv: {
      monthly: 'STRIPE_PRICE_ID_PRO_MONTHLY',
      yearly: 'STRIPE_PRICE_ID_PRO_YEARLY',
    },
    description: 'For solo founders shipping multiple projects.',
  },
  team: {
    id: 'team',
    displayName: 'Team',
    monthlyPriceCents: 14900,
    yearlyPriceCents: 142800,
    unitPerStandard: 1,
    unitsPerMonth: Number.POSITIVE_INFINITY,
    trialDays: 14,
    stripePriceIdEnv: {
      monthly: 'STRIPE_PRICE_ID_TEAM_MONTHLY',
      yearly: 'STRIPE_PRICE_ID_TEAM_YEARLY',
    },
    description: 'For product teams of 3–20.',
  },
};

// ----------------------------------------------------------------------------
// §3.3 Package Definitions
// ----------------------------------------------------------------------------

/** Unit cost of each package in the unified quota pool. */
export const PACKAGE_UNIT_COST: Record<PackageType, number> = {
  standard: 1,
  ultimate: 3,
};

/** A generation is only allowed if the package exists for the tier. */
export function packageAvailableOn(
  tier: SubscriptionTier,
  pkg: PackageType
): boolean {
  if (tier === 'free') return pkg === 'standard';
  return true;
}

// ----------------------------------------------------------------------------
// §8.3 Free-Tier Limits (per-document / per-period limits)
// ----------------------------------------------------------------------------

export interface TierLimits {
  maxProjects: number;
  maxRegenerationsPerDocument: number;
  auditLogRetentionDays: number;
  generationRateLimitPerDay: number;
  apiRateLimitPerHour: number;
  concurrentGenerations: number;
  allowedExportFormats: ReadonlyArray<'zip' | 'pdf' | 'docx'>;
  customAgentsAllowed: boolean;
  teamCollaborationAllowed: boolean;
  versionHistoryDepth: number;
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: {
    maxProjects: 1,
    maxRegenerationsPerDocument: 3,
    auditLogRetentionDays: 30,
    generationRateLimitPerDay: 1,
    apiRateLimitPerHour: 60,
    concurrentGenerations: 1,
    allowedExportFormats: ['zip'],
    customAgentsAllowed: false,
    teamCollaborationAllowed: false,
    versionHistoryDepth: 0,
  },
  pro: {
    maxProjects: 10,
    maxRegenerationsPerDocument: Number.POSITIVE_INFINITY,
    auditLogRetentionDays: 90,
    generationRateLimitPerDay: 50,
    apiRateLimitPerHour: 300,
    concurrentGenerations: 3,
    allowedExportFormats: ['zip', 'pdf', 'docx'],
    customAgentsAllowed: true,
    teamCollaborationAllowed: false,
    versionHistoryDepth: 10,
  },
  team: {
    maxProjects: Number.POSITIVE_INFINITY,
    maxRegenerationsPerDocument: Number.POSITIVE_INFINITY,
    auditLogRetentionDays: 365,
    generationRateLimitPerDay: 500,
    apiRateLimitPerHour: 1000,
    concurrentGenerations: 10,
    allowedExportFormats: ['zip', 'pdf', 'docx'],
    customAgentsAllowed: true,
    teamCollaborationAllowed: true,
    versionHistoryDepth: Number.POSITIVE_INFINITY,
  },
};

// ----------------------------------------------------------------------------
// §8.2 Feature Gate Helper
// ----------------------------------------------------------------------------

export type Enforcement = 'ui' | 'backend' | 'both';

export interface FeatureGate {
  feature: FeatureKey;
  tier: SubscriptionTier;
  enforcement: Enforcement;
  errorCode: ErrorCode;
}

export type FeatureKey =
  | 'create_project'
  | 'add_custom_agent'
  | 'team_collaboration'
  | 'export_github'
  | 'export_pdf'
  | 'export_docx'
  | 'view_version_history'
  | 'enable_sso'
  | 'api_access'
  | 'custom_ai_model'
  | 'regenerate_document'
  | 'priority_queue';

export type ErrorCode =
  | 'BIZ_PROJECT_LIMIT_REACHED'
  | 'BIZ_REGEN_LIMIT_REACHED'
  | 'BIZ_FEATURE_PRO_ONLY'
  | 'BIZ_FEATURE_TEAM_ONLY'
  | 'STRIPE_CHECKOUT_FAILED'
  | 'STRIPE_PAYMENT_FAILED'
  | 'STRIPE_SUBSCRIPTION_NOT_FOUND'
  | 'STRIPE_SIGNATURE_INVALID'
  | 'STRIPE_PORTAL_LINK_FAILED'
  | 'BIZ_TRIAL_ALREADY_USED'
  | 'BIZ_DOWNGRADE_BLOCKED_BY_ACTIVE';

export const FEATURE_GATES: Record<FeatureKey, FeatureGate> = {
  create_project: { feature: 'create_project', tier: 'free', enforcement: 'both', errorCode: 'BIZ_PROJECT_LIMIT_REACHED' },
  add_custom_agent: { feature: 'add_custom_agent', tier: 'pro', enforcement: 'both', errorCode: 'BIZ_FEATURE_PRO_ONLY' },
  team_collaboration: { feature: 'team_collaboration', tier: 'team', enforcement: 'both', errorCode: 'BIZ_FEATURE_TEAM_ONLY' },
  export_github: { feature: 'export_github', tier: 'pro', enforcement: 'backend', errorCode: 'BIZ_FEATURE_PRO_ONLY' },
  export_pdf: { feature: 'export_pdf', tier: 'pro', enforcement: 'both', errorCode: 'BIZ_FEATURE_PRO_ONLY' },
  export_docx: { feature: 'export_docx', tier: 'pro', enforcement: 'both', errorCode: 'BIZ_FEATURE_PRO_ONLY' },
  view_version_history: { feature: 'view_version_history', tier: 'pro', enforcement: 'both', errorCode: 'BIZ_FEATURE_PRO_ONLY' },
  enable_sso: { feature: 'enable_sso', tier: 'team', enforcement: 'both', errorCode: 'BIZ_FEATURE_TEAM_ONLY' },
  api_access: { feature: 'api_access', tier: 'team', enforcement: 'both', errorCode: 'BIZ_FEATURE_TEAM_ONLY' },
  custom_ai_model: { feature: 'custom_ai_model', tier: 'team', enforcement: 'backend', errorCode: 'BIZ_FEATURE_TEAM_ONLY' },
  regenerate_document: { feature: 'regenerate_document', tier: 'free', enforcement: 'both', errorCode: 'BIZ_REGEN_LIMIT_REACHED' },
  priority_queue: { feature: 'priority_queue', tier: 'pro', enforcement: 'ui', errorCode: 'BIZ_FEATURE_PRO_ONLY' },
};

const TIER_RANK: Record<SubscriptionTier, number> = { free: 0, pro: 1, team: 2 };

/**
 * Check whether a tier is allowed to use a feature.
 * Per §10.2: IF user.tier == 'free' AND feature.tier in ['pro', 'team'] THEN deny.
 */
export function canUseFeature(
  userTier: SubscriptionTier,
  feature: FeatureKey
): { allowed: boolean; errorCode: ErrorCode | null } {
  const gate = FEATURE_GATES[feature];
  if (!gate) return { allowed: true, errorCode: null };
  if (TIER_RANK[userTier] >= TIER_RANK[gate.tier]) {
    return { allowed: true, errorCode: null };
  }
  return { allowed: false, errorCode: gate.errorCode };
}

// ----------------------------------------------------------------------------
// §3.4 Quota math
// ----------------------------------------------------------------------------

/**
 * Compute whether a proposed generation is allowed given the user's tier,
 * current quota usage, and the package they want to spend.
 *
 * Per §3.4: 1 Ultimate = 3 Standard-equivalent units.
 * Per §3.4: Free tier is 1 Standard project, lifetime, no Ultimate.
 * Per §3.4: Team Standard is unlimited; Team Ultimate is capped at 10/mo.
 * Per §3.4: Pro is 10 units/mo flex pool.
 */
export interface QuotaState {
  tier: SubscriptionTier;
  unitsUsedThisMonth: number;
  ultimateUsedThisMonth: number;
  totalProjects: number;
}

export interface QuotaDecision {
  allowed: boolean;
  reason:
    | 'allowed'
    | 'ultimate_not_on_free'
    | 'free_project_limit_reached'
    | 'pro_units_exhausted'
    | 'team_ultimate_exhausted'
    | 'tier_does_not_have_package';
  message: string;
  errorCode: ErrorCode | null;
  unitsConsumed: number;
}

export function decideQuota(
  state: QuotaState,
  pkg: PackageType
): QuotaDecision {
  const { tier, unitsUsedThisMonth, ultimateUsedThisMonth, totalProjects } = state;
  const tierCfg = TIER_CONFIG[tier];
  const unitCost = PACKAGE_UNIT_COST[pkg];

  // Free tier — no Ultimate, 1 project lifetime
  if (tier === 'free') {
    if (pkg === 'ultimate') {
      return {
        allowed: false,
        reason: 'ultimate_not_on_free',
        message: 'Ultimate is a paid feature. Upgrade to Pro for 10 units/mo.',
        errorCode: 'BIZ_FEATURE_PRO_ONLY',
        unitsConsumed: 0,
      };
    }
    if (totalProjects >= tierCfg.unitsPerMonth) {
      return {
        allowed: false,
        reason: 'free_project_limit_reached',
        message: "You've used your free Standard project. Upgrade to continue.",
        errorCode: 'BIZ_PROJECT_LIMIT_REACHED',
        unitsConsumed: 0,
      };
    }
    return { allowed: true, reason: 'allowed', message: 'OK', errorCode: null, unitsConsumed: unitCost };
  }

  // Pro tier — 10 units/mo flex
  if (tier === 'pro') {
    if (unitsUsedThisMonth + unitCost > tierCfg.unitsPerMonth) {
      return {
        allowed: false,
        reason: 'pro_units_exhausted',
        message: 'This would exceed your 10 monthly units. Upgrade to Team for unlimited Standard.',
        errorCode: 'BIZ_FEATURE_TEAM_ONLY',
        unitsConsumed: 0,
      };
    }
    return { allowed: true, reason: 'allowed', message: 'OK', errorCode: null, unitsConsumed: unitCost };
  }

  // Team tier — unlimited Standard, 10 Ultimate/mo
  if (tier === 'team') {
    if (pkg === 'ultimate' && ultimateUsedThisMonth >= 10) {
      return {
        allowed: false,
        reason: 'team_ultimate_exhausted',
        message: "You've used your 10 Ultimate generations this month. They reset on the 1st.",
        errorCode: 'BIZ_FEATURE_TEAM_ONLY',
        unitsConsumed: 0,
      };
    }
    // Standard is unlimited on Team — no quota check.
    return { allowed: true, reason: 'allowed', message: 'OK', errorCode: null, unitsConsumed: unitCost };
  }

  return {
    allowed: false,
    reason: 'tier_does_not_have_package',
    message: 'Unknown tier.',
    errorCode: null,
    unitsConsumed: 0,
  };
}

// ----------------------------------------------------------------------------
// §3.4 Quota reset helper
// ----------------------------------------------------------------------------

/** ISO date for the start of the current calendar month in the user's TZ. */
export function currentMonthStart(now: Date = new Date()): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

/** Days remaining in the current month. */
export function daysUntilReset(now: Date = new Date()): number {
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return Math.max(0, Math.ceil((next.getTime() - now.getTime()) / 86_400_000));
}
