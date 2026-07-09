/**
 * AnimatedTextarea - Textarea with focus animations
 */

import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef, useState, type TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { easing, duration } from './motion';

interface AnimatedTextareaProps {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export const AnimatedTextarea = forwardRef<HTMLTextAreaElement, AnimatedTextareaProps>(
  function AnimatedTextarea({ label, error, hint, className = '', ...props }, ref) {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div data-ev-id="ev_b61d60a399" className="flex flex-col gap-2">
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
				
				<motion.textarea
          ref={ref}
          className={`
						w-full bg-surface 
						border rounded-md
						px-4 py-3
						font-mono text-[13px] text-text-white 
						placeholder:text-text-slate
						focus:outline-none
						transition-shadow
						resize-none
						min-h-[120px]
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
            error ?
            '0 0 0 3px rgba(255,76,106,0.15)' :
            'none'
          }}
          transition={{ duration: duration.fast, ease: easing.outQuart }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props} />


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