import { useState, useMemo } from 'react';
import { AgentNode } from './AgentNode';
import { AgentConnection } from './AgentConnection';
import { AgentDetailsPanel } from './AgentDetailsPanel';
import type { AgentTeam, Agent } from '@/types';

interface AgentMapPanelProps {
  team: AgentTeam;
  isDesigning?: boolean;
}

export function AgentMapPanel({ team, isDesigning }: AgentMapPanelProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const selectedAgent = team.agents.find((a) => a.id === selectedAgentId) || null;

  // Calculate positions in a radial layout with more space
  const positions = useMemo(() => {
    const centerX = 220;
    const centerY = 180;
    const radius = 130;

    const posMap: Record<string, {x: number;y: number;}> = {};

    // Orchestrator at center
    const orchestrator = team.agents.find((a) => a.type === 'orchestrator');
    if (orchestrator) {
      posMap[orchestrator.id] = { x: centerX, y: centerY };
    }

    // Other agents in a circle
    const otherAgents = team.agents.filter((a) => a.type !== 'orchestrator');
    otherAgents.forEach((agent, index) => {
      const angle = index * 2 * Math.PI / otherAgents.length - Math.PI / 2;
      posMap[agent.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    return posMap;
  }, [team.agents]);

  const handleAgentClick = (agent: Agent) => {
    if (selectedAgentId === agent.id) {
      setShowDetails(true);
    } else {
      setSelectedAgentId(agent.id);
    }
  };

  const handleAgentDoubleClick = (agent: Agent) => {
    setSelectedAgentId(agent.id);
    setShowDetails(true);
  };

  if (isDesigning) {
    return (
      <div data-ev-id="ev_6ffe61894b" className="h-full flex flex-col items-center justify-center gap-4">
				<div data-ev-id="ev_8cfabbdc51" className="relative w-16 h-16">
					<div data-ev-id="ev_769b17e1d4" className="absolute inset-0 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
					<div data-ev-id="ev_023733e124"
          className="absolute inset-2 border-2 border-cyan-dim border-b-transparent rounded-full animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />

				</div>
				<p data-ev-id="ev_f8dc443390" className="font-mono text-[13px] text-text-light tracking-[1px]">Designing agent team...</p>
			</div>);

  }

  if (team.agents.length === 0) {
    return (
      <div data-ev-id="ev_70264a4dc5" className="h-full flex flex-col items-center justify-center gap-4 p-8">
				<div data-ev-id="ev_e1c6fff192" className="w-24 h-24 border border-dashed border-border rounded-lg flex items-center justify-center">
					<span data-ev-id="ev_545324247d" className="font-mono text-[11px] text-text-slate uppercase tracking-[2px]">Empty</span>
				</div>
				<p data-ev-id="ev_76562f4d46" className="font-mono text-[11px] text-text-slate text-center tracking-[1px]">
					Complete the interview to design your agent team
				</p>
			</div>);

  }

  return (
    <div data-ev-id="ev_dc1db51a00" className="h-full flex flex-col relative">
			{/* Header */}
			<div data-ev-id="ev_d03554e64d" className="p-4 border-b border-border">
				<h3 data-ev-id="ev_e18d47e7b9" className="font-display text-[28px] tracking-[4px] text-text-white">AGENT TEAM</h3>
				<p data-ev-id="ev_2cab7b4e3e" className="font-mono text-[11px] tracking-[1px] text-text-slate mt-1">
					{team.agents.length} agents · {team.connections.length} interactions
					{selectedAgentId && ' · Click again for details'}
				</p>
			</div>

			{/* Graph */}
			<div data-ev-id="ev_ebb75e5662" className="flex-1 overflow-hidden">
				<svg data-ev-id="ev_c8ce31f446"
        width="100%"
        height="100%"
        viewBox="0 0 440 360"
        preserveAspectRatio="xMidYMid meet"
        className="bg-deep">

					{/* Grid pattern */}
					<defs data-ev-id="ev_5a275dd0c3">
						<pattern data-ev-id="ev_e2110ea930" id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
							<path data-ev-id="ev_5aac15aaf2" d="M 20 0 L 0 0 0 20" fill="none" stroke="#1C2030" strokeWidth="0.5" />
						</pattern>
						{/* Glow filter */}
						<filter data-ev-id="ev_4970a0cb4c" id="glow" x="-50%" y="-50%" width="200%" height="200%">
							<feGaussianBlur data-ev-id="ev_dbadf8d35f" stdDeviation="3" result="coloredBlur" />
							<feMerge data-ev-id="ev_9bcf062aba">
								<feMergeNode data-ev-id="ev_5aaef45bea" in="coloredBlur" />
								<feMergeNode data-ev-id="ev_863bd2d92c" in="SourceGraphic" />
							</feMerge>
						</filter>
					</defs>
					<rect data-ev-id="ev_cd22b69507" width="100%" height="100%" fill="url(#grid)" />

					{/* Connections with enhanced styling */}
					{team.connections.map((conn) => {
            const fromPos = positions[conn.from];
            const toPos = positions[conn.to];
            if (!fromPos || !toPos) return null;

            const isHighlighted = selectedAgentId === conn.from || selectedAgentId === conn.to;
            const fromAgent = team.agents.find((a) => a.id === conn.from);

            return (
              <AgentConnection
                key={conn.interactionId}
                fromPos={fromPos}
                toPos={toPos}
                label={conn.label}
                color={isHighlighted ? fromAgent?.color || '#00E5CC' : '#252A3A'} />);


          })}

					{/* Agent nodes */}
					{team.agents.map((agent) =>
          <AgentNode
            key={agent.id}
            agent={agent}
            position={positions[agent.id] || { x: 0, y: 0 }}
            isSelected={selectedAgentId === agent.id}
            onClick={() => handleAgentClick(agent)} />

          )}
				</svg>
			</div>

			{/* Agent list */}
			<div data-ev-id="ev_84ac0a97a0" className="border-t border-border max-h-40 overflow-y-auto">
				<div data-ev-id="ev_9e27747d34" className="divide-y divide-border">
					{team.agents.map((agent) =>
          <div data-ev-id="ev_ad90c5ae2a"
          key={agent.id}
          className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
          selectedAgentId === agent.id ? 'bg-panel' : 'hover:bg-surface'}`
          }
          onClick={() => handleAgentClick(agent)}
          onDoubleClick={() => handleAgentDoubleClick(agent)}>

							<div data-ev-id="ev_d292297d68" className="w-2 h-8 rounded-sm" style={{ backgroundColor: agent.color }} />
							<div data-ev-id="ev_6071fc19d3" className="flex-1 min-w-0">
								<p data-ev-id="ev_0fc9b16002" className="font-mono text-[11px] font-bold uppercase tracking-[2.5px] text-text-white truncate">
									{agent.name}
								</p>
								<p data-ev-id="ev_9bac092422" className="font-mono text-[9px] text-text-slate truncate">{agent.role}</p>
							</div>
							<span data-ev-id="ev_397c20222c" className="font-mono text-[9px] text-text-slate">{agent.designation}</span>
						</div>
          )}
				</div>
			</div>

			{/* Details Panel */}
			{showDetails && selectedAgent &&
      <AgentDetailsPanel
        agent={selectedAgent}
        team={team}
        onClose={() => setShowDetails(false)} />

      }
		</div>);

}