/**
 * Interview Types
 * 
 * Based on Core Systems PRD §3.4-3.6
 * Supports 13 domains, 4 rounds, adaptive questioning
 */

// Interview state machine values (per Core Systems PRD §3.4)
export type InterviewStatus = 
	| 'NOT_STARTED'
	| 'IN_PROGRESS'
	| 'AWAITING_CONFIRMATION'
	| 'COMPLETED'
	| 'ABANDONED';

// Interview rounds
export type InterviewRound = 1 | 2 | 3 | 4;

// Legacy phase mapping (for backwards compatibility)
export type InterviewPhase = 'concept' | 'features' | 'technical' | 'depth' | 'complete';

// Map rounds to phases
export const ROUND_TO_PHASE: Record<InterviewRound, InterviewPhase> = {
	1: 'concept',
	2: 'features',
	3: 'technical',
	4: 'depth',
};

export const PHASE_TO_ROUND: Record<InterviewPhase, InterviewRound | null> = {
	concept: 1,
	features: 2,
	technical: 3,
	depth: 4,
	complete: null,
};

// Domain coverage tracking
export interface DomainCoverage {
	domainId: number;
	completed: boolean;
	percentage: number;
	answeredQuestions: string[];
}

// Individual answer
export interface InterviewAnswer {
	id: string;
	domainId: number;
	questionId: string;
	value: string;
	isAmbiguous: boolean;
	clarificationNeeded: string | null;
	userSpecifiedDefault: boolean;
	appliedDefault: string | null;
	createdAt: string;
}

// Message in interview conversation
export interface InterviewMessage {
	id: string;
	role: 'system' | 'user' | 'assistant';
	content: string;
	domainId?: number;
	questionId?: string;
	timestamp: string;
}

// Decision made during interview
export interface InterviewDecision {
	id: string;
	description: string;
	rationale: string;
	domainId: number;
	createdAt: string;
}

// Deferred item for later
export interface DeferredItem {
	id: string;
	description: string;
	domainId: number;
	reason: string;
	createdAt: string;
}

// Full interview session (per Core Systems PRD §3.7)
export interface InterviewSession {
	id: string;
	userId: string;
	productName: string;
	currentRound: InterviewRound;
	currentDomainId: number;
	status: InterviewStatus;
	domainCoverage: Record<number, DomainCoverage>;
	answers: InterviewAnswer[];
	messages: InterviewMessage[];
	decisions: InterviewDecision[];
	deferredItems: DeferredItem[];
	createdAt: string;
	updatedAt: string;
}

/**
 * InterviewAnswers - Flexible record for long-form interview responses
 * All answers are now free-form text strings
 */
export interface InterviewAnswers {
	// Concept / Big Picture
	appDescription?: string;
	targetUsers?: string;
	uniqueValue?: string;
	businessModel?: string;
	platforms?: string;
	
	// Features
	coreFeatures?: string;
	futureFeatures?: string;
	authAndUsers?: string;
	paymentsAndCommerce?: string;
	realtimeFeatures?: string;
	integrations?: string;
	dataAndContent?: string;
	
	// Technical
	scaleExpectations?: string;
	technicalPreferences?: string;
	complianceNeeds?: string;
	timeline?: string;
	
	// Design & Other
	brandAndDesign?: string;
	additionalContext?: string;
	
	// Legacy fields (for backwards compatibility with document generation)
	productName?: string;
	productDescription?: string;
	problemSolved?: string;
	productType?: string;
	primaryUser?: string;
	userContext?: string;
	technicalLiteracy?: string;
	secondaryUser?: string;
	corePrinciples?: string;
	tradeoffs?: string;
	coreSystems?: string;
	userFlows?: string;
	systemStates?: string;
	dataCollected?: string;
	complianceRequirements?: string | string[];
	usesAI?: string;
	contentModeration?: string;
	userRoles?: string;
	rolePermissions?: string;
	tenancyModel?: string;
	techPreferences?: string;
	performanceRequirements?: string;
	externalServices?: string;
	existingIntegrations?: string;
	exposeAPI?: string;
	visualStyle?: string;
	brandColors?: string;
	keyScreens?: string;
	accessibility?: string;
	dataEntities?: string;
	entityRelationships?: string;
	specialDataRequirements?: string;
	criticalFailures?: string;
	errorCommunication?: string;
	testingPriorities?: string;
	testingApproach?: string | string[];
	pricingTiers?: string;
	gatedFeatures?: string;
	
	// Allow any additional string keys for flexibility
	[key: string]: string | string[] | undefined;
}

// Simple interview state for the useInterview hook
export interface InterviewState {
	currentPhase: InterviewPhase;
	answers: InterviewAnswers;
	completedPhases: InterviewPhase[];
	flags: string[];
	// Legacy fields for backwards compatibility
	currentRound?: number;
}

// Full interview state for AI interview flow
export interface FullInterviewState {
	session: InterviewSession | null;
	currentQuestion: {
		domainId: number;
		questionId: string;
		text: string;
		helpText?: string;
		type: 'text' | 'multiline' | 'choice' | 'multi-choice';
		options?: string[];
		required: boolean;
	} | null;
	isLoading: boolean;
	error: string | null;
}

// Interview question from the question bank
export interface InterviewQuestion {
	id: string;
	domainId: number;
	text: string;
	helpText?: string;
	required: boolean;
	type: 'text' | 'multiline' | 'choice' | 'multi-choice';
	options?: string[];
	defaultValue?: string;
}

// Legacy InterviewRound type (for backwards compatibility)
export interface LegacyInterviewRound {
	id: number;
	name: string;
	phase: InterviewPhase;
	questions: InterviewQuestion[];
}
