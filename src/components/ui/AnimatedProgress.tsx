/**
 * AnimatedProgress - Progress bar with fluid animation
 */

import { motion } from 'framer-motion';
import { easing, duration } from './motion';

interface AnimatedProgressProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'gradient' | 'glow';
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedProgress({
  progress,
  label,
  showPercentage = true,
  variant = 'default',
  size = 'md'
}: AnimatedProgressProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const fillStyles = {
    default: 'bg-cyan',
    gradient: 'bg-gradient-to-r from-cyan via-cyan-dim to-cyan',
    glow: 'bg-cyan shadow-[0_0_20px_rgba(0,229,204,0.5)]'
  };

  return (
    <div data-ev-id="ev_cf36b09acc" className="flex flex-col gap-2">
			{(label || showPercentage) &&
      <div data-ev-id="ev_65abf025c3" className="flex items-center justify-between">
					{label &&
        <span data-ev-id="ev_abb744dccc" className="font-mono text-[11px] font-bold uppercase tracking-[2.5px] text-text-slate">
							{label}
						</span>
        }
					{showPercentage &&
        <motion.span
          className="font-mono text-[11px] text-cyan tabular-nums"
          key={clampedProgress}
          initial={{ opacity: 0.5, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast }}>

							{Math.round(clampedProgress)}%
						</motion.span>
        }
				</div>
      }
			
			<div data-ev-id="ev_5dede7d66b" className={`${sizes[size]} bg-panel rounded-full overflow-hidden relative`}>
				<motion.div
          className={`h-full ${fillStyles[variant]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{
            duration: duration.slow,
            ease: easing.outQuint
          }} />

				
				{/* Shimmer effect for active progress */}
				{clampedProgress > 0 && clampedProgress < 100 &&
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
            width: `${clampedProgress}%`
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }} />

        }
			</div>
		</div>);

}