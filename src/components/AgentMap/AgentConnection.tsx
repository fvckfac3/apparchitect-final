interface AgentConnectionProps {
  fromPos: {x: number;y: number;};
  toPos: {x: number;y: number;};
  label: string;
  color?: string;
}

export function AgentConnection({ fromPos, toPos, label, color = '#252A3A' }: AgentConnectionProps) {
  // Calculate control points for curved line
  const midX = (fromPos.x + toPos.x) / 2;
  const midY = (fromPos.y + toPos.y) / 2;
  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Offset for curve
  const offset = Math.min(distance * 0.2, 30);
  const perpX = -dy / distance * offset;
  const perpY = dx / distance * offset;

  const controlX = midX + perpX;
  const controlY = midY + perpY;

  const path = `M ${fromPos.x} ${fromPos.y} Q ${controlX} ${controlY} ${toPos.x} ${toPos.y}`;

  return (
    <g data-ev-id="ev_a142bca553">
			{/* Connection line */}
			<path data-ev-id="ev_ef5d4ad362" d={path} fill="none" stroke={color} strokeWidth="1" opacity="0.5" strokeDasharray="4 2" />

			{/* Label background */}
			<rect data-ev-id="ev_0a3196ccf4"
      x={midX + perpX / 2 - 35}
      y={midY + perpY / 2 - 8}
      width="70"
      height="16"
      rx="2"
      fill="#0E1018"
      stroke={color}
      strokeWidth="0.5" />


			{/* Label text */}
			<text data-ev-id="ev_c0e7ada20a"
      x={midX + perpX / 2}
      y={midY + perpY / 2 + 3}
      textAnchor="middle"
      fill="#6B7494"
      className="font-mono text-[7px] uppercase"
      letterSpacing="1px">

				{label}
			</text>
		</g>);

}