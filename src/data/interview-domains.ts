/**
 * Interview Domains Configuration
 * 
 * Based on Core Systems PRD §3 - Adaptive Interview Engine
 * Covers 13 domains across 4 rounds of questioning
 */

export interface DomainQuestion {
	id: string;
	text: string;
	helpText?: string;
	required: boolean;
	type: 'text' | 'multiline' | 'choice' | 'multi-choice';
	options?: string[];
	defaultValue?: string;
	followUpTrigger?: (answer: string) => boolean;
	followUpQuestions?: DomainQuestion[];
}

export interface InterviewDomain {
	id: number;
	name: string;
	description: string;
	round: 1 | 2 | 3 | 4;
	questions: DomainQuestion[];
}

export const INTERVIEW_DOMAINS: InterviewDomain[] = [
	// ROUND 1: Concept Foundation
	{
		id: 1,
		name: 'Product Identity',
		description: 'Define what your product is and what makes it unique',
		round: 1,
		questions: [
			{
				id: '1.1',
				text: 'What is your product called?',
				helpText: 'The name users will know it by',
				required: true,
				type: 'text',
			},
			{
				id: '1.2',
				text: 'Describe your product in one sentence.',
				helpText: 'What does it do and who is it for?',
				required: true,
				type: 'text',
			},
			{
				id: '1.3',
				text: 'What problem does it solve?',
				helpText: 'The pain point you are addressing',
				required: true,
				type: 'multiline',
			},
			{
				id: '1.4',
				text: 'What type of product is this?',
				required: true,
				type: 'choice',
				options: ['Web App', 'Mobile App', 'Desktop App', 'API/Service', 'Platform', 'Marketplace', 'SaaS Tool'],
			},
			{
				id: '1.5',
				text: 'What makes your product different from alternatives?',
				helpText: 'Your unique value proposition',
				required: true,
				type: 'multiline',
			},
		],
	},
	{
		id: 2,
		name: 'Target Audience',
		description: 'Define who will use your product',
		round: 1,
		questions: [
			{
				id: '2.1',
				text: 'Who is your primary user?',
				helpText: 'Describe your ideal user in one sentence',
				required: true,
				type: 'text',
			},
			{
				id: '2.2',
				text: 'What is their context when using your product?',
				helpText: 'Where, when, and why they use it',
				required: true,
				type: 'multiline',
			},
			{
				id: '2.3',
				text: 'What is their technical literacy level?',
				required: true,
				type: 'choice',
				options: ['Non-technical', 'Basic', 'Intermediate', 'Technical', 'Expert/Developer'],
			},
			{
				id: '2.4',
				text: 'Do you have a secondary user type?',
				helpText: 'Leave blank if not applicable',
				required: false,
				type: 'text',
			},
		],
	},
	{
		id: 3,
		name: 'Core Principles',
		description: 'Define the guiding principles for product decisions',
		round: 1,
		questions: [
			{
				id: '3.1',
				text: 'What are the 3-5 core principles that should guide all decisions?',
				helpText: 'e.g., "Speed over features", "Privacy first", "Simple over complex"',
				required: true,
				type: 'multiline',
			},
			{
				id: '3.2',
				text: 'What trade-offs are you willing to make?',
				helpText: 'What would you sacrifice for your core principles?',
				required: true,
				type: 'multiline',
			},
		],
	},

	// ROUND 2: Feature Scope
	{
		id: 4,
		name: 'Core Systems',
		description: 'Define the major functional systems',
		round: 2,
		questions: [
			{
				id: '4.1',
				text: 'What are the 3-5 core systems or features?',
				helpText: 'The main functional areas (e.g., User Management, Content Editor, Analytics)',
				required: true,
				type: 'multiline',
			},
			{
				id: '4.2',
				text: 'For each system, what is the user flow?',
				helpText: 'Describe the step-by-step user journey through each system',
				required: true,
				type: 'multiline',
			},
			{
				id: '4.3',
				text: 'What states can each system be in?',
				helpText: 'e.g., Loading, Active, Error, Complete',
				required: true,
				type: 'multiline',
			},
		],
	},
	{
		id: 5,
		name: 'Safety & Privacy',
		description: 'Define safety, privacy, and compliance requirements',
		round: 2,
		questions: [
			{
				id: '5.1',
				text: 'What user data do you collect?',
				helpText: 'List all data types (email, name, payment info, etc.)',
				required: true,
				type: 'multiline',
			},
			{
				id: '5.2',
				text: 'Are there compliance requirements?',
				required: true,
				type: 'multi-choice',
				options: ['GDPR', 'CCPA', 'HIPAA', 'SOC2', 'PCI-DSS', 'None/Unknown'],
			},
			{
				id: '5.3',
				text: 'Does your product use AI/LLMs?',
				required: true,
				type: 'choice',
				options: ['Yes - Core feature', 'Yes - Supporting feature', 'No', 'Considering it'],
			},
			{
				id: '5.4',
				text: 'What content moderation is needed?',
				helpText: 'How do you handle harmful content, spam, or abuse?',
				required: false,
				type: 'multiline',
			},
		],
	},
	{
		id: 6,
		name: 'Roles & Permissions',
		description: 'Define user roles and access control',
		round: 2,
		questions: [
			{
				id: '6.1',
				text: 'What user roles exist?',
				helpText: 'e.g., Owner, Admin, Member, Viewer, Guest',
				required: true,
				type: 'multiline',
			},
			{
				id: '6.2',
				text: 'What can each role do?',
				helpText: 'List permissions for each role',
				required: true,
				type: 'multiline',
			},
			{
				id: '6.3',
				text: 'Is this single-user or multi-tenant?',
				required: true,
				type: 'choice',
				options: ['Single user (personal app)', 'Multi-user (shared workspace)', 'Multi-tenant (separate organizations)'],
			},
		],
	},

	// ROUND 3: Technical & Business Context
	{
		id: 7,
		name: 'Technical Stack',
		description: 'Define technology preferences and constraints',
		round: 3,
		questions: [
			{
				id: '7.1',
				text: 'Do you have technology preferences?',
				helpText: 'Frameworks, languages, or platforms you want to use',
				required: false,
				type: 'multiline',
				defaultValue: '[USER-UNSPECIFIED — RECOMMENDED DEFAULT APPLIED]: React + TypeScript + Supabase',
			},
			{
				id: '7.2',
				text: 'What platforms must it support?',
				required: true,
				type: 'multi-choice',
				options: ['Web (Desktop)', 'Web (Mobile)', 'iOS App', 'Android App', 'Desktop App', 'API Only'],
			},
			{
				id: '7.3',
				text: 'What are your performance requirements?',
				helpText: 'Expected load, response times, uptime needs',
				required: false,
				type: 'multiline',
			},
		],
	},
	{
		id: 8,
		name: 'External Integrations',
		description: 'Define third-party services and APIs',
		round: 3,
		questions: [
			{
				id: '8.1',
				text: 'What external services do you need?',
				helpText: 'e.g., Stripe for payments, SendGrid for email, etc.',
				required: true,
				type: 'multiline',
			},
			{
				id: '8.2',
				text: 'Do you need to integrate with existing systems?',
				helpText: 'CRMs, ERPs, other tools your users already use',
				required: false,
				type: 'multiline',
			},
			{
				id: '8.3',
				text: 'Will you expose an API for others?',
				required: true,
				type: 'choice',
				options: ['Yes - Public API', 'Yes - Partner API only', 'No', 'Maybe later'],
			},
		],
	},
	{
		id: 9,
		name: 'UI & Design',
		description: 'Define visual and interaction requirements',
		round: 3,
		questions: [
			{
				id: '9.1',
				text: 'What is the visual style?',
				helpText: 'e.g., Minimal, Professional, Playful, Dark mode, etc.',
				required: true,
				type: 'text',
			},
			{
				id: '9.2',
				text: 'Do you have brand colors or fonts?',
				helpText: 'Hex codes, font names, or leave blank for defaults',
				required: false,
				type: 'multiline',
			},
			{
				id: '9.3',
				text: 'What are the key screens?',
				helpText: 'List the main pages/views users will see',
				required: true,
				type: 'multiline',
			},
			{
				id: '9.4',
				text: 'Any accessibility requirements?',
				required: true,
				type: 'choice',
				options: ['WCAG AA (standard)', 'WCAG AAA (strict)', 'Basic accessibility', 'Not a priority'],
			},
		],
	},

	// ROUND 4: Depth Probing
	{
		id: 10,
		name: 'Database & Data',
		description: 'Define data models and storage needs',
		round: 4,
		questions: [
			{
				id: '10.1',
				text: 'What are the main data entities?',
				helpText: 'e.g., Users, Projects, Tasks, Comments',
				required: true,
				type: 'multiline',
			},
			{
				id: '10.2',
				text: 'What relationships exist between entities?',
				helpText: 'e.g., Users have many Projects, Projects have many Tasks',
				required: true,
				type: 'multiline',
			},
			{
				id: '10.3',
				text: 'Any special data requirements?',
				helpText: 'Real-time sync, file storage, search, analytics, etc.',
				required: false,
				type: 'multiline',
			},
		],
	},
	{
		id: 11,
		name: 'Error Handling',
		description: 'Define error states and recovery',
		round: 4,
		questions: [
			{
				id: '11.1',
				text: 'What are the critical failure scenarios?',
				helpText: 'What could go wrong that would seriously impact users?',
				required: true,
				type: 'multiline',
			},
			{
				id: '11.2',
				text: 'How should errors be communicated to users?',
				helpText: 'Tone, detail level, recovery guidance',
				required: false,
				type: 'multiline',
				defaultValue: '[USER-UNSPECIFIED — RECOMMENDED DEFAULT APPLIED]: Clear, non-technical messages with actionable recovery steps',
			},
		],
	},
	{
		id: 12,
		name: 'Testing & Quality',
		description: 'Define testing and quality requirements',
		round: 4,
		questions: [
			{
				id: '12.1',
				text: 'What must be tested thoroughly?',
				helpText: 'Critical paths, edge cases, security scenarios',
				required: true,
				type: 'multiline',
			},
			{
				id: '12.2',
				text: 'What testing approach do you prefer?',
				required: true,
				type: 'multi-choice',
				options: ['Unit tests', 'Integration tests', 'E2E tests', 'Manual QA', 'All of the above'],
			},
		],
	},
	{
		id: 13,
		name: 'Monetization',
		description: 'Define business model and pricing',
		round: 4,
		questions: [
			{
				id: '13.1',
				text: 'What is the business model?',
				required: true,
				type: 'choice',
				options: ['Free', 'Freemium', 'Subscription', 'One-time purchase', 'Usage-based', 'Marketplace/Commission', 'Enterprise sales'],
			},
			{
				id: '13.2',
				text: 'If paid, what are the pricing tiers?',
				helpText: 'Describe each tier and what it includes',
				required: false,
				type: 'multiline',
			},
			{
				id: '13.3',
				text: 'What features are gated behind payment?',
				helpText: 'What do free users get vs. paid users?',
				required: false,
				type: 'multiline',
			},
		],
	},
];

// Interview round labels
export const INTERVIEW_ROUNDS = {
	1: { name: 'Concept Foundation', description: 'Define your product identity, audience, and principles' },
	2: { name: 'Feature Scope', description: 'Detail core systems, safety, and permissions' },
	3: { name: 'Technical Context', description: 'Specify technology, integrations, and design' },
	4: { name: 'Depth Probing', description: 'Data models, errors, testing, and monetization' },
} as const;

// Helper to get total questions count
export function getTotalQuestions(): number {
	return INTERVIEW_DOMAINS.reduce((sum, domain) => sum + domain.questions.length, 0);
}

// Helper to get questions by round
export function getQuestionsByRound(round: 1 | 2 | 3 | 4): DomainQuestion[] {
	return INTERVIEW_DOMAINS.filter((d) => d.round === round).flatMap((d) => d.questions);
}

// Helper to get domain by ID
export function getDomainById(id: number): InterviewDomain | undefined {
	return INTERVIEW_DOMAINS.find((d) => d.id === id);
}
