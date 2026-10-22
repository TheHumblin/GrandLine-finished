import { Component, type ErrorInfo, type ReactNode } from 'react';

interface PartyErrorBoundaryProps { children: ReactNode; }
interface PartyErrorBoundaryState { failed: boolean; }
export default class PartyErrorBoundary extends Component<PartyErrorBoundaryProps, PartyErrorBoundaryState> {
  state: PartyErrorBoundaryState = { failed: false };
  static getDerivedStateFromError(): PartyErrorBoundaryState { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('[Watch party] Rendering failed:', error.message, info.componentStack); }
  render() {
    if (!this.state.failed) return this.props.children;
    return <section role="alert" className="watch-party rounded-3xl border border-destructive/40 bg-card p-8 text-foreground"><h2 className="text-2xl font-semibold">The lounge couldn’t load</h2><p className="mt-3 text-base text-muted-foreground">Your room is still stored in the cloud. Retry to reconnect to your crew.</p><button type="button" onClick={() => this.setState({ failed: false })} className="party-primary mt-5">Retry lounge</button></section>;
  }
}
