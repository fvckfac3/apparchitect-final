import type { InterviewAnswers, InterviewPhase } from './interview';
import type { AgentTeam } from './agents';
import type { GeneratedDocuments } from './documents';

export interface DocumentVersion {
	id: string;
	versionNumber: number;
	documents: GeneratedDocuments;
	createdAt: Date;
	label?: string;
}

export interface Project {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	interviewState: {
		currentPhase: InterviewPhase;
		answers: InterviewAnswers;
		completedPhases: InterviewPhase[];
	};
	agentTeam: AgentTeam | null;
	documentVersions: DocumentVersion[];
	currentVersionId: string | null;
	phase: 'interview' | 'team-design' | 'generation' | 'review';
}

export interface ProjectSummary {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	phase: Project['phase'];
	agentCount: number;
	versionCount: number;
}
