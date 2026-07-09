/**
 * Motion Components - Framer Motion primitives for the design system
 * 
 * Provides reusable animation patterns with consistent easing and timing.
 * Based on the animation-patterns skill guidelines.
 * 
 * NOTE: This file intentionally exports both motion variant objects
 * (Variants: fadeIn, fadeInUp, etc.) and React components. The
 * react-refresh/only-export-components rule flags this as a warning,
 * but splitting the file would force every consumer to import from
 * two places. We disable the rule at file level instead.
 */

/* eslint-disable react-refresh/only-export-components */

import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';

// ============================================================================
// EASING CURVES (no bounce/elastic - they feel dated)
// ============================================================================

export const easing = {
	// Standard - smooth, refined deceleration
	outQuart: [0.25, 1, 0.5, 1] as const,
	// Snappier - confident, decisive
	outQuint: [0.22, 1, 0.36, 1] as const,
	// Dramatic - expo deceleration
	outExpo: [0.16, 1, 0.3, 1] as const,
	// For entrances
	enter: [0.22, 1, 0.36, 1] as const,
	// For exits (faster)
	exit: [0.4, 0, 1, 1] as const,
};

// ============================================================================
// TIMING
// ============================================================================

export const duration = {
	instant: 0.1,      // Micro-feedback
	fast: 0.15,        // Hover, toggle
	normal: 0.25,      // State changes
	medium: 0.35,      // Modals, dropdowns
	slow: 0.5,         // Page transitions
	entrance: 0.6,     // Hero animations
};

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

export const fadeIn: Variants = {
	initial: { opacity: 0 },
	animate: { opacity: 1, transition: { duration: duration.normal, ease: easing.outQuart } },
	exit: { opacity: 0, transition: { duration: duration.fast, ease: easing.exit } },
};

export const fadeInUp: Variants = {
	initial: { opacity: 0, y: 24 },
	animate: { 
		opacity: 1, 
		y: 0, 
		transition: { duration: duration.medium, ease: easing.outQuint } 
	},
	exit: { 
		opacity: 0, 
		y: -12, 
		transition: { duration: duration.fast, ease: easing.exit } 
	},
};

export const fadeInDown: Variants = {
	initial: { opacity: 0, y: -24 },
	animate: { 
		opacity: 1, 
		y: 0, 
		transition: { duration: duration.medium, ease: easing.outQuint } 
	},
};

export const fadeInLeft: Variants = {
	initial: { opacity: 0, x: -24 },
	animate: { 
		opacity: 1, 
		x: 0, 
		transition: { duration: duration.medium, ease: easing.outQuint } 
	},
};

export const fadeInRight: Variants = {
	initial: { opacity: 0, x: 24 },
	animate: { 
		opacity: 1, 
		x: 0, 
		transition: { duration: duration.medium, ease: easing.outQuint } 
	},
};

export const scaleIn: Variants = {
	initial: { opacity: 0, scale: 0.92 },
	animate: { 
		opacity: 1, 
		scale: 1, 
		transition: { duration: duration.medium, ease: easing.outQuint } 
	},
	exit: { 
		opacity: 0, 
		scale: 0.95, 
		transition: { duration: duration.fast, ease: easing.exit } 
	},
};

export const staggerContainer: Variants = {
	initial: {},
	animate: {
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.1,
		},
	},
};

export const staggerItem: Variants = {
	initial: { opacity: 0, y: 20 },
	animate: { 
		opacity: 1, 
		y: 0,
		transition: { duration: duration.medium, ease: easing.outQuint },
	},
};

// ============================================================================
// MOTION WRAPPER COMPONENTS
// ============================================================================

interface MotionDivProps extends HTMLMotionProps<'div'> {
	children?: ReactNode;
}

// Fade in from below (most common entrance)
export const FadeInUp = forwardRef<HTMLDivElement, MotionDivProps>(
	({ children, ...props }, ref) => (
		<motion.div
			ref={ref}
			initial="initial"
			animate="animate"
			exit="exit"
			variants={fadeInUp}
			{...props}
		>
			{children}
		</motion.div>
	)
);
FadeInUp.displayName = 'FadeInUp';

// Scale in (for modals, cards)
export const ScaleIn = forwardRef<HTMLDivElement, MotionDivProps>(
	({ children, ...props }, ref) => (
		<motion.div
			ref={ref}
			initial="initial"
			animate="animate"
			exit="exit"
			variants={scaleIn}
			{...props}
		>
			{children}
		</motion.div>
	)
);
ScaleIn.displayName = 'ScaleIn';

// Staggered container
export const StaggerContainer = forwardRef<HTMLDivElement, MotionDivProps>(
	({ children, ...props }, ref) => (
		<motion.div
			ref={ref}
			initial="initial"
			animate="animate"
			variants={staggerContainer}
			{...props}
		>
			{children}
		</motion.div>
	)
);
StaggerContainer.displayName = 'StaggerContainer';

// Stagger item
export const StaggerItem = forwardRef<HTMLDivElement, MotionDivProps>(
	({ children, ...props }, ref) => (
		<motion.div
			ref={ref}
			variants={staggerItem}
			{...props}
		>
			{children}
		</motion.div>
	)
);
StaggerItem.displayName = 'StaggerItem';

// ============================================================================
// SCROLL-TRIGGERED ANIMATION
// ============================================================================

interface ScrollRevealProps extends MotionDivProps {
	delay?: number;
}

export function ScrollReveal({ children, delay = 0, ...props }: ScrollRevealProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ 
				opacity: 1, 
				y: 0,
				transition: { 
					duration: duration.slow, 
					ease: easing.outQuint,
					delay,
				},
			}}
			viewport={{ once: true, margin: '-100px' }}
			{...props}
		>
			{children}
		</motion.div>
	);
}

// ============================================================================
// HOVER LIFT EFFECT
// ============================================================================

interface HoverLiftProps extends MotionDivProps {
	liftAmount?: number;
}

export function HoverLift({ children, liftAmount = 4, ...props }: HoverLiftProps) {
	return (
		<motion.div
			whileHover={{ 
				y: -liftAmount,
				transition: { duration: duration.fast, ease: easing.outQuart },
			}}
			whileTap={{ 
				y: 0,
				transition: { duration: duration.instant },
			}}
			{...props}
		>
			{children}
		</motion.div>
	);
}

// ============================================================================
// REDUCED MOTION WRAPPER
// ============================================================================

export function useReducedMotion(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
