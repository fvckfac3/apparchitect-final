/**
 * AnimatedButton - Button with micro-interactions and magnetic effect
 * 
 * Based on delight skill patterns:
 * - Magnetic pull toward cursor
 * - Press feedback with scale
 * - Glow intensification on hover
 */

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { type ReactNode, type MouseEvent, type ButtonHTMLAttributes } from 'react';
import { easing, duration } from './motion';

interface AnimatedButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  magnetic?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function AnimatedButton({
  variant = 'primary',
  size = 'md',
  magnetic = false,
  children,
  className = '',
  disabled,
  onClick,
  type = 'button',
}: AnimatedButtonProps) {
  // Magnetic effect values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  function handleMouseMove(e: MouseEvent<HTMLButtonElement>) {
    if (!magnetic || disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Base styles
  const baseStyles = `
		inline-flex items-center justify-center 
		font-mono font-bold uppercase tracking-[2px]
		transition-colors
		disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
		relative overflow-hidden
		rounded-md
	`;

  // Variant styles
  const variants = {
    primary: `
			bg-cyan text-ink
			shadow-[0_0_20px_rgba(0,229,204,0.3)]
		`,
    secondary: `
			bg-panel border border-border text-text-white
		`,
    ghost: `
			bg-transparent text-text-light
		`,
    danger: `
			bg-signal-red/10 border border-signal-red/30 text-signal-red
		`
  };

  // Size styles
  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text-[11px]',
    lg: 'px-8 py-4 text-[12px]'
  };

  // Hover animations by variant
  const hoverAnimations = {
    primary: {
      scale: 1.02,
      boxShadow: '0 0 40px rgba(0,229,204,0.5), 0 0 80px rgba(0,229,204,0.2)'
    },
    secondary: {
      scale: 1.02,
      borderColor: 'rgba(0,229,204,0.5)',
      boxShadow: '0 0 20px rgba(0,229,204,0.15)'
    },
    ghost: {
      scale: 1.02,
      backgroundColor: 'rgba(28,32,48,0.5)'
    },
    danger: {
      scale: 1.02,
      boxShadow: '0 0 20px rgba(255,76,106,0.3)'
    }
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={magnetic ? { x: springX, y: springY } : undefined}
      whileHover={disabled ? undefined : hoverAnimations[variant]}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{
        duration: duration.fast,
        ease: easing.outQuart
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      onClick={onClick}
      type={type}>

			{/* Shimmer effect on primary buttons */}
			{variant === 'primary' &&
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
        }}
        initial={{ x: '-100%' }}
        whileHover={{
          x: '100%',
          opacity: 1,
          transition: { duration: 0.6, ease: 'linear' }
        }} />

      }
			<span data-ev-id="ev_94b0d91ea0" className="relative z-10 flex items-center gap-2">
				{children}
			</span>
		</motion.button>);

}