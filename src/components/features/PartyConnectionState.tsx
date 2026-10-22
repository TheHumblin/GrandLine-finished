import { Anchor, AlertCircle, WifiOff } from 'lucide-react';

interface PartyConnectionStateProps { error?: string; online: boolean; onRetry: () => void; onBack: () => void; }
export default function PartyConnectionState({ error, online, onRetry, onBack }: PartyConnectionStateProps) {
  return <section className="party-panel mx-auto max-w-2xl p-8 text-center" role={error || !online ? 'alert' : 'status'}>
    <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">{!online ? <WifiOff size={28} /> : error ? <AlertCircle size={28} /> : <Anchor size={28} />}</span>
    <h1 className="text-2xl font-semibold">{!online ? 'The connection drifted' : error ? 'Unable to reconnect to this room' : 'Bringing the crew aboard…'}</h1>
    <p className="mt-3 text-base leading-relaxed text-muted-foreground">{!online ? 'Reconnect to the internet to rejoin your crew. Your video player and room cues may be out of step.' : error || 'Connecting to your private cloud room.'}</p>
    <div className="mt-6 flex justify-center gap-3"><button type="button" className="party-secondary" onClick={onBack}>Back to lounge</button>{(error || !online) && <button type="button" disabled={!online} className="party-primary" onClick={onRetry}>Reconnect</button>}</div>
  </section>;
}
