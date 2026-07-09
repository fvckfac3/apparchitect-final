/**
 * AI Interview System - V2 Architecture
 * 
 * Enhanced interview system with AI-powered:
 * - Dynamic follow-up questions
 * - Answer quality assessment
 * - Smart inference and suggestions
 * - Adaptive questioning flow
 */

import type { InterviewAnswers, InterviewPhase } from '@/types/interview';

// ============================================================================
// §1 - AI INTERVIEW TYPES
// ============================================================================

export interface AIQuestion {
	id: string;
	text: string;
	helpText?: string;
	type: 'text' | 'textarea' | 'select' | 'multiselect';
	options?: string[];
	required: boolean;
	category: AIQuestionCategory;
	followUpTrigger?: (answer: string) => boolean;
	validation?: (answer: string) => ValidationResult;
	aiSuggestion?: (context: InterviewContext) => string | null;
}

export type AIQuestionCategory = 
	| 'product_identity'
	| 'target_audience'
	| 'core_systems'
	| 'safety_privacy'
	| 'roles_permissions'
	| 'technical'
	| 'integrations'
	| 'design'
	| 'data'
	| 'testing'
	| 'monetization';

export interface InterviewContext {
	answers: Partial<InterviewAnswers>;
	currentPhase: InterviewPhase;
	completedCategories: AIQuestionCategory[];
	answerQuality: Record<string, number>;
}

export interface ValidationResult {
	isValid: boolean;
	issues: string[];
	suggestions: string[];
	qualityScore: number; // 0-100
}

export interface FollowUpQuestion {
	parentQuestionId: string;
	question: AIQuestion;
	triggerCondition: string;
}

// ============================================================================
// §2 - QUESTION BANK (V2 ENHANCED)
// ============================================================================

export const AI_QUESTION_BANK: AIQuestion[] = [
	// Product Identity
	{
		id: 'productName',
		text: 'What is your product called?',
		helpText: 'Choose a clear, memorable name that reflects your product\'s purpose.',
		type: 'text',
		required: true,
		category: 'product_identity',
		validation: (answer) => ({
			isValid: answer.length >= 2 && answer.length <= 50,
			issues: answer.length < 2 ? ['Name is too short'] : answer.length > 50 ? ['Name is too long'] : [],
			suggestions: [],
			qualityScore: Math.min(100, answer.length * 5),
		}),
	},
	{
		id: 'productDescription',
		text: 'Describe your product in 2-3 sentences.',
		helpText: 'What does it do? Who is it for? What problem does it solve?',
		type: 'textarea',
		required: true,
		category: 'product_identity',
		validation: (answer) => {
			const words = answer.split(/\s+/).filter(w => w.length > 0).length;
			return {
				isValid: words >= 10,
				issues: words < 10 ? ['Please provide more detail (at least 10 words)'] : [],
				suggestions: words < 20 ? ['Consider adding more context about your target users'] : [],
				qualityScore: Math.min(100, words * 3),
			};
		},
	},
	{
		id: 'problemSolved',
		text: 'What problem does your product solve?',
		helpText: 'Describe the pain point your users experience without your product.',
		type: 'textarea',
		required: true,
		category: 'product_identity',
	},
	{
		id: 'uniqueValue',
		text: 'What makes your product unique?',
		helpText: 'How is this different from existing solutions?',
		type: 'textarea',
		required: false,
		category: 'product_identity',
	},
	{
		id: 'productType',
		text: 'What type of product is this?',
		type: 'select',
		options: [
			'Web Application',
			'Mobile App',
			'SaaS Platform',
			'E-commerce',
			'Marketplace',
			'Content Platform',
			'Developer Tool',
			'Enterprise Software',
			'Other',
		],
		required: true,
		category: 'product_identity',
	},
	
	// Target Audience
	{
		id: 'primaryUser',
		text: 'Who is the primary user of your product?',
		helpText: 'Describe your main target audience.',
		type: 'textarea',
		required: true,
		category: 'target_audience',
	},
	{
		id: 'technicalLiteracy',
		text: 'What is the technical literacy of your users?',
		type: 'select',
		options: [
			'Non-technical',
			'Basic computer skills',
			'Technically comfortable',
			'Developers/Engineers',
			'Mixed audience',
		],
		required: true,
		category: 'target_audience',
	},
	
	// Core Systems
	{
		id: 'coreSystems',
		text: 'What are the main features or systems in your product?',
		helpText: 'List the key functionality. Example: User auth, Dashboard, Notifications, Payments',
		type: 'textarea',
		required: true,
		category: 'core_systems',
		validation: (answer) => {
			const features = answer.split(/[,\n]/).filter(f => f.trim().length > 0);
			return {
				isValid: features.length >= 2,
				issues: features.length < 2 ? ['List at least 2 core features'] : [],
				suggestions: features.length < 4 ? ['Consider common features: authentication, notifications, settings'] : [],
				qualityScore: Math.min(100, features.length * 20),
			};
		},
	},
	{
		id: 'userFlows',
		text: 'Describe the main user journeys.',
		helpText: 'What are the key paths users take through your product?',
		type: 'textarea',
		required: false,
		category: 'core_systems',
	},
	
	// Safety & Privacy
	{
		id: 'dataCollected',
		text: 'What user data will you collect?',
		helpText: 'Email, name, payment info, usage data, etc.',
		type: 'textarea',
		required: true,
		category: 'safety_privacy',
	},
	{
		id: 'usesAI',
		text: 'Does your product use AI or LLMs?',
		type: 'select',
		options: [
			'Yes - Core feature',
			'Yes - Supporting feature',
			'No',
			'Considering it',
		],
		required: true,
		category: 'safety_privacy',
		followUpTrigger: (answer) => answer.toLowerCase().includes('yes'),
	},
	{
		id: 'complianceRequirements',
		text: 'Do you have any compliance requirements?',
		type: 'multiselect',
		options: ['GDPR', 'HIPAA', 'SOC 2', 'PCI-DSS', 'CCPA', 'None'],
		required: false,
		category: 'safety_privacy',
	},
	
	// Roles & Permissions
	{
		id: 'userRoles',
		text: 'What user roles does your product need?',
		helpText: 'Example: Admin, Editor, Viewer, Guest',
		type: 'textarea',
		required: true,
		category: 'roles_permissions',
	},
	{
		id: 'tenancyModel',
		text: 'Is this a single-tenant or multi-tenant application?',
		type: 'select',
		options: [
			'Single-tenant',
			'Multi-tenant (organizations/teams)',
			'Both',
			'Not sure',
		],
		required: true,
		category: 'roles_permissions',
	},
	
	// Technical
	{
		id: 'platforms',
		text: 'What platforms should your product support?',
		type: 'multiselect',
		options: ['Web', 'iOS', 'Android', 'Desktop (Mac)', 'Desktop (Windows)', 'API only'],
		required: true,
		category: 'technical',
	},
	{
		id: 'techPreferences',
		text: 'Do you have any technology preferences?',
		helpText: 'Languages, frameworks, databases, etc.',
		type: 'textarea',
		required: false,
		category: 'technical',
	},
	{
		id: 'performanceRequirements',
		text: 'What are your performance requirements?',
		helpText: 'Expected users, page load time, API response time, etc.',
		type: 'textarea',
		required: false,
		category: 'technical',
	},
	
	// Integrations
	{
		id: 'externalServices',
		text: 'What external services or APIs will you integrate with?',
		helpText: 'Example: Stripe, SendGrid, Twilio, Google Maps',
		type: 'textarea',
		required: false,
		category: 'integrations',
	},
	{
		id: 'exposeAPI',
		text: 'Will you expose a public API?',
		type: 'select',
		options: ['Yes', 'No', 'Eventually'],
		required: true,
		category: 'integrations',
	},
	
	// Design
	{
		id: 'visualStyle',
		text: 'Describe the visual style you want.',
		helpText: 'Modern, minimal, playful, corporate, etc.',
		type: 'textarea',
		required: false,
		category: 'design',
	},
	{
		id: 'keyScreens',
		text: 'What are the key screens in your product?',
		helpText: 'List the main pages or views.',
		type: 'textarea',
		required: false,
		category: 'design',
	},
	{
		id: 'accessibility',
		text: 'What accessibility requirements do you have?',
		type: 'select',
		options: [
			'WCAG 2.1 AA (standard)',
			'WCAG 2.1 AAA (strict)',
			'Basic accessibility',
			'No specific requirements',
		],
		required: false,
		category: 'design',
	},
	
	// Data
	{
		id: 'dataEntities',
		text: 'What are the main data entities in your product?',
		helpText: 'Example: Users, Posts, Comments, Orders, Products',
		type: 'textarea',
		required: true,
		category: 'data',
	},
	{
		id: 'entityRelationships',
		text: 'How are these entities related?',
		helpText: 'Example: Users have many Posts, Posts have many Comments',
		type: 'textarea',
		required: false,
		category: 'data',
	},
	
	// Testing
	{
		id: 'testingPriorities',
		text: 'What are your testing priorities?',
		helpText: 'What functionality is most critical to test?',
		type: 'textarea',
		required: false,
		category: 'testing',
	},
	{
		id: 'testingApproach',
		text: 'What testing approaches do you want?',
		type: 'multiselect',
		options: [
			'Unit tests',
			'Integration tests',
			'E2E tests',
			'Visual regression',
			'Performance tests',
			'Security tests',
		],
		required: false,
		category: 'testing',
	},
	
	// Monetization
	{
		id: 'businessModel',
		text: 'What is your business model?',
		type: 'select',
		options: [
			'Free',
			'Freemium',
			'Subscription',
			'One-time purchase',
			'Usage-based',
			'Marketplace commission',
			'Enterprise licensing',
			'Not decided yet',
		],
		required: true,
		category: 'monetization',
	},
	{
		id: 'pricingTiers',
		text: 'Describe your pricing tiers (if applicable).',
		helpText: 'Example: Free, Pro ($10/mo), Enterprise (custom)',
		type: 'textarea',
		required: false,
		category: 'monetization',
	},
];

// ============================================================================
// §3 - FOLLOW-UP QUESTIONS
// ============================================================================

export const FOLLOW_UP_QUESTIONS: FollowUpQuestion[] = [
	// AI follow-ups
	{
		parentQuestionId: 'usesAI',
		triggerCondition: 'yes',
		question: {
			id: 'aiCapabilities',
			text: 'What AI capabilities will you implement?',
			helpText: 'Text generation, image recognition, recommendations, etc.',
			type: 'textarea',
			required: true,
			category: 'safety_privacy',
		},
	},
	{
		parentQuestionId: 'usesAI',
		triggerCondition: 'yes',
		question: {
			id: 'aiSafeguards',
			text: 'What AI safety measures will you implement?',
			type: 'multiselect',
			options: [
				'Content filtering',
				'Rate limiting',
				'Human review',
				'Output validation',
				'Audit logging',
			],
			required: true,
			category: 'safety_privacy',
		},
	},
	// Multi-tenant follow-ups
	{
		parentQuestionId: 'tenancyModel',
		triggerCondition: 'multi',
		question: {
			id: 'tenantIsolation',
			text: 'How should tenant data be isolated?',
			type: 'select',
			options: [
				'Row-level (same tables, filtered)',
				'Schema-level (separate schemas)',
				'Database-level (separate databases)',
			],
			required: true,
			category: 'data',
		},
	},
	// Payment follow-ups
	{
		parentQuestionId: 'businessModel',
		triggerCondition: 'subscription|freemium|usage',
		question: {
			id: 'paymentProvider',
			text: 'Which payment provider will you use?',
			type: 'select',
			options: ['Stripe', 'PayPal', 'Paddle', 'Other', 'Not decided'],
			required: true,
			category: 'monetization',
		},
	},
];

// ============================================================================
// §4 - AI SUGGESTION ENGINE
// ============================================================================

export function generateAISuggestion(questionId: string, context: InterviewContext): string | null {
	const { answers } = context;
	
	switch (questionId) {
		case 'techPreferences':
			if (answers.platforms?.includes('Web')) {
				return 'Based on web platform selection: React + TypeScript + Supabase is recommended for rapid development.';
			}
			break;
			
		case 'complianceRequirements':
			if (answers.dataCollected?.toLowerCase().includes('health')) {
				return 'Since you\'re collecting health data, HIPAA compliance may be required.';
			}
			if (answers.dataCollected?.toLowerCase().includes('payment')) {
				return 'Payment data handling requires PCI-DSS compliance.';
			}
			break;
			
		case 'userRoles':
			if (answers.productType === 'SaaS Platform') {
				return 'Typical SaaS roles: Owner, Admin, Member, Viewer. Consider team-based permissions.';
			}
			break;
			
		case 'testingApproach':
			if (answers.usesAI?.toLowerCase().includes('yes')) {
				return 'AI features benefit from output validation tests and edge case coverage.';
			}
			break;
	}
	
	return null;
}

// ============================================================================
// §5 - ANSWER QUALITY ASSESSMENT
// ============================================================================

export function assessAnswerQuality(questionId: string, answer: string): number {
	if (!answer || answer.trim() === '') return 0;
	
	const question = AI_QUESTION_BANK.find(q => q.id === questionId);
	if (!question) return 50;
	
	// Use custom validation if available
	if (question.validation) {
		return question.validation(answer).qualityScore;
	}
	
	// Default quality assessment
	let score = 50;
	
	// Length-based scoring
	const words = answer.split(/\s+/).filter(w => w.length > 0).length;
	if (question.type === 'textarea') {
		if (words >= 20) score += 30;
		else if (words >= 10) score += 20;
		else if (words >= 5) score += 10;
	}
	
	// Specificity bonus
	if (answer.match(/\d+/)) score += 10; // Contains numbers (specificity)
	if (answer.includes(',') || answer.includes(';')) score += 5; // Lists
	
	return Math.min(100, score);
}

export function getOverallAnswerQuality(answers: Partial<InterviewAnswers>): number {
	const scores: number[] = [];
	
	for (const [key, value] of Object.entries(answers)) {
		if (typeof value === 'string' && value.trim()) {
			scores.push(assessAnswerQuality(key, value));
		} else if (Array.isArray(value) && value.length > 0) {
			scores.push(70); // Arrays are inherently specific
		}
	}
	
	return scores.length > 0 
		? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
		: 0;
}

// ============================================================================
// §6 - QUESTION FLOW MANAGEMENT
// ============================================================================

export function getQuestionsForCategory(category: AIQuestionCategory): AIQuestion[] {
	return AI_QUESTION_BANK.filter(q => q.category === category);
}

export function getNextCategory(completedCategories: AIQuestionCategory[]): AIQuestionCategory | null {
	const categoryOrder: AIQuestionCategory[] = [
		'product_identity',
		'target_audience',
		'core_systems',
		'roles_permissions',
		'safety_privacy',
		'technical',
		'integrations',
		'design',
		'data',
		'testing',
		'monetization',
	];
	
	for (const category of categoryOrder) {
		if (!completedCategories.includes(category)) {
			return category;
		}
	}
	
	return null;
}

export function shouldTriggerFollowUp(questionId: string, answer: string): FollowUpQuestion | null {
	return FOLLOW_UP_QUESTIONS.find(fq => {
		if (fq.parentQuestionId !== questionId) return false;
		const pattern = new RegExp(fq.triggerCondition, 'i');
		return pattern.test(answer);
	}) || null;
}

// ============================================================================
// §7 - INTERVIEW PROGRESS TRACKING
// ============================================================================

export interface InterviewProgress {
	completedQuestions: number;
	totalQuestions: number;
	percentage: number;
	qualityScore: number;
	currentCategory: AIQuestionCategory | null;
	remainingCategories: AIQuestionCategory[];
}

export function calculateProgress(context: InterviewContext): InterviewProgress {
	const answeredQuestions = Object.keys(context.answers).filter(
		key => {
			const value = context.answers[key as keyof InterviewAnswers];
			return value && (typeof value !== 'string' || value.trim() !== '');
		}
	).length;
	
	const requiredQuestions = AI_QUESTION_BANK.filter(q => q.required).length;
	const percentage = Math.round((answeredQuestions / requiredQuestions) * 100);
	
	const currentCategory = getNextCategory(context.completedCategories);
	const allCategories: AIQuestionCategory[] = [
		'product_identity', 'target_audience', 'core_systems', 'roles_permissions',
		'safety_privacy', 'technical', 'integrations', 'design', 'data', 'testing', 'monetization'
	];
	const remainingCategories = allCategories.filter(c => !context.completedCategories.includes(c));
	
	return {
		completedQuestions: answeredQuestions,
		totalQuestions: requiredQuestions,
		percentage: Math.min(100, percentage),
		qualityScore: getOverallAnswerQuality(context.answers),
		currentCategory,
		remainingCategories,
	};
}

// Export types
export type { AIQuestion as Question };
