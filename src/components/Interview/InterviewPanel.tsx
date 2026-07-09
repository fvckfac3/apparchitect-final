/**
 * InterviewPanel - Conversational interview with auto-save and progress indicators
 */

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Check, Sparkles, Save } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { AnimatedProgress } from '@/components/ui/AnimatedProgress';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { InterviewReview } from '@/components/Interview/InterviewReview';
import { useInterview, type EnhancedQuestion } from '@/hooks/use-interview';
import { easing, duration } from '@/components/ui/motion';
import type { InterviewAnswers } from '@/types/interview';

interface InterviewPanelProps {
  onComplete: (answers: InterviewAnswers) => void;
}

/** Subtle indicator showing answer progress */
function AnswerProgress({
  charCount,
  isMinimum,
  isGood,
  progress,
  isStarted






}: {charCount: number;isMinimum: boolean;isGood: boolean;progress: number;isStarted: boolean;}) {
  if (!isStarted) return null;

  return (
    <motion.div
      className="flex items-center gap-2 mt-2"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}>

      {/* Mini progress bar */}
      <div data-ev-id="ev_4882fdc79f" className="flex-1 h-1 bg-border rounded-full overflow-hidden max-w-[120px]">
        <motion.div
          className={`h-full rounded-full transition-colors ${
          isGood ? 'bg-signal-green' : isMinimum ? 'bg-cyan' : 'bg-text-slate'}`
          }
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }} />

      </div>
      
      {/* Status indicator */}
      <AnimatePresence mode="wait">
        {isGood ?
        <motion.span
          key="good"
          className="flex items-center gap-1 text-[10px] text-signal-green font-mono"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}>

            <Sparkles className="w-3 h-3" />
            Great detail
          </motion.span> :
        isMinimum ?
        <motion.span
          key="minimum"
          className="flex items-center gap-1 text-[10px] text-cyan font-mono"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}>

            <Check className="w-3 h-3" />
            Good start
          </motion.span> :

        <motion.span
          key="writing"
          className="text-[10px] text-text-slate font-mono"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}>

            {charCount} chars
          </motion.span>
        }
      </AnimatePresence>
    </motion.div>);

}

/** Auto-save indicator */
function AutoSaveIndicator({ isSaving }: {isSaving: boolean;}) {
  return (
    <AnimatePresence>
      {isSaving &&
      <motion.div
        className="flex items-center gap-1.5 text-[10px] text-text-slate font-mono"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}>

          <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>

            <Save className="w-3 h-3" />
          </motion.div>
          Saving...
        </motion.div>
      }
    </AnimatePresence>);

}

export function InterviewPanel({ onComplete }: InterviewPanelProps) {
  const {
    state,
    currentRound,
    questions,
    updateDraftAnswer,
    getAnswer,
    getQuestionStatus,
    goToNextRound,
    progress,
    resetInterview,
    isComplete
  } = useInterview();

  const [isSaving, setIsSaving] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showReview, setShowReview] = useState(false);

  // Show review screen when interview is complete
  useEffect(() => {
    if (isComplete && !showReview) {
      setShowReview(true);
    }
  }, [isComplete, showReview]);

  const handleInputChange = useCallback((id: string, value: string) => {
    updateDraftAnswer(id, value);

    // Show saving indicator
    setIsSaving(true);
    if (saveTimeout) clearTimeout(saveTimeout);
    const timeout = setTimeout(() => setIsSaving(false), 800);
    setSaveTimeout(timeout);
  }, [updateDraftAnswer, saveTimeout]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (saveTimeout) clearTimeout(saveTimeout);
    };
  }, [saveTimeout]);

  // Check if user can proceed - ALWAYS allow if ANY answer is provided
  const canProceed = questions.some((q) => {
    const answer = getAnswer(q.id);
    return answer && answer.trim().length > 0;
  }) || questions.every((q) => !q.required);

  const renderQuestion = (question: EnhancedQuestion, index: number) => {
    const answer = getAnswer(question.id);
    const status = getQuestionStatus(question);

    return (
      <motion.div
        key={question.id}
        className="flex flex-col gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: duration.medium,
          ease: easing.outQuint,
          delay: index * 0.1
        }}>

        {/* Question number and text */}
        <div data-ev-id="ev_810831beda" className="flex items-start gap-3">
          <motion.span
            className={`font-mono text-[11px] font-bold tabular-nums mt-0.5 transition-colors ${
            status.isGood ? 'text-signal-green' : status.isMinimum ? 'text-cyan' : 'text-text-slate'}`
            }
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: duration.fast, delay: index * 0.1 + 0.1 }}>

            {String(index + 1).padStart(2, '0')}
          </motion.span>
          <div data-ev-id="ev_f4a2e27ac3" className="flex-1">
            <p data-ev-id="ev_4f805fde55" className="font-mono text-[13px] text-text-warm leading-relaxed">
              {question.text}
              {question.required &&
              <span data-ev-id="ev_89537db91d" className="text-signal-red ml-1">*</span>
              }
            </p>
            {/* Guidance text */}
            <p data-ev-id="ev_d8b3e3f461" className="font-mono text-[11px] text-text-slate mt-1.5 leading-relaxed opacity-70">
              {question.guidance}
            </p>
          </div>
        </div>
        
        {/* Textarea */}
        <div data-ev-id="ev_d046a23d13" className="ml-7">
          <motion.div
            className="relative"
            whileFocus={{ scale: 1.005 }}>

            <textarea data-ev-id="ev_ecdd14bd39"
            placeholder={question.placeholder}
            value={answer}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            rows={5}
            className={`
                w-full px-4 py-3 rounded-lg
                bg-panel border transition-all duration-200
                font-mono text-[13px] text-text-white
                placeholder:text-text-slate/50
                resize-y min-h-[140px]
                focus:outline-none focus:ring-2 focus:ring-offset-0
                ${
            status.isGood ?
            'border-signal-green/30 focus:border-signal-green focus:ring-signal-green/20' :
            status.isMinimum ?
            'border-cyan/30 focus:border-cyan focus:ring-cyan/20' :
            'border-border focus:border-cyan focus:ring-cyan/20'}
              `
            } />

            {/* Completion checkmark */}
            <AnimatePresence>
              {status.isGood &&
              <motion.div
                className="absolute top-3 right-3 text-signal-green"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}>

                  <Sparkles className="w-4 h-4" />
                </motion.div>
              }
            </AnimatePresence>
          </motion.div>
          
          {/* Answer progress */}
          <AnswerProgress {...status} />
        </div>
      </motion.div>);

  };

  // Handler for editing answers in review
  const handleEditAnswer = useCallback((questionId: string, newValue: string) => {
    updateDraftAnswer(questionId, newValue);
  }, [updateDraftAnswer]);

  // Handler for going back from review to interview
  const handleBackFromReview = useCallback(() => {
    setShowReview(false);
    resetInterview();
  }, [resetInterview]);

  // Handler for finalizing and completing the interview
  const handleFinalize = useCallback(() => {
    onComplete(state.answers);
  }, [onComplete, state.answers]);

  // Show review screen when interview is complete
  if (showReview) {
    return (
      <InterviewReview
        answers={state.answers}
        onEdit={handleEditAnswer}
        onFinalize={handleFinalize}
        onBack={handleBackFromReview} />);


  }

  if (!currentRound) return null;

  return (
    <div data-ev-id="ev_62aac93a56" className="h-full flex flex-col bg-surface/50">
      {/* TOP ACTION BAR - Always visible, cannot be missed */}
      <div data-ev-id="ev_14ca489b20" className="flex-shrink-0 p-3 bg-cyan/20 border-b-2 border-cyan">
        <button data-ev-id="ev_41d39bd7d4"
        onClick={goToNextRound}
        disabled={!canProceed}
        className={`w-full py-3 px-4 rounded-lg font-mono text-sm font-bold flex items-center justify-center gap-2 transition-all ${
        canProceed ?
        'bg-cyan text-deep hover:bg-cyan/90 cursor-pointer' :
        'bg-surface text-text-slate cursor-not-allowed'}`
        }>

          {canProceed ?
          <>
              CONTINUE TO NEXT STEP
              <ArrowRight className="w-5 h-5" />
            </> :

          'Answer required questions (*) to continue'
          }
        </button>
      </div>

      {/* Scrollable content */}
      <div data-ev-id="ev_e03887f923" className="flex-1 min-h-0 overflow-y-auto">
        {/* Header */}
        <div data-ev-id="ev_b51fd3fe9d" className="p-4 border-b border-border">
          <div data-ev-id="ev_51bbe5511d" className="flex items-center justify-between mb-3">
            <div data-ev-id="ev_d4c7e2fe9b">
              <div data-ev-id="ev_828982c83d" className="flex items-center gap-3 mb-1">
                <h2 data-ev-id="ev_fc924db41f" className="font-display text-[20px] tracking-[2px] text-text-white">
                  {currentRound.title}
                </h2>
                <Badge variant="cyan" size="sm">
                  {Math.round(progress)}%
                </Badge>
              </div>
              <p data-ev-id="ev_792dce6f83" className="font-mono text-[11px] text-text-slate">
                {currentRound.subtitle}
              </p>
            </div>
            
            <div data-ev-id="ev_d586e694b9" className="flex items-center gap-3">
              <AutoSaveIndicator isSaving={isSaving} />
              <Tooltip content="Start over">
                <button data-ev-id="ev_678c818bfa"
                onClick={resetInterview}
                className="p-2 text-text-slate hover:text-text-white rounded-md hover:bg-panel transition-colors">

                  <RotateCcw className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          </div>
          
          <AnimatedProgress
            progress={progress}
            label="Interview Progress"
            variant="glow" />

          
          <p data-ev-id="ev_a94a0fefff" className="font-mono text-[10px] text-text-slate mt-2 flex items-center gap-1 opacity-60">
            <Save className="w-3 h-3" />
            Answers saved automatically
          </p>
        </div>

        {/* Questions */}
        <div data-ev-id="ev_be89b231d3" className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentRound.id}-${currentRound.subtitle}`}
              className="flex flex-col gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>

              {questions.map((question, index) => renderQuestion(question, index))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM Footer - Also visible */}
      <div data-ev-id="ev_02227c58c6" className="flex-shrink-0 p-3 border-t-2 border-cyan bg-panel">
        <button data-ev-id="ev_fa3489186a"
        onClick={goToNextRound}
        disabled={!canProceed}
        className={`w-full py-3 px-4 rounded-lg font-mono text-sm font-bold flex items-center justify-center gap-2 transition-all ${
        canProceed ?
        'bg-cyan text-deep hover:bg-cyan/90 cursor-pointer' :
        'bg-surface text-text-slate cursor-not-allowed'}`
        }>

          {canProceed ?
          <>
              CONTINUE
              <ArrowRight className="w-5 h-5" />
            </> :

          'Answer required questions (*) first'
          }
        </button>
      </div>
    </div>);

}