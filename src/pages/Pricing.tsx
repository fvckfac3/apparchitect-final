/**
 * Pricing.tsx — public pricing page at /pricing.
 *
 * Implements Monetization & Pricing PRD §14:
 *   1. Hero
 *   2. Three tier cards (Free, Pro, Team) with "Most popular" badge on Pro
 *   3. Annual pricing with "Save 20%" callout
 *   4. Feature comparison table
 *   5. FAQ
 *   6. Footer with "Questions? Email us" link
 *
 * No dark patterns: there is no "no thanks" button — only "Upgrade" or
 * a ghost "Continue with Free" link.
 */
import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/use-subscription';
import { startCheckout } from '@/lib/billing/stripe-client';
import { BILLING_ERROR_REGISTRY } from '@/lib/billing/errors';
import { TIER_CONFIG } from '@/lib/billing/tiers';
import { cn } from '@/lib/cn';

type Interval = 'month' | 'year';

const FEATURE_COMPARISON: Array<{
  label: string;
  free: string | boolean;
  pro: string | boolean;
  team: string | boolean;
}> = [
  { label: 'PRD suite generation', free: '1 (lifetime)', pro: '10 / mo', team: 'Unlimited' },
  { label: 'Download as ZIP', free: true, pro: true, team: true },
  { label: 'Re-generate a single document', free: '3 retries', pro: 'Unlimited', team: 'Unlimited' },
  { label: 'Create new projects', free: '1', pro: '10', team: 'Unlimited' },
  { label: 'Custom agents', free: false, pro: true, team: true },
  { label: 'Team collaboration', free: false, pro: false, team: true },
  { label: 'Priority generation queue', free: false, pro: true, team: true },
  { label: 'Export to GitHub', free: false, pro: true, team: true },
  { label: 'Export to PDF / DOCX', free: false, pro: true, team: true },
  { label: 'Version history', free: false, pro: '10 versions', team: 'Unlimited' },
  { label: 'Custom domain on shared pages', free: false, pro: false, team: true },
  { label: 'SSO / SAML', free: false, pro: false, team: true },
  { label: 'Audit log retention', free: '30 days', pro: '90 days', team: '1 year' },
  { label: 'Email support', free: false, pro: true, team: true },
  { label: 'Slack / Teams support', free: false, pro: false, team: true },
  { label: 'BYO Claude key', free: false, pro: false, team: true },
  { label: 'API access', free: false, pro: false, team: true },
];

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Does the free tier expire?',
    a: 'No. Your one free Standard project is yours forever, even if you never upgrade.',
  },
  {
    q: 'What happens to my projects if I downgrade?',
    a: 'You keep access to your existing projects until the end of your current billing period. After that, free-tier limits apply to new actions only.',
  },
  {
    q: 'Can I switch between monthly and yearly?',
    a: 'Yes. Yearly saves 20%. You can switch from the Stripe Customer Portal at any time.',
  },
  {
    q: 'What is an "Ultimate" generation?',
    a: 'Ultimate is a deeper package that includes 8 expansion documents (monetization, brand, launch, financial model, etc.) and 5 extra agents on top of the standard 16 base PRDs. 1 Ultimate = 3 Standard units on the Pro flex quota.',
  },
  {
    q: 'Do unused units roll over?',
    a: 'No. Pro units reset on the 1st of each month and do not roll over. Team tier has unlimited Standard so rollover does not apply.',
  },
  {
    q: 'How do I cancel?',
    a: 'From /settings/billing. One click, no retention loop, no dark patterns. You keep access until the end of the billing period.',
  },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return <span className="text-emerald-400">✓</span>;
  }
  if (value === false) {
    return <span className="text-zinc-600">—</span>;
  }
  return <span className="text-zinc-200">{value}</span>;
}

function PricingCard({
  tierKey,
  name,
  priceMonthly,
  priceYearly,
  description,
  features,
  ctaLabel,
  highlight,
  onCta,
  ctaDisabled,
  currentBadge,
}: {
  tierKey: 'free' | 'pro' | 'team';
  name: string;
  priceMonthly: string;
  priceYearly: string;
  description: string;
  features: string[];
  ctaLabel: string;
  highlight?: boolean;
  onCta: () => void;
  ctaDisabled?: boolean;
  currentBadge?: string;
}) {
  return (
    <div
      data-tier={tierKey}
      className={cn(
        'relative flex flex-col rounded-2xl border p-6 backdrop-blur',
        highlight
          ? 'border-amber-400/40 bg-amber-400/5 shadow-[0_0_40px_-12px_rgba(251,191,36,0.3)]'
          : 'border-white/10 bg-white/5',
      )}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-zinc-900">
          Most popular
        </div>
      )}
      {currentBadge && (
        <div className="absolute -top-3 right-4 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
          {currentBadge}
        </div>
      )}
      <h3 className="text-2xl font-semibold text-zinc-50">{name}</h3>
      <p className="mt-1 text-sm text-zinc-400">{description}</p>
      <div className="mt-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-zinc-50">{priceMonthly}</span>
          <span className="text-sm text-zinc-500">/ month</span>
        </div>
        {priceYearly && (
          <div className="mt-1 text-xs text-zinc-500">{priceYearly} billed yearly</div>
        )}
      </div>
      <ul className="mt-6 space-y-2 text-sm text-zinc-300">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-emerald-400">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onCta}
        disabled={ctaDisabled}
        data-testid={`pricing-cta-${tierKey}`}
        className={cn(
          'mt-8 rounded-lg px-4 py-3 text-sm font-semibold transition',
          highlight
            ? 'bg-amber-400 text-zinc-900 hover:bg-amber-300'
            : 'bg-white/10 text-zinc-100 hover:bg-white/20',
          ctaDisabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

export default function Pricing(): ReactNode {
  const [interval, setInterval] = useState<Interval>('month');
  const [busy, setBusy] = useState<null | 'pro' | 'team'>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { subscription, refresh } = useSubscription();
  const navigate = useNavigate();

  async function onUpgrade(tier: 'pro' | 'team') {
    if (!user) {
      navigate('/auth?next=/pricing');
      return;
    }
    setBusy(tier);
    setError(null);
    try {
      const result = await startCheckout({
        targetTier: tier,
        interval,
        successUrl: window.location.origin + '/settings/billing?upgraded=1',
        cancelUrl: window.location.origin + '/pricing',
      });
      window.location.href = result.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setBusy(null);
    }
  }

  const currentTier = subscription?.tier ?? 'free';
  const proPrice = interval === 'year'
    ? `$${TIER_CONFIG.pro.yearlyPriceCents / 100}`
    : `$${TIER_CONFIG.pro.monthlyPriceCents / 100}`;
  const teamPrice = interval === 'year'
    ? `$${TIER_CONFIG.team.yearlyPriceCents / 100}`
    : `$${TIER_CONFIG.team.monthlyPriceCents / 100}`;
  const proPerMonth = interval === 'year' ? '$39' : '$49';
  const teamPerMonth = interval === 'year' ? '$119' : '$149';

  return (
    <main
      data-page="pricing"
      className="min-h-screen bg-zinc-950 text-zinc-100"
    >
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          Pick the plan that fits your build
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
          Generate a complete, build-ready PRD suite in minutes. Start free, upgrade when
          you need more.
        </p>
        <div className="mt-8 inline-flex rounded-lg border border-white/10 bg-white/5 p-1">
          {(['month', 'year'] as Interval[]).map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInterval(i)}
              data-testid={`interval-${i}`}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition',
                interval === i ? 'bg-amber-400 text-zinc-900' : 'text-zinc-300 hover:text-zinc-100',
              )}
            >
              {i === 'year' ? 'Yearly · Save 20%' : 'Monthly'}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        </div>
      )}

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-3">
        <PricingCard
          tierKey="free"
          name="Free"
          priceMonthly="$0"
          priceYearly=""
          description="Generate one complete Standard PRD suite. Yours forever."
          features={[
            '1 Standard project, lifetime',
            '16 base PRDs + agent team',
            '3 regenerations per document',
            'ZIP download',
          ]}
          ctaLabel={currentTier === 'free' ? 'Your current plan' : 'Continue with Free'}
          onCta={() => (user ? navigate('/dashboard') : navigate('/auth'))}
          ctaDisabled={currentTier === 'free' && busy !== null}
          currentBadge={currentTier === 'free' ? 'Current' : undefined}
        />
        <PricingCard
          tierKey="pro"
          name="Pro"
          priceMonthly={proPerMonth}
          priceYearly={`${proPrice} / year`}
          description="For solo founders who want flexibility across multiple projects."
          features={[
            '10 Standard-equivalent units / mo',
            'Mix Standard and Ultimate (3:1)',
            '10 projects, custom agents, GitHub export',
            'PDF / DOCX export, 90-day audit log',
            'Priority generation queue',
            'Email support',
          ]}
          ctaLabel={
            currentTier === 'pro'
              ? 'Your current plan'
              : busy === 'pro'
                ? 'Opening checkout…'
                : `Upgrade to Pro${interval === 'year' ? ' · Save 20%' : ''}`
          }
          highlight
          onCta={() => onUpgrade('pro')}
          ctaDisabled={currentTier === 'pro' || busy !== null}
          currentBadge={currentTier === 'pro' ? 'Current' : undefined}
        />
        <PricingCard
          tierKey="team"
          name="Team"
          priceMonthly={teamPerMonth}
          priceYearly={`${teamPrice} / year`}
          description="For product teams of 3–20 who need collaboration and unlimited Standard."
          features={[
            'Unlimited Standard + 10 Ultimate / mo',
            'Team collaboration, custom domain',
            'SSO, 1-year audit log',
            'BYO Claude key, API access',
            'Slack / Teams support',
          ]}
          ctaLabel={
            currentTier === 'team'
              ? 'Your current plan'
              : busy === 'team'
                ? 'Opening checkout…'
                : `Upgrade to Team${interval === 'year' ? ' · Save 20%' : ''}`
          }
          onCta={() => onUpgrade('team')}
          ctaDisabled={currentTier === 'team' || busy !== null}
          currentBadge={currentTier === 'team' ? 'Current' : undefined}
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-semibold text-zinc-50">Feature comparison</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-zinc-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold">Free</th>
                <th className="px-4 py-3 font-semibold text-amber-300">Pro</th>
                <th className="px-4 py-3 font-semibold">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {FEATURE_COMPARISON.map((row) => (
                <tr key={row.label} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-zinc-200">{row.label}</td>
                  <td className="px-4 py-3"><Cell value={row.free} /></td>
                  <td className="px-4 py-3"><Cell value={row.pro} /></td>
                  <td className="px-4 py-3"><Cell value={row.team} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="text-2xl font-semibold text-zinc-50">FAQ</h2>
        <div className="mt-6 space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-lg border border-white/10 bg-white/5 px-4 py-3"
            >
              <summary className="cursor-pointer text-sm font-medium text-zinc-100 marker:hidden">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-zinc-400">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl border-t border-white/10 px-6 py-10 text-center text-sm text-zinc-500">
        Questions? <a href="mailto:support@apparchitect.app" className="text-amber-300 hover:underline">Email us</a> · <Link to="/" className="text-amber-300 hover:underline">Back to home</Link>
      </footer>
    </main>
  );
}
