/**
 * Header - App header with animations
 */

import { Boxes, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { UserMenu } from '@/components/Auth/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { easing, duration } from '@/components/ui/motion';

interface HeaderProps {
  showTagline?: boolean;
  projectName?: string;
  onOpenProjects?: () => void;
  showProjectActions?: boolean;
}

export function Header({
  showTagline = true,
  projectName,
  onOpenProjects,
  showProjectActions = false
}: HeaderProps) {
  const { user } = useAuth();

  return (
    <motion.header
      className="h-16 border-b border-border/50 bg-deep/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: duration.medium, ease: easing.outQuint }}>

			<div data-ev-id="ev_44d7277ccf" className="flex items-center gap-3">
				<motion.div
          className="w-10 h-10 bg-cyan/10 border border-cyan/30 rounded-lg flex items-center justify-center"
          whileHover={{
            scale: 1.05,
            boxShadow: '0 0 20px rgba(0,229,204,0.3)'
          }}
          transition={{ duration: duration.fast }}>

					<Boxes className="w-5 h-5 text-cyan" />
				</motion.div>
				<div data-ev-id="ev_0dc8d31ea4">
					<div data-ev-id="ev_36e503520d" className="flex items-center gap-2">
						<h1 data-ev-id="ev_c2012eb2fd" className="font-display text-[20px] sm:text-[24px] tracking-[4px] sm:tracking-[6px] text-text-white">
							APPARCHITECT
						</h1>
						{projectName &&
            <>
								<span data-ev-id="ev_779a72693a" className="text-text-slate hidden sm:inline">/</span>
								<motion.span
                className="font-mono text-[13px] text-cyan hidden sm:inline truncate max-w-[200px]"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: duration.medium, ease: easing.outQuint }}>

									{projectName}
								</motion.span>
							</>
            }
					</div>
					{showTagline && !projectName &&
          <p data-ev-id="ev_4b2b6022d9" className="font-mono text-[9px] uppercase tracking-[2.5px] text-text-slate -mt-1 hidden sm:block">
							Agent-Powered Build System
						</p>
          }
				</div>
			</div>

			<div data-ev-id="ev_b6f2ef1b15" className="flex items-center gap-2 sm:gap-3">
				{showProjectActions && onOpenProjects &&
        <AnimatedButton variant="secondary" size="sm" onClick={onOpenProjects}>
						<FolderOpen className="w-3 h-3" />
						<span data-ev-id="ev_d96db4af48" className="hidden sm:inline">Projects</span>
					</AnimatedButton>
        }
				{user && <UserMenu />}
			</div>
		</motion.header>);

}