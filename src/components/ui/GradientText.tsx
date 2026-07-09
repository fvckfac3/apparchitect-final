/**
 * GradientText - Animated gradient text effect
 * 
 * Use sparingly - following anti-AI-slop guidelines:
 * "Gradient clipped to text is striking on one headline. AI puts it on every heading."
 */

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  gradient?: 'cyan' | 'sunset' | 'aurora' | 'custom';
  customGradient?: string;
  animate?: boolean;
}

export function GradientText({
  children,
  className = '',
  gradient = 'cyan',
  customGradient,
  animate = false
}: GradientTextProps) {
  const gradients = {
    cyan: 'from-cyan via-cyan-dim to-cyan',
    sunset: 'from-amber via-signal-red to-amber',
    aurora: 'from-cyan via-agent-frontend to-cyan',
    custom: customGradient || 'from-cyan to-cyan-dim'
  };

  const baseClasses = `
		bg-gradient-to-r bg-clip-text text-transparent
		${gradient === 'custom' ? customGradient : gradients[gradient]}
		${className}
	`;

  if (animate) {
    return (
      <motion.span
        className={baseClasses}
        style={{ backgroundSize: '200% 200%' }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}>

				{children}
			</motion.span>);

  }

  return <span data-ev-id="ev_8787d8883f" className={baseClasses}>{children}</span>;
}