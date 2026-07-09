/**
 * Agent Catalog
 * 
 * Based on Core Systems PRD §6 - Agent Team Synthesizer
 * Canonical 14-agent menu for team composition
 */

import type { AgentType } from '@/types/agents';

export interface AgentDefinition {
	id: string;
	type: AgentType;
	name: string;
	designation: string;
	role: string;
	capabilities: string[];
	responsibilities: string[];
	outOfScope: string[];
	dependsOn: AgentType[];
	requiredFor: string[]; // Feature patterns that require this agent
	color: string;
}

export const AGENT_CATALOG: AgentDefinition[] = [
	{
		id: '00',
		type: 'orchestrator',
		name: 'Orchestrator Agent',
		designation: 'AA-ORCH',
		role: 'Project-wide coordination, sequencing, conflict resolution, and quality gating',
		capabilities: [
			'Maintain master task graph',
			'Sequence agent work based on dependencies',
			'Enforce PRD precedence at handoffs',
			'Resolve agent overlaps and conflicts',
			'Gate phase transitions on audit reports',
		],
		responsibilities: [
			'Coordinates all other agents',
			'Enforces quality gates',
			'Resolves conflicts',
			'Maintains decision log',
		],
		outOfScope: [
			'Writing production code',
			'Writing user-facing copy',
			'Modifying PRD documents',
			'Running tests directly',
		],
		dependsOn: [],
		requiredFor: ['*'], // Always required
		color: '#00E5CC',
	},
	{
		id: '01',
		type: 'frontend',
		name: 'Frontend Agent',
		designation: 'AA-FE',
		role: 'Builds all user interface components and screens',
		capabilities: [
			'React/Next.js component development',
			'Responsive layout implementation',
			'Design system application',
			'State management',
			'Accessibility compliance',
		],
		responsibilities: [
			'Implements all UI screens',
			'Applies design tokens',
			'Handles client-side state',
			'Ensures responsive behavior',
		],
		outOfScope: [
			'API implementation',
			'Database queries',
			'Business logic',
		],
		dependsOn: ['orchestrator'],
		requiredFor: ['web app', 'ui', 'interface', 'screen', 'page'],
		color: '#3B82F6',
	},
	{
		id: '02',
		type: 'backend',
		name: 'Backend Agent',
		designation: 'AA-BE',
		role: 'Implements API routes, business logic, and orchestration',
		capabilities: [
			'API route implementation',
			'Business logic',
			'Input validation',
			'Error handling',
			'Service orchestration',
		],
		responsibilities: [
			'Implements all API endpoints',
			'Validates inputs',
			'Handles errors',
			'Orchestrates services',
		],
		outOfScope: [
			'UI components',
			'Database schema design',
			'Infrastructure setup',
		],
		dependsOn: ['orchestrator', 'database'],
		requiredFor: ['api', 'backend', 'server', 'business logic'],
		color: '#10B981',
	},
	{
		id: '03',
		type: 'database',
		name: 'Database Agent',
		designation: 'AA-DB',
		role: 'Designs schema, migrations, RLS policies, and seed data',
		capabilities: [
			'Schema design',
			'Migration creation',
			'RLS policy implementation',
			'Seed data generation',
			'Query optimization',
		],
		responsibilities: [
			'Designs database schema',
			'Creates migrations',
			'Implements RLS',
			'Provides seed data',
		],
		outOfScope: [
			'API implementation',
			'UI components',
			'Business logic',
		],
		dependsOn: ['orchestrator'],
		requiredFor: ['database', 'data', 'storage', 'persistence'],
		color: '#8B5CF6',
	},
	{
		id: '04',
		type: 'auth',
		name: 'Auth & Security Agent',
		designation: 'AA-AUTH',
		role: 'Implements authentication, authorization, and security measures',
		capabilities: [
			'Auth flow implementation',
			'Permission enforcement',
			'Secret management',
			'Security scanning',
			'Rate limiting',
		],
		responsibilities: [
			'Implements auth flows',
			'Enforces permissions',
			'Manages secrets',
			'Security headers',
		],
		outOfScope: [
			'UI components',
			'Business logic',
			'Database schema',
		],
		dependsOn: ['orchestrator', 'database'],
		requiredFor: ['auth', 'login', 'signup', 'permission', 'role', 'security'],
		color: '#EF4444',
	},
	{
		id: '05',
		type: 'ai',
		name: 'AI Integration Agent',
		designation: 'AA-AI',
		role: 'Integrates LLM/AI capabilities with validation and safety',
		capabilities: [
			'LLM integration',
			'Prompt construction',
			'Response validation',
			'Schema enforcement',
			'Fallback handling',
		],
		responsibilities: [
			'Integrates AI providers',
			'Constructs prompts',
			'Validates responses',
			'Handles AI errors',
		],
		outOfScope: [
			'UI components',
			'Database operations',
			'Non-AI business logic',
		],
		dependsOn: ['orchestrator', 'backend'],
		requiredFor: ['ai', 'llm', 'gpt', 'claude', 'machine learning', 'generate'],
		color: '#F59E0B',
	},
	{
		id: '06',
		type: 'devops',
		name: 'DevOps Agent',
		designation: 'AA-DEVOPS',
		role: 'Sets up deployment, CI/CD, environments, and monitoring',
		capabilities: [
			'CI/CD pipeline setup',
			'Environment configuration',
			'Deployment automation',
			'Monitoring setup',
			'Secret rotation',
		],
		responsibilities: [
			'Sets up CI/CD',
			'Configures environments',
			'Automates deployment',
			'Sets up monitoring',
		],
		outOfScope: [
			'Application code',
			'UI components',
			'Business logic',
		],
		dependsOn: ['orchestrator'],
		requiredFor: ['deploy', 'ci/cd', 'infrastructure', 'monitoring'],
		color: '#6366F1',
	},
	{
		id: '07',
		type: 'qa',
		name: 'QA Agent',
		designation: 'AA-QA',
		role: 'Runs tests, compliance checks, and audit reports',
		capabilities: [
			'Unit test execution',
			'Integration testing',
			'E2E testing',
			'PRD compliance audits',
			'Bug reporting',
		],
		responsibilities: [
			'Runs all test suites',
			'Verifies PRD compliance',
			'Reports bugs',
			'Gates releases',
		],
		outOfScope: [
			'Writing application code',
			'UI components',
			'Fixing bugs',
		],
		dependsOn: ['orchestrator', 'frontend', 'backend'],
		requiredFor: ['test', 'qa', 'quality', 'verification'],
		color: '#EC4899',
	},
	{
		id: '08',
		type: 'experience',
		name: 'Experience Agent',
		designation: 'AA-UX',
		role: 'Implements onboarding, navigation, and user experience flows',
		capabilities: [
			'Onboarding flow implementation',
			'Navigation design',
			'User journey optimization',
			'Accessibility',
			'Responsive behavior',
		],
		responsibilities: [
			'Implements onboarding',
			'Designs navigation',
			'Optimizes UX',
			'Ensures accessibility',
		],
		outOfScope: [
			'Backend logic',
			'Database design',
			'Infrastructure',
		],
		dependsOn: ['orchestrator', 'frontend'],
		requiredFor: ['onboarding', 'ux', 'user experience', 'navigation'],
		color: '#14B8A6',
	},
	{
		id: '09',
		type: 'integration',
		name: 'Data Integration Agent',
		designation: 'AA-INT',
		role: 'Integrates external services, webhooks, and APIs',
		capabilities: [
			'Third-party API integration',
			'Webhook handling',
			'Data transformation',
			'Error handling',
			'Retry logic',
		],
		responsibilities: [
			'Integrates external services',
			'Handles webhooks',
			'Transforms data',
			'Manages API credentials',
		],
		outOfScope: [
			'UI components',
			'Core business logic',
			'Database schema',
		],
		dependsOn: ['orchestrator', 'backend'],
		requiredFor: ['integration', 'webhook', 'stripe', 'payment', 'email', 'sms'],
		color: '#F97316',
	},
	{
		id: '10',
		type: 'content',
		name: 'Content & Design Agent',
		designation: 'AA-CONTENT',
		role: 'Manages copy registry, design tokens, and component library',
		capabilities: [
			'Copy registry management',
			'Design token implementation',
			'Component variants',
			'Internationalization',
			'Brand consistency',
		],
		responsibilities: [
			'Maintains copy registry',
			'Implements design tokens',
			'Creates component variants',
			'Ensures brand consistency',
		],
		outOfScope: [
			'Backend logic',
			'Database operations',
			'Infrastructure',
		],
		dependsOn: ['orchestrator', 'frontend'],
		requiredFor: ['design', 'copy', 'content', 'brand', 'style'],
		color: '#A855F7',
	},
	{
		id: '11',
		type: 'documentation',
		name: 'Documentation Agent',
		designation: 'AA-DOCS',
		role: 'Produces and maintains PRD suite and documentation',
		capabilities: [
			'PRD generation',
			'Documentation writing',
			'Changelog maintenance',
			'Cross-doc validation',
			'Template management',
		],
		responsibilities: [
			'Generates PRD suite',
			'Maintains documentation',
			'Validates consistency',
			'Updates changelog',
		],
		outOfScope: [
			'Application code',
			'UI components',
			'Database operations',
		],
		dependsOn: ['orchestrator'],
		requiredFor: ['*'], // Always required for PRD suite
		color: '#06B6D4',
	},
	{
		id: '12',
		type: 'realtime',
		name: 'Real-Time Agent',
		designation: 'AA-RT',
		role: 'Implements real-time features like WebSockets and live updates',
		capabilities: [
			'WebSocket implementation',
			'Real-time subscriptions',
			'Presence tracking',
			'Live collaboration',
			'Push notifications',
		],
		responsibilities: [
			'Implements real-time features',
			'Manages subscriptions',
			'Handles presence',
			'Sends notifications',
		],
		outOfScope: [
			'REST API',
			'Database schema',
			'UI components',
		],
		dependsOn: ['orchestrator', 'backend'],
		requiredFor: ['realtime', 'live', 'websocket', 'notification', 'chat', 'collaboration'],
		color: '#84CC16',
	},
	{
		id: '13',
		type: 'analytics',
		name: 'Analytics Agent',
		designation: 'AA-ANALYTICS',
		role: 'Implements product analytics, event tracking, and reporting',
		capabilities: [
			'Event tracking setup',
			'Analytics integration',
			'Dashboard creation',
			'Conversion tracking',
			'A/B testing',
		],
		responsibilities: [
			'Sets up event tracking',
			'Integrates analytics tools',
			'Creates dashboards',
			'Tracks conversions',
		],
		outOfScope: [
			'Application features',
			'UI components',
			'Database design',
		],
		dependsOn: ['orchestrator', 'frontend'],
		requiredFor: ['analytics', 'tracking', 'metrics', 'dashboard', 'reporting'],
		color: '#0EA5E9',
	},
];

// Get agent by type
export function getAgentByType(type: AgentType): AgentDefinition | undefined {
	return AGENT_CATALOG.find(a => a.type === type);
}

// Determine required agents based on features
export function determineRequiredAgents(features: string[]): AgentDefinition[] {
	const requiredTypes = new Set<AgentType>();
	
	// Always include orchestrator and documentation
	requiredTypes.add('orchestrator');
	requiredTypes.add('documentation');
	
	// Check each feature against agent requirements
	const featuresLower = features.map(f => f.toLowerCase()).join(' ');
	
	for (const agent of AGENT_CATALOG) {
		for (const pattern of agent.requiredFor) {
			if (pattern === '*' || featuresLower.includes(pattern)) {
				requiredTypes.add(agent.type);
				// Also add dependencies
				for (const dep of agent.dependsOn) {
					requiredTypes.add(dep);
				}
				break;
			}
		}
	}
	
	return AGENT_CATALOG.filter(a => requiredTypes.has(a.type));
}
