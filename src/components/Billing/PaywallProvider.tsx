/**
 * PaywallProvider.tsx - Context-based paywall trigger surface.
 *
 * Lets any component call usePaywall().show(trigger, errorCode?) to open
 * the paywall modal. Modal is mounted by the provider so triggers can be
 * fired from anywhere in the tree.
 *
 * Implements Monetization & Pricing PRD §6.1 - "Modal appears (the only UI
 * surface where the paywall shows)".
 */
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { PaywallModal } from './PaywallModal';
import type { PaywallTrigger } from './PaywallModal';
import type { BillingErrorCode } from '@/lib/billing/errors';

interface PaywallState {
  trigger: PaywallTrigger | null;
  errorCode: BillingErrorCode | null;
}

interface PaywallContextValue {
  show: (trigger: PaywallTrigger, errorCode?: BillingErrorCode) => void;
  close: () => void;
}

const PaywallContext = createContext<PaywallContextValue | null>(null);

export function PaywallProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PaywallState>({ trigger: null, errorCode: null });

  const show = useCallback((trigger: PaywallTrigger, errorCode?: BillingErrorCode) => {
    setState({ trigger, errorCode: errorCode ?? null });
  }, []);

  const close = useCallback(() => {
    setState({ trigger: null, errorCode: null });
  }, []);

  return (
    <PaywallContext.Provider value={{ show, close }}>
      {children}
      {state.trigger && (
        <PaywallModal
          open
          trigger={state.trigger}
          onClose={close}
        />
      )}
    </PaywallContext.Provider>
  );
}

export function usePaywall(): PaywallContextValue {
  const ctx = useContext(PaywallContext);
  if (!ctx) {
    throw new Error('usePaywall must be used inside <PaywallProvider>.');
  }
  return ctx;
}
