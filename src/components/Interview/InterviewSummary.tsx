/**
 * InterviewSummary - Polished card-based summary of interview answers
 */

import { motion } from 'framer-motion';
import {
  Check,
  Sparkles,
  FileText,
  Users,
  Cpu,
  Palette,
  Lightbulb,
  Target,
  Layers,
  Rocket } from
'lucide-react';
import type { InterviewAnswers } from '@/types';

interface InterviewSummaryProps {
  answers: InterviewAnswers;
}

interface SectionConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  fields: {key: string;label: string;icon: React.ReactNode;}[];
}

const SECTIONS: SectionConfig[] = [
{
  id: 'concept',
  title: 'The Big Picture',
  icon: <Lightbulb className="w-4 h-4" />,
  color: 'cyan',
  fields: [
  { key: 'appDescription', label: 'App Description', icon: <FileText className="w-3.5 h-3.5" /> },
  { key: 'targetUsers', label: 'Target Users', icon: <Users className="w-3.5 h-3.5" /> },
  { key: 'uniqueValue', label: 'Unique Value', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { key: 'businessModel', label: 'Business Model', icon: <Target className="w-3.5 h-3.5" /> },
  { key: 'platforms', label: 'Platforms', icon: <Layers className="w-3.5 h-3.5" /> }]

},
{
  id: 'features',
  title: 'What It Does',
  icon: <Layers className="w-4 h-4" />,
  color: 'signal-green',
  fields: [
  { key: 'coreFeatures', label: 'Core Features', icon: <FileText className="w-3.5 h-3.5" /> },
  { key: 'futureFeatures', label: 'Future Features', icon: <Rocket className="w-3.5 h-3.5" /> },
  { key: 'authAndUsers', label: 'Auth & Users', icon: <Users className="w-3.5 h-3.5" /> },
  { key: 'paymentsAndCommerce', label: 'Payments', icon: <Target className="w-3.5 h-3.5" /> },
  { key: 'realtimeFeatures', label: 'Real-time', icon: <Cpu className="w-3.5 h-3.5" /> },
  { key: 'integrations', label: 'Integrations', icon: <Layers className="w-3.5 h-3.5" /> },
  { key: 'dataAndContent', label: 'Data & Content', icon: <FileText className="w-3.5 h-3.5" /> }]

},
{
  id: 'technical',
  title: 'Practical Details',
  icon: <Cpu className="w-4 h-4" />,
  color: 'amber',
  fields: [
  { key: 'scaleExpectations', label: 'Scale', icon: <Target className="w-3.5 h-3.5" /> },
  { key: 'technicalPreferences', label: 'Tech Preferences', icon: <Cpu className="w-3.5 h-3.5" /> },
  { key: 'complianceNeeds', label: 'Compliance', icon: <FileText className="w-3.5 h-3.5" /> },
  { key: 'timeline', label: 'Timeline', icon: <Rocket className="w-3.5 h-3.5" /> }]

},
{
  id: 'design',
  title: 'Finishing Touches',
  icon: <Palette className="w-4 h-4" />,
  color: 'purple',
  fields: [
  { key: 'brandAndDesign', label: 'Brand & Design', icon: <Palette className="w-3.5 h-3.5" /> },
  { key: 'additionalContext', label: 'Additional Context', icon: <Lightbulb className="w-3.5 h-3.5" /> }]

}];


/** Truncate text for display */
function truncate(text: string | undefined, maxLength: number = 120): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength).trim() + '...';
}

/** Single answer card */
function AnswerCard({
  label,
  icon,
  value,
  index





}: {label: string;icon: React.ReactNode;value: string | undefined;index: number;}) {
  const hasValue = value && value.trim().length > 0;
  const displayValue = truncate(value);

  return (
    <motion.div
      className={`
        p-3 rounded-lg border transition-all
        ${hasValue ?
      'bg-surface/50 border-border hover:border-cyan/30' :
      'bg-surface/30 border-border/50'}
      `}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}>

      <div data-ev-id="ev_3d557950b2" className="flex items-center gap-2 mb-1.5">
        <span data-ev-id="ev_42ac69b5f3" className="text-text-slate">{icon}</span>
        <span data-ev-id="ev_87fcfd7c5f" className="font-mono text-[10px] uppercase tracking-wider text-text-slate">
          {label}
        </span>
      </div>
      {hasValue ?
      <p data-ev-id="ev_321320baa2" className="font-mono text-[12px] text-text-light leading-relaxed">
          {displayValue}
        </p> :

      <p data-ev-id="ev_633f4717df" className="font-mono text-[11px] text-text-slate/50 italic">
          Not provided
        </p>
      }
    </motion.div>);

}

/** Section card */
function SectionCard({
  section,
  answers,
  index




}: {section: SectionConfig;answers: InterviewAnswers;index: number;}) {
  // Filter to only fields with values
  const fieldsWithValues = section.fields.filter(
    (f) => answers[f.key] && (answers[f.key] as string).trim().length > 0
  );

  if (fieldsWithValues.length === 0) return null;

  return (
    <motion.div
      className="rounded-xl border border-border bg-panel/30 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}>

      {/* Header */}
      <div data-ev-id="ev_d63cada686" className={`px-4 py-3 border-b border-border bg-${section.color}/5`}>
        <div data-ev-id="ev_36bd64df4f" className="flex items-center gap-2">
          <span data-ev-id="ev_196a2ac720" className={`text-${section.color}`}>{section.icon}</span>
          <h3 data-ev-id="ev_d2c8316149" className="font-display text-[14px] tracking-wide text-text-white">
            {section.title}
          </h3>
          <span data-ev-id="ev_a7e09b794a" className="ml-auto font-mono text-[10px] text-text-slate">
            {fieldsWithValues.length} answers
          </span>
        </div>
      </div>

      {/* Content - Grid of answer cards */}
      <div data-ev-id="ev_32f4049edb" className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {fieldsWithValues.map((field, fieldIndex) =>
        <AnswerCard
          key={field.key}
          label={field.label}
          icon={field.icon}
          value={answers[field.key] as string | undefined}
          index={fieldIndex} />

        )}
      </div>
    </motion.div>);

}

export function InterviewSummary({ answers }: InterviewSummaryProps) {
  // Count total answers
  const totalAnswers = SECTIONS.reduce(
    (count, section) =>
    count +
    section.fields.filter(
      (f) => answers[f.key] && (answers[f.key] as string).trim().length > 0
    ).length,
    0
  );

  return (
    <div data-ev-id="ev_a304a34e9c" className="flex flex-col gap-4">
      {/* Success banner */}
      <motion.div
        className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-cyan/10 to-signal-green/10 border border-cyan/20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}>

        <div data-ev-id="ev_d7028ddc4c" className="p-2 rounded-full bg-cyan/20">
          <Check className="w-4 h-4 text-cyan" />
        </div>
        <div data-ev-id="ev_63bf2c912e">
          <p data-ev-id="ev_5c5dcbf3c4" className="font-mono text-[13px] text-text-white font-medium">
            Interview Complete
          </p>
          <p data-ev-id="ev_1675f21c0c" className="font-mono text-[11px] text-text-slate">
            {totalAnswers} responses captured and ready for PRD generation
          </p>
        </div>
      </motion.div>

      {/* Section cards */}
      <div data-ev-id="ev_03831baed3" className="space-y-4">
        {SECTIONS.map((section, index) =>
        <SectionCard
          key={section.id}
          section={section}
          answers={answers}
          index={index} />

        )}
      </div>
    </div>);

}