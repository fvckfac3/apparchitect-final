/**
 * AnimatedSelect - Dropdown with animated states
 */

import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef, useState, type SelectHTMLAttributes } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { easing, duration } from './motion';

interface AnimatedSelectProps {
  label?: string;
  options: string[];
  error?: string;
  hint?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
}

export const AnimatedSelect = forwardRef<HTMLSelectElement, AnimatedSelectProps>(
  function AnimatedSelect({ label, options, error, hint, className = '', ...props }, ref) {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div data-ev-id="ev_c295e75020" className="flex flex-col gap-2">
				{label &&
        <motion.label
          className="font-mono text-[11px] font-bold uppercase tracking-[2.5px] text-text-light"
          animate={{
            color: isFocused ? '#00E5CC' : error ? '#FF4C6A' : '#A8B0C8'
          }}
          transition={{ duration: duration.fast }}>

						{label}
					</motion.label>
        }
				
				<div data-ev-id="ev_d7b552a46c" className="relative">
					<motion.select
            ref={ref}
            className={`
							w-full appearance-none bg-surface 
							border rounded-md
							px-4 py-3 pr-10
							font-mono text-[13px] text-text-white 
							focus:outline-none
							cursor-pointer
							min-h-[44px]
							${error ? 'border-signal-red' : 'border-border'}
							${className}
						`}
            animate={{
              borderColor: isFocused ?
              '#00E5CC' :
              error ?
              '#FF4C6A' :
              '#252A3A',
              boxShadow: isFocused ?
              '0 0 0 3px rgba(0,229,204,0.15), 0 0 20px rgba(0,229,204,0.1)' :
              'none'
            }}
            transition={{ duration: duration.fast, ease: easing.outQuart }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}>

						<option data-ev-id="ev_214944fdb5" value="">Select an option...</option>
						{options.map((option) =>
            <option data-ev-id="ev_b82e628070" key={option} value={option}>
								{option}
							</option>
            )}
					</motion.select>

					{/* Chevron icon */}
					<motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            animate={{
              rotate: isFocused ? 180 : 0,
              color: isFocused ? '#00E5CC' : '#6B7494'
            }}
            transition={{ duration: duration.fast }}>

						<ChevronDown className="w-4 h-4" />
					</motion.div>
				</div>

				{/* Error/hint message */}
				<AnimatePresence mode="wait">
					{error ?
          <motion.span
            key="error"
            className="font-mono text-[11px] text-signal-red flex items-center gap-1.5"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: duration.fast }}>

							<AlertCircle className="w-3 h-3" />
							{error}
						</motion.span> :
          hint ?
          <motion.span
            key="hint"
            className="font-mono text-[11px] text-text-slate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}>

							{hint}
						</motion.span> :
          null}
				</AnimatePresence>
			</div>);

  }
);