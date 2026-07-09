/**
 * DocumentPreview - Enhanced with animations and micro-interactions
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Users, GitBranch, BookOpen, Copy, Check, Sparkles, Zap, ArrowRight, Layers } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { ExportMenu } from './ExportMenu';
import { VersionHistory } from '@/components/Projects/VersionHistory';
import { easing, duration } from '@/components/ui/motion';
import type { GeneratedDocuments, Document } from '@/types';
import type { DocumentVersion } from '@/types/project';

interface DocumentPreviewProps {
  documents: GeneratedDocuments;
  isGenerating?: boolean;
  projectName?: string;
  versions?: DocumentVersion[];
  currentVersionId?: string | null;
  onRestoreVersion?: (versionId: string) => void;
}

type TabId = 'master' | 'agents' | 'collaboration' | 'setup';

const TABS: {id: TabId;label: string;icon: typeof FileText;}[] = [
{ id: 'master', label: 'Master Context', icon: FileText },
{ id: 'agents', label: 'Agent PRDs', icon: Users },
{ id: 'collaboration', label: 'Collaboration', icon: GitBranch },
{ id: 'setup', label: 'Setup Guide', icon: BookOpen }];

// Document types for visual display
const DOCUMENT_TYPES = [
{ id: 'master', icon: FileText, label: 'Master Context', desc: 'Complete project overview' },
{ id: 'agents', icon: Users, label: 'Agent PRDs', desc: 'Individual agent specifications' },
{ id: 'collab', icon: GitBranch, label: 'Collaboration Map', desc: 'How agents work together' },
{ id: 'setup', icon: BookOpen, label: 'Setup Guide', desc: 'Implementation roadmap' }];


// Generation steps for progress display
const GENERATION_STEPS = [
{ label: 'Analyzing requirements', duration: 1500 },
{ label: 'Designing agent architecture', duration: 2000 },
{ label: 'Writing master context', duration: 2500 },
{ label: 'Generating agent PRDs', duration: 3000 },
{ label: 'Mapping collaboration flows', duration: 2000 },
{ label: 'Finalizing documentation', duration: 1500 }];


// ============================================================================
// EMPTY STATE - Shown before generation
// ============================================================================

function EmptyState() {
  return (
    <motion.div
      className="h-full flex flex-col bg-surface/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.medium }}>

			{/* Header area */}
			<div data-ev-id="ev_51150e5c94" className="p-6 sm:p-8 border-b border-border/50">
				<motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.medium, delay: 0.1 }}>

					<Badge variant="cyan" size="sm" className="mb-3">
						<Layers className="w-3 h-3" />
						Document Preview
					</Badge>
					<h3 data-ev-id="ev_8fb0d2fbf2" className="font-display text-[24px] sm:text-[28px] tracking-[4px] text-text-white mb-2">
						YOUR PRD SUITE
					</h3>
					<p data-ev-id="ev_e638620bec" className="font-mono text-[12px] text-text-light leading-relaxed max-w-md">
						Complete the interview and team design to generate your 
						production-ready documentation package.
					</p>
				</motion.div>
			</div>

			{/* Document types preview */}
			<div data-ev-id="ev_a8d9f4b7fe" className="flex-1 p-6 sm:p-8 overflow-y-auto">
				<p data-ev-id="ev_7f58195298" className="font-mono text-[10px] uppercase tracking-[2px] text-text-slate mb-4">
					What you'll receive
				</p>
				
				<div data-ev-id="ev_905cdb1606" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{DOCUMENT_TYPES.map((doc, index) =>
          <motion.div
            key={doc.id}
            className="group relative p-4 rounded-lg border border-dashed border-border bg-panel/30 hover:border-cyan/30 hover:bg-panel/50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: duration.medium,
              ease: easing.outQuint,
              delay: 0.2 + index * 0.1
            }}>

							<div data-ev-id="ev_48262fb76c" className="flex items-start gap-3">
								<div data-ev-id="ev_5492a026c8" className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center group-hover:border-cyan/30 transition-colors">
									<doc.icon className="w-5 h-5 text-text-slate group-hover:text-cyan transition-colors" />
								</div>
								<div data-ev-id="ev_a3f72efb06" className="flex-1 min-w-0">
									<p data-ev-id="ev_509bc1b748" className="font-mono text-[12px] font-bold text-text-white group-hover:text-cyan transition-colors">
										{doc.label}
									</p>
									<p data-ev-id="ev_a42fca3c7e" className="font-mono text-[11px] text-text-slate mt-0.5">
										{doc.desc}
									</p>
								</div>
							</div>
							
							{/* Decorative corner */}
							<div data-ev-id="ev_20f05a7038" className="absolute top-2 right-2 w-2 h-2 border-t border-r border-border group-hover:border-cyan/30 transition-colors" />
						</motion.div>
          )}
				</div>

				{/* Bottom hint */}
				<motion.div
          className="mt-8 p-4 rounded-lg bg-cyan/5 border border-cyan/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.medium, delay: 0.6 }}>

					<div data-ev-id="ev_fd53e86956" className="flex items-center gap-3">
						<div data-ev-id="ev_e33ab4b309" className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center">
							<Zap className="w-4 h-4 text-cyan" />
						</div>
						<div data-ev-id="ev_f939e94b59">
							<p data-ev-id="ev_2ba0a84eab" className="font-mono text-[11px] font-bold text-cyan">
								Zero-ambiguity specification
							</p>
							<p data-ev-id="ev_6198dbcafe" className="font-mono text-[10px] text-text-light">
								Every document is detailed enough for direct implementation
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</motion.div>);

}

// ============================================================================
// GENERATING STATE - Shown during document generation
// ============================================================================

function GeneratingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedDocs, setCompletedDocs] = useState<string[]>([]);

  // Simulate generation progress
  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < GENERATION_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 2000);

    return () => clearInterval(stepTimer);
  }, []);

  // Mark documents as complete over time
  useEffect(() => {
    const docTimers = DOCUMENT_TYPES.map((doc, index) => {
      return setTimeout(() => {
        setCompletedDocs((prev) => [...prev, doc.id]);
      }, 3000 + index * 2500);
    });

    return () => docTimers.forEach(clearTimeout);
  }, []);

  return (
    <div data-ev-id="ev_476fee74db" className="h-full flex flex-col bg-surface/30">
			{/* Disabled tabs header */}
			<div data-ev-id="ev_b5ca7beb5e" className="flex border-b border-border opacity-40">
				{TABS.map((tab) =>
        <div data-ev-id="ev_67f684cb48"
        key={tab.id}
        className="flex items-center gap-2 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[2.5px] text-text-slate border-b-2 border-transparent">

						<tab.icon className="w-4 h-4" />
						<span data-ev-id="ev_db3dbc280f" className="hidden sm:inline">{tab.label}</span>
					</div>
        )}
			</div>

			{/* Main content */}
			<div data-ev-id="ev_3337d225e6" className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8">
				{/* Animated icon */}
				<motion.div
          className="relative mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: duration.medium, ease: easing.outQuint }}>

					{/* Outer ring */}
					<motion.div
            className="absolute inset-0 rounded-2xl border-2 border-cyan/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }} />

					
					{/* Main container */}
					<motion.div
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan/20 to-agent-frontend/20 border border-cyan/40 flex items-center justify-center"
            animate={{
              boxShadow: [
              '0 0 0 0 rgba(0,229,204,0), 0 0 30px rgba(0,229,204,0.1)',
              '0 0 40px 10px rgba(0,229,204,0.15), 0 0 60px rgba(0,229,204,0.1)',
              '0 0 0 0 rgba(0,229,204,0), 0 0 30px rgba(0,229,204,0.1)']

            }}
            transition={{ duration: 2.5, repeat: Infinity }}>

						<motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>

							<Sparkles className="w-8 h-8 text-cyan" />
						</motion.div>
					</motion.div>

					{/* Status dot */}
					<motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-cyan rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}>

						<motion.div
              className="w-2 h-2 bg-ink rounded-full"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }} />

					</motion.div>
				</motion.div>

				{/* Title */}
				<motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.medium, delay: 0.2 }}>

					<h3 data-ev-id="ev_93b85732cf" className="font-display text-[24px] tracking-[6px] text-text-white mb-2">
						GENERATING
					</h3>
					<AnimatePresence mode="wait">
						<motion.p
              key={currentStep}
              className="font-mono text-[12px] text-cyan tracking-[1px]"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}>

							{GENERATION_STEPS[currentStep]?.label}...
						</motion.p>
					</AnimatePresence>
				</motion.div>

				{/* Document progress cards */}
				<motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.medium, delay: 0.4 }}>

					<div data-ev-id="ev_4b721a74ac" className="flex flex-col gap-2">
						{DOCUMENT_TYPES.map((doc, index) => {
              const isComplete = completedDocs.includes(doc.id);
              const isActive = !isComplete && completedDocs.length === index;

              return (
                <motion.div
                  key={doc.id}
                  className={`
										flex items-center gap-3 p-3 rounded-lg border transition-colors
										${isComplete ?
                  'bg-cyan/5 border-cyan/30' :
                  isActive ?
                  'bg-panel/50 border-cyan/20' :
                  'bg-panel/30 border-border/50'}
									`
                  }
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: duration.medium,
                    delay: 0.5 + index * 0.1
                  }}>

									{/* Status indicator */}
									<div data-ev-id="ev_e2958093d5" className={`
										w-8 h-8 rounded-lg flex items-center justify-center transition-colors
										${isComplete ?
                  'bg-cyan text-ink' :
                  isActive ?
                  'bg-cyan/20 text-cyan' :
                  'bg-surface text-text-slate'}
									`
                  }>
										<AnimatePresence mode="wait">
											{isComplete ?
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.3, ease: easing.outQuint }}>

													<Check className="w-4 h-4" />
												</motion.div> :
                      isActive ?
                      <motion.div
                        key="loading"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>

													<doc.icon className="w-4 h-4" />
												</motion.div> :

                      <doc.icon className="w-4 h-4" />
                      }
										</AnimatePresence>
									</div>

									{/* Label */}
									<div data-ev-id="ev_0b96ef7d0e" className="flex-1 min-w-0">
										<p data-ev-id="ev_c3ba107f73" className={`
											font-mono text-[11px] font-bold transition-colors
											${isComplete ? 'text-cyan' : isActive ? 'text-text-white' : 'text-text-slate'}
										`}>
											{doc.label}
										</p>
									</div>

									{/* Status text */}
									<span data-ev-id="ev_18d1367071" className={`
										font-mono text-[9px] uppercase tracking-[1px]
										${isComplete ? 'text-cyan' : isActive ? 'text-text-light' : 'text-text-slate'}
									`}>
										{isComplete ? 'Done' : isActive ? 'Writing...' : 'Pending'}
									</span>
								</motion.div>);

            })}
					</div>
				</motion.div>
			</div>
		</div>);

}

export function DocumentPreview({
  documents,
  isGenerating,
  projectName,
  versions = [],
  currentVersionId,
  onRestoreVersion
}: DocumentPreviewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('master');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAgentDoc, setSelectedAgentDoc] = useState<string | null>(null);

  const handleCopy = (content: string, id: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCurrentDocument = (): Document | null => {
    switch (activeTab) {
      case 'master':
        return documents.masterContext;
      case 'agents':
        if (selectedAgentDoc) {
          return documents.agentPRDs.find((d) => d.id === selectedAgentDoc) || null;
        }
        return documents.agentPRDs[0] || null;
      case 'collaboration':
        return documents.collaborationMap;
      case 'setup':
        return documents.setupGuide;
      default:
        return null;
    }
  };

  const currentDoc = getCurrentDocument();

  // Generating state
  if (isGenerating) {
    return <GeneratingState />;
  }

  // Empty state
  if (!documents.masterContext && documents.agentPRDs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div data-ev-id="ev_a9d14e45d3" className="h-full flex flex-col bg-surface/30">
			{/* Tabs */}
			<div data-ev-id="ev_6fcdcc71c4" className="flex items-center justify-between border-b border-border">
				<div data-ev-id="ev_e5adf31e52" className="flex overflow-x-auto">
					{TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const hasContent =
            tab.id === 'master' && documents.masterContext ||
            tab.id === 'agents' && documents.agentPRDs.length > 0 ||
            tab.id === 'collaboration' && documents.collaborationMap ||
            tab.id === 'setup' && documents.setupGuide;

            return (
              <motion.button
                key={tab.id}
                onClick={() => hasContent && setActiveTab(tab.id)}
                className={`
									flex items-center gap-2 px-3 sm:px-4 py-3 
									font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[1.5px] sm:tracking-[2.5px] 
									border-b-2 transition-colors whitespace-nowrap
									${isActive ?
                'text-cyan border-cyan' :
                hasContent ?
                'text-text-light border-transparent hover:text-text-white' :
                'text-text-slate border-transparent cursor-not-allowed opacity-50'}
								`
                }
                whileHover={hasContent && !isActive ? { y: -2 } : undefined}
                transition={{ duration: duration.fast }}
                disabled={!hasContent}>

								<tab.icon className="w-4 h-4" />
								<span data-ev-id="ev_d7c6f7a916" className="hidden sm:inline">{tab.label}</span>
								{tab.id === 'agents' && documents.agentPRDs.length > 0 &&
                <Badge variant="cyan" size="sm">
										{documents.agentPRDs.length}
									</Badge>
                }
							</motion.button>);

          })}
				</div>
				<div data-ev-id="ev_ccbb0e77e1" className="pr-2 sm:pr-4">
					<ExportMenu documents={documents} projectName={projectName} />
				</div>
			</div>

			{/* Agent selector */}
			<AnimatePresence mode="wait">
				{activeTab === 'agents' && documents.agentPRDs.length > 0 &&
        <motion.div
          className="flex gap-2 p-3 sm:p-4 border-b border-border overflow-x-auto"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: duration.medium, ease: easing.outQuint }}>

						{documents.agentPRDs.map((doc, index) =>
          <motion.button
            key={doc.id}
            onClick={() => setSelectedAgentDoc(doc.id)}
            className={`
									px-3 py-1.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-[1px] border whitespace-nowrap
									${(selectedAgentDoc || documents.agentPRDs[0]?.id) === doc.id ?
            'bg-cyan/20 border-cyan text-cyan' :
            'bg-surface border-border text-text-light hover:border-cyan/50'}
								`
            }
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: duration.fast, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}>

								{doc.subtitle || doc.title}
							</motion.button>
          )}
					</motion.div>
        }
			</AnimatePresence>

			{/* Version History */}
			{activeTab === 'master' && versions.length > 0 && onRestoreVersion &&
      <motion.div
        className="p-3 sm:p-4 border-b border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration.fast }}>

					<VersionHistory
          versions={versions}
          currentVersionId={currentVersionId || null}
          onRestore={onRestoreVersion} />

				</motion.div>
      }

			{/* Document content */}
			<AnimatePresence mode="wait">
				{currentDoc &&
        <motion.div
          key={currentDoc.id}
          className="flex-1 flex flex-col overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: duration.medium, ease: easing.outQuint }}>

						{/* Document header */}
						<div data-ev-id="ev_711f84d5a3" className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-border bg-panel/50">
							<div data-ev-id="ev_4009ec31ed">
								<h3 data-ev-id="ev_562013b5cd" className="font-mono text-[13px] font-bold text-text-white">
									{currentDoc.title}
								</h3>
								{currentDoc.subtitle &&
              <p data-ev-id="ev_9abb322b1a" className="font-mono text-[11px] text-text-slate">
										{currentDoc.subtitle}
									</p>
              }
							</div>
							<AnimatedButton
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(currentDoc.content, currentDoc.id)}>

								<AnimatePresence mode="wait">
									{copiedId === currentDoc.id ?
                <motion.span
                  key="copied"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1 text-emerald-400">

											<Check className="w-3 h-3" /> Copied
										</motion.span> :

                <motion.span
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1">

											<Copy className="w-3 h-3" /> Copy
										</motion.span>
                }
								</AnimatePresence>
							</AnimatedButton>
						</div>

						{/* Document body */}
						<div data-ev-id="ev_0f6385b014" className="flex-1 overflow-y-auto p-3 sm:p-4">
							<pre data-ev-id="ev_72af3b47cc" className="font-mono text-[11px] sm:text-[12px] leading-relaxed text-text-warm whitespace-pre-wrap">
								{currentDoc.content}
							</pre>
						</div>
					</motion.div>
        }
			</AnimatePresence>
		</div>);

}