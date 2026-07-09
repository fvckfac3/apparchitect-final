/**
 * billing/errors.ts — Canonical error codes for billing operations.
 *
 * Mirrors Monetization & Pricing PRD §9. Every code here MUST also be
 * referenced in the Error & State Reference (PRD §17 cross-doc rule).
 *
 * Each code has:
 *   - a stable string id (the registered code)
 *   - an HTTP status (for the edge-function layer)
 *   - a default user-facing message (overridable in the Content & Copy PRD)
 *
 * BillingError is a thin class so UI can branch on the code without
 * parsing error message strings.
 */

export type BillingErrorCode =
  | 'BIZ_PROJECT_LIMIT_REACHED'
  | 'BIZ_REGEN_LIMIT_REACHED'
  | 'BIZ_FEATURE_PRO_ONLY'
  | 'BIZ_FEATURE_TEAM_ONLY'
  | 'BIZ_TRIAL_ALREADY_USED'
  | 'BIZ_DOWNGRADE_BLOCKED_BY_ACTIVE'
  | 'STRIPE_CHECKOUT_FAILED'
  | 'STRIPE_PAYMENT_FAILED'
  | 'STRIPE_SUBSCRIPTION_NOT_FOUND'
  | 'STRIPE_SIGNATURE_INVALID'
  | 'STRIPE_PORTAL_LINK_FAILED'
  | 'SEC_WEBHOOK_VERIFICATION_FAILED'
  | 'AUTH_REQUIRED'
  | 'SUPABASE_UNAVAILABLE';

export interface BillingErrorSpec {
  code: BillingErrorCode;
  httpStatus: number;
  defaultMessage: string;
  userMessage: string;
  paywall: boolean;
}

export const BILLING_ERROR_REGISTRY: Record<BillingErrorCode, BillingErrorSpec> = {
  BIZ_PROJECT_LIMIT_REACHED: {
    code: 'BIZ_PROJECT_LIMIT_REACHED',
    httpStatus: 403,
    defaultMessage: 'Free-tier project limit reached',
    userMessage: "You've used your free project. Upgrade to Pro to create more.",
    paywall: true,
  },
  BIZ_REGEN_LIMIT_REACHED: {
    code: 'BIZ_REGEN_LIMIT_REACHED',
    httpStatus: 403,
    defaultMessage: 'Document regeneration limit reached',
    userMessage: "You've used your 3 free regenerations on this document. Upgrade for unlimited.",
    paywall: true,
  },
  BIZ_FEATURE_PRO_ONLY: {
    code: 'BIZ_FEATURE_PRO_ONLY',
    httpStatus: 403,
    defaultMessage: 'Pro feature',
    userMessage: 'This is a Pro feature. Upgrade to unlock.',
    paywall: true,
  },
  BIZ_FEATURE_TEAM_ONLY: {
    code: 'BIZ_FEATURE_TEAM_ONLY',
    httpStatus: 403,
    defaultMessage: 'Team feature',
    userMessage: 'This is a Team feature. Upgrade to unlock.',
    paywall: true,
  },
  BIZ_TRIAL_ALREADY_USED: {
    code: 'BIZ_TRIAL_ALREADY_USED',
    httpStatus: 400,
    defaultMessage: 'Trial already used',
    userMessage: "You've already used your free trial.",
    paywall: false,
  },
  BIZ_DOWNGRADE_BLOCKED_BY_ACTIVE: {
    code: 'BIZ_DOWNGRADE_BLOCKED_BY_ACTIVE',
    httpStatus: 400,
    defaultMessage: 'Downgrade blocked by active features',
    userMessage:
      'Downgrade will take effect at period end. Active team features will remain until then.',
    paywall: false,
  },
  STRIPE_CHECKOUT_FAILED: {
    code: 'STRIPE_CHECKOUT_FAILED',
    httpStatus: 402,
    defaultMessage: 'Stripe Checkout session creation failed',
    userMessage: "We couldn't start checkout. Please try again.",
    paywall: false,
  },
  STRIPE_PAYMENT_FAILED: {
    code: 'STRIPE_PAYMENT_FAILED',
    httpStatus: 402,
    defaultMessage: "User's payment method was declined",
    userMessage: 'Your last payment failed. Update your payment method.',
    paywall: false,
  },
  STRIPE_SUBSCRIPTION_NOT_FOUND: {
    code: 'STRIPE_SUBSCRIPTION_NOT_FOUND',
    httpStatus: 404,
    defaultMessage: 'Subscription not found locally',
    userMessage: 'Your subscription is being synced. Please refresh in a moment.',
    paywall: false,
  },
  STRIPE_SIGNATURE_INVALID: {
    code: 'STRIPE_SIGNATURE_INVALID',
    httpStatus: 401,
    defaultMessage: 'Stripe webhook signature verification failed',
    userMessage: 'Internal error. Our team has been notified.',
    paywall: false,
  },
  STRIPE_PORTAL_LINK_FAILED: {
    code: 'STRIPE_PORTAL_LINK_FAILED',
    httpStatus: 500,
    defaultMessage: 'Customer Portal session creation failed',
    userMessage: "We couldn't open the billing portal. Please try again.",
    paywall: false,
  },
  SEC_WEBHOOK_VERIFICATION_FAILED: {
    code: 'SEC_WEBHOOK_VERIFICATION_FAILED',
    httpStatus: 401,
    defaultMessage: 'Webhook signature verification failed',
    userMessage: 'Internal error. Our team has been notified.',
    paywall: false,
  },
  AUTH_REQUIRED: {
    code: 'AUTH_REQUIRED',
    httpStatus: 401,
    defaultMessage: 'User not authenticated',
    userMessage: 'Please sign in to continue.',
    paywall: false,
  },
  SUPABASE_UNAVAILABLE: {
    code: 'SUPABASE_UNAVAILABLE',
    httpStatus: 503,
    defaultMessage: 'Database is not enabled',
    userMessage: 'Service temporarily unavailable. Please try again in a moment.',
    paywall: false,
  },
};

export class BillingError extends Error {
  readonly code: BillingErrorCode;
  readonly httpStatus: number;
  readonly paywall: boolean;
  readonly userMessage: string;

  constructor(code: BillingErrorCode, overrideMessage?: string) {
    const spec = BILLING_ERROR_REGISTRY[code];
    super(overrideMessage ?? spec.defaultMessage);
    this.name = 'BillingError';
    this.code = code;
    this.httpStatus = spec.httpStatus;
    this.paywall = spec.paywall;
    this.userMessage = spec.userMessage;
  }
}

export function getErrorCode(err: unknown): BillingErrorCode {
  if (err instanceof BillingError) return err.code;
  if (err && typeof err === 'object' && 'code' in err) {
    const c = (err as { code: string }).code;
    if (c in BILLING_ERROR_REGISTRY) return c as BillingErrorCode;
  }
  return 'STRIPE_CHECKOUT_FAILED';
}
