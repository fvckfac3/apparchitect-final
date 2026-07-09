/**
 * PaywallModal.tsx — single paywall surface per PRD §6.1.
 *
 * Triggers (PRD §4) are surfaced from a registry; the modal just shows the
 * title, body, and a primary "Upgrade to Pro" CTA. Pro and Team are
 * highlighted; Free is shown as the current tier (greyed).
 *
 * One-click cancel is enforced via the Customer Portal — we never let users
 * cancel through this modal (PRD §10.1, Safety override).
 */

import { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSubscription } from '@/hooks/use-subscription';
import { startCheckout, BillingError } from '@/lib/billing';
import type { BillingErrorCode } from '@/lib/billing/errors';
import { cn } from '@/lib/cn';
import { useAuth } from '@/contexts/AuthContext';

export type PaywallTrigger =
  | 'project_limit'
  | 'custom_agent'
  | 'team_feature'
  | 'github_export'
  | 'format_export'
  | 'version_history'
  | 'regen_limit'
  | 'sso';

interface PaywallContent {
  title: string;
  body: string;
  errorCode: BillingErrorCode;
}

const TRIGGER_CONTENT: Record<PaywallTrigger, PaywallContent> = {
  project_limit: {
    title: "You've generated your first suite",
    body: "Upgrade to Pro to start a second project and keep building.",
    errorCode: 'BIZ_PROJECT_LIMIT_REACHED',
  },
  custom_agent: {
    title: 'Custom agents are a Pro feature',
    body: 'Upgrade to Pro to add agents beyond the auto-generated team.',
    errorCode: 'BIZ_FEATURE_PRO_ONLY',
  },
  team_feature: {
    title: 'Sharing is a Team feature',
    body: 'Upgrade to Team to invite collaborators and work together on a project.',
    errorCode: 'BIZ_FEATURE_TEAM_ONLY',
  },
  github_export: {
    title: 'GitHub export is a Pro feature',
    body: 'Upgrade to Pro to commit your suite directly to a GitHub repository.',
    errorCode: 'BIZ_FEATURE_PRO_ONLY',
  },
  format_export: {
    title: 'PDF and DOCX export are Pro features',
    body: 'Upgrade to Pro to export your suite in additional formats.',
    errorCode: 'BIZ_FEATURE_PRO_ONLY',
  },
  version_history: {
    title: 'Version history is a Pro feature',
    body: 'Upgrade to Pro to revisit your past generations.',
    errorCode: 'BIZ_FEATURE_PRO_ONLY',
  },
  regen_limit: {
    title: "You've used your 3 free regenerations",
    body: "Upgrade to Pro for unlimited document regenerations on every project.",
    errorCode: 'BIZ_REGEN_LIMIT_REACHED',
  },
  sso: {
    title: 'SSO is a Team feature',
    body: 'Upgrade to Team to enable Okta, Azure AD, or any SAML provider.',
    errorCode: 'BIZ_FEATURE_TEAM_ONLY',
  },
};

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  trigger: PaywallTrigger;
  defaultInterval?: 'month' | 'year';
  projectCount?: number;
}

export function PaywallModal({
  open,
  onClose,
  trigger,
  defaultInterval = 'year',
  projectCount,
}: PaywallModalProps) {
  const { subscription } = useSubscription();
  const [interval, setInterval] = useState<'month' | 'year'>(defaultInterval);
  const [loadingTier, setLoadingTier] = useState<'pro' | 'team' | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;
  const content = TRIGGER_CONTENT[trigger];
  const isTeamTrigger = trigger === 'team_feature' || trigger === 'sso';

  const handleUpgrade = async (tier: 'pro' | 'team') => {
    setLoadingTier(tier);
    setError(null);
    try {
      const successUrl = `${window.location.origin}/settings/billing?checkout=success`;
      const cancelUrl = `${window.location.origin}/settings/billing?checkout=cancelled`;
      const { url } = await startCheckout({
        targetTier: tier,
        interval,
        successUrl,
        cancelUrl,
      });
      window.location.href = url;
    } catch (err) {
      if (err instanceof BillingError) {
        setError(err.userMessage);
      } else {
        setError("We couldn't start checkout. Please try again.");
      }
      setLoadingTier(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-zinc-950 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400">
          <Sparkles className="size-4" />
          {content.errorCode.replace(/_/g, ' ')}
        </div>

        <h2 id="paywall-title" className="mb-2 text-3xl font-semibold text-white">
          {content.title}
        </h2>
        <p className="mb-6 text-zinc-400">{content.body}</p>

        {projectCount !== undefined && (
          <p className="mb-4 text-xs text-zinc-500">
            {projectCount === 0
              ? 'You have no projects yet.'
              : `You have ${projectCount} project${projectCount === 1 ? '' : 's'}.`}
          </p>
        )}

        <div className="mb-6 inline-flex rounded-lg border border-white/10 p-1">
          {(['month', 'year'] as const).map((i) => (
            <button
              key={i}
              onClick={() => setInterval(i)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition',
                interval === i
                  ? 'bg-white text-zinc-900'
                  : 'text-zinc-400 hover:text-white',
              )}
            >
              {i === 'month' ? 'Monthly' : 'Yearly · save 20%'}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <TierCard
            name="Free"
            price="$0"
            interval="forever"
            highlight={subscription?.tier === 'free'}
            cta="Your current plan"
            ctaDisabled
            features={[
              '1 Standard project',
              'Full PRD suite generation',
              'ZIP export',
              '3 regenerations per document',
            ]}
            onClick={() => {}}
          />
          <TierCard
            name="Pro"
            price={interval === 'month' ? '$49' : '$39'}
            interval={interval === 'month' ? '/month' : '/month, billed yearly'}
            highlight
            cta={loadingTier === 'pro' ? 'Starting checkout…' : 'Upgrade to Pro'}
            loading={loadingTier === 'pro'}
            features={[
              '10 Standard-equivalent units / month',
              'Mixable with Ultimate at 3:1',
              'Custom agents',
              'GitHub, PDF, DOCX export',
              'Version history (last 10)',
              'Email support',
            ]}
            onClick={() => handleUpgrade('pro')}
          />
          <TierCard
            name="Team"
            price={interval === 'month' ? '$149' : '$119'}
            interval={interval === 'month' ? '/month' : '/month, billed yearly'}
            highlight={isTeamTrigger}
            badge={isTeamTrigger ? 'Required' : undefined}
            cta={loadingTier === 'team' ? 'Starting checkout…' : 'Upgrade to Team'}
            loading={loadingTier === 'team'}
            features={[
              'Unlimited Standard projects',
              '10 Ultimate generations / month',
              'Team collaboration',
              'SSO / SAML',
              '1-year audit log',
              'Slack/Teams support',
            ]}
            onClick={() => handleUpgrade('team')}
          />
        </div>

        {error && (
          <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <p className="mt-6 text-center text-xs text-zinc-500">
          Cancel anytime · One-click cancel via Settings → Billing · No dark patterns.
        </p>
      </div>
    </div>
  );
}

interface TierCardProps {
  name: string;
  price: string;
  interval: string;
  highlight: boolean;
  badge?: string;
  cta: string;
  ctaDisabled?: boolean;
  loading?: boolean;
  features: string[];
  onClick: () => void;
}

function TierCard({
  name,
  price,
  interval,
  highlight,
  badge,
  cta,
  ctaDisabled,
  loading,
  features,
  onClick,
}: TierCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-xl border p-5 transition',
        highlight
          ? 'border-amber-400/50 bg-gradient-to-b from-amber-500/10 to-transparent'
          : 'border-white/10 bg-white/5',
      )}
    >
      {badge && (
        <span className="absolute -top-2 right-4 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-900">
          {badge}
        </span>
      )}
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
      </div>
      <div className="mb-1">
        <span className="text-3xl font-bold text-white">{price}</span>
        <span className="ml-1 text-sm text-zinc-400">{interval}</span>
      </div>
      <ul className="mb-4 mt-3 space-y-1.5 text-sm text-zinc-300">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-amber-400" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={onClick}
        disabled={ctaDisabled || loading}
        className={cn(
          'mt-auto',
          highlight
            ? 'bg-amber-400 text-zinc-900 hover:bg-amber-300'
            : 'bg-white/10 text-white hover:bg-white/20',
        )}
      >
        {cta}
      </Button>
    </div>
  );
}
