import type { ReactNode } from 'react';

interface ThreeColumnLayoutProps {
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
}

export function ThreeColumnLayout({ leftPanel, centerPanel, rightPanel }: ThreeColumnLayoutProps) {
  return (
    <div data-ev-id="ev_2fdbd78a4e" className="flex-1 flex overflow-hidden">
			{/* Left Panel - Interview */}
			<div data-ev-id="ev_65c98224c2" className="w-[380px] h-full border-r border-border bg-surface flex flex-col overflow-hidden">
				{leftPanel}
			</div>

			{/* Center Panel - Document Preview */}
			<div data-ev-id="ev_a01582fef6" className="flex-1 bg-deep overflow-hidden flex flex-col">
				{centerPanel}
			</div>

			{/* Right Panel - Agent Map */}
			<div data-ev-id="ev_cdb7d3d387" className="w-[420px] border-l border-border bg-surface overflow-hidden flex flex-col">
				{rightPanel}
			</div>
		</div>);

}