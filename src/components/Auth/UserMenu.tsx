import { useState } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div data-ev-id="ev_7365f9499f" className="relative">
			<button data-ev-id="ev_07cb9964c0"
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center gap-2 px-3 py-2 bg-panel border border-border rounded-md hover:border-cyan/50 transition-colors">

				<div data-ev-id="ev_cf4d55731a" className="w-6 h-6 bg-cyan/20 rounded-full flex items-center justify-center">
					<User className="w-3 h-3 text-cyan" />
				</div>
				<span data-ev-id="ev_a86a650740" className="font-mono text-[11px] text-text-white max-w-[120px] truncate">
					{displayName}
				</span>
				<ChevronDown className="w-3 h-3 text-text-slate" />
			</button>

			{isOpen &&
      <>
					<div data-ev-id="ev_1af47e95be" className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
					<div data-ev-id="ev_05c9fc5d76" className="absolute right-0 top-full mt-2 w-48 bg-panel border border-border rounded-md shadow-xl z-50 overflow-hidden">
						<div data-ev-id="ev_c8ccd67023" className="px-3 py-2 border-b border-border">
							<p data-ev-id="ev_6dfc985e62" className="font-mono text-[11px] text-text-white truncate">{user.email}</p>
						</div>
						<button data-ev-id="ev_8512e622cd"
          onClick={() => {
            signOut();
            setIsOpen(false);
          }}
          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-surface transition-colors text-left">

							<LogOut className="w-4 h-4 text-text-slate" />
							<span data-ev-id="ev_a3f9ac2953" className="font-mono text-[11px] text-text-light">Sign out</span>
						</button>
					</div>
				</>
      }
		</div>);

}