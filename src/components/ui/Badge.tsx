/**
 * Badge Component - Status indicators and labels
 * 
 * Follows anti-AI-slop guidelines:
 * - No emoji as icons
 * - Proper semantic colors
 * - Subtle animations
 */

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'cyan';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  className = ''
}: BadgeProps) {
  const variants = {
    default: 'bg-panel border-border text-text-light',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    warning: 'bg-amber/10 border-amber/30 text-amber',
    error: 'bg-signal-red/10 border-signal-red/30 text-signal-red',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    cyan: 'bg-cyan/10 border-cyan/30 text-cyan'
  };

  const dotColors = {
    default: 'bg-text-slate',
    success: 'bg-emerald-400',
    warning: 'bg-amber',
    error: 'bg-signal-red',
    info: 'bg-blue-400',
    cyan: 'bg-cyan'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-3 py-1 text-[10px]'
  };

  return (
    <span data-ev-id="ev_40f51cd01d"
    className={`
				inline-flex items-center gap-1.5
				font-mono uppercase tracking-[1.5px] font-medium
				border rounded-full
				${variants[variant]}
				${sizes[size]}
				${className}
			`}>

			{dot &&
      <span data-ev-id="ev_7132571867" className="relative flex h-1.5 w-1.5">
					{pulse &&
        <motion.span
          className={`absolute inline-flex h-full w-full rounded-full ${dotColors[variant]} opacity-75`}
          animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
          transition={{ duration: 1.5, repeat: Infinity }} />

        }
					<span data-ev-id="ev_22ffac5921" className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColors[variant]}`} />
				</span>
      }
			{children}
		</span>);

}