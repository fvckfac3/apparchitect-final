/**
 * AIStatusBadge.tsx
 *
 * Surfaces the live AI provider / fallback state during PRD generation
 * so the user can see whether real AI enhancement is happening, which
 * model is being used, and whether a fallback occurred.
 *
 * Three visual states:
 *   - idle         -> "AI not running" (muted)
 *   - active       -> "Writing prose with <provider>..." (accent)
 *   - fallback     -> "Switched to <fallback> provider" (warning)
 *
 * Use:
 *   <AIStatusBadge state={aiState} phase={phase} />
 */
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import type { GenerationPhase } from '@/hooks/use-prd-generator-v2';

export type AIStatusState =
  | { kind: 'idle' }
  | { kind: 'active'; provider: string; model: string }
  | { kind: 'fallback'; from: string; to: string; reason: string }
  | { kind: 'unavailable'; reason: string };

export interface AIStatusBadgeProps {
  state: AIStatusState;
  phase: GenerationPhase;
}

export function AIStatusBadge({ state, phase }: AIStatusBadgeProps) {
  if (state.kind === 'idle') return null;

  if (state.kind === 'active') {
    return (
      <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
        <Loader2 className="size-4 animate-spin text-primary" />
        <Sparkles className="size-3.5 text-primary" />
        <span className="text-foreground">
          Writing prose with <span className="font-medium">{state.provider}</span>
          <span className="ml-1 text-muted-foreground">({state.model})</span>
        </span>
      </div>
    );
  }

  if (state.kind === 'fallback') {
    return (
      <div className="flex items-center gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/5 px-3 py-2 text-sm">
        <AlertTriangle className="size-4 text-yellow-600 dark:text-yellow-400" />
        <span className="text-foreground">
          <span className="font-medium">{state.from}</span> unavailable
          {' '}- switched to <span className="font-medium">{state.to}</span>
        </span>
        <span className="ml-1 text-xs text-muted-foreground">({state.reason})</span>
      </div>
    );
  }

  // unavailable
  return (
    <div className="flex items-center gap-2 rounded-md border border-muted-foreground/20 bg-muted/30 px-3 py-2 text-sm">
      <AlertTriangle className="size-4 text-muted-foreground" />
      <span className="text-muted-foreground">
        AI enhancement unavailable - using template-only mode
      </span>
      <span className="text-xs text-muted-foreground/70">({state.reason})</span>
    </div>
  );
}
