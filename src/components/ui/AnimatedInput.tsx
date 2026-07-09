/**
 * AnimatedInput - Form input with focus animations and micro-interactions
 * 
 * Following UI/UX patterns skill:
 * - Label position: above input, left-aligned
 * - Error message: within 8px below input
 * - Inline validation on blur
 * - 44px minimum height for touch targets
 */

import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { easing, duration } from './motion';

interface AnimatedInputProps {
  label?: string;
  error?: string;
  success?: boolean;
  hint?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  function AnimatedInput({ label, error, success, hint, className = '', ...props }, ref) {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div data-ev-id="ev_2a4d8f3ae3" className="flex flex-col gap-2">
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
				
				<div data-ev-id="ev_e837a913f6" className="relative">
					<motion.input
            ref={ref}
            className={`
							w-full bg-surface 
							border rounded-md
							px-4 py-3 pr-10
							font-mono text-[13px] text-text-white 
							placeholder:text-text-slate
							focus:outline-none
							transition-shadow
							min-h-[44px]
							${error ? 'border-signal-red' : success ? 'border-emerald-500' : 'border-border'}
							${className}
						`}
            animate={{
              borderColor: isFocused ?
              '#00E5CC' :
              error ?
              '#FF4C6A' :
              success ?
              '#10B981' :
              '#252A3A',
              boxShadow: isFocused ?
              '0 0 0 3px rgba(0,229,204,0.15), 0 0 20px rgba(0,229,204,0.1)' :
              error ?
              '0 0 0 3px rgba(255,76,106,0.15)' :
              'none'
            }}
            transition={{ duration: duration.fast, ease: easing.outQuart }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props} />


					{/* Status icon */}
					<AnimatePresence>
						{(error || success) &&
            <motion.div
              className="absolute right-3 top-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: duration.fast }}>

								{error ?
              <AlertCircle className="w-4 h-4 text-signal-red" /> :

              <Check className="w-4 h-4 text-emerald-500" />
              }
							</motion.div>
            }
					</AnimatePresence>
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