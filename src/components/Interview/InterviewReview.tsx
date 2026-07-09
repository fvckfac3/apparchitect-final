/**
 * InterviewReview - Polished review screen with smart flagging and edit capability
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  AlertTriangle,
  Sparkles,
  Edit3,
  X,
  ChevronRight,
  FileText,
  Users,
  Cpu,
  Palette,
  Lightbulb,
  Target,
  Layers,
  Rocket } from
'lucide-react';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Badge } from '@/components/ui/Badge';
import { easing, duration } from '@/components/ui/motion';
import type { InterviewAnswers } from '@/types';

interface InterviewReviewProps {
  answers: InterviewAnswers;
  onEdit: (questionId: string, newValue: string) => void;
  onFinalize: () => void;
  onBack: () => void;
}

interface QuestionMeta {
  id: string;
  label: string;
  icon: React.ReactNode;
  minChars: number;
  targetChars: number;
  required: boolean;
}

interface SectionMeta {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  questions: QuestionMeta[];
}

// Question metadata with recommended lengths
const SECTIONS: SectionMeta[] = [
{
  id: 'concept',
  title: 'The Big Picture',
  subtitle: 'Your vision and value proposition',
  icon: <Lightbulb className="w-5 h-5" />,
  color: 'cyan',
  questions: [
  { id: 'appDescription', label: 'App Description', icon: <FileText className="w-4 h-4" />, minChars: 100, targetChars: 300, required: true },
  { id: 'targetUsers', label: 'Target Users', icon: <Users className="w-4 h-4" />, minChars: 100, targetChars: 250, required: true },
  { id: 'uniqueValue', label: 'Unique Value', icon: <Sparkles className="w-4 h-4" />, minChars: 80, targetChars: 200, required: true },
  { id: 'businessModel', label: 'Business Model', icon: <Target className="w-4 h-4" />, minChars: 60, targetChars: 200, required: true },
  { id: 'platforms', label: 'Platforms', icon: <Layers className="w-4 h-4" />, minChars: 40, targetChars: 150, required: true }]

},
{
  id: 'features',
  title: 'What It Does',
  subtitle: 'Core capabilities and integrations',
  icon: <Layers className="w-5 h-5" />,
  color: 'signal-green',
  questions: [
  { id: 'coreFeatures', label: 'Core Features', icon: <FileText className="w-4 h-4" />, minChars: 150, targetChars: 400, required: true },
  { id: 'futureFeatures', label: 'Future Features', icon: <Rocket className="w-4 h-4" />, minChars: 40, targetChars: 200, required: false },
  { id: 'authAndUsers', label: 'Auth & Users', icon: <Users className="w-4 h-4" />, minChars: 80, targetChars: 250, required: true },
  { id: 'paymentsAndCommerce', label: 'Payments', icon: <Target className="w-4 h-4" />, minChars: 40, targetChars: 200, required: false },
  { id: 'realtimeFeatures', label: 'Real-time', icon: <Cpu className="w-4 h-4" />, minChars: 30, targetChars: 150, required: false },
  { id: 'integrations', label: 'Integrations', icon: <Layers className="w-4 h-4" />, minChars: 30, targetChars: 150, required: false },
  { id: 'dataAndContent', label: 'Data & Content', icon: <FileText className="w-4 h-4" />, minChars: 80, targetChars: 200, required: true }]

},
{
  id: 'technical',
  title: 'Practical Details',
  subtitle: 'Scale, constraints, and timeline',
  icon: <Cpu className="w-5 h-5" />,
  color: 'amber',
  questions: [
  { id: 'scaleExpectations', label: 'Scale Expectations', icon: <Target className="w-4 h-4" />, minChars: 60, targetChars: 200, required: true },
  { id: 'technicalPreferences', label: 'Tech Preferences', icon: <Cpu className="w-4 h-4" />, minChars: 30, targetChars: 150, required: false },
  { id: 'complianceNeeds', label: 'Compliance', icon: <FileText className="w-4 h-4" />, minChars: 30, targetChars: 150, required: false },
  { id: 'timeline', label: 'Timeline', icon: <Rocket className="w-4 h-4" />, minChars: 60, targetChars: 200, required: true }]

},
{
  id: 'design',
  title: 'Finishing Touches',
  subtitle: 'Brand and additional context',
  icon: <Palette className="w-5 h-5" />,
  color: 'purple',
  questions: [
  { id: 'brandAndDesign', label: 'Brand & Design', icon: <Palette className="w-4 h-4" />, minChars: 50, targetChars: 200, required: false },
  { id: 'additionalContext', label: 'Additional Context', icon: <Lightbulb className="w-4 h-4" />, minChars: 0, targetChars: 200, required: false }]

}];


type AnswerStatus = 'great' | 'good' | 'brief' | 'skipped';

function getAnswerStatus(value: string | undefined, meta: QuestionMeta): AnswerStatus {
  const length = value?.trim().length || 0;
  if (length === 0) return 'skipped';
  if (length >= meta.targetChars) return 'great';
  if (length >= meta.minChars) return 'good';
  return 'brief';
}

function getStatusConfig(status: AnswerStatus, required: boolean) {
  switch (status) {
    case 'great':
      return {
        color: 'text-signal-green',
        bgColor: 'bg-signal-green/10',
        borderColor: 'border-signal-green/30',
        icon: <Sparkles className="w-3.5 h-3.5" />,
        label: 'Great detail'
      };
    case 'good':
      return {
        color: 'text-cyan',
        bgColor: 'bg-cyan/10',
        borderColor: 'border-cyan/30',
        icon: <Check className="w-3.5 h-3.5" />,
        label: 'Good'
      };
    case 'brief':
      return {
        color: 'text-amber',
        bgColor: 'bg-amber/10',
        borderColor: 'border-amber/30',
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
        label: 'Could use more detail'
      };
    case 'skipped':
      return {
        color: required ? 'text-signal-red' : 'text-text-slate',
        bgColor: required ? 'bg-signal-red/10' : 'bg-surface',
        borderColor: required ? 'border-signal-red/30' : 'border-border',
        icon: required ? <AlertTriangle className="w-3.5 h-3.5" /> : null,
        label: required ? 'Required' : 'Skipped'
      };
  }
}

/** Single answer card with edit capability */
function AnswerCard({
  questionMeta,
  value,
  onEdit




}: {questionMeta: QuestionMeta;value: string | undefined;onEdit: (newValue: string) => void;}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');

  const status = getAnswerStatus(value, questionMeta);
  const config = getStatusConfig(status, questionMeta.required);

  const handleSave = () => {
    onEdit(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      className={`
        rounded-lg border transition-all duration-200
        ${isEditing ? 'border-cyan bg-panel' : `${config.borderColor} bg-surface/50 hover:bg-surface`}
      `}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}>

      {/* Header */}
      <div data-ev-id="ev_2bf7230403" className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div data-ev-id="ev_fdc274d529" className="flex items-center gap-2">
          <span data-ev-id="ev_26c346ec53" className="text-text-slate">{questionMeta.icon}</span>
          <span data-ev-id="ev_cfc0cd2662" className="font-mono text-[12px] font-medium text-text-warm">
            {questionMeta.label}
          </span>
          {questionMeta.required &&
          <span data-ev-id="ev_ad0b26709e" className="text-signal-red text-[10px]">*</span>
          }
        </div>
        <div data-ev-id="ev_85a4005312" className="flex items-center gap-2">
          {!isEditing &&
          <motion.span
            className={`flex items-center gap-1 text-[10px] font-mono ${config.color}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}>

              {config.icon}
              {config.label}
            </motion.span>
          }
          {!isEditing &&
          <motion.button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded text-text-slate hover:text-cyan hover:bg-cyan/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>

              <Edit3 className="w-3.5 h-3.5" />
            </motion.button>
          }
        </div>
      </div>
      
      {/* Content */}
      <div data-ev-id="ev_886928bef3" className="p-4">
        <AnimatePresence mode="wait">
          {isEditing ?
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3">

              <textarea data-ev-id="ev_408b1923c7"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={5}
            autoFocus
            className="
                  w-full px-3 py-2.5 rounded-md
                  bg-panel border border-cyan/30
                  font-mono text-[13px] text-text-white
                  placeholder:text-text-slate/50
                  resize-y min-h-[100px]
                  focus:outline-none focus:ring-2 focus:ring-cyan/20
                " />




































              <div data-ev-id="ev_284bf57ff2" className="flex items-center justify-between">
                <span data-ev-id="ev_84930b1b2d" className="text-[10px] font-mono text-text-slate">
                  {editValue.length} chars · Target: {questionMeta.targetChars}+
                </span>
                <div data-ev-id="ev_c7628e9c91" className="flex items-center gap-2">
                  <button data-ev-id="ev_7b7d93590b"
                onClick={handleCancel}
                className="px-3 py-1.5 rounded text-[11px] font-mono text-text-slate hover:text-text-white hover:bg-surface transition-colors">

                    Cancel
                  </button>
                  <button data-ev-id="ev_c48977659b"
                onClick={handleSave}
                className="px-3 py-1.5 rounded text-[11px] font-mono bg-cyan/20 text-cyan hover:bg-cyan/30 transition-colors">

                    Save
                  </button>
                </div>
              </div>
            </motion.div> :

          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>

              {value && value.trim() ?
            <p data-ev-id="ev_1663137c82" className="font-mono text-[13px] text-text-light leading-relaxed whitespace-pre-wrap">
                  {value.length > 300 ? value.slice(0, 300) + '...' : value}
                </p> :

            <p data-ev-id="ev_419b42471f" className="font-mono text-[12px] text-text-slate italic">
                  {questionMeta.required ? 'This field needs your input' : 'No response provided'}
                </p>
            }
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </motion.div>);

}

/** Section card containing multiple answers */
function SectionCard({
  section,
  answers,
  onEdit,
  isExpanded,
  onToggle






}: {section: SectionMeta;answers: InterviewAnswers;onEdit: (questionId: string, value: string) => void;isExpanded: boolean;onToggle: () => void;}) {
  const stats = useMemo(() => {
    let great = 0,good = 0,brief = 0,skipped = 0,requiredSkipped = 0;
    section.questions.forEach((q) => {
      const status = getAnswerStatus(answers[q.id] as string | undefined, q);
      if (status === 'great') great++;else
      if (status === 'good') good++;else
      if (status === 'brief') brief++;else
      {
        skipped++;
        if (q.required) requiredSkipped++;
      }
    });
    return { great, good, brief, skipped, requiredSkipped, total: section.questions.length };
  }, [section.questions, answers]);

  const hasIssues = stats.brief > 0 || stats.requiredSkipped > 0;

  return (
    <motion.div
      layout
      className="rounded-xl border border-border bg-panel/50 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}>

      {/* Section Header */}
      <button data-ev-id="ev_508ab4d747"
      onClick={onToggle}
      className="w-full px-5 py-4 flex items-center justify-between hover:bg-surface/50 transition-colors">

        <div data-ev-id="ev_c6a66d8070" className="flex items-center gap-4">
          <div data-ev-id="ev_8d2f23d52b" className={`p-2.5 rounded-lg bg-${section.color}/10 text-${section.color}`}>
            {section.icon}
          </div>
          <div data-ev-id="ev_16591b2408" className="text-left">
            <h3 data-ev-id="ev_09fb696379" className="font-display text-[16px] tracking-wide text-text-white">
              {section.title}
            </h3>
            <p data-ev-id="ev_fd533088c7" className="font-mono text-[11px] text-text-slate mt-0.5">
              {section.subtitle}
            </p>
          </div>
        </div>
        
        <div data-ev-id="ev_5a25c36c85" className="flex items-center gap-3">
          {/* Stats pills */}
          <div data-ev-id="ev_b67b040a90" className="flex items-center gap-1.5">
            {stats.great > 0 &&
            <span data-ev-id="ev_758bf5eab3" className="px-2 py-0.5 rounded-full bg-signal-green/10 text-signal-green text-[10px] font-mono">
                {stats.great} great
              </span>
            }
            {stats.good > 0 &&
            <span data-ev-id="ev_afc0cbb9d6" className="px-2 py-0.5 rounded-full bg-cyan/10 text-cyan text-[10px] font-mono">
                {stats.good} good
              </span>
            }
            {stats.brief > 0 &&
            <span data-ev-id="ev_370dc591be" className="px-2 py-0.5 rounded-full bg-amber/10 text-amber text-[10px] font-mono">
                {stats.brief} brief
              </span>
            }
            {stats.requiredSkipped > 0 &&
            <span data-ev-id="ev_9b9110d232" className="px-2 py-0.5 rounded-full bg-signal-red/10 text-signal-red text-[10px] font-mono">
                {stats.requiredSkipped} needed
              </span>
            }
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}>

            <ChevronRight className="w-5 h-5 text-text-slate" />
          </motion.div>
        </div>
      </button>
      
      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: easing.outQuint }}
          className="overflow-hidden">

            <div data-ev-id="ev_f9b5932529" className="px-5 pb-5 grid gap-3">
              {section.questions.map((q) =>
            <AnswerCard
              key={q.id}
              questionMeta={q}
              value={answers[q.id] as string | undefined}
              onEdit={(value) => onEdit(q.id, value)} />

            )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>);

}

/** Smart summary banner */
function SmartSummary({ answers }: {answers: InterviewAnswers;}) {
  const analysis = useMemo(() => {
    let totalQuestions = 0;
    let greatAnswers = 0;
    let goodAnswers = 0;
    let briefAnswers = 0;
    let skippedRequired = 0;
    let skippedOptional = 0;
    const briefQuestions: string[] = [];
    const skippedRequiredQuestions: string[] = [];

    SECTIONS.forEach((section) => {
      section.questions.forEach((q) => {
        totalQuestions++;
        const status = getAnswerStatus(answers[q.id] as string | undefined, q);
        if (status === 'great') greatAnswers++;else
        if (status === 'good') goodAnswers++;else
        if (status === 'brief') {
          briefAnswers++;
          briefQuestions.push(q.label);
        } else {
          if (q.required) {
            skippedRequired++;
            skippedRequiredQuestions.push(q.label);
          } else {
            skippedOptional++;
          }
        }
      });
    });

    const completionScore = Math.round((greatAnswers * 1 + goodAnswers * 0.8 + briefAnswers * 0.4) / totalQuestions * 100);

    return {
      totalQuestions,
      greatAnswers,
      goodAnswers,
      briefAnswers,
      skippedRequired,
      skippedOptional,
      briefQuestions,
      skippedRequiredQuestions,
      completionScore,
      isReady: skippedRequired === 0
    };
  }, [answers]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-signal-green';
    if (score >= 60) return 'text-cyan';
    if (score >= 40) return 'text-amber';
    return 'text-signal-red';
  };

  return (
    <motion.div
      className="rounded-xl border border-border bg-gradient-to-br from-panel to-surface p-5"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}>

      <div data-ev-id="ev_aa5fc1b185" className="flex items-start justify-between gap-6">
        <div data-ev-id="ev_9a5fc62ec1" className="flex-1">
          <div data-ev-id="ev_57e5b31b44" className="flex items-center gap-3 mb-3">
            <div data-ev-id="ev_aeb4bc3f46" className={`text-[32px] font-display tracking-tight ${getScoreColor(analysis.completionScore)}`}>
              {analysis.completionScore}%
            </div>
            <div data-ev-id="ev_c7a62ea38c">
              <h3 data-ev-id="ev_b2526a1b5c" className="font-mono text-[13px] text-text-white font-medium">Completion Score</h3>
              <p data-ev-id="ev_82332e0390" className="font-mono text-[11px] text-text-slate">
                {analysis.greatAnswers} detailed · {analysis.goodAnswers} good · {analysis.briefAnswers} brief
              </p>
            </div>
          </div>
          
          {/* Recommendations */}
          {(analysis.skippedRequired > 0 || analysis.briefAnswers > 0) &&
          <div data-ev-id="ev_7c48d3b346" className="mt-4 space-y-2">
              {analysis.skippedRequired > 0 &&
            <motion.div
              className="flex items-start gap-2 p-3 rounded-lg bg-signal-red/10 border border-signal-red/20"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}>

                  <AlertTriangle className="w-4 h-4 text-signal-red flex-shrink-0 mt-0.5" />
                  <div data-ev-id="ev_f02a0ca11d">
                    <p data-ev-id="ev_89b3a14bf5" className="font-mono text-[11px] text-signal-red font-medium">Required fields missing</p>
                    <p data-ev-id="ev_e3cefcf103" className="font-mono text-[10px] text-text-slate mt-0.5">
                      {analysis.skippedRequiredQuestions.join(', ')}
                    </p>
                  </div>
                </motion.div>
            }
              
              {analysis.briefAnswers > 0 &&
            <motion.div
              className="flex items-start gap-2 p-3 rounded-lg bg-amber/10 border border-amber/20"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}>

                  <Lightbulb className="w-4 h-4 text-amber flex-shrink-0 mt-0.5" />
                  <div data-ev-id="ev_6ba4e4da9a">
                    <p data-ev-id="ev_f45c7084c9" className="font-mono text-[11px] text-amber font-medium">Could use more detail</p>
                    <p data-ev-id="ev_3e1234959e" className="font-mono text-[10px] text-text-slate mt-0.5">
                      {analysis.briefQuestions.slice(0, 3).join(', ')}
                      {analysis.briefQuestions.length > 3 && ` +${analysis.briefQuestions.length - 3} more`}
                    </p>
                  </div>
                </motion.div>
            }
            </div>
          }
          
          {analysis.isReady && analysis.briefAnswers === 0 &&
          <motion.div
            className="flex items-center gap-2 p-3 rounded-lg bg-signal-green/10 border border-signal-green/20 mt-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}>

              <Sparkles className="w-4 h-4 text-signal-green" />
              <p data-ev-id="ev_fb3b8ce28f" className="font-mono text-[11px] text-signal-green">
                Looking great! Your responses are detailed and ready for PRD generation.
              </p>
            </motion.div>
          }
        </div>
      </div>
    </motion.div>);

}

export function InterviewReview({ answers, onEdit, onFinalize, onBack }: InterviewReviewProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['concept']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
    prev.includes(sectionId) ?
    prev.filter((id) => id !== sectionId) :
    [...prev, sectionId]
    );
  };

  // Check if all required fields are filled
  const canFinalize = useMemo(() => {
    return SECTIONS.every((section) =>
    section.questions.every((q) => {
      if (!q.required) return true;
      const value = answers[q.id] as string | undefined;
      return value && value.trim().length > 0;
    })
    );
  }, [answers]);

  return (
    <div data-ev-id="ev_452df9ec50" className="h-full flex flex-col bg-surface/50">
      {/* STICKY TOP ACTION BAR - Always visible, cannot be missed */}
      <div data-ev-id="ev_b4e056874f" className="flex-shrink-0 p-3 bg-gradient-to-r from-cyan/20 via-cyan/10 to-transparent border-b-2 border-cyan/40">
        <div data-ev-id="ev_5284311864" className="flex items-center justify-between gap-3">
          <button data-ev-id="ev_9401135880"
          onClick={onBack}
          className="px-3 py-2 rounded font-mono text-[11px] text-text-slate hover:text-text-white hover:bg-surface/50 transition-colors border border-border">

            ← Back to Interview
          </button>
          
          <AnimatedButton
            onClick={onFinalize}
            disabled={!canFinalize}
            magnetic
            className="flex-1 max-w-[280px]">

            {canFinalize ?
            <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate PRD
                <ChevronRight className="w-4 h-4 ml-1" />
              </> :

            <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Complete Required Fields
              </>
            }
          </AnimatedButton>
        </div>
        {!canFinalize &&
        <p data-ev-id="ev_c1e62cdfa6" className="font-mono text-[10px] text-amber mt-2 text-center">
            Fill all required fields (*) to continue
          </p>
        }
      </div>

      {/* Header with summary */}
      <div data-ev-id="ev_75d8091f84" className="flex-shrink-0 p-4 border-b border-border">
        <div data-ev-id="ev_ab5ed56972" className="flex items-center justify-between mb-3">
          <div data-ev-id="ev_ad0fa11fbb">
            <h2 data-ev-id="ev_d8f810d2b6" className="font-display text-[20px] tracking-[2px] text-text-white">
              REVIEW YOUR ANSWERS
            </h2>
            <p data-ev-id="ev_cf6ed5cf6e" className="font-mono text-[10px] text-text-slate mt-1">
              Check your responses before generating the PRD
            </p>
          </div>
          <Badge variant="cyan" size="sm">Final Review</Badge>
        </div>
        <SmartSummary answers={answers} />
      </div>

      {/* Scrollable sections */}
      <div data-ev-id="ev_dba4384e53" className="flex-1 min-h-0 overflow-y-auto p-4">
        <div data-ev-id="ev_9341166b02" className="space-y-3">
          {SECTIONS.map((section, index) =>
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}>

              <SectionCard
              section={section}
              answers={answers}
              onEdit={onEdit}
              isExpanded={expandedSections.includes(section.id)}
              onToggle={() => toggleSection(section.id)} />

            </motion.div>
          )}
        </div>
        
        {/* Bottom spacer with another CTA */}
        <div data-ev-id="ev_f608d0d91f" className="mt-6 p-4 rounded-lg bg-panel border border-cyan/20">
          <p data-ev-id="ev_491a14e136" className="font-mono text-[11px] text-text-slate mb-3 text-center">
            Ready to generate your PRD?
          </p>
          <AnimatedButton
            onClick={onFinalize}
            disabled={!canFinalize}
            magnetic
            className="w-full">

            {canFinalize ?
            <>
                <Sparkles className="w-4 h-4 mr-2" />
                Finalize & Generate PRD
                <ChevronRight className="w-4 h-4 ml-1" />
              </> :

            <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Complete Required Fields First
              </>
            }
          </AnimatedButton>
        </div>
      </div>
    </div>);

}