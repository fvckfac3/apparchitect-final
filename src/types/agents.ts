export type AgentType =
	| 'orchestrator'
	| 'backend'
	| 'frontend'
	| 'database'
	| 'auth'
	| 'payments'
	| 'ai'
	| 'devops'
	| 'qa'
	| 'realtime'
	| 'analytics'
	| 'mobile'
	| 'content'
	| 'storage'
	| 'admin'
	| 'fullstack'
	| 'experience'
	| 'integration'
	| 'documentation';

export interface Agent {
	id: string;
	type: AgentType;
	name: string;
	designation: string;
	role: string;
	responsibilities: string[];
	color: string;
}

export interface AgentConnection {
	from: string;
	to: string;
	label: string;
	interactionId: string;
}

export interface AgentTeam {
	agents: Agent[];
	connections: AgentConnection[];
}

export const AGENT_COLORS: Record<AgentType, string> = {
	orchestrator: 'var(--color-agent-orchestrator)',
	backend: 'var(--color-agent-backend)',
	frontend: 'var(--color-agent-frontend)',
	database: 'var(--color-agent-database)',
	auth: 'var(--color-agent-auth)',
	payments: 'var(--color-agent-payments)',
	ai: 'var(--color-agent-ai)',
	devops: 'var(--color-agent-devops)',
	qa: 'var(--color-agent-qa)',
	realtime: 'var(--color-agent-realtime)',
	analytics: 'var(--color-agent-analytics)',
	mobile: 'var(--color-agent-mobile)',
	content: 'var(--color-cyan-dim)',
	storage: 'var(--color-amber)',
	admin: 'var(--color-text-light)',
	fullstack: 'var(--color-agent-frontend)',
	experience: '#14B8A6',
	integration: '#F97316',
	documentation: '#06B6D4',
};

export const AGENT_LABELS: Record<AgentType, { name: string; designation: string; role: string }> = {
	orchestrator: {
		name: 'Orchestrator Agent',
		designation: 'AGENT-01',
		role: 'Coordination · Sequencing · QA Gating',
	},
	backend: {
		name: 'Backend Agent',
		designation: 'AGENT-02',
		role: 'API · Business Logic · Data Processing',
	},
	frontend: {
		name: 'Frontend Agent',
		designation: 'AGENT-03',
		role: 'UI/UX · Components · Responsive Design',
	},
	database: {
		name: 'Database Agent',
		designation: 'AGENT-04',
		role: 'Schema · Migrations · Query Optimization',
	},
	auth: {
		name: 'Auth & Security Agent',
		designation: 'AGENT-05',
		role: 'Identity · Access Control · Security',
	},
	payments: {
		name: 'Payments Agent',
		designation: 'AGENT-06',
		role: 'Commerce · Subscriptions · Payouts',
	},
	ai: {
		name: 'AI Integration Agent',
		designation: 'AGENT-07',
		role: 'ML Models · Prompts · AI Features',
	},
	devops: {
		name: 'DevOps Agent',
		designation: 'AGENT-08',
		role: 'Deployment · CI/CD · Infrastructure',
	},
	qa: {
		name: 'QA & Testing Agent',
		designation: 'AGENT-09',
		role: 'Testing · Coverage · Quality Gates',
	},
	realtime: {
		name: 'Real-Time Agent',
		designation: 'AGENT-10',
		role: 'WebSockets · Live Updates · Presence',
	},
	analytics: {
		name: 'Analytics Agent',
		designation: 'AGENT-11',
		role: 'Telemetry · Events · Funnels',
	},
	mobile: {
		name: 'Mobile Agent',
		designation: 'AGENT-12',
		role: 'iOS · Android · Native Features',
	},
	content: {
		name: 'Content & SEO Agent',
		designation: 'AGENT-13',
		role: 'SEO · Meta Tags · Content Strategy',
	},
	storage: {
		name: 'Storage Agent',
		designation: 'AGENT-14',
		role: 'File Storage · CDN · Media',
	},
	admin: {
		name: 'Admin Systems Agent',
		designation: 'AGENT-15',
		role: 'Admin Panel · Management · Moderation',
	},
	fullstack: {
		name: 'Full-Stack Agent',
		designation: 'AGENT-FS',
		role: 'Unified App Development',
	},
	experience: {
		name: 'Experience Agent',
		designation: 'AA-UX',
		role: 'Onboarding · Navigation · User Flows',
	},
	integration: {
		name: 'Data Integration Agent',
		designation: 'AA-INT',
		role: 'External Services · Webhooks · APIs',
	},
	documentation: {
		name: 'Documentation Agent',
		designation: 'AA-DOCS',
		role: 'PRD Suite · Docs · Changelog',
	},
};
