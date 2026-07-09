import type { Agent } from '@/types';

interface AgentNodeProps {
  agent: Agent;
  position: {x: number;y: number;};
  isSelected?: boolean;
  onClick?: () => void;
}

export function AgentNode({ agent, position, isSelected, onClick }: AgentNodeProps) {
  return (
    <g data-ev-id="ev_829f1ba7ce"
    transform={`translate(${position.x}, ${position.y})`}
    onClick={onClick}
    className="cursor-pointer">

			{/* Glow effect for selected */}
			{isSelected &&
      <circle data-ev-id="ev_ce2bbb7430"
      r="50"
      fill="none"
      stroke={agent.color}
      strokeWidth="2"
      opacity="0.5"
      className="animate-pulse" />

      }

			{/* Node background */}
			<rect data-ev-id="ev_bcaf9a1cad"
      x="-60"
      y="-35"
      width="120"
      height="70"
      rx="4"
      fill="#1C2030"
      stroke={isSelected ? agent.color : '#252A3A'}
      strokeWidth={isSelected ? 2 : 1}
      className="transition-all duration-200 hover:stroke-[var(--color-cyan)]" />


			{/* Accent line */}
			<rect data-ev-id="ev_9f61437853" x="-60" y="-35" width="4" height="70" rx="2" fill={agent.color} />

			{/* Designation */}
			<text data-ev-id="ev_c7d4ca54c0"
      y="-15"
      textAnchor="middle"
      fill={agent.color}
      className="font-mono text-[9px] font-bold uppercase"
      letterSpacing="2px">

				{agent.designation}
			</text>

			{/* Name */}
			<text data-ev-id="ev_dd837d7e3f" y="5" textAnchor="middle" fill="#F5F2EC" className="font-mono text-[10px] font-bold uppercase" letterSpacing="1px">
				{agent.type.toUpperCase()}
			</text>

			{/* Role */}
			<text data-ev-id="ev_3528133cb7" y="22" textAnchor="middle" fill="#6B7494" className="font-mono text-[8px]" letterSpacing="0.5px">
				{agent.role.split(' · ')[0]}
			</text>
		</g>);

}