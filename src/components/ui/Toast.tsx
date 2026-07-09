/**
 * Toast - Notification system with animations
 * 
 * Following UI/UX patterns:
 * - Toast duration: 3-5s for info, persistent for errors
 * - Success feedback on every action
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { type ReactNode } from 'react';
import { easing, duration } from './motion';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  variant?: ToastVariant;
  title: string;
  description?: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  error: <AlertCircle className="w-5 h-5 text-signal-red" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber" />,
  info: <Info className="w-5 h-5 text-blue-400" />
};

const borderColors: Record<ToastVariant, string> = {
  success: 'border-emerald-500/30',
  error: 'border-signal-red/30',
  warning: 'border-amber/30',
  info: 'border-blue-500/30'
};

export function Toast({
  variant = 'info',
  title,
  description,
  onClose,
  action
}: ToastProps) {
  return (
    <motion.div
      className={`
				flex items-start gap-3 
				bg-panel/95 backdrop-blur-sm
				border ${borderColors[variant]}
				rounded-lg p-4
				shadow-[0_8px_32px_rgba(0,0,0,0.4)]
				min-w-[320px] max-w-[420px]
			`}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: duration.medium, ease: easing.outQuint }}
      layout>

			<div data-ev-id="ev_f09e9bbd67" className="flex-shrink-0 mt-0.5">
				{icons[variant]}
			</div>
			
			<div data-ev-id="ev_c5fc5c5e16" className="flex-1 min-w-0">
				<p data-ev-id="ev_eec1200933" className="font-mono text-[13px] font-medium text-text-white">
					{title}
				</p>
				{description &&
        <p data-ev-id="ev_bcf1396453" className="font-mono text-[12px] text-text-light mt-1">
						{description}
					</p>
        }
				{action &&
        <button data-ev-id="ev_ebceeab82f"
        className="font-mono text-[11px] font-bold uppercase tracking-[1.5px] text-cyan hover:text-cyan-dim mt-2 transition-colors"
        onClick={action.onClick}>

						{action.label}
					</button>
        }
			</div>

			{onClose &&
      <button data-ev-id="ev_0ffd8aeb68"
      className="flex-shrink-0 p-1 -m-1 text-text-slate hover:text-text-light transition-colors rounded"
      onClick={onClose}>

					<X className="w-4 h-4" />
				</button>
      }
		</motion.div>);

}

// ============================================================================
// TOAST CONTAINER
// ============================================================================

interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div data-ev-id="ev_d2deae194e" className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
			<AnimatePresence mode="popLayout">
				{toasts.map((toast) =>
        <Toast
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          onClose={() => onDismiss(toast.id)} />

        )}
			</AnimatePresence>
		</div>);

}