/**
 * AI Interview Hook - V2 Architecture
 * 
 * Enhanced interview system with:
 * - AI-powered question selection
 * - Answer quality assessment
 * - Smart follow-up questions
 * - Adaptive flow based on responses
 */

import { useState, useCallback, useMemo } from 'react';
import type { InterviewAnswers, InterviewPhase } from '@/types/interview';
import {
	AI_QUESTION_BANK,
	FOLLOW_UP_QUESTIONS,
	generateAISuggestion,
	assessAnswerQuality,
	getOverallAnswerQuality,
	getQuestionsForCategory,
	getNextCategory,
	shouldTriggerFollowUp,
	calculateProgress,
	type AIQuestion,
	type AIQuestionCategory,
	type InterviewContext,
	type InterviewProgress,
	type FollowUpQuestion,
} from '@/lib/interview-ai';

// ============================================================================
// §1 - TYPES
// ============================================================================

export interface AIInterviewState {
	currentCategory: AIQuestionCategory;
	currentQuestions: AIQuestion[];
	answers: Partial<InterviewAnswers>;
	completedCategories: AIQuestionCategory[];
	pendingFollowUps: FollowUpQuestion[];
	answerQuality: Record<string, number>;
	suggestions: Record<string, string>;
	isComplete: boolean;
}

const STORAGE_KEY = 'apparchitect_ai_interview';

// ============================================================================
// §2 - INITIAL STATE
// ============================================================================

function getInitialState(): AIInterviewState {
	const saved = localStorage.getItem(STORAGE_KEY);
	if (saved) {
		try {
			return JSON.parse(saved);
		} catch {
			// ignore
		}
	}
	
	return {
		currentCategory: 'product_identity',
		currentQuestions: getQuestionsForCategory('product_identity'),
		answers: {},
		completedCategories: [],
		pendingFollowUps: [],
		answerQuality: {},
		suggestions: {},
		isComplete: false,
	};
}

// ============================================================================
// §3 - MAIN HOOK
// ============================================================================

export function useAIInterview() {
	const [state, setState] = useState<AIInterviewState>(getInitialState);
	
	// Persist state
	const saveState = useCallback((newState: AIInterviewState) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
		setState(newState);
	}, []);
	
	// Get current context for AI features
	const context: InterviewContext = useMemo(() => ({
		answers: state.answers,
		currentPhase: categoryToPhase(state.currentCategory),
		completedCategories: state.completedCategories,
		answerQuality: state.answerQuality,
	}), [state]);
	
	// Calculate progress
	const progress: InterviewProgress = useMemo(() => 
		calculateProgress(context)
	, [context]);
	
	// Update answers for current category
	const updateAnswers = useCallback((updates: Partial<InterviewAnswers>) => {
		const newAnswers = { ...state.answers, ...updates };
		const newQuality = { ...state.answerQuality };
		const newSuggestions = { ...state.suggestions };
		const newFollowUps = [...state.pendingFollowUps];
		
		// Assess quality and check for follow-ups
		for (const [key, value] of Object.entries(updates)) {
			if (typeof value === 'string') {
				// Assess quality
				newQuality[key] = assessAnswerQuality(key, value);
				
				// Generate suggestions
				const suggestion = generateAISuggestion(key, {
					...context,
					answers: newAnswers,
				});
				if (suggestion) {
					newSuggestions[key] = suggestion;
				}
				
				// Check for follow-ups
				const followUp = shouldTriggerFollowUp(key, value);
				if (followUp && !newFollowUps.some(f => f.question.id === followUp.question.id)) {
					newFollowUps.push(followUp);
				}
			}
		}
		
		saveState({
			...state,
			answers: newAnswers,
			answerQuality: newQuality,
			suggestions: newSuggestions,
			pendingFollowUps: newFollowUps,
		});
	}, [state, context, saveState]);
	
	// Move to next category
	const goToNextCategory = useCallback(() => {
		// Check if there are pending follow-ups
		if (state.pendingFollowUps.length > 0) {
			// Process follow-ups first
			const followUp = state.pendingFollowUps[0];
			saveState({
				...state,
				currentQuestions: [followUp.question],
				pendingFollowUps: state.pendingFollowUps.slice(1),
			});
			return;
		}
		
		// Mark current category as complete
		const newCompletedCategories = [
			...state.completedCategories,
			state.currentCategory,
		];
		
		// Get next category
		const nextCategory = getNextCategory(newCompletedCategories);
		
		if (nextCategory) {
			saveState({
				...state,
				currentCategory: nextCategory,
				currentQuestions: getQuestionsForCategory(nextCategory),
				completedCategories: newCompletedCategories,
			});
		} else {
			// Interview complete
			saveState({
				...state,
				completedCategories: newCompletedCategories,
				isComplete: true,
			});
		}
	}, [state, saveState]);
	
	// Go to specific category
	const goToCategory = useCallback((category: AIQuestionCategory) => {
		saveState({
			...state,
			currentCategory: category,
			currentQuestions: getQuestionsForCategory(category),
		});
	}, [state, saveState]);
	
	// Get suggestion for a question
	const getSuggestion = useCallback((questionId: string): string | null => {
		return state.suggestions[questionId] || generateAISuggestion(questionId, context);
	}, [state.suggestions, context]);
	
	// Get quality score for an answer
	const getQualityScore = useCallback((questionId: string): number => {
		return state.answerQuality[questionId] || 0;
	}, [state.answerQuality]);
	
	// Reset interview
	const resetInterview = useCallback(() => {
		localStorage.removeItem(STORAGE_KEY);
		setState({
			currentCategory: 'product_identity',
			currentQuestions: getQuestionsForCategory('product_identity'),
			answers: {},
			completedCategories: [],
			pendingFollowUps: [],
			answerQuality: {},
			suggestions: {},
			isComplete: false,
		});
	}, []);
	
	// Get complete answers (with defaults filled in)
	const getCompleteAnswers = useCallback((): InterviewAnswers => {
		return {
			productName: '',
			productDescription: '',
			problemSolved: '',
			productType: '',
			uniqueValue: '',
			primaryUser: '',
			userContext: '',
			technicalLiteracy: '',
			corePrinciples: '',
			tradeoffs: '',
			coreSystems: '',
			userFlows: '',
			systemStates: '',
			dataCollected: '',
			complianceRequirements: [],
			usesAI: '',
			userRoles: '',
			rolePermissions: '',
			tenancyModel: '',
			platforms: [],
			externalServices: '',
			exposeAPI: '',
			visualStyle: '',
			keyScreens: '',
			accessibility: '',
			dataEntities: '',
			entityRelationships: '',
			criticalFailures: '',
			testingPriorities: '',
			testingApproach: [],
			businessModel: '',
			...state.answers,
		} as InterviewAnswers;
	}, [state.answers]);
	
	return {
		// State
		state,
		currentCategory: state.currentCategory,
		currentQuestions: state.currentQuestions,
		answers: state.answers,
		isComplete: state.isComplete,
		
		// Progress
		progress,
		overallQuality: getOverallAnswerQuality(state.answers),
		
		// Actions
		updateAnswers,
		goToNextCategory,
		goToCategory,
		resetInterview,
		getCompleteAnswers,
		
		// AI Features
		getSuggestion,
		getQualityScore,
		hasPendingFollowUps: state.pendingFollowUps.length > 0,
	};
}

// ============================================================================
// §4 - HELPERS
// ============================================================================

function categoryToPhase(category: AIQuestionCategory): InterviewPhase {
	switch (category) {
		case 'product_identity':
		case 'target_audience':
			return 'concept';
		case 'core_systems':
		case 'roles_permissions':
			return 'features';
		case 'safety_privacy':
		case 'technical':
		case 'integrations':
		case 'data':
			return 'technical';
		case 'design':
		case 'testing':
		case 'monetization':
			return 'depth';
		default:
			return 'concept';
	}
}

// Export types
// Types already exported above
