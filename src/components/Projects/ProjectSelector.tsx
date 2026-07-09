import { useState } from 'react';
import { FolderOpen, Plus, Trash2, Clock, Users, FileText, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { ProjectSummary } from '@/types/project';

interface ProjectSelectorProps {
  projects: ProjectSummary[];
  onCreate: (name: string) => void;
  onOpen: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onClose: () => void;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function getPhaseLabel(phase: ProjectSummary['phase']): string {
  switch (phase) {
    case 'interview':
      return 'Interview';
    case 'team-design':
      return 'Team Design';
    case 'generation':
      return 'Generating';
    case 'review':
      return 'Review';
    default:
      return phase;
  }
}

export function ProjectSelector({ projects, onCreate, onOpen, onDelete, onClose }: ProjectSelectorProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreate = () => {
    if (newProjectName.trim()) {
      onCreate(newProjectName.trim());
      setNewProjectName('');
      setShowCreate(false);
    }
  };

  return (
    <div data-ev-id="ev_e7348ca637" className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-8">
			<div data-ev-id="ev_ddb77ca423" className="w-full max-w-2xl bg-surface border border-border rounded-lg overflow-hidden">
				{/* Header */}
				<div data-ev-id="ev_1d7bdc439f" className="flex items-center justify-between p-6 border-b border-border">
					<div data-ev-id="ev_68c0a52278" className="flex items-center gap-3">
						<div data-ev-id="ev_90bdfcd90d" className="w-10 h-10 bg-cyan/10 border border-cyan/30 rounded-md flex items-center justify-center">
							<FolderOpen className="w-5 h-5 text-cyan" />
						</div>
						<div data-ev-id="ev_077b762091">
							<h2 data-ev-id="ev_1ed1e9e54c" className="font-display text-[24px] tracking-[4px] text-text-white">PROJECTS</h2>
							<p data-ev-id="ev_ff63862741" className="font-mono text-[9px] uppercase tracking-[2px] text-text-slate">
								{projects.length} saved project{projects.length !== 1 ? 's' : ''}
							</p>
						</div>
					</div>
					<button data-ev-id="ev_b4b6b52a00" onClick={onClose} className="p-2 text-text-slate hover:text-text-white transition-colors">
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* New Project Form */}
				{showCreate ?
        <div data-ev-id="ev_5c184f3b70" className="p-6 border-b border-border bg-panel">
						<div data-ev-id="ev_553e4e9693" className="flex gap-3">
							<div data-ev-id="ev_500ba7ab4b" className="flex-1">
								<Input
                placeholder="Project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus />

							</div>
							<Button onClick={handleCreate} disabled={!newProjectName.trim()}>
								Create
							</Button>
							<Button variant="ghost" onClick={() => setShowCreate(false)}>
								Cancel
							</Button>
						</div>
					</div> :

        <div data-ev-id="ev_dd0ab7b1f2" className="p-4 border-b border-border">
						<Button onClick={() => setShowCreate(true)} variant="secondary" className="w-full">
							<Plus className="w-4 h-4 mr-2" /> New Project
						</Button>
					</div>
        }

				{/* Project List */}
				<div data-ev-id="ev_f1e73b3a94" className="max-h-[400px] overflow-y-auto">
					{projects.length === 0 ?
          <div data-ev-id="ev_4ee236a998" className="p-12 text-center">
							<FolderOpen className="w-12 h-12 text-text-slate mx-auto mb-4" />
							<p data-ev-id="ev_bd769c43c4" className="font-mono text-[13px] text-text-slate">No projects yet</p>
							<p data-ev-id="ev_1d1971290b" className="font-mono text-[11px] text-text-slate mt-1">Create your first project to get started</p>
						</div> :

          <div data-ev-id="ev_3e3251659c" className="divide-y divide-border">
							{projects.map((project) =>
            <div data-ev-id="ev_226d98de29"
            key={project.id}
            className="p-4 hover:bg-panel transition-colors group">

									{deleteConfirm === project.id ?
              <div data-ev-id="ev_e796fb0e9f" className="flex items-center justify-between">
											<p data-ev-id="ev_9c14af0a5e" className="font-mono text-[11px] text-signal-red">Delete this project?</p>
											<div data-ev-id="ev_a6f1b89add" className="flex gap-2">
												<Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      onDelete(project.id);
                      setDeleteConfirm(null);
                    }}
                    className="text-signal-red hover:bg-signal-red/20">

													Delete
												</Button>
												<Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(null)}>
													Cancel
												</Button>
											</div>
										</div> :

              <div data-ev-id="ev_d6d1787a91" className="flex items-center gap-4">
											<button data-ev-id="ev_4110f7a09d"
                onClick={() => onOpen(project.id)}
                className="flex-1 text-left">

												<div data-ev-id="ev_9bf889b10f" className="flex items-center justify-between mb-2">
													<h3 data-ev-id="ev_9c61f026dd" className="font-mono text-[13px] font-bold text-text-white">
														{project.name}
													</h3>
													<span data-ev-id="ev_95fa5d628e" className="px-2 py-1 bg-cyan/10 text-cyan font-mono text-[9px] uppercase tracking-[1px] rounded">
														{getPhaseLabel(project.phase)}
													</span>
												</div>
												<div data-ev-id="ev_c2260102e3" className="flex items-center gap-4 text-text-slate">
													<span data-ev-id="ev_db5a734460" className="flex items-center gap-1 font-mono text-[10px]">
														<Clock className="w-3 h-3" />
														{formatDate(project.updatedAt)}
													</span>
													{project.agentCount > 0 &&
                    <span data-ev-id="ev_dc4bb41116" className="flex items-center gap-1 font-mono text-[10px]">
															<Users className="w-3 h-3" />
															{project.agentCount} agents
														</span>
                    }
													{project.versionCount > 0 &&
                    <span data-ev-id="ev_ded7888702" className="flex items-center gap-1 font-mono text-[10px]">
															<FileText className="w-3 h-3" />
															{project.versionCount} version{project.versionCount !== 1 ? 's' : ''}
														</span>
                    }
												</div>
											</button>
											<div data-ev-id="ev_d0fc464e19" className="flex items-center gap-1">
												<button data-ev-id="ev_33b049d4ec"
                  onClick={() => setDeleteConfirm(project.id)}
                  className="p-2 text-text-slate hover:text-signal-red transition-colors opacity-0 group-hover:opacity-100">

													<Trash2 className="w-4 h-4" />
												</button>
												<button data-ev-id="ev_80952bc4e5"
                  onClick={() => onOpen(project.id)}
                  className="p-2 text-text-slate hover:text-cyan transition-colors">

													<ChevronRight className="w-4 h-4" />
												</button>
											</div>
										</div>
              }
								</div>
            )}
						</div>
          }
				</div>
			</div>
		</div>);

}