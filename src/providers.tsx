import type { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { PaywallProvider } from '@/components/Billing/PaywallProvider';
import { PaywallModal } from '@/components/Billing/PaywallModal';

/**
 * ⚠️ App-wide providers. Add new providers here — they'll be available in all routes.
 *
 * RULES:
 * - All providers wrap the router (so any route can access them).
 * - Do NOT add providers inside route components — that won't work.
 * - To use a provider's context in a route, just call the hook (e.g., useAuth()).
 */

/** Wrap <App /> with all app-wide providers (auth, themes, state, etc.) */
export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<AuthProvider>
			<PaywallProvider>
				{children}
				<PaywallModal />
			</PaywallProvider>
		</AuthProvider>
	);
}
