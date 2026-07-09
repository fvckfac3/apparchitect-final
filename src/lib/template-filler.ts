/**
 * Deep Template Filler - V2 Compliant
 * 
 * Intelligent answer mapping and template population.
 * Maps interview answers to template placeholders with
 * smart defaults, inference, and validation.
 */

import type { InterviewAnswers } from '@/types/interview';
import type { AgentTeam } from '@/types/agents';

// ============================================================================
// §1 - ANSWER MAPPING CONFIGURATION
// ============================================================================

export interface AnswerMapping {
	placeholder: string;
	source: keyof InterviewAnswers | ((answers: InterviewAnswers, team?: AgentTeam) => string);
	defaultValue: string;
	transform?: (value: string) => string;
	required?: boolean;
}

// Comprehensive answer mappings
const ANSWER_MAPPINGS: AnswerMapping[] = [
	// Product Identity
	{
		placeholder: '[Product Name]',
		source: 'productName',
		defaultValue: 'AppArchitect App',
		required: true,
	},
	{
		placeholder: '[Product Description]',
		source: 'productDescription',
		defaultValue: '[USER-UNSPECIFIED]',
	},
	{
		placeholder: '[Problem Statement]',
		source: 'problemSolved',
		defaultValue: '[USER-UNSPECIFIED]',
	},
	{
		placeholder: '[Unique Value]',
		source: 'uniqueValue',
		defaultValue: '[USER-UNSPECIFIED]',
	},
	{
		placeholder: '[Product Type]',
		source: 'productType',
		defaultValue: 'Web Application',
	},
	
	// Target Audience
	{
		placeholder: '[Primary User]',
		source: 'primaryUser',
		defaultValue: 'End users',
	},
	{
		placeholder: '[User Context]',
		source: 'userContext',
		defaultValue: '[USER-UNSPECIFIED]',
	},
	{
		placeholder: '[Technical Literacy]',
		source: 'technicalLiteracy',
		defaultValue: 'Mixed technical background',
	},
	{
		placeholder: '[Secondary User]',
		source: 'secondaryUser',
		defaultValue: 'N/A',
	},
	
	// Core Principles
	{
		placeholder: '[Core Principles]',
		source: 'corePrinciples',
		defaultValue: 'Simplicity, Reliability, Security',
	},
	{
		placeholder: '[Tradeoffs]',
		source: 'tradeoffs',
		defaultValue: 'Speed over features for MVP',
	},
	
	// Core Systems
	{
		placeholder: '[Core Systems]',
		source: 'coreSystems',
		defaultValue: '[USER-UNSPECIFIED]',
	},
	{
		placeholder: '[User Flows]',
		source: 'userFlows',
		defaultValue: '[USER-UNSPECIFIED]',
	},
	{
		placeholder: '[System States]',
		source: 'systemStates',
		defaultValue: 'idle, loading, success, error',
	},
	
	// Safety & Privacy
	{
		placeholder: '[Data Collected]',
		source: 'dataCollected',
		defaultValue: '[USER-UNSPECIFIED]',
	},
	{
		placeholder: '[Uses AI]',
		source: 'usesAI',
		defaultValue: 'No',
	},
	{
		placeholder: '[Content Moderation]',
		source: 'contentModeration',
		defaultValue: 'N/A',
	},
	{
		placeholder: '[Compliance Requirements]',
		source: (answers) => {
			const val = answers.complianceRequirements;
			if (Array.isArray(val)) return val.join(', ') || 'None specified';
			return val || 'None specified';
		},
		defaultValue: 'None specified',
	},
	
	// Roles & Permissions
	{
		placeholder: '[User Roles]',
		source: 'userRoles',
		defaultValue: 'User, Admin',
	},
	{
		placeholder: '[Role Permissions]',
		source: 'rolePermissions',
		defaultValue: '[USER-UNSPECIFIED]',
	},
	{
		placeholder: '[Tenancy Model]',
		source: 'tenancyModel',
		defaultValue: 'Single-tenant',
	},
	
	// Technical Stack
	{
		placeholder: '[Tech Preferences]',
		source: 'techPreferences',
		defaultValue: 'React, TypeScript, Supabase',
	},
	{
		placeholder: '[Platforms]',
		source: (answers) => {
			const val = answers.platforms;
			if (Array.isArray(val)) return val.join(', ') || 'Web';
			return val || 'Web';
		},
		defaultValue: 'Web',
	},
	{
		placeholder: '[Performance Requirements]',
		source: 'performanceRequirements',
		defaultValue: 'Page load < 3s, API response < 500ms',
	},
	
	// External Integrations
	{
		placeholder: '[External Services]',
		source: 'externalServices',
		defaultValue: 'None specified',
	},
	{
		placeholder: '[Existing Integrations]',
		source: 'existingIntegrations',
		defaultValue: 'None',
	},
	{
		placeholder: '[Expose API]',
		source: 'exposeAPI',
		defaultValue: 'No',
	},
	
	// UI & Design
	{
		placeholder: '[Visual Style]',
		source: 'visualStyle',
		defaultValue: 'Modern, clean, professional',
	},
	{
		placeholder: '[Brand Colors]',
		source: 'brandColors',
		defaultValue: '#00E5CC (Cyan), #252A3A (Dark)',
	},
	{
		placeholder: '[Key Screens]',
		source: 'keyScreens',
		defaultValue: '[USER-UNSPECIFIED]',
	},
	{
		placeholder: '[Accessibility]',
		source: 'accessibility',
		defaultValue: 'WCAG 2.1 AA compliance',
	},
	
	// Database & Data
	{
		placeholder: '[Data Entities]',
		source: 'dataEntities',
		defaultValue: '[USER-UNSPECIFIED]',
	},
	{
		placeholder: '[Entity Relationships]',
		source: 'entityRelationships',
		defaultValue: '[USER-UNSPECIFIED]',
	},
	{
		placeholder: '[Special Data Requirements]',
		source: 'specialDataRequirements',
		defaultValue: 'None',
	},
	
	// Error Handling
	{
		placeholder: '[Critical Failures]',
		source: 'criticalFailures',
		defaultValue: 'Authentication failure, Data loss, System crash',
	},
	{
		placeholder: '[Error Communication]',
		source: 'errorCommunication',
		defaultValue: 'User-friendly messages with retry options',
	},
	
	// Testing & Quality
	{
		placeholder: '[Testing Priorities]',
		source: 'testingPriorities',
		defaultValue: 'Core functionality, Security, Performance',
	},
	{
		placeholder: '[Testing Approach]',
		source: (answers) => {
			const val = answers.testingApproach;
			if (Array.isArray(val)) return val.join(', ') || 'Unit tests, Integration tests';
			return val || 'Unit tests, Integration tests';
		},
		defaultValue: 'Unit tests, Integration tests',
	},
	
	// Monetization
	{
		placeholder: '[Business Model]',
		source: 'businessModel',
		defaultValue: '[USER-UNSPECIFIED]',
	},
	{
		placeholder: '[Pricing Tiers]',
		source: 'pricingTiers',
		defaultValue: 'Free, Pro, Enterprise',
	},
	{
		placeholder: '[Gated Features]',
		source: 'gatedFeatures',
		defaultValue: '[USER-UNSPECIFIED]',
	},
];

// ============================================================================
// §2 - SMART DEFAULTS & INFERENCE
// ============================================================================

export interface InferenceRule {
	condition: (answers: InterviewAnswers) => boolean;
	inferences: Partial<InterviewAnswers>;
}

const INFERENCE_RULES: InferenceRule[] = [
	// If AI is used, infer content moderation
	{
		condition: (a) => a.usesAI?.toLowerCase().includes('yes') ?? false,
		inferences: {
			contentModeration: 'AI output filtering, Hallucination prevention',
		},
	},
	// If multi-tenant, infer isolation requirements
	{
		condition: (a) => a.tenancyModel?.toLowerCase().includes('multi') ?? false,
		inferences: {
			specialDataRequirements: 'Tenant isolation, Row-level security',
		},
	},
	// If payments mentioned, infer compliance
	{
		condition: (a) => 
			(a.businessModel?.toLowerCase().includes('subscription') ||
			a.externalServices?.toLowerCase().includes('stripe')) ?? false,
		inferences: {
			complianceRequirements: ['PCI-DSS'],
		},
	},
	// If health data mentioned, infer HIPAA
	{
		condition: (a) => 
			(a.dataCollected?.toLowerCase().includes('health') ||
			a.productType?.toLowerCase().includes('health')) ?? false,
		inferences: {
			complianceRequirements: ['HIPAA'],
		},
	},
	// If mobile platform, infer responsive design
	{
		condition: (a) => {
			const val = a.platforms;
			if (Array.isArray(val)) return val.some(p => p.toLowerCase().includes('mobile'));
			return typeof val === 'string' && val.toLowerCase().includes('mobile');
		},
		inferences: {
			accessibility: 'Mobile-first, responsive design, WCAG 2.1 AA',
		},
	},
];

// Apply inference rules
export function applyInferences(answers: InterviewAnswers): InterviewAnswers {
	const enhanced = { ...answers };
	
	for (const rule of INFERENCE_RULES) {
		if (rule.condition(answers)) {
			for (const [key, value] of Object.entries(rule.inferences)) {
				const k = key as keyof InterviewAnswers;
				// Only apply if not already set
				if (!enhanced[k] || enhanced[k] === '[USER-UNSPECIFIED]') {
					(enhanced as Record<string, unknown>)[k] = value;
				}
			}
		}
	}
	
	return enhanced;
}

// ============================================================================
// §3 - TEMPLATE FILLING
// ============================================================================

export interface FillResult {
	content: string;
	replacements: number;
	unfilled: string[];
	inferred: string[];
}

// Get resolved value for a placeholder
function resolveValue(
	mapping: AnswerMapping,
	answers: InterviewAnswers,
	team?: AgentTeam
): string {
	let value: string;
	
	if (typeof mapping.source === 'function') {
		value = mapping.source(answers, team);
	} else {
		value = (answers[mapping.source] as string) || '';
	}
	
	// Apply transform if provided
	if (mapping.transform && value) {
		value = mapping.transform(value);
	}
	
	// Use default if empty
	if (!value || value.trim() === '') {
		value = mapping.defaultValue;
	}
	
	return value;
}

// Fill a template with answers
export function fillTemplate(
	template: string,
	answers: InterviewAnswers,
	team?: AgentTeam
): FillResult {
	let content = template;
	let replacements = 0;
	const unfilled: string[] = [];
	const inferred: string[] = [];
	
	// Apply inferences first
	const enhancedAnswers = applyInferences(answers);
	
	// Track which fields were inferred
	for (const key of Object.keys(enhancedAnswers) as (keyof InterviewAnswers)[]) {
		if (enhancedAnswers[key] !== answers[key]) {
			inferred.push(key);
		}
	}
	
	// Apply all mappings
	for (const mapping of ANSWER_MAPPINGS) {
		const value = resolveValue(mapping, enhancedAnswers, team);
		
		if (content.includes(mapping.placeholder)) {
			content = content.split(mapping.placeholder).join(value);
			replacements++;
			
			if (value === '[USER-UNSPECIFIED]') {
				unfilled.push(mapping.placeholder);
			}
		}
	}
	
	// Dynamic placeholders not in standard mappings
	// Handle date placeholders
	content = content.replace(/\[Current Date\]/g, new Date().toISOString().split('T')[0]);
	content = content.replace(/\[Generation Date\]/g, new Date().toISOString());
	
	// Handle team-related placeholders
	if (team) {
		content = content.replace(/\[Agent Count\]/g, String(team.agents.length));
		content = content.replace(/\[Agent List\]/g, 
			team.agents.map(a => a.name).join(', ')
		);
	}
	
	return {
		content,
		replacements,
		unfilled: [...new Set(unfilled)],
		inferred,
	};
}

// ============================================================================
// §4 - BATCH TEMPLATE FILLING
// ============================================================================

export interface BatchFillResult {
	documents: Map<string, string>;
	totalReplacements: number;
	unfilledByDocument: Map<string, string[]>;
	inferredFields: string[];
}

export function fillTemplates(
	templates: Map<string, string>,
	answers: InterviewAnswers,
	team?: AgentTeam
): BatchFillResult {
	const documents = new Map<string, string>();
	const unfilledByDocument = new Map<string, string[]>();
	let totalReplacements = 0;
	const allInferred = new Set<string>();
	
	for (const [id, template] of templates.entries()) {
		const result = fillTemplate(template, answers, team);
		documents.set(id, result.content);
		unfilledByDocument.set(id, result.unfilled);
		totalReplacements += result.replacements;
		result.inferred.forEach(f => allInferred.add(f));
	}
	
	return {
		documents,
		totalReplacements,
		unfilledByDocument,
		inferredFields: Array.from(allInferred),
	};
}

// ============================================================================
// §5 - ANSWER COMPLETENESS CHECK
// ============================================================================

export interface CompletenessResult {
	score: number; // 0-100
	missing: string[];
	partial: string[];
	complete: string[];
	recommendations: string[];
}

export function checkAnswerCompleteness(answers: InterviewAnswers): CompletenessResult {
	const missing: string[] = [];
	const partial: string[] = [];
	const complete: string[] = [];
	const recommendations: string[] = [];
	
	const requiredFields: (keyof InterviewAnswers)[] = [
		'productName',
		'productDescription',
		'problemSolved',
		'primaryUser',
		'coreSystems',
		'userRoles',
		'dataEntities',
	];
	
	const optionalFields: (keyof InterviewAnswers)[] = [
		'uniqueValue',
		'userContext',
		'techPreferences',
		'visualStyle',
		'businessModel',
	];
	
	// Check required fields
	for (const field of requiredFields) {
		const value = answers[field];
		if (!value || value === '[USER-UNSPECIFIED]') {
			missing.push(field);
		} else if (typeof value === 'string' && value.length < 20) {
			partial.push(field);
		} else {
			complete.push(field);
		}
	}
	
	// Check optional fields
	for (const field of optionalFields) {
		const value = answers[field];
		if (value && value !== '[USER-UNSPECIFIED]') {
			complete.push(field);
		}
	}
	
	// Generate recommendations
	if (missing.includes('productDescription')) {
		recommendations.push('Provide a detailed product description for better PRD generation');
	}
	if (missing.includes('coreSystems')) {
		recommendations.push('Define core systems and features to guide technical architecture');
	}
	if (missing.includes('dataEntities')) {
		recommendations.push('Describe data entities for accurate database schema generation');
	}
	
	// Calculate score
	const totalRequired = requiredFields.length;
	const completedRequired = requiredFields.filter(f => complete.includes(f)).length;
	const partialRequired = requiredFields.filter(f => partial.includes(f)).length;
	
	const score = Math.round(
		((completedRequired + partialRequired * 0.5) / totalRequired) * 100
	);
	
	return {
		score,
		missing,
		partial,
		complete,
		recommendations,
	};
}

// Export mappings for external use
export { ANSWER_MAPPINGS, INFERENCE_RULES };
