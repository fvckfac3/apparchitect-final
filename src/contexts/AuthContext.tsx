/**
 * AuthContext - Supabase auth provider + useAuth hook.
 *
 * The react-refresh/only-export-components rule warns that this file
 * exports both a component (AuthProvider) and a non-component function
 * (useAuth hook). React Refresh's heuristic only allows components and
 * const exports to coexist, but mixing a Provider with its hook is the
 * idiomatic React context pattern. The component/hook pair is the
 * documented React API, so we disable the rule at file level.
 */

/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
	signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!supabase) {
			setIsLoading(false);
			return;
		}

		// Get initial session
		void supabase.auth.getSession()
			.then(({ data: { session } }) => {
				setSession(session);
				setUser(session?.user ?? null);
			})
			.catch(() => {
				setSession(null);
				setUser(null);
			})
			.finally(() => setIsLoading(false));

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setIsLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
		if (!supabase) return { error: new Error('Authentication is temporarily unavailable. Please try again shortly.') };

		try {
			const { data, error } = await supabase.auth.signUp({
				email: email.trim().toLowerCase(),
				password,
				options: {
					data: { full_name: fullName?.trim() || null },
					emailRedirectTo: `${window.location.origin}/`,
				},
			});

			if (error) return { error: error as Error };
			if (!data.user) return { error: new Error('We could not create the account. Please try again.') };
			return { error: null };
		} catch {
			return { error: new Error('We could not reach the account service. Check your connection and try again.') };
		}
	}, []);

	const signIn = useCallback(async (email: string, password: string) => {
		if (!supabase) return { error: new Error('Authentication is temporarily unavailable. Please try again shortly.') };

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email: email.trim().toLowerCase(),
				password,
			});
			return { error: error as Error | null };
		} catch {
			return { error: new Error('We could not reach the account service. Check your connection and try again.') };
		}
	}, []);

	const signOut = useCallback(async () => {
		if (!supabase) return;
		await supabase.auth.signOut();
	}, []);

	return (
		<AuthContext.Provider value={{ user, session, isLoading, signUp, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
