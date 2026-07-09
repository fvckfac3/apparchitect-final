interface ProgressBarProps {
  progress: number;
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div data-ev-id="ev_d7e1d02de7" className="flex flex-col gap-2">
			{label &&
      <div data-ev-id="ev_86b07c22f1" className="flex items-center justify-between">
					<span data-ev-id="ev_1596d929e2" className="font-mono text-[11px] font-bold uppercase tracking-[2.5px] text-text-slate">{label}</span>
					<span data-ev-id="ev_1f90842d33" className="font-mono text-[11px] text-cyan">{progress}%</span>
				</div>
      }
			<div data-ev-id="ev_d26bcbaf5b" className="h-1 bg-panel rounded-full overflow-hidden">
				<div data-ev-id="ev_e08f3e86e9"
        className="h-full bg-gradient-to-r from-cyan to-cyan-dim transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }} />

			</div>
		</div>);

}