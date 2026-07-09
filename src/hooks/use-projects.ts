import { useState, useCallback, useEffect } from 'react';
import type { Project, ProjectSummary, DocumentVersion } from '@/types/project';
import type { InterviewAnswers, InterviewPhase } from '@/types/interview';
import type { AgentTeam } from '@/types/agents';
import type { GeneratedDocuments } from '@/types/documents';

const PROJECTS_KEY = 'apparchitect_projects';
const CURRENT_PROJECT_KEY = 'apparchitect_current_project';

function generateId(): string {
	return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function loadProjects(): Project[] {
	try {
		const saved = localStorage.getItem(PROJECTS_KEY);
		if (saved) {
			const projects = JSON.parse(saved);
			return projects.map((p: Project) => ({
				...p,
				createdAt: new Date(p.createdAt),
				updatedAt: new Date(p.updatedAt),
				documentVersions: (p.documentVersions || []).map((v: DocumentVersion) => ({
					...v,
					createdAt: new Date(v.createdAt),
				})),
			}));
		}
	} catch {
		// ignore
	}
	return [];
}

function saveProjects(projects: Project[]): void {
	localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function useProjects() {
	const [projects, setProjects] = useState<Project[]>(loadProjects);
	const [currentProjectId, setCurrentProjectId] = useState<string | null>(() => {
		return localStorage.getItem(CURRENT_PROJECT_KEY);
	});

	const currentProject = projects.find((p) => p.id === currentProjectId) || null;

	const updateProjects = useCallback((newProjects: Project[]) => {
		setProjects(newProjects);
		saveProjects(newProjects);
	}, []);

	const createProject = useCallback(
		(name: string): Project => {
			const now = new Date();
			const project: Project = {
				id: generateId(),
				name,
				createdAt: now,
				updatedAt: now,
				interviewState: {
					currentPhase: 'concept',
					answers: {},
					completedPhases: [],
				},
				agentTeam: null,
				documentVersions: [],
				currentVersionId: null,
				phase: 'interview',
			};
			updateProjects([project, ...projects]);
			setCurrentProjectId(project.id);
			localStorage.setItem(CURRENT_PROJECT_KEY, project.id);
			return project;
		},
		[projects, updateProjects]
	);

	const openProject = useCallback(
		(projectId: string) => {
			const project = projects.find((p) => p.id === projectId);
			if (project) {
				setCurrentProjectId(projectId);
				localStorage.setItem(CURRENT_PROJECT_KEY, projectId);
			}
			return project || null;
		},
		[projects]
	);

	const closeProject = useCallback(() => {
		setCurrentProjectId(null);
		localStorage.removeItem(CURRENT_PROJECT_KEY);
	}, []);

	const deleteProject = useCallback(
		(projectId: string) => {
			const newProjects = projects.filter((p) => p.id !== projectId);
			updateProjects(newProjects);
			if (currentProjectId === projectId) {
				closeProject();
			}
		},
		[projects, currentProjectId, updateProjects, closeProject]
	);

	const updateCurrentProject = useCallback(
		(updates: Partial<Project>) => {
			if (!currentProjectId) return;
			const newProjects = projects.map((p) =>
				p.id === currentProjectId ? { ...p, ...updates, updatedAt: new Date() } : p
			);
			updateProjects(newProjects);
		},
		[currentProjectId, projects, updateProjects]
	);

	const updateInterviewState = useCallback(
		(phase: InterviewPhase, answers: InterviewAnswers, completedPhases: InterviewPhase[]) => {
			updateCurrentProject({
				interviewState: { currentPhase: phase, answers, completedPhases },
			});
		},
		[updateCurrentProject]
	);

	const setAgentTeam = useCallback(
		(team: AgentTeam) => {
			updateCurrentProject({
				agentTeam: team,
				phase: 'team-design',
			});
		},
		[updateCurrentProject]
	);

	const addDocumentVersion = useCallback(
		(documents: GeneratedDocuments, label?: string): DocumentVersion => {
			if (!currentProject) throw new Error('No current project');

			const versionNumber = currentProject.documentVersions.length + 1;
			const version: DocumentVersion = {
				id: `v${versionNumber}_${Date.now()}`,
				versionNumber,
				documents,
				createdAt: new Date(),
				label,
			};

			updateCurrentProject({
				documentVersions: [...currentProject.documentVersions, version],
				currentVersionId: version.id,
				phase: 'review',
			});

			return version;
		},
		[currentProject, updateCurrentProject]
	);

	const restoreVersion = useCallback(
		(versionId: string) => {
			if (!currentProject) return null;
			const version = currentProject.documentVersions.find((v) => v.id === versionId);
			if (version) {
				updateCurrentProject({ currentVersionId: versionId });
			}
			return version || null;
		},
		[currentProject, updateCurrentProject]
	);

	const getCurrentVersion = useCallback((): DocumentVersion | null => {
		if (!currentProject?.currentVersionId) return null;
		return currentProject.documentVersions.find((v) => v.id === currentProject.currentVersionId) || null;
	}, [currentProject]);

	const getProjectSummaries = useCallback((): ProjectSummary[] => {
		return projects.map((p) => ({
			id: p.id,
			name: p.name,
			createdAt: p.createdAt,
			updatedAt: p.updatedAt,
			phase: p.phase,
			agentCount: p.agentTeam?.agents.length || 0,
			versionCount: p.documentVersions.length,
		}));
	}, [projects]);

	const renameProject = useCallback(
		(projectId: string, newName: string) => {
			const newProjects = projects.map((p) =>
				p.id === projectId ? { ...p, name: newName, updatedAt: new Date() } : p
			);
			updateProjects(newProjects);
		},
		[projects, updateProjects]
	);

	return {
		projects,
		currentProject,
		currentProjectId,
		createProject,
		openProject,
		closeProject,
		deleteProject,
		updateCurrentProject,
		updateInterviewState,
		setAgentTeam,
		addDocumentVersion,
		restoreVersion,
		getCurrentVersion,
		getProjectSummaries,
		renameProject,
	};
}
