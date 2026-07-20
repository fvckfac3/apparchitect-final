import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { AgentTeam } from '@/types/agents';
import type { GeneratedDocuments } from '@/types/documents';
import type { InterviewAnswers, InterviewPhase } from '@/types/interview';

export interface DbProject {
	id: string;
	name: string;
	phase: 'interview' | 'team-design' | 'generation' | 'review';
	interviewState: {
		currentPhase: InterviewPhase;
		answers: InterviewAnswers;
		completedPhases: InterviewPhase[];
	};
	agentTeam: AgentTeam | null;
	currentVersionId: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface DbDocumentVersion {
	id: string;
	projectId: string;
	versionNumber: number;
	label: string | null;
	documents: GeneratedDocuments;
	createdAt: Date;
}

export interface DbProjectSummary {
	id: string;
	name: string;
	phase: DbProject['phase'];
	agentCount: number;
	versionCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export function useDbProjects() {
	const { user } = useAuth();
	const [projects, setProjects] = useState<DbProject[]>([]);
	const [currentProject, setCurrentProject] = useState<DbProject | null>(null);
	const [documentVersions, setDocumentVersions] = useState<DbDocumentVersion[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch all projects for user
	const fetchProjects = useCallback(async () => {
		if (!supabase || !user) {
			setIsLoading(false);
			return;
		}

		const { data, error } = await supabase
			.from('projects')
			.select('*')
			.order('updated_at', { ascending: false });

		if (error) {
			console.error('[projects] fetch failed:', error.message);
			setProjects([]);
			setCurrentProject(null);
			setDocumentVersions([]);
		} else if (data) {
			setProjects(
				data.map((p) => ({
					id: p.id,
					name: p.name,
					phase: p.phase as DbProject['phase'],
					interviewState: p.interview_state as DbProject['interviewState'],
					agentTeam: p.agent_team as AgentTeam | null,
					currentVersionId: p.current_version_id,
					createdAt: new Date(p.created_at),
					updatedAt: new Date(p.updated_at),
				}))
			);
		}
		setIsLoading(false);
	}, [user]);

	useEffect(() => {
		fetchProjects();
	}, [fetchProjects]);

	// Fetch document versions for a project
	const fetchVersions = useCallback(async (projectId: string) => {
		if (!supabase) return;

		const { data, error } = await supabase
			.from('document_versions')
			.select('*')
			.eq('project_id', projectId)
			.eq('user_id', user?.id ?? '')
			.order('version_number', { ascending: false });

		if (error) {
			console.error('[projects] version fetch failed:', error.message);
			setDocumentVersions([]);
		} else if (data) {
			setDocumentVersions(
				data.map((v) => ({
					id: v.id,
					projectId: v.project_id,
					versionNumber: v.version_number,
					label: v.label,
					documents: v.documents as GeneratedDocuments,
					createdAt: new Date(v.created_at),
				}))
			);
		}
	}, [user]);

	// Create a new project
	const createProject = useCallback(
		async (name: string): Promise<DbProject | null> => {
			if (!supabase || !user) return null;

			const { data, error } = await supabase
				.from('projects')
				.insert({
					user_id: user.id,
					name,
					phase: 'interview',
					interview_state: {
						currentPhase: 'concept',
						answers: {},
						completedPhases: [],
					},
				})
				.select()
				.single();

			if (error || !data) {
			console.error('[projects] create failed:', error?.message || 'no project returned');
			return null;
		}

			const project: DbProject = {
				id: data.id,
				name: data.name,
				phase: data.phase as DbProject['phase'],
				interviewState: data.interview_state as DbProject['interviewState'],
				agentTeam: null,
				currentVersionId: null,
				createdAt: new Date(data.created_at),
				updatedAt: new Date(data.updated_at),
			};

			setProjects((prev) => [project, ...prev]);
			setCurrentProject(project);
			setDocumentVersions([]);
			return project;
		},
		[user]
	);

	// Open a project
	const openProject = useCallback(
		async (projectId: string): Promise<DbProject | null> => {
			const project = projects.find((p) => p.id === projectId);
			if (project) {
				setCurrentProject(project);
				await fetchVersions(projectId);
				return project;
			}
			return null;
		},
		[projects, fetchVersions]
	);

	// Close current project
	const closeProject = useCallback(() => {
		setCurrentProject(null);
		setDocumentVersions([]);
	}, []);

	// Delete a project
	const deleteProject = useCallback(
		async (projectId: string) => {
			if (!supabase) return;

			const { error } = await supabase.from('projects').delete().eq('id', projectId);

			if (!error) {
				setProjects((prev) => prev.filter((p) => p.id !== projectId));
				if (currentProject?.id === projectId) {
					closeProject();
				}
			}
		},
		[currentProject, closeProject]
	);

	// Update current project
	const updateProject = useCallback(
		async (updates: Partial<Pick<DbProject, 'name' | 'phase' | 'interviewState' | 'agentTeam' | 'currentVersionId'>>) => {
			if (!supabase || !currentProject) return;

			const dbUpdates: Record<string, unknown> = {};
			if (updates.name !== undefined) dbUpdates.name = updates.name;
			if (updates.phase !== undefined) dbUpdates.phase = updates.phase;
			if (updates.interviewState !== undefined) dbUpdates.interview_state = updates.interviewState;
			if (updates.agentTeam !== undefined) dbUpdates.agent_team = updates.agentTeam;
			if (updates.currentVersionId !== undefined) dbUpdates.current_version_id = updates.currentVersionId;

			const { error } = await supabase.from('projects').update(dbUpdates).eq('id', currentProject.id);

			if (!error) {
				const updatedProject = { ...currentProject, ...updates, updatedAt: new Date() };
				setCurrentProject(updatedProject);
				setProjects((prev) => prev.map((p) => (p.id === currentProject.id ? updatedProject : p)));
			}
		},
		[currentProject]
	);

	// Add a document version
	const addDocumentVersion = useCallback(
		async (documents: GeneratedDocuments, label?: string): Promise<DbDocumentVersion | null> => {
			if (!supabase || !user || !currentProject) return null;

			const versionNumber = documentVersions.length + 1;

			const { data, error } = await supabase
				.from('document_versions')
				.insert({
					project_id: currentProject.id,
					user_id: user.id,
					version_number: versionNumber,
					label: label || null,
					documents: documents as unknown as Record<string, unknown>,
				})
				.select()
				.single();

			if (error || !data) return null;

			const version: DbDocumentVersion = {
				id: data.id,
				projectId: data.project_id,
				versionNumber: data.version_number,
				label: data.label,
				documents: data.documents as GeneratedDocuments,
				createdAt: new Date(data.created_at),
			};

			setDocumentVersions((prev) => [version, ...prev]);
			await updateProject({ currentVersionId: version.id, phase: 'review' });

			return version;
		},
		[user, currentProject, documentVersions, updateProject]
	);

	// Restore a document version
	const restoreVersion = useCallback(
		async (versionId: string) => {
			await updateProject({ currentVersionId: versionId });
		},
		[updateProject]
	);

	// Get current version
	const getCurrentVersion = useCallback((): DbDocumentVersion | null => {
		if (!currentProject?.currentVersionId) return null;
		return documentVersions.find((v) => v.id === currentProject.currentVersionId) || null;
	}, [currentProject, documentVersions]);

	// Get project summaries
	const getProjectSummaries = useCallback((): DbProjectSummary[] => {
		return projects.map((p) => ({
			id: p.id,
			name: p.name,
			phase: p.phase,
			agentCount: p.agentTeam?.agents.length || 0,
			versionCount: 0, // Would need to fetch this separately for accuracy
			createdAt: p.createdAt,
			updatedAt: p.updatedAt,
		}));
	}, [projects]);

	return {
		projects,
		currentProject,
		documentVersions,
		isLoading,
		createProject,
		openProject,
		closeProject,
		deleteProject,
		updateProject,
		addDocumentVersion,
		restoreVersion,
		getCurrentVersion,
		getProjectSummaries,
		refresh: fetchProjects,
	};
}
