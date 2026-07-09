import { useState } from 'react';
import { History, RotateCcw, Check, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { DocumentVersion } from '@/types/project';

interface VersionHistoryProps {
  versions: DocumentVersion[];
  currentVersionId: string | null;
  onRestore: (versionId: string) => void;
  onCompare?: (versionA: string, versionB: string) => void;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function VersionHistory({ versions, currentVersionId, onRestore, onCompare }: VersionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string | null>(null);

  if (versions.length === 0) return null;

  const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);
  const displayVersions = isExpanded ? sortedVersions : sortedVersions.slice(0, 3);

  const handleCompareClick = (versionId: string) => {
    if (!selectedForCompare) {
      setSelectedForCompare(versionId);
    } else if (selectedForCompare === versionId) {
      setSelectedForCompare(null);
    } else {
      onCompare?.(selectedForCompare, versionId);
      setSelectedForCompare(null);
      setCompareMode(false);
    }
  };

  return (
    <div data-ev-id="ev_d37b0be77e" className="border border-border rounded-md overflow-hidden">
			<div data-ev-id="ev_7df2ce0bd2" className="px-4 py-3 bg-panel border-b border-border flex items-center justify-between">
				<div data-ev-id="ev_2d0e710d96" className="flex items-center gap-2">
					<History className="w-4 h-4 text-cyan" />
					<span data-ev-id="ev_0f9fa892a7" className="font-mono text-[11px] font-bold uppercase tracking-[2.5px] text-text-white">
						Version History
					</span>
					<span data-ev-id="ev_1c6b469271" className="px-1.5 py-0.5 bg-cyan/20 text-cyan rounded text-[9px] font-mono">
						{versions.length}
					</span>
				</div>
				{onCompare && versions.length > 1 &&
        <Button
          size="sm"
          variant={compareMode ? 'primary' : 'ghost'}
          onClick={() => {
            setCompareMode(!compareMode);
            setSelectedForCompare(null);
          }}>

						<Eye className="w-3 h-3 mr-1" />
						{compareMode ? 'Cancel Compare' : 'Compare'}
					</Button>
        }
			</div>

			{compareMode &&
      <div data-ev-id="ev_41000a915b" className="px-4 py-2 bg-cyan/5 border-b border-cyan/20">
					<p data-ev-id="ev_5a6c627733" className="font-mono text-[10px] text-cyan">
						{selectedForCompare ?
          'Now select another version to compare' :
          'Select two versions to compare'}
					</p>
				</div>
      }

			<div data-ev-id="ev_644cf0c7ce" className="divide-y divide-border">
				{displayVersions.map((version) => {
          const isCurrent = version.id === currentVersionId;
          const isSelectedForCompare = version.id === selectedForCompare;

          return (
            <div data-ev-id="ev_a0266b7b63"
            key={version.id}
            className={`px-4 py-3 flex items-center justify-between transition-colors ${
            isCurrent ? 'bg-cyan/5' : 'hover:bg-surface'} ${
            isSelectedForCompare ? 'ring-1 ring-cyan ring-inset' : ''}`}>

							<div data-ev-id="ev_7e6fc6311a" className="flex items-center gap-3">
								<div data-ev-id="ev_1926018dd0"
                className={`w-8 h-8 rounded-md flex items-center justify-center font-mono text-[11px] font-bold ${
                isCurrent ? 'bg-cyan text-ink' : 'bg-panel text-text-light'}`
                }>

									v{version.versionNumber}
								</div>
								<div data-ev-id="ev_f16cbf9e8c">
									<div data-ev-id="ev_d355337f2b" className="flex items-center gap-2">
										<span data-ev-id="ev_354452da65" className="font-mono text-[11px] text-text-white">
											{version.label || `Version ${version.versionNumber}`}
										</span>
										{isCurrent &&
                    <span data-ev-id="ev_02fad2ad4a" className="flex items-center gap-1 px-1.5 py-0.5 bg-cyan/20 text-cyan rounded text-[8px] font-mono uppercase">
												<Check className="w-2.5 h-2.5" /> Current
											</span>
                    }
									</div>
									<span data-ev-id="ev_d9031e55c7" className="font-mono text-[9px] text-text-slate">
										{formatDate(version.createdAt)}
									</span>
								</div>
							</div>

							<div data-ev-id="ev_1fa0944660" className="flex items-center gap-2">
								{compareMode ?
                <Button
                  size="sm"
                  variant={isSelectedForCompare ? 'primary' : 'secondary'}
                  onClick={() => handleCompareClick(version.id)}>

										{isSelectedForCompare ? 'Selected' : 'Select'}
									</Button> :

                !isCurrent &&
                <Button size="sm" variant="ghost" onClick={() => onRestore(version.id)}>
											<RotateCcw className="w-3 h-3 mr-1" /> Restore
										</Button>

                }
							</div>
						</div>);

        })}
			</div>

			{versions.length > 3 &&
      <button data-ev-id="ev_b2fb453c3c"
      onClick={() => setIsExpanded(!isExpanded)}
      className="w-full px-4 py-2 flex items-center justify-center gap-1 font-mono text-[10px] text-text-slate hover:text-text-white transition-colors border-t border-border">

					{isExpanded ?
        <>
							<ChevronUp className="w-3 h-3" /> Show less
						</> :

        <>
							<ChevronDown className="w-3 h-3" /> Show {versions.length - 3} more
						</>
        }
				</button>
      }
		</div>);

}