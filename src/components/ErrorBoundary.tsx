import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router';

/**
 * App-wide error boundary. Catches uncaught render errors and shows a
 * recovery UI instead of a blank page. Wrap around <App /> in main.tsx
 * and around any high-risk subtree (route content, etc.) as needed.
 *
 * Recovery options:
 *  - "Reload" — full page reload, drops all in-memory state
 *  - "Go home" — soft reset to "/", keeps the router mounted
 *  - "Report" — opens a mailto with the error summary pre-filled
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  /** Override the page-level error UI; defaults to a full-screen card. */
  variant?: 'page' | 'inline';
  /** Optional context string shown in the error card to aid debugging. */
  context?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Surface to the browser console for devtools; production telemetry
    // is out of scope for v1.
    console.error('[ErrorBoundary] caught:', error, info.componentStack);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  private buildReportMailto(): string {
    const err = this.state.error;
    const subject = encodeURIComponent(
      `[AppArchitect] ${err?.name ?? 'Error'} report`,
    );
    const body = encodeURIComponent(
      [
        `Context: ${this.props.context ?? '(root)'}`,
        `Message: ${err?.message ?? '(none)'}`,
        `Stack: ${err?.stack ?? '(none)'}`,
        `URL: ${window.location.href}`,
        `Time: ${new Date().toISOString()}`,
      ].join('\n'),
    );
    return `mailto:support@example.com?subject=${subject}&body=${body}`;
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    const isInline = this.props.variant === 'inline';
    const error = this.state.error;

    if (isInline) {
      return (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-red-200">
                {this.props.context ?? 'Something went wrong'}
              </p>
              <p className="mt-1 text-xs text-red-300/70">
                {error?.message ?? 'Unknown error'}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={this.handleReset}
                  className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200 hover:bg-red-500/20"
                >
                  Try again
                </button>
                <a
                  href={this.buildReportMailto()}
                  className="rounded-md border border-red-500/30 bg-transparent px-3 py-1 text-xs text-red-200/80 hover:bg-red-500/10"
                >
                  Report
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg,theme(colors.zinc.950))] p-6 text-[var(--page-fg,theme(colors.zinc.100))]">
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <h1 className="mb-1 text-xl font-semibold">Something broke</h1>
          <p className="mb-4 text-sm text-zinc-400">
            {this.props.context
              ? `The ${this.props.context} section ran into a problem.`
              : 'An unexpected error stopped the app from rendering.'}
          </p>
          {error && (
            <pre className="mb-6 max-h-40 overflow-auto rounded-md bg-zinc-950/80 p-3 text-xs text-zinc-300">
              {error.name}: {error.message}
            </pre>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-zinc-100 hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4" />
              Reload
            </button>
            <Link
              to="/"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm font-medium text-zinc-100 hover:bg-white/5"
            >
              <Home className="h-4 w-4" />
              Go home
            </Link>
            <a
              href={this.buildReportMailto()}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5"
            >
              Report issue
            </a>
          </div>
        </div>
      </div>
    );
  }
}
