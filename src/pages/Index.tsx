import { useState, useCallback, useEffect } from 'react';
import { LandingHero } from '@/components/Landing/LandingHero';
import { Header } from '@/components/Layout/Header';
import { ThreeColumnLayout } from '@/components/Layout/ThreeColumnLayout';
import { InterviewPanel } from '@/components/Interview/InterviewPanel';
import { InterviewSummary } from '@/components/Interview/InterviewSummary';
import { DocumentPreview } from '@/components/Documents/DocumentPreview';
import { AgentMapPanel } from '@/components/AgentMap/AgentMapPanel';
import { ProjectSelector } from '@/components/Projects/ProjectSelector';
import { AIStatusBadge } from '@/components/Generation/AIStatusBadge';
import { StepTracker } from '@/components/Timeline/StepTracker';
import { AuthPage } from '@/components/Auth/AuthPage';
import { useAgentTeam } from '@/hooks/use-agent-team';
import { useDocumentGenerator } from '@/hooks/use-document-generator';
import { usePRDGenerator } from '@/hooks/use-prd-generator';
import { useDbProjects } from '@/hooks/use-db-projects';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/use-subscription';
import { usePaywall } from '@/components/Billing/PaywallProvider';
import { Button } from '@/components/ui/Button';
import { ArrowRight, RotateCcw, RefreshCw, Loader2 } from 'lucide-react';
import type { AppPhase, InterviewAnswers } from '@/types';
import type { DocumentVersion } from '@/types/project';
import { TIER_LIMITS } from '@/constants';

export default function Index() {
  const { user, isLoading: authLoading } = useAuth();
  const [phase, setPhase] = useState<AppPhase>('landing');
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [interviewAnswers, setInterviewAnswers] = useState<InterviewAnswers | null>(null);

  const { team, isDesigning, designTeam } = useAgentTeam();
  const { documents, isGenerating, generateDocuments } = useDocumentGenerator();
  const { progress: prdProgress, generateSuite, suite: prdSuite, synthesizeTeam, aiStatus } = usePRDGenerator();
  const {
    currentProject,
    documentVersions,
    isLoading: projectsLoading,
    createProject,
    openProject,
    closeProject,
    deleteProject,
    updateProject,
    addDocumentVersion,
    restoreVersion,
    getCurrentVersion,
    getProjectSummaries
  } = useDbProjects();
  const { subscription, quotaUsage } = useSubscription();
  const { show: showPaywall } = usePaywall();

  // Track completed phases for step tracker
  const [completedPhases, setCompletedPhases] = useState<AppPhase[]>([]);

  // Sync with current project on load
  useEffect(() => {
    if (currentProject) {
      setPhase(currentProject.phase);
      if (currentProject.interviewState.answers) {
        setInterviewAnswers(currentProject.interviewState.answers);
      }
      // Reconstruct completed phases
      const phases: AppPhase[] = [];
      if (currentProject.phase !== 'interview') phases.push('interview');
      if (currentProject.phase === 'generation' || currentProject.phase === 'review') phases.push('team-design');
      if (currentProject.phase === 'review') phases.push('generation');
      setCompletedPhases(phases);
    }
  }, [currentProject]);

  const handleStart = useCallback(async () => {
    const project = await createProject(`Project ${new Date().toLocaleDateString()}`);
    if (project) {
      setPhase('interview');
      setCompletedPhases([]);
      setInterviewAnswers(null);
    }
  }, [createProject]);

  const handleInterviewComplete = useCallback(
    async (answers: InterviewAnswers) => {
      setInterviewAnswers(answers);
      setPhase('team-design');
      setCompletedPhases((prev) => [...prev, 'interview']);

      // Save interview state to database
      await updateProject({
        interviewState: {
          currentPhase: 'complete',
          answers,
          completedPhases: ['concept', 'features', 'technical', 'depth']
        },
        phase: 'team-design'
      });

      designTeam(answers);
    },
    [designTeam, updateProject]
  );

  // Watch for team design completion
  useEffect(() => {
    if (phase === 'team-design' && !isDesigning && team.agents.length > 0 && currentProject) {
      updateProject({ agentTeam: team });
    }
  }, [phase, isDesigning, team, currentProject, updateProject]);

  const handleDesignComplete = useCallback(async () => {
    if (!interviewAnswers) return;
    setPhase('generation');
    setCompletedPhases((prev) => [...prev, 'team-design']);
    await updateProject({ phase: 'generation' });
    
    // Generate full PRD suite with the new generator
    try {
      const result = await generateSuite(interviewAnswers);
      // Also run the legacy generator for backwards compatibility
      generateDocuments(interviewAnswers, result.team);
    } catch (err) {
      console.error('PRD generation failed:', err);
      // Fallback to legacy generator
      generateDocuments(interviewAnswers, team);
    }
  }, [interviewAnswers, team, generateDocuments, generateSuite, updateProject]);

  // Watch for document generation completion
  useEffect(() => {
    if (phase === 'generation' && !isGenerating && documents.masterContext && currentProject) {
      setPhase('review');
      setCompletedPhases((prev) => [...prev, 'generation']);
      addDocumentVersion(documents, 'Initial generation');
    }
  }, [phase, isGenerating, documents, currentProject, addDocumentVersion]);

  const handleRegenerate = useCallback(async () => {
    if (!interviewAnswers) return;
    setPhase('generation');
    await updateProject({ phase: 'generation' });
    generateDocuments(interviewAnswers, currentProject?.agentTeam || team);
  }, [interviewAnswers, team, currentProject, generateDocuments, updateProject]);

  const handleStartOver = useCallback(() => {
    closeProject();
    setPhase('landing');
    setInterviewAnswers(null);
    setCompletedPhases([]);
  }, [closeProject]);

  const handleOpenProjects = useCallback(() => {
    setShowProjectSelector(true);
  }, []);

  const handleCreateProject = useCallback(
    async (name: string) => {
      // PRD §4 paywall trigger: free user creating a 2nd project
      if (subscription?.tier === 'free' && projects.length >= 1) {
        showPaywall('project_limit', 'BIZ_PROJECT_LIMIT_REACHED');
        return;
      }
      const project = await createProject(name);
      if (project) {
        setShowProjectSelector(false);
        setPhase('interview');
        setCompletedPhases([]);
        setInterviewAnswers(null);
      }
    },
    [createProject, showPaywall, projects, subscription]
  );

  const handleOpenProject = useCallback(
    async (projectId: string) => {
      const project = await openProject(projectId);
      if (project) {
        setShowProjectSelector(false);
        setPhase(project.phase);
        setInterviewAnswers(project.interviewState.answers);
        // Reconstruct completed phases based on current phase
        const phases: AppPhase[] = [];
        if (project.phase !== 'interview') phases.push('interview');
        if (project.phase === 'generation' || project.phase === 'review') phases.push('team-design');
        if (project.phase === 'review') phases.push('generation');
        setCompletedPhases(phases);
      }
    },
    [openProject]
  );

  const handleDeleteProject = useCallback(
    (projectId: string) => {
      deleteProject(projectId);
    },
    [deleteProject]
  );

  const handleRestoreVersion = useCallback(
    (versionId: string) => {
      restoreVersion(versionId);
    },
    [restoreVersion]
  );

  const currentVersion = getCurrentVersion();

  // Convert DB versions to the format expected by DocumentPreview
  const versionsForPreview: DocumentVersion[] = documentVersions.map((v) => ({
    id: v.id,
    versionNumber: v.versionNumber,
    documents: v.documents,
    createdAt: v.createdAt,
    label: v.label || undefined
  }));

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div data-ev-id="ev_644d7fde6e" className="min-h-screen bg-ink flex items-center justify-center">
				<div data-ev-id="ev_68651011d3" className="flex flex-col items-center gap-4">
					<Loader2 className="w-8 h-8 text-cyan animate-spin" />
					<p data-ev-id="ev_afd9f4794c" className="font-mono text-[13px] text-text-slate">Loading...</p>
				</div>
			</div>);

  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage />;
  }

  // Show loading state while loading projects
  if (projectsLoading) {
    return (
      <div data-ev-id="ev_3ae8825ca5" className="min-h-screen bg-ink flex items-center justify-center">
				<div data-ev-id="ev_476a463012" className="flex flex-col items-center gap-4">
					<Loader2 className="w-8 h-8 text-cyan animate-spin" />
					<p data-ev-id="ev_6abfb74af4" className="font-mono text-[13px] text-text-slate">Loading projects...</p>
				</div>
			</div>);

  }

  // Show landing page
  if (phase === 'landing' && !currentProject) {
    return (
      <>
				<LandingHero
          onStart={handleStart}
          onOpenProjects={handleOpenProjects}
          recentProjects={getProjectSummaries()}
          onOpenProject={handleOpenProject} />

				{showProjectSelector &&
        <ProjectSelector
          projects={getProjectSummaries()}
          onCreate={handleCreateProject}
          onOpen={handleOpenProject}
          onDelete={handleDeleteProject}
          onClose={() => setShowProjectSelector(false)} />

        }
			</>);

  }

  // Main app layout
  return (
    <div data-ev-id="ev_d7edb77efe" className="h-screen flex flex-col bg-ink overflow-hidden">
			<Header
        projectName={currentProject?.name}
        onOpenProjects={handleOpenProjects}
        showProjectActions={true} />


			{/* Step Tracker */}
			<StepTracker currentPhase={phase} completedPhases={completedPhases} />

			<ThreeColumnLayout
        leftPanel={
        phase === 'interview' ?
        <InterviewPanel onComplete={handleInterviewComplete} /> :

        <div data-ev-id="ev_28db98ff98" className="h-full flex flex-col">
							<div data-ev-id="ev_28087e3b9d" className="p-6 border-b border-border flex items-center justify-between">
								<div data-ev-id="ev_f04a8ef8fc">
									<h2 data-ev-id="ev_9c1327ae33" className="font-display text-[28px] tracking-[4px] text-text-white">INTERVIEW COMPLETE</h2>
									<p data-ev-id="ev_27cc317150" className="font-mono text-[11px] tracking-[1px] text-text-slate mt-1">
										All data captured successfully
									</p>
								</div>
								<button data-ev-id="ev_677c81fd20"
            onClick={handleStartOver}
            className="p-2 text-text-slate hover:text-text-white transition-colors"
            title="Start over">

									<RotateCcw className="w-4 h-4" />
								</button>
							</div>
							<div data-ev-id="ev_26b03718ab" className="flex-1 overflow-y-auto p-6">
								{interviewAnswers && <InterviewSummary answers={interviewAnswers} />}
							</div>
							<div data-ev-id="ev_77e63152b9" className="p-6 border-t border-border flex flex-col gap-3">
								{phase === 'team-design' && !isDesigning && team.agents.length > 0 &&
            <Button onClick={handleDesignComplete} className="w-full">
										Generate Documents <ArrowRight className="ml-2 w-4 h-4" />
									</Button>
            }
								{phase === 'review' &&
            <Button onClick={handleRegenerate} variant="secondary" className="w-full">
										<RefreshCw className="mr-2 w-4 h-4" /> Regenerate Documents
									</Button>
            }
							</div>
						</div>

        }
        centerPanel={
        <DocumentPreview
          documents={currentVersion?.documents || documents}
          isGenerating={isGenerating}
          projectName={currentProject?.name}
          versions={versionsForPreview}
          currentVersionId={currentProject?.currentVersionId}
          onRestoreVersion={handleRestoreVersion} />

        }
        rightPanel={<>
            {isGenerating && aiStatus && (
              <AIStatusBadge status={aiStatus} className="mb-3" />
            )}
            <AgentMapPanel team={currentProject?.agentTeam || team} isDesigning={isDesigning} />
          </>} />


			{/* Project Selector Modal */}
			{showProjectSelector &&
      <ProjectSelector
        projects={getProjectSummaries()}
        onCreate={handleCreateProject}
        onOpen={handleOpenProject}
        onDelete={handleDeleteProject}
        onClose={() => setShowProjectSelector(false)} />

      }
		</div>);

}