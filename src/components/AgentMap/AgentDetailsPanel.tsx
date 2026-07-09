import { X, GitBranch, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Agent, AgentTeam } from '@/types';
import { AGENT_LABELS } from '@/types/agents';

interface AgentDetailsPanelProps {
  agent: Agent;
  team: AgentTeam;
  onClose: () => void;
}

function getAgentResponsibilities(agentType: string): string[] {
  switch (agentType) {
    case 'orchestrator':
      return [
      'Coordinate all agent activities',
      'Manage task sequencing and dependencies',
      'Resolve conflicts between agents',
      'Quality gate approvals',
      'Phase transition management'];

    case 'backend':
      return [
      'Design and implement REST/GraphQL APIs',
      'Business logic implementation',
      'Data validation and processing',
      'API documentation',
      'Integration with external services'];

    case 'frontend':
      return [
      'UI component development',
      'Responsive design implementation',
      'State management',
      'API integration',
      'Accessibility compliance'];

    case 'database':
      return [
      'Schema design and optimization',
      'Migration file creation',
      'Index strategy',
      'Query optimization',
      'Data integrity constraints'];

    case 'auth':
      return [
      'Authentication flow implementation',
      'Authorization and RBAC',
      'Session management',
      'Security auditing',
      'OAuth/SSO integration'];

    case 'payments':
      return [
      'Payment processor integration',
      'Subscription management',
      'Webhook handling',
      'Invoice generation',
      'Refund processing'];

    case 'ai':
      return [
      'AI model integration',
      'Prompt engineering',
      'Response processing',
      'Token usage optimization',
      'AI feature implementation'];

    case 'devops':
      return [
      'CI/CD pipeline setup',
      'Infrastructure configuration',
      'Environment management',
      'Deployment automation',
      'Monitoring setup'];

    case 'qa':
      return [
      'Test suite development',
      'Integration testing',
      'E2E testing',
      'Performance testing',
      'Bug triage and reporting'];

    case 'realtime':
      return [
      'WebSocket implementation',
      'Real-time event handling',
      'Presence management',
      'Message queuing',
      'Connection state management'];

    case 'mobile':
      return [
      'Native app development',
      'Platform-specific features',
      'Push notifications',
      'Offline support',
      'App store deployment'];

    default:
      return ['Specialized domain tasks'];
  }
}

function getAgentDosAndDonts(agentType: string): {dos: string[];donts: string[];} {
  const common = {
    dos: [
    'Follow Master Project Context exactly',
    'Signal completion to Orchestrator',
    'Document all decisions',
    'Write tests for all code'],

    donts: [
    'Make unilateral architectural decisions',
    'Bypass Orchestrator coordination',
    'Assume unstated requirements',
    'Skip code review processes']

  };

  return common;
}

export function AgentDetailsPanel({ agent, team, onClose }: AgentDetailsPanelProps) {
  const connections = team.connections.filter((c) => c.from === agent.id || c.to === agent.id);
  const responsibilities = getAgentResponsibilities(agent.type);
  const { dos, donts } = getAgentDosAndDonts(agent.type);

  return (
    <div data-ev-id="ev_c13c2ead27" className="absolute inset-0 bg-surface border-l border-border flex flex-col z-10 overflow-hidden">
			{/* Header */}
			<div data-ev-id="ev_87cc819fd5" className="p-4 border-b border-border flex items-start justify-between">
				<div data-ev-id="ev_20ef3b3ff6" className="flex items-center gap-3">
					<div data-ev-id="ev_6029bdc7b3" className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${agent.color}20`, border: `2px solid ${agent.color}` }}>
						<span data-ev-id="ev_7b6bc7562c" className="font-mono text-[10px] font-bold" style={{ color: agent.color }}>
							{agent.designation.split('-')[1]}
						</span>
					</div>
					<div data-ev-id="ev_97475e0f1f">
						<p data-ev-id="ev_da4da4cf4d" className="font-mono text-[9px] uppercase tracking-[2px]" style={{ color: agent.color }}>
							{agent.designation}
						</p>
						<h3 data-ev-id="ev_29cb2d1349" className="font-display text-[20px] tracking-[3px] text-text-white">{agent.type.toUpperCase()}</h3>
						<p data-ev-id="ev_029f25861f" className="font-mono text-[10px] text-text-slate">{agent.role}</p>
					</div>
				</div>
				<button data-ev-id="ev_d6fe26794f" onClick={onClose} className="p-2 text-text-slate hover:text-text-white transition-colors">
					<X className="w-4 h-4" />
				</button>
			</div>

			{/* Content */}
			<div data-ev-id="ev_14e0cd6e41" className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
				{/* Responsibilities */}
				<div data-ev-id="ev_dada1c69e6">
					<h4 data-ev-id="ev_f17d6afc50" className="font-mono text-[10px] font-bold uppercase tracking-[2px] text-text-light mb-3">
						Primary Responsibilities
					</h4>
					<ul data-ev-id="ev_c3f1dfbc04" className="flex flex-col gap-2">
						{responsibilities.map((resp, i) =>
            <li data-ev-id="ev_287146fbc3" key={i} className="flex items-start gap-2">
								<div data-ev-id="ev_07b9633f70" className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: agent.color }} />
								<span data-ev-id="ev_580ac24491" className="font-mono text-[11px] text-text-warm">{resp}</span>
							</li>
            )}
					</ul>
				</div>

				{/* Collaborations */}
				{connections.length > 0 &&
        <div data-ev-id="ev_6abec19b35">
						<h4 data-ev-id="ev_a6047fdd4f" className="font-mono text-[10px] font-bold uppercase tracking-[2px] text-text-light mb-3 flex items-center gap-2">
							<GitBranch className="w-3 h-3" />
							Collaborations ({connections.length})
						</h4>
						<div data-ev-id="ev_6dbcc7e397" className="flex flex-col gap-2">
							{connections.map((conn) => {
              const otherAgentId = conn.from === agent.id ? conn.to : conn.from;
              const otherAgent = team.agents.find((a) => a.id === otherAgentId);
              const isOutgoing = conn.from === agent.id;

              if (!otherAgent) return null;

              return (
                <div data-ev-id="ev_bf2e41276b" key={conn.interactionId} className="bg-panel border border-border rounded-md p-3">
										<div data-ev-id="ev_c7605aab13" className="flex items-center gap-2 mb-1">
											<span data-ev-id="ev_5578130944" className="font-mono text-[9px] text-text-slate">{conn.interactionId}</span>
											<span data-ev-id="ev_d84a3f1d3b" className="font-mono text-[9px] px-1.5 py-0.5 bg-cyan/10 text-cyan rounded">
												{conn.label}
											</span>
										</div>
										<div data-ev-id="ev_da120b0feb" className="flex items-center gap-2">
											<span data-ev-id="ev_d48ad42336" className="font-mono text-[10px] text-text-white">{agent.designation}</span>
											<ArrowRight className="w-3 h-3 text-cyan" />
											<span data-ev-id="ev_7474bb44da" className="font-mono text-[10px] text-text-white">{otherAgent.designation}</span>
											<span data-ev-id="ev_c917104687" className="font-mono text-[9px] text-text-slate">({otherAgent.name})</span>
										</div>
									</div>);

            })}
						</div>
					</div>
        }

				{/* Do's and Don'ts */}
				<div data-ev-id="ev_60eb30fb85" className="grid grid-cols-2 gap-4">
					<div data-ev-id="ev_8503072aee">
						<h4 data-ev-id="ev_829ac1b7bb" className="font-mono text-[10px] font-bold uppercase tracking-[2px] text-cyan-dim mb-3 flex items-center gap-1">
							<CheckCircle2 className="w-3 h-3" /> Do's
						</h4>
						<ul data-ev-id="ev_c56eeabb9c" className="flex flex-col gap-1.5">
							{dos.map((item, i) =>
              <li data-ev-id="ev_8efe4369a0" key={i} className="font-mono text-[9px] text-text-light">✓ {item}</li>
              )}
						</ul>
					</div>
					<div data-ev-id="ev_4d9bd7e0fc">
						<h4 data-ev-id="ev_a3122a98d7" className="font-mono text-[10px] font-bold uppercase tracking-[2px] text-signal-red mb-3 flex items-center gap-1">
							<AlertCircle className="w-3 h-3" /> Don'ts
						</h4>
						<ul data-ev-id="ev_ef4f02faf4" className="flex flex-col gap-1.5">
							{donts.map((item, i) =>
              <li data-ev-id="ev_092c6b9062" key={i} className="font-mono text-[9px] text-text-light">✗ {item}</li>
              )}
						</ul>
					</div>
				</div>
			</div>
		</div>);

}