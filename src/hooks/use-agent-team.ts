import { useState, useCallback, useMemo } from 'react';
import type { Agent, AgentTeam, AgentConnection, AgentType, InterviewAnswers } from '@/types';
import { AGENT_LABELS, AGENT_COLORS } from '@/types/agents';
import { AGENT_CATALOG, determineRequiredAgents } from '@/data/agent-catalog';

function createAgent(type: AgentType, index: number): Agent {
	// Try to get from catalog first for richer data
	const catalogAgent = AGENT_CATALOG.find(a => a.type === type);
	const labels = AGENT_LABELS[type];
	
	return {
		id: `agent-${type}-${index}`,
		type,
		name: catalogAgent?.name || labels.name,
		designation: catalogAgent?.designation || labels.designation,
		role: catalogAgent?.role || labels.role,
		responsibilities: catalogAgent?.responsibilities || [],
		color: catalogAgent?.color || AGENT_COLORS[type],
	};
}

function determineConnections(agents: Agent[]): AgentConnection[] {
	const connections: AgentConnection[] = [];
	const agentMap = new Map(agents.map((a) => [a.type, a]));
	let interactionId = 1;

	const orchestrator = agentMap.get('orchestrator');
	if (!orchestrator) return connections;

	// Orchestrator connects to all agents
	agents.forEach((agent) => {
		if (agent.type !== 'orchestrator') {
			connections.push({
				from: orchestrator.id,
				to: agent.id,
				label: 'Coordination',
				interactionId: `INT-${String(interactionId++).padStart(3, '0')}`,
			});
		}
	});

	// Backend <-> Database
	if (agentMap.has('backend') && agentMap.has('database')) {
		connections.push({
			from: agentMap.get('backend')!.id,
			to: agentMap.get('database')!.id,
			label: 'Schema Design',
			interactionId: `INT-${String(interactionId++).padStart(3, '0')}`,
		});
	}

	// Frontend <-> Backend
	if (agentMap.has('frontend') && agentMap.has('backend')) {
		connections.push({
			from: agentMap.get('frontend')!.id,
			to: agentMap.get('backend')!.id,
			label: 'API Contract',
			interactionId: `INT-${String(interactionId++).padStart(3, '0')}`,
		});
	}

	// Auth <-> Backend
	if (agentMap.has('auth') && agentMap.has('backend')) {
		connections.push({
			from: agentMap.get('auth')!.id,
			to: agentMap.get('backend')!.id,
			label: 'Auth Middleware',
			interactionId: `INT-${String(interactionId++).padStart(3, '0')}`,
		});
	}

	// Payments <-> Backend
	if (agentMap.has('payments') && agentMap.has('backend')) {
		connections.push({
			from: agentMap.get('payments')!.id,
			to: agentMap.get('backend')!.id,
			label: 'Webhook Handling',
			interactionId: `INT-${String(interactionId++).padStart(3, '0')}`,
		});
	}

	// AI <-> Backend
	if (agentMap.has('ai') && agentMap.has('backend')) {
		connections.push({
			from: agentMap.get('ai')!.id,
			to: agentMap.get('backend')!.id,
			label: 'Data Pipeline',
			interactionId: `INT-${String(interactionId++).padStart(3, '0')}`,
		});
	}

	// QA <-> All (simplified to just a few key ones)
	if (agentMap.has('qa')) {
		const qaAgent = agentMap.get('qa')!;
		['frontend', 'backend'].forEach((targetType) => {
			if (agentMap.has(targetType as AgentType)) {
				connections.push({
					from: qaAgent.id,
					to: agentMap.get(targetType as AgentType)!.id,
					label: 'Quality Gates',
					interactionId: `INT-${String(interactionId++).padStart(3, '0')}`,
				});
			}
		});
	}

	return connections;
}

export function useAgentTeam() {
	const [team, setTeam] = useState<AgentTeam>({ agents: [], connections: [] });
	const [isDesigning, setIsDesigning] = useState(false);

	const designTeam = useCallback((answers: InterviewAnswers) => {
		setIsDesigning(true);

		// Simulate design process with delays for UX
		const agents: Agent[] = [];
		let index = 1;

		// Always add Orchestrator
		agents.push(createAgent('orchestrator', index++));

		// Determine complexity
		const isSimple =
			!answers.hasPayments &&
			!answers.hasRealtime &&
			answers.expectedScale === 'hundreds' &&
			!answers.platforms?.includes('iOS') &&
			!answers.platforms?.includes('Android');

		if (isSimple) {
			// Minimal team for simple apps
			agents.push(createAgent('fullstack', index++));
			agents.push(createAgent('database', index++));
			if (answers.hasAuth) {
				agents.push(createAgent('auth', index++));
			}
			agents.push(createAgent('devops', index++));
			agents.push(createAgent('qa', index++));
		} else {
			// Full team for complex apps
			if (answers.platforms?.includes('Web') || !answers.platforms?.length) {
				agents.push(createAgent('frontend', index++));
			}
			agents.push(createAgent('backend', index++));
			agents.push(createAgent('database', index++));

			if (answers.hasAuth) {
				agents.push(createAgent('auth', index++));
			}

			if (answers.hasPayments) {
				agents.push(createAgent('payments', index++));
			}

			const integrations = typeof answers.externalIntegrations === 'string' ? answers.externalIntegrations.toLowerCase() : '';
			if (
				integrations.includes('openai') ||
				integrations.includes('ai') ||
				integrations.includes('gpt')
			) {
				agents.push(createAgent('ai', index++));
			}

			if (answers.hasRealtime) {
				agents.push(createAgent('realtime', index++));
			}

			if (answers.platforms?.includes('iOS') || answers.platforms?.includes('Android')) {
				agents.push(createAgent('mobile', index++));
			}

			agents.push(createAgent('devops', index++));
			agents.push(createAgent('qa', index++));
		}

		const connections = determineConnections(agents);

		setTimeout(() => {
			setTeam({ agents, connections });
			setIsDesigning(false);
		}, 1500);
	}, []);

	const agentCount = useMemo(() => team.agents.length, [team.agents]);

	return {
		team,
		isDesigning,
		designTeam,
		agentCount,
	};
}
