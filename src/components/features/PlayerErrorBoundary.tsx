import { Component, type ErrorInfo, type ReactNode } from 'react';

interface PlayerErrorBoundaryProps { children: ReactNode }
interface PlayerErrorBoundaryState { failed: boolean }
export default class PlayerErrorBoundary extends Component<PlayerErrorBoundaryProps, PlayerErrorBoundaryState> {
  state: PlayerErrorBoundaryState = { failed: false };
  static getDerivedStateFromError(): PlayerErrorBoundaryState { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('[OVA player] Render failed', error.message, info.componentStack); }
  render() {
    if (!this.state.failed) return this.props.children;
    return <div role="alert" className="rounded-xl border border-destructive bg-card p-6 text-foreground">
      <h2 className="text-lg font-semibold">The player could not load</h2>
      <p className="mt-2 text-base text-muted-foreground">Retry the player or return to the OVA catalog.</p>
      <button type="button" onClick={() => this.setState({ failed: false })} className="mt-4 min-h-[44px] rounded-lg border border-border px-4 text-base font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Retry player</button>
    </div>;
  }
}
