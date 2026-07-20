import { useState } from 'react';
import { Boxes, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';

type AuthMode = 'signin' | 'signup';

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Account created. Check your email to confirm your address, then sign in.');
          setMode('signin');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-ev-id="ev_533a0338ab" className="min-h-screen bg-ink flex flex-col">
			{/* Header */}
			<header data-ev-id="ev_d441d480e2" className="h-16 border-b border-border flex items-center px-8">
				<div data-ev-id="ev_acb2b4bf1e" className="flex items-center gap-3">
					<div data-ev-id="ev_ea71b5d19e" className="w-10 h-10 bg-cyan/10 border border-cyan/30 rounded-md flex items-center justify-center">
						<Boxes className="w-5 h-5 text-cyan" />
					</div>
					<div data-ev-id="ev_48b398b817">
						<h1 data-ev-id="ev_e62e4854d8" className="font-display text-[24px] tracking-[6px] text-text-white">APPARCHITECT</h1>
						<p data-ev-id="ev_f711cfe218" className="font-mono text-[9px] uppercase tracking-[2.5px] text-text-slate -mt-1">
							Agent-Powered Build System
						</p>
					</div>
				</div>
			</header>

			{/* Main */}
			<main data-ev-id="ev_7f6c0525ac" className="flex-1 flex items-center justify-center p-8">
				<div data-ev-id="ev_69d9b1074f" className="w-full max-w-md">
					{/* Card */}
					<div data-ev-id="ev_43d2379cb6" className="bg-surface border border-border rounded-lg overflow-hidden">
						{/* Tabs */}
						<div data-ev-id="ev_d596f7b3c1" className="flex border-b border-border">
							<button data-ev-id="ev_97f401c41c"
              onClick={() => {setMode('signin');setError(null);}}
              className={`flex-1 py-4 font-mono text-[11px] font-bold uppercase tracking-[2.5px] border-b-2 transition-colors ${
              mode === 'signin' ?
              'text-cyan border-cyan' :
              'text-text-slate border-transparent hover:text-text-light'}`
              }>

								Sign In
							</button>
							<button data-ev-id="ev_446c4d1aeb"
              onClick={() => {setMode('signup');setError(null);}}
              className={`flex-1 py-4 font-mono text-[11px] font-bold uppercase tracking-[2.5px] border-b-2 transition-colors ${
              mode === 'signup' ?
              'text-cyan border-cyan' :
              'text-text-slate border-transparent hover:text-text-light'}`
              }>

								Sign Up
							</button>
						</div>

						{/* Form */}
						<form data-ev-id="ev_c9e4657108" onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
							{mode === 'signup' &&
              <div data-ev-id="ev_1e99394801" className="relative">
									<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-slate" />
									<input data-ev-id="ev_f24ebde3b6"
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-panel border border-border rounded-sm pl-10 pr-4 py-3 font-mono text-[13px] text-text-white placeholder:text-text-slate focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/30 transition-colors" />

								</div>
              }

							<div data-ev-id="ev_f577d2b2cf" className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-slate" />
								<input data-ev-id="ev_b313ea63c4"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-panel border border-border rounded-sm pl-10 pr-4 py-3 font-mono text-[13px] text-text-white placeholder:text-text-slate focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/30 transition-colors" />

							</div>

							<div data-ev-id="ev_ba9a5714ec" className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-slate" />
								<input data-ev-id="ev_024b13810c"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-panel border border-border rounded-sm pl-10 pr-4 py-3 font-mono text-[13px] text-text-white placeholder:text-text-slate focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/30 transition-colors" />

							</div>

							{error &&
              <div data-ev-id="ev_f0ce9a3fa9" className="p-3 bg-signal-red/10 border border-signal-red/30 rounded-sm">
									<p data-ev-id="ev_7cf42479c3" className="font-mono text-[11px] text-signal-red">{error}</p>
								</div>
              }

							{success &&
              <div data-ev-id="ev_a3d12554ce" className="p-3 bg-cyan/10 border border-cyan/30 rounded-sm">
									<p data-ev-id="ev_3d74e094d9" className="font-mono text-[11px] text-cyan">{success}</p>
								</div>
              }

							<Button type="submit" disabled={isLoading} className="w-full">
								{isLoading ?
                <Loader2 className="w-4 h-4 animate-spin" /> :

                <>
										{mode === 'signin' ? 'Sign In' : 'Create Account'}
										<ArrowRight className="ml-2 w-4 h-4" />
									</>
                }
							</Button>
						</form>
					</div>

					{/* Footer text */}
					<p data-ev-id="ev_603128c191" className="text-center mt-6 font-mono text-[11px] text-text-slate">
						{mode === 'signin' ?
            <>
								Don't have an account?{' '}
								<button data-ev-id="ev_31df55ad86" onClick={() => setMode('signup')} className="text-cyan hover:underline">
									Sign up
								</button>
							</> :

            <>
								Already have an account?{' '}
								<button data-ev-id="ev_733cfde0af" onClick={() => setMode('signin')} className="text-cyan hover:underline">
									Sign in
								</button>
							</>
            }
					</p>
				</div>
			</main>
		</div>);

}