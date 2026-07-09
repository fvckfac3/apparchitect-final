/**
 * Tooltip - Hover hint with animation
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { easing, duration } from './motion';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 0.3
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const positions = {
    top: {
      initial: { opacity: 0, y: 4 },
      animate: { opacity: 1, y: 0 },
      className: 'bottom-full left-1/2 -translate-x-1/2 mb-2'
    },
    bottom: {
      initial: { opacity: 0, y: -4 },
      animate: { opacity: 1, y: 0 },
      className: 'top-full left-1/2 -translate-x-1/2 mt-2'
    },
    left: {
      initial: { opacity: 0, x: 4 },
      animate: { opacity: 1, x: 0 },
      className: 'right-full top-1/2 -translate-y-1/2 mr-2'
    },
    right: {
      initial: { opacity: 0, x: -4 },
      animate: { opacity: 1, x: 0 },
      className: 'left-full top-1/2 -translate-y-1/2 ml-2'
    }
  };

  function handleMouseEnter() {
    const id = setTimeout(() => setIsVisible(true), delay * 1000);
    setTimeoutId(id);
  }

  function handleMouseLeave() {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  }

  return (
    <div data-ev-id="ev_c83ee9f46c"
    className="relative inline-flex"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}>

			{children}
			<AnimatePresence>
				{isVisible &&
        <motion.div
          className={`
							absolute z-50 pointer-events-none
							${positions[position].className}
						`}
          initial={positions[position].initial}
          animate={positions[position].animate}
          exit={positions[position].initial}
          transition={{ duration: duration.fast, ease: easing.outQuart }}>

						<div data-ev-id="ev_228525c184" className="px-3 py-1.5 bg-panel border border-border rounded-md shadow-lg whitespace-nowrap">
							<span data-ev-id="ev_eaaf4f0e2c" className="font-mono text-[11px] text-text-light">
								{content}
							</span>
						</div>
					</motion.div>
        }
			</AnimatePresence>
		</div>);

}