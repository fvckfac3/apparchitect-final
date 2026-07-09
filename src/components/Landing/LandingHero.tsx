/**
 * LandingHero - Enhanced with animations and micro-interactions
 * 
 * Applies design system skills:
 * - Staggered entrance animations
 * - Interactive feature cards with 3D tilt
 * - Magnetic CTA button
 * - Text scramble effect on headline
 * - Responsive layout
 */

import { ArrowRight, Boxes, Zap, FileText, Users, FolderOpen, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserMenu } from '@/components/Auth/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Card } from '@/components/ui/Card';
import { TextScramble } from '@/components/ui/TextScramble';
import { Badge } from '@/components/ui/Badge';
import {
  StaggerContainer,
  StaggerItem,
  FadeInUp,
  easing,
  duration } from
'@/components/ui/motion';
import type { DbProjectSummary } from '@/hooks/use-db-projects';

interface LandingHeroProps {
  onStart: () => void;
  onOpenProjects: () => void;
  recentProjects?: DbProjectSummary[];
  onOpenProject?: (projectId: string) => void;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
}

const features = [
{
  icon: Zap,
  title: 'ADAPTIVE INTERVIEW',
  desc: 'Intelligent questions that adapt to your answers. No detail left uncaptured.',
  color: 'cyan'
},
{
  icon: Users,
  title: 'AGENT TEAM DESIGN',
  desc: 'Optimal team composition determined by your app requirements. Right-sized teams.',
  color: 'agent-frontend'
},
{
  icon: FileText,
  title: 'ZERO-AMBIGUITY PRDS',
  desc: 'Complete specifications so thorough each agent executes with zero clarification.',
  color: 'amber'
}];


export function LandingHero({
  onStart,
  onOpenProjects,
  recentProjects = [],
  onOpenProject
}: LandingHeroProps) {
  const { user } = useAuth();
  const displayProjects = recentProjects.slice(0, 3);

  return (
    <div data-ev-id="ev_5c0a61e73b" className="min-h-screen bg-ink flex flex-col overflow-hidden">
			{/* Ambient background effects */}
			<div data-ev-id="ev_b445de4417" className="fixed inset-0 pointer-events-none overflow-hidden">
				{/* Gradient orbs */}
				<motion.div
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-cyan/5 blur-[120px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />

				<motion.div
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-agent-frontend/5 blur-[100px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 2 }} />

			</div>

			{/* Header */}
			<motion.header
        className="relative z-10 h-16 border-b border-border/50 flex items-center justify-between px-4 sm:px-8 backdrop-blur-sm bg-ink/50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: duration.medium, ease: easing.outQuint }}>

				<div data-ev-id="ev_0160a7aac3" className="flex items-center gap-3">
					<motion.div
            className="w-10 h-10 bg-cyan/10 border border-cyan/30 rounded-lg flex items-center justify-center"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 20px rgba(0,229,204,0.3)'
            }}
            transition={{ duration: duration.fast }}>

						<Boxes className="w-5 h-5 text-cyan" />
					</motion.div>
					<div data-ev-id="ev_419e5c0d37" className="hidden sm:block">
						<h1 data-ev-id="ev_b99c29c807" className="font-display text-[20px] sm:text-[24px] tracking-[4px] sm:tracking-[6px] text-text-white">
							APPARCHITECT
						</h1>
						<p data-ev-id="ev_560b4d4a2b" className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[2px] text-text-slate -mt-1">
							Agent-Powered Build System
						</p>
					</div>
				</div>
				<div data-ev-id="ev_c1c83e7071" className="flex items-center gap-2 sm:gap-3">
					<AnimatedButton variant="secondary" size="sm" onClick={onOpenProjects}>
						<FolderOpen className="w-3 h-3" />
						<span data-ev-id="ev_fb653e1f55" className="hidden sm:inline">Projects</span>
					</AnimatedButton>
					{user && <UserMenu />}
				</div>
			</motion.header>

			{/* Hero */}
			<main data-ev-id="ev_eb4cfce802" className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-0">
				<div data-ev-id="ev_4b1fb40d05" className="max-w-5xl w-full">
					{/* Blueprint grid background */}
					<div data-ev-id="ev_60d3045529" className="relative">
						<div data-ev-id="ev_a2a709b725"
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
									linear-gradient(to right, #00E5CC 1px, transparent 1px),
									linear-gradient(to bottom, #00E5CC 1px, transparent 1px)
								`,
              backgroundSize: '40px 40px'
            }} />


						<StaggerContainer className="relative text-center py-8 sm:py-16">
							{/* Version badge */}
							<StaggerItem className="mb-6">
								<Badge variant="cyan" dot pulse>
									<Sparkles className="w-3 h-3" />
									V2 Architecture Ready
								</Badge>
							</StaggerItem>

							{/* Tagline */}
							<StaggerItem>
								<p data-ev-id="ev_2bc55cb607" className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[3px] sm:tracking-[4px] text-cyan mb-4 sm:mb-6">
									From Idea to Agent Team in Minutes
								</p>
							</StaggerItem>

							{/* Main headline with scramble effect */}
							<StaggerItem>
								<h2 data-ev-id="ev_57122217a1" className="font-display text-[36px] sm:text-[48px] md:text-[64px] leading-none tracking-[4px] sm:tracking-[6px] md:tracking-[8px] text-text-white mb-4 sm:mb-6">
									<TextScramble
                    text="DESCRIBE IT."
                    className="block" />

									<span data-ev-id="ev_869260ace5" className="text-cyan block mt-2">
										<TextScramble
                      text="WE'LL ARCHITECT IT." />

									</span>
								</h2>
							</StaggerItem>

							{/* Subheadline */}
							<StaggerItem>
								<p data-ev-id="ev_acb5a648dc" className="font-mono text-[12px] sm:text-[13px] text-text-light max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
									Transform your app idea into production-ready PRDs.
									<br data-ev-id="ev_45860aa7e9" className="hidden sm:block" />
									<span data-ev-id="ev_f8bc39ae2a" className="sm:hidden"> </span>
									Your app, fully specified. Zero ambiguity.
								</p>
							</StaggerItem>

							{/* CTA */}
							<StaggerItem>
								<AnimatedButton
                  onClick={onStart}
                  size="lg"
                  magnetic
                  className="text-[13px] sm:text-[15px]">

									New Project 
									<motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>

										<ArrowRight className="w-5 h-5" />
									</motion.span>
								</AnimatedButton>
							</StaggerItem>
						</StaggerContainer>
					</div>

					{/* Recent Projects */}
					{displayProjects.length > 0 &&
          <FadeInUp className="mt-8 mb-8 sm:mb-12">
							<h3 data-ev-id="ev_22afc31dae" className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[2px] text-text-slate mb-4 text-center">
								Recent Projects
							</h3>
							<div data-ev-id="ev_2a38960bb7" className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
								{displayProjects.map((project, index) =>
              <motion.button
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: duration.medium,
                  ease: easing.outQuint,
                  delay: index * 0.1
                }}
                whileHover={{
                  y: -4,
                  borderColor: 'rgba(0,229,204,0.5)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(0,229,204,0.1)'
                }}
                onClick={() => onOpenProject?.(project.id)}
                className="bg-surface border border-border rounded-lg p-4 text-left transition-colors group">

										<p data-ev-id="ev_7445457b5f" className="font-mono text-[13px] font-bold text-text-white truncate group-hover:text-cyan transition-colors">
											{project.name}
										</p>
										<div data-ev-id="ev_e7b3762d1b" className="flex items-center gap-3 mt-2">
											<span data-ev-id="ev_a9ddc94f02" className="flex items-center gap-1 font-mono text-[9px] text-text-slate">
												<Clock className="w-3 h-3" />
												{formatDate(project.updatedAt)}
											</span>
											{project.agentCount > 0 &&
                  <span data-ev-id="ev_03cce1250c" className="flex items-center gap-1 font-mono text-[9px] text-text-slate">
													<Users className="w-3 h-3" />
													{project.agentCount}
												</span>
                  }
										</div>
									</motion.button>
              )}
							</div>
						</FadeInUp>
          }

					{/* Features - Breaking the 3-card grid pattern with asymmetric layout */}
					<StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
						{features.map((feature, index) =>
            <StaggerItem key={feature.title}>
								<Card
                variant="interactive"
                hoverEffect="tilt"
                className={`p-6 h-full ${index === 1 ? 'md:-mt-4' : ''}`}>

									<motion.div
                  className={`w-10 h-10 bg-${feature.color}/10 border border-${feature.color}/30 rounded-lg flex items-center justify-center mb-4`}
                  whileHover={{
                    scale: 1.1,
                    rotate: 5
                  }}
                  transition={{ duration: duration.fast }}>

										<feature.icon className={`w-5 h-5 text-${feature.color}`} />
									</motion.div>
									<h3 data-ev-id="ev_cd77ecca27" className="font-mono text-[11px] font-bold uppercase tracking-[2.5px] text-text-white mb-2">
										{feature.title}
									</h3>
									<p data-ev-id="ev_636b28d980" className="font-mono text-[11px] text-text-slate leading-relaxed">
										{feature.desc}
									</p>
								</Card>
							</StaggerItem>
            )}
					</StaggerContainer>
				</div>
			</main>

			{/* Footer */}
			<motion.footer
        className="relative z-10 h-12 border-t border-border/50 flex items-center justify-center backdrop-blur-sm bg-ink/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration.slow, delay: 0.5 }}>

				<p data-ev-id="ev_6f815f3daa" className="font-mono text-[9px] uppercase tracking-[2px] text-text-slate">
					Brand Identity System · v2.0.0
				</p>
			</motion.footer>
		</div>);

}