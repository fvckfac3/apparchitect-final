/**
 * Skeleton - Loading placeholder with shimmer effect
 * 
 * Following animation-patterns skill:
 * - Show skeleton after 300ms for loads over 1 second
 * - Skeletons should mirror content layout
 */

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height
}: SkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  };

  return (
    <div data-ev-id="ev_5b3e607792"
    className={`relative overflow-hidden bg-panel ${variants[variant]} ${className}`}
    style={{ width, height }}>

			<motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)'
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }} />

		</div>);

}

// ============================================================================
// PRESET SKELETONS
// ============================================================================

export function SkeletonCard({ className = '' }: {className?: string;}) {
  return (
    <div data-ev-id="ev_a95eb33d73" className={`p-6 bg-panel border border-border rounded-lg ${className}`}>
			<div data-ev-id="ev_089dfca86f" className="flex flex-col gap-4">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-6 w-3/4" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-2/3" />
			</div>
		</div>);

}

export function SkeletonList({ count = 3 }: {count?: number;}) {
  return (
    <div data-ev-id="ev_4607113d49" className="flex flex-col gap-3">
			{Array.from({ length: count }).map((_, i) =>
      <div data-ev-id="ev_e8c01e448d" key={i} className="flex items-center gap-3">
					<Skeleton variant="circular" width={40} height={40} />
					<div data-ev-id="ev_91109c6ce7" className="flex-1 flex flex-col gap-2">
						<Skeleton className="h-4 w-1/3" />
						<Skeleton className="h-3 w-1/2" />
					</div>
				</div>
      )}
		</div>);

}