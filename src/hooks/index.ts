/**
 * Hooks Module Index
 * 
 * Central export point for all custom hooks.
 * Import from '@/hooks' for convenient access.
 */

// Interview Hooks
export { useInterview } from './use-interview';
export { useAIInterview, type AIInterviewState } from './use-ai-interview';

// PRD Generation Hooks
export { usePRDGenerator } from './use-prd-generator';
export { 
	usePRDGeneratorV2, 
	type GenerationPhase, 
	type GenerationProgress,
	type PRDSuiteOutput,
} from './use-prd-generator-v2';

// Document Generation
export { useDocumentGenerator } from './use-document-generator';

// Agent Team
export { useAgentTeam } from './use-agent-team';

// Projects
export { useProjects } from './use-projects';
export { useDbProjects, type DbProject, type DbDocumentVersion, type DbProjectSummary } from './use-db-projects';
