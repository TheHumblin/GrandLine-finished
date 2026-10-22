import { lazy, Suspense, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useEpisodeCatalog } from '@/hooks/useEpisodeCatalog';
import { useWatchParty } from '@/hooks/useWatchParty';
import PartyLobby from '@/components/features/PartyLobby';
import PartyConnectionState from '@/components/features/PartyConnectionState';
import PartyErrorBoundary from '@/components/features/PartyErrorBoundary';
import '@/styles/watch-party.css';

const PartyRoom = lazy(() => import('@/components/features/PartyRoom'));
const AuthModal = lazy(() => import('@/components/features/AuthModal'));
export default function WatchParty() {
  const { user, loading, updateProgress } = useAuth();
  const { total } = useEpisodeCatalog();
  const [params, setParams] = useSearchParams();
  const [authOpen, setAuthOpen] = useState(false);
  const party = useWatchParty(user?.id, params.get('room'));
  const exit = () => { party.forgetRoom(); setParams({}, { replace: true }); };
  const markWatched = () => {
    if (!party.snapshot) return;
    updateProgress(party.snapshot.room.episode_number);
    toast.success('Episode marked watched. Your progress and bounty have been saved.');
  };
  return <main className="watch-party min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:py-8">
    <div className="mx-auto max-w-screen-2xl">
      <PartyErrorBoundary>
        {loading ? <p role="status" className="p-8 text-base">Loading your crew profile…</p> : party.roomId && user ? party.snapshot ? <Suspense fallback={<p role="status" className="p-8 text-base">Preparing the viewing lounge…</p>}><PartyRoom snapshot={party.snapshot} user={user} total={total} online={party.online} syncError={!!party.error} busy={party.busy} onCommand={party.sendCommand} onRetry={() => { void party.retry(); }} onExit={exit} onWatched={markWatched} /></Suspense> : <PartyConnectionState error={party.error?.message} online={party.online} onRetry={() => { void party.retry(); }} onBack={exit} /> : <PartyLobby total={total} initialEpisode={Math.min(total, Math.max(1, (user?.currentEpisode || 0) + 1))} invitation={params.get('room')} signedIn={!!user} busy={party.busy} onSignIn={() => setAuthOpen(true)} onCommand={party.sendCommand} />}
      </PartyErrorBoundary>
    </div>
    {authOpen && <Suspense fallback={null}><AuthModal open={authOpen} onClose={() => setAuthOpen(false)} /></Suspense>}
  </main>;
}
