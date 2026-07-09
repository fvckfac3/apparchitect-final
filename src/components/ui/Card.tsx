/**
 * Card Component - Elevated surface with hover effects
 * 
 * Follows the shadow skill guidelines for dark mode:
 * - Border + glow hybrid for dark surfaces
 * - Layered shadows for premium feel
 * - 3D tilt on hover for delight
 */

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { type ReactNode, type MouseEvent } from 'react';
import { easing, duration } from './motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'interactive' | 'glow';
  hoverEffect?: 'lift' | 'tilt' | 'glow' | 'none';
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  variant = 'default',
  hoverEffect = 'lift',
  onClick
}: CardProps) {
  // For 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (hoverEffect !== 'tilt') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Variant styles
  const variants = {
    default: `
			bg-panel 
			border border-border
			rounded-lg
		`,
    elevated: `
			bg-panel 
			border border-border
			rounded-lg
			shadow-[0_4px_24px_rgba(0,0,0,0.4)]
		`,
    interactive: `
			bg-panel 
			border border-border
			rounded-lg
			cursor-pointer
			select-none
		`,
    glow: `
			bg-panel 
			border border-cyan/20
			rounded-lg
			shadow-[0_0_30px_rgba(0,229,204,0.1)]
		`
  };

  // Hover animations by effect type
  const hoverAnimations = {
    lift: {
      y: -6,
      boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,229,204,0.2)',
      borderColor: 'rgba(0,229,204,0.3)'
    },
    tilt: {
      boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(0,229,204,0.15)',
      borderColor: 'rgba(0,229,204,0.4)'
    },
    glow: {
      boxShadow: '0 0 40px rgba(0,229,204,0.25), 0 0 80px rgba(0,229,204,0.1)',
      borderColor: 'rgba(0,229,204,0.5)'
    },
    none: {}
  };

  return (
    <motion.div
      className={`${variants[variant]} ${className}`}
      style={
      hoverEffect === 'tilt' ?
      {
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000
      } :
      undefined
      }
      whileHover={hoverAnimations[hoverEffect]}
      transition={{
        duration: duration.normal,
        ease: easing.outQuart
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}>

			{children}
		</motion.div>);

}

// ============================================================================
// GLOW CARD - Special variant with animated glow
// ============================================================================

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({
  children,
  className = '',
  glowColor = 'rgba(0,229,204,0.15)'
}: GlowCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <motion.div
      className={`relative overflow-hidden bg-panel border border-border rounded-lg ${className}`}
      onMouseMove={handleMouseMove}
      whileHover={{ borderColor: 'rgba(0,229,204,0.4)' }}
      transition={{ duration: duration.fast }}>

			{/* Cursor glow effect */}
			<motion.div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, ${glowColor}, transparent 70%)`
          )
        }} />

			<div data-ev-id="ev_d940ba03d9" className="relative z-10">
				{children}
			</div>
		</motion.div>);

}