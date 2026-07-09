import { useState, useCallback, useEffect, useRef } from 'react';
import type { InterviewState, InterviewPhase, InterviewAnswers, InterviewRound } from '@/types';

/**
 * Enhanced interview question with guidance for long-form answers
 */
export interface EnhancedQuestion {
	id: string;
	text: string;
	type: 'textarea';
	placeholder: string;
	required?: boolean;
	/** Conversational guidance to help users write richer answers */
	guidance: string;
	/** Minimum character count for a "good" answer */
	minChars?: number;
	/** Target character count for a "great" answer */
	targetChars?: number;
}

export interface EnhancedRound {
	id: InterviewPhase;
	title: string;
	subtitle: string;
	questions: EnhancedQuestion[];
}

/**
 * Streamlined interview with conversational, open-ended questions.
 * Each question includes guidance to help users write thoughtful responses.
 */
const INTERVIEW_ROUNDS: EnhancedRound[] = [
	{
		id: 'concept',
		title: 'THE BIG PICTURE',
		subtitle: "Let's understand your vision",
		questions: [
			{
				id: 'appDescription',
				text: "Tell us about your app. What's the story behind it?",
				type: 'textarea',
				placeholder: "I'm building an app that...",
				required: true,
				guidance: "Describe what your app does, what inspired you to build it, and why it matters. Pretend you're explaining it to a friend over coffee.",
				minChars: 100,
				targetChars: 300,
			},
			{
				id: 'targetUsers',
				text: "Who are you building this for? Paint us a picture of your ideal user.",
				type: 'textarea',
				placeholder: "My ideal user is someone who...",
				required: true,
				guidance: "Go beyond demographics. What's their day like? What frustrates them? What would make them smile when using your app?",
				minChars: 100,
				targetChars: 250,
			},
			{
				id: 'uniqueValue',
				text: "What will make people choose your app over alternatives?",
				type: 'textarea',
				placeholder: "What makes us different is...",
				required: true,
				guidance: "Think about the 'aha moment' — what will users experience that they can't get elsewhere? It's okay if it's something simple done really well.",
				minChars: 80,
				targetChars: 200,
			},
		],
	},
	{
		id: 'concept',
		title: 'THE BIG PICTURE',
		subtitle: 'Business and reach',
		questions: [
			{
				id: 'businessModel',
				text: "How will this become a sustainable business?",
				type: 'textarea',
				placeholder: "The plan is to...",
				required: true,
				guidance: "Share your monetization thinking — subscriptions, one-time purchases, freemium, marketplace fees? It's fine if you're still exploring options.",
				minChars: 60,
				targetChars: 200,
			},
			{
				id: 'platforms',
				text: "Where will people use your app?",
				type: 'textarea',
				placeholder: "People will access it via...",
				required: true,
				guidance: "Web browser? Phone app? Desktop? Think about when and where your users will reach for your app — that context matters.",
				minChars: 40,
				targetChars: 150,
			},
		],
	},
	{
		id: 'features',
		title: 'WHAT IT DOES',
		subtitle: 'Core capabilities',
		questions: [
			{
				id: 'coreFeatures',
				text: "Walk us through the main things users can do in your app.",
				type: 'textarea',
				placeholder: "The main things you can do are...\n\n1. \n2. \n3. ",
				required: true,
				guidance: "List each major feature and briefly explain what it does. Focus on actions: 'Users can...' Think MVP — what's essential for launch?",
				minChars: 150,
				targetChars: 400,
			},
			{
				id: 'futureFeatures',
				text: "What's on your wishlist for version 2 and beyond?",
				type: 'textarea',
				placeholder: "Later, I'd love to add...",
				guidance: "Dream a little! What would you add if you had unlimited time? This helps us design a foundation that can grow.",
				minChars: 40,
				targetChars: 200,
			},
		],
	},
	{
		id: 'features',
		title: 'WHAT IT DOES',
		subtitle: 'Users and access',
		questions: [
			{
				id: 'authAndUsers',
				text: "Tell us about user accounts and permissions.",
				type: 'textarea',
				placeholder: "For user accounts, I'm thinking...",
				required: true,
				guidance: "How do people sign up? Are there different types of users with different abilities? Can people use it without an account?",
				minChars: 80,
				targetChars: 250,
			},
			{
				id: 'paymentsAndCommerce',
				text: "Does money change hands in your app? How?",
				type: 'textarea',
				placeholder: "Regarding payments...",
				guidance: "Subscriptions, one-time purchases, marketplace transactions, tips? Walk through what the payment experience looks like. Skip this if not applicable.",
				minChars: 40,
				targetChars: 200,
			},
			{
				id: 'realtimeFeatures',
				text: "Does anything need to happen in real-time?",
				type: 'textarea',
				placeholder: "For real-time features...",
				guidance: "Live chat? Collaborative editing? Instant notifications? Real-time stock updates? These affect architecture significantly.",
				minChars: 30,
				targetChars: 150,
			},
		],
	},
	{
		id: 'features',
		title: 'WHAT IT DOES',
		subtitle: 'Data and connections',
		questions: [
			{
				id: 'integrations',
				text: "What other services or tools should your app connect with?",
				type: 'textarea',
				placeholder: "I'd like to integrate with...",
				guidance: "Payment processors, email services, social platforms, analytics, other apps your users already use? Think about the ecosystem your app lives in.",
				minChars: 30,
				targetChars: 150,
			},
			{
				id: 'dataAndContent',
				text: "What will users create, upload, or manage in your app?",
				type: 'textarea',
				placeholder: "Users will work with things like...",
				required: true,
				guidance: "Text, images, files, lists, records? Think about what users bring into the app and what they create inside it. How much data might a heavy user have?",
				minChars: 80,
				targetChars: 200,
			},
		],
	},
	{
		id: 'technical',
		title: 'PRACTICAL DETAILS',
		subtitle: 'Scale and growth',
		questions: [
			{
				id: 'scaleExpectations',
				text: "How big do you expect this to get?",
				type: 'textarea',
				placeholder: "For scale, I'm expecting...",
				required: true,
				guidance: "Start with launch: 10 users? 1,000? Then think year one and beyond. How much data will each user have? This shapes infrastructure decisions.",
				minChars: 60,
				targetChars: 200,
			},
			{
				id: 'technicalPreferences',
				text: "Any technical preferences or constraints we should know about?",
				type: 'textarea',
				placeholder: "Technically, I'd prefer...",
				guidance: "Existing tech stack? Hosting preferences? Budget constraints? Team expertise? It's okay to say 'no preference' — we'll recommend best practices.",
				minChars: 30,
				targetChars: 150,
			},
		],
	},
	{
		id: 'technical',
		title: 'PRACTICAL DETAILS',
		subtitle: 'Compliance and timing',
		questions: [
			{
				id: 'complianceNeeds',
				text: "Are there any rules or regulations your app needs to follow?",
				type: 'textarea',
				placeholder: "For compliance, we need to consider...",
				guidance: "GDPR, HIPAA, financial regulations, age restrictions? Industry-specific requirements? Even if you're unsure, mention what industry you're in.",
				minChars: 30,
				targetChars: 150,
			},
			{
				id: 'timeline',
				text: "What's driving your timeline?",
				type: 'textarea',
				placeholder: "The timeline looks like...",
				required: true,
				guidance: "Launch date? Investor demo? Seasonal opportunity? Understanding what's driving urgency helps us prioritize. What milestones matter most?",
				minChars: 60,
				targetChars: 200,
			},
		],
	},
	{
		id: 'depth',
		title: 'FINISHING TOUCHES',
		subtitle: 'Brand and final thoughts',
		questions: [
			{
				id: 'brandAndDesign',
				text: "How should your app look and feel?",
				type: 'textarea',
				placeholder: "For the look and feel, I'm imagining...",
				guidance: "Describe the vibe: playful or professional? Minimal or feature-rich? Reference apps you admire. Any existing brand colors or assets?",
				minChars: 50,
				targetChars: 200,
			},
			{
				id: 'additionalContext',
				text: "Anything else on your mind?",
				type: 'textarea',
				placeholder: "One more thing...",
				guidance: "Edge cases, worries, specific workflows, things you've tried before that didn't work — share anything that might help us understand your vision better.",
				minChars: 0,
				targetChars: 200,
			},
		],
	},
];

const PHASE_ORDER: InterviewPhase[] = ['concept', 'features', 'technical', 'depth', 'complete'];

/** Key for storing draft answers (auto-saved while typing) */
const DRAFT_STORAGE_KEY = 'apparchitect_interview_draft';
const STATE_STORAGE_KEY = 'apparchitect_interview';

function getInitialState(): InterviewState {
	const saved = localStorage.getItem(STATE_STORAGE_KEY);
	if (saved) {
		try {
			return JSON.parse(saved);
		} catch {
			// ignore
		}
	}
	return {
		currentPhase: 'concept',
		answers: {},
		completedPhases: [],
		flags: [],
	};
}

function getDraftAnswers(): Record<string, string> {
	const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
	if (saved) {
		try {
			return JSON.parse(saved);
		} catch {
			// ignore
		}
	}
	return {};
}

export function useInterview() {
	const [state, setState] = useState<InterviewState>(getInitialState);
	const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
	const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>(getDraftAnswers);
	const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Auto-save drafts with debounce
	const saveDrafts = useCallback((drafts: Record<string, string>) => {
		localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
	}, []);

	// Update draft answers with auto-save
	const updateDraftAnswer = useCallback((id: string, value: string) => {
		setDraftAnswers(prev => {
			const updated = { ...prev, [id]: value };
			
			// Debounce save to localStorage
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
			saveTimeoutRef.current = setTimeout(() => {
				saveDrafts(updated);
			}, 500); // Save after 500ms of no typing
			
			return updated;
		});
	}, [saveDrafts]);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, []);

	const saveState = useCallback((newState: InterviewState) => {
		localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(newState));
		setState(newState);
	}, []);

	const getCurrentRound = useCallback((): EnhancedRound | undefined => {
		const roundsForPhase = INTERVIEW_ROUNDS.filter((r) => r.id === state.currentPhase);
		const phaseRoundIndex = currentRoundIndex % Math.max(1, roundsForPhase.length);
		return roundsForPhase[phaseRoundIndex] || roundsForPhase[0];
	}, [state.currentPhase, currentRoundIndex]);

	const getQuestionsForCurrentRound = useCallback((): EnhancedQuestion[] => {
		const round = getCurrentRound();
		if (!round) return [];
		return round.questions;
	}, [getCurrentRound]);

	const updateAnswers = useCallback(
		(updates: Partial<InterviewAnswers>) => {
			const newState = {
				...state,
				answers: { ...state.answers, ...updates },
			};
			saveState(newState);
		},
		[state, saveState]
	);

	const commitDraftsToAnswers = useCallback(() => {
		// Move current drafts to permanent answers
		const newAnswers = { ...state.answers };
		Object.entries(draftAnswers).forEach(([key, value]) => {
			if (value && value.trim()) {
				newAnswers[key] = value;
			}
		});
		return newAnswers;
	}, [state.answers, draftAnswers]);

	const goToNextRound = useCallback(() => {
		// Commit drafts first
		const newAnswers = commitDraftsToAnswers();
		
		const roundsForPhase = INTERVIEW_ROUNDS.filter((r) => r.id === state.currentPhase);
		const phaseRoundIndex = currentRoundIndex % Math.max(1, roundsForPhase.length);

		if (phaseRoundIndex < roundsForPhase.length - 1) {
			// Save answers and move to next round in same phase
			saveState({ ...state, answers: newAnswers });
			setCurrentRoundIndex((prev) => prev + 1);
		} else {
			const currentPhaseIndex = PHASE_ORDER.indexOf(state.currentPhase);
			if (currentPhaseIndex < PHASE_ORDER.length - 2) {
				const nextPhase = PHASE_ORDER[currentPhaseIndex + 1];
				const newState = {
					...state,
					currentPhase: nextPhase,
					completedPhases: [...state.completedPhases, state.currentPhase],
					answers: newAnswers,
				};
				saveState(newState);
				setCurrentRoundIndex(0);
			} else {
				const newState = {
					...state,
					currentPhase: 'complete' as InterviewPhase,
					completedPhases: [...state.completedPhases, state.currentPhase],
					answers: newAnswers,
				};
				saveState(newState);
			}
		}
	}, [state, currentRoundIndex, saveState, commitDraftsToAnswers]);

	const resetInterview = useCallback(() => {
		localStorage.removeItem(STATE_STORAGE_KEY);
		localStorage.removeItem(DRAFT_STORAGE_KEY);
		setState({
			currentPhase: 'concept',
			answers: {},
			completedPhases: [],
			flags: [],
		});
		setDraftAnswers({});
		setCurrentRoundIndex(0);
	}, []);

	// Calculate progress
	const totalRounds = INTERVIEW_ROUNDS.length;
	const completedRounds = INTERVIEW_ROUNDS.filter((r) => {
		const phaseIndex = PHASE_ORDER.indexOf(r.id);
		const currentPhaseIndex = PHASE_ORDER.indexOf(state.currentPhase);
		return phaseIndex < currentPhaseIndex;
	}).length + (currentRoundIndex % Math.max(1, INTERVIEW_ROUNDS.filter((r) => r.id === state.currentPhase).length));
	
	const progress = Math.round((completedRounds / totalRounds) * 100);

	// Get answer for a question (check drafts first, then committed answers)
	const getAnswer = useCallback((questionId: string): string => {
		const answer = draftAnswers[questionId] ?? state.answers[questionId] ?? '';
	return typeof answer === 'string' ? answer : '';
	}, [draftAnswers, state.answers]);

	// Calculate completion status for a question
	const getQuestionStatus = useCallback((question: EnhancedQuestion): {
		charCount: number;
		isStarted: boolean;
		isMinimum: boolean;
		isGood: boolean;
		progress: number;
	} => {
		const answer = getAnswer(question.id);
		const charCount = answer.length;
		const minChars = question.minChars || 50;
		const targetChars = question.targetChars || 200;
		
		return {
			charCount,
			isStarted: charCount > 0,
			isMinimum: charCount >= minChars,
			isGood: charCount >= targetChars,
			progress: Math.min(100, Math.round((charCount / targetChars) * 100)),
		};
	}, [getAnswer]);

	return {
		state,
		currentRound: getCurrentRound(),
		questions: getQuestionsForCurrentRound(),
		updateDraftAnswer,
		getAnswer,
		getQuestionStatus,
		goToNextRound,
		progress,
		resetInterview,
		isComplete: state.currentPhase === 'complete',
	};
}

// Types already exported above
