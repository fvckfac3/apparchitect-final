/**
 * StepTracker - Animated step progress indicator
 */

import { Check, Circle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppPhase } from '@/types';
import { easing, duration } from '@/components/ui/motion';

interface Step {
  id: AppPhase;
  label: string;
  description: string;
}

const STEPS: Step[] = [
{ id: 'interview', label: 'INTERVIEW', description: 'Capture app requirements' },
{ id: 'team-design', label: 'TEAM DESIGN', description: 'Design agent team' },
{ id: 'generation', label: 'GENERATION', description: 'Create PRD documents' },
{ id: 'review', label: 'REVIEW', description: 'Review & export' }];


interface StepTrackerProps {
  currentPhase: AppPhase;
  completedPhases?: AppPhase[];
}

export function StepTracker({ currentPhase, completedPhases = [] }: StepTrackerProps) {
  if (currentPhase === 'landing') return null;

  const currentIndex = STEPS.findIndex((s) => s.id === currentPhase);

  return (
    <motion.div
      className="bg-deep/80 backdrop-blur-sm border-b border-border/50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.medium, ease: easing.outQuint, delay: 0.1 }}>

			<div data-ev-id="ev_08a1b2cefa" className="flex items-center justify-center py-4 px-4 sm:px-8 overflow-x-auto">
				{STEPS.map((step, index) => {
          const isComplete = completedPhases.includes(step.id) || index < currentIndex;
          const isCurrent = step.id === currentPhase;
          const isGenerating = isCurrent && step.id === 'generation';

          return (
            <div data-ev-id="ev_7ec378c2ba" key={step.id} className="flex items-center">
							<div data-ev-id="ev_3893b17c81" className="flex flex-col items-center">
								{/* Step icon */}
								<motion.div
                  className={`
										w-10 h-10 rounded-lg flex items-center justify-center
										${isComplete ?
                  'bg-cyan text-ink' :
                  isCurrent ?
                  'bg-cyan/20 border-2 border-cyan text-cyan' :
                  'bg-panel border border-border text-text-slate'}
									`
                  }
                  initial={false}
                  animate={{
                    scale: isCurrent ? [1, 1.05, 1] : 1,
                    boxShadow: isCurrent ?
                    '0 0 20px rgba(0,229,204,0.3)' :
                    'none'
                  }}
                  transition={{
                    scale: {
                      duration: 2,
                      repeat: isCurrent ? Infinity : 0,
                      ease: 'easeInOut'
                    },
                    boxShadow: { duration: duration.medium }
                  }}>

									<AnimatePresence mode="wait">
										{isComplete ?
                    <motion.div
                      key="complete"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: duration.fast, ease: easing.outQuint }}>

												<Check className="w-5 h-5" />
											</motion.div> :
                    isGenerating ?
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}>

												<Loader2 className="w-5 h-5 animate-spin" />
											</motion.div> :
                    isCurrent ?
                    <motion.div
                      key="current"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: duration.fast }}>

												<Circle className="w-5 h-5" />
											</motion.div> :

                    <span data-ev-id="ev_9d008c8608" className="font-mono text-[11px] font-bold">
												{index + 1}
											</span>
                    }
									</AnimatePresence>
								</motion.div>

								{/* Step label */}
								<motion.div
                  className="mt-2 text-center"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: duration.medium, delay: index * 0.05 }}>

									<p data-ev-id="ev_a6366d3ad5"
                  className={`
											font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[1.5px] sm:tracking-[2px]
											${isComplete || isCurrent ? 'text-text-white' : 'text-text-slate'}
										`}>

										{step.label}
									</p>
									<p data-ev-id="ev_228d880164" className="font-mono text-[8px] sm:text-[9px] text-text-slate mt-0.5 hidden sm:block">
										{step.description}
									</p>
								</motion.div>
							</div>

							{/* Connector line */}
							{index < STEPS.length - 1 &&
              <div data-ev-id="ev_3ea87aa0da" className="relative w-12 sm:w-20 h-0.5 mx-2 sm:mx-4 mb-8">
									<div data-ev-id="ev_bac7bf77f3" className="absolute inset-0 bg-border" />
									<motion.div
                  className="absolute inset-y-0 left-0 bg-cyan"
                  initial={{ width: '0%' }}
                  animate={{
                    width: index < currentIndex ? '100%' : '0%'
                  }}
                  transition={{
                    duration: duration.slow,
                    ease: easing.outQuint
                  }} />

								</div>
              }
						</div>);

        })}
			</div>
		</motion.div>);

}