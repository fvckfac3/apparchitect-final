type Status = 'active' | 'pending' | 'error' | 'done';

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

const statusStyles: Record<Status, {bg: string;text: string;dot: string;}> = {
  active: {
    bg: 'bg-cyan/10',
    text: 'text-cyan',
    dot: 'bg-cyan'
  },
  pending: {
    bg: 'bg-amber/10',
    text: 'text-amber',
    dot: 'bg-amber'
  },
  error: {
    bg: 'bg-signal-red/10',
    text: 'text-signal-red',
    dot: 'bg-signal-red'
  },
  done: {
    bg: 'bg-cyan-dim/10',
    text: 'text-cyan-dim',
    dot: 'bg-cyan-dim'
  }
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles = statusStyles[status];
  const displayLabel = label || status.toUpperCase();

  return (
    <div data-ev-id="ev_d868cec1b6"
    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm ${styles.bg}`}>

			<span data-ev-id="ev_6b47e2c1d4" className={`w-1.5 h-1.5 rounded-full ${styles.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
			<span data-ev-id="ev_d095baba7e" className={`font-mono text-[11px] font-bold uppercase tracking-[2.5px] ${styles.text}`}>
				{displayLabel}
			</span>
		</div>);

}