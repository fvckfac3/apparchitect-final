/**
 * GlassPanel - Frosted glass effect for overlays and panels
 * 
 * Following anti-AI-slop guidelines:
 * - Use sparingly (one glass element can be beautiful, everywhere is chaos)
 * - Only for specific use cases: modals, floating panels
 */

import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';
import { scaleIn, duration, easing } from './motion';

interface GlassPanelProps extends HTMLMotionProps<'div'> {
	children: ReactNode;
	intensity?: 'light' | 'medium' | 'heavy';
	className?: string;
}

export function GlassPanel({ 
	children, 
	intensity = 'medium',
	className = '',
	...props
}: GlassPanelProps) {
	const intensityStyles = {
		light: 'bg-panel/60 backdrop-blur-sm',
		medium: 'bg-panel/80 backdrop-blur-md',
		heavy: 'bg-panel/90 backdrop-blur-lg',
	};

	return (
		<motion.div
			className={`
				${intensityStyles[intensity]}
				border border-white/5
				rounded-xl
				shadow-[0_8px_32px_rgba(0,0,0,0.4)]
				${className}
			`}
			initial="initial"
			animate="animate"
			exit="exit"
			variants={scaleIn}
			{...props}
		>
			{children}
		</motion.div>
	);
}

// ============================================================================
// MODAL OVERLAY
// ============================================================================

interface ModalOverlayProps {
	children: ReactNode;
	onClose?: () => void;
}

export function ModalOverlay({ children, onClose }: ModalOverlayProps) {
	return (
		<motion.div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: duration.fast }}
		>
			{/* Backdrop */}
			<motion.div
				className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
				onClick={onClose}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			/>
			{/* Content */}
			<GlassPanel className="relative z-10 max-w-lg w-full">
				{children}
			</GlassPanel>
		</motion.div>
	);
}
