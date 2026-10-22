import { useState } from 'react';
import PartyRoomHeader from '@/components/features/PartyRoomHeader';
import PartyVideoStage from '@/components/features/PartyVideoStage';
import PartyPlaybackCue from '@/components/features/PartyPlaybackCue';
import PartyCaptainControls from '@/components/features/PartyCaptainControls';
import PartySidebar from '@/components/features/PartySidebar';
import PartyEndDialog from '@/components/features/PartyEndDialog';
import type { AuthUser } from '@/hooks/useAuth';
import type { PartySnapshot, SendPartyCommand } from '@/types/watchParty';

interface PartyRoomProps { snapshot: PartySnapshot; user: AuthUser; total: number; online: boolean; syncError: boolean; busy: boolean; onCommand: SendPartyCommand; onRetry: () => void; onExit: () => void; onWatched: () => void; }
export default function PartyRoom({ snapshot, user, total, online, syncError, busy, onCommand, onRetry, onExit, onWatched }: PartyRoomProps) {
  const [leaving, setLeaving] = useState(false);
  const captain = snapshot.room.user_id === user.id;
  const disabled = busy || !online || syncError;
  return <div className="space-y-6">
    <PartyRoomHeader room={snapshot.room} online={online} syncError={syncError} busy={busy} onLeave={() => setLeaving(true)} onRetry={onRetry} />
    {(!online || syncError) && <p role="alert" className="party-warning rounded-2xl border border-primary/25 bg-card px-5 py-4 text-base leading-relaxed">Room updates are unavailable. The reference timer is frozen at the last confirmed cue; your video may keep playing. Reconnect before following new captain commands.</p>}
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 space-y-5">
        <PartyVideoStage room={snapshot.room} captain={captain} disabled={disabled} currentEpisode={user.currentEpisode} showSpoilers={user.showSpoilers} watched={user.watchedEpisodes.includes(snapshot.room.episode_number)} onWatched={onWatched} onCommand={onCommand} />
        <PartyPlaybackCue snapshot={snapshot} connected={online && !syncError} />
        {captain ? <PartyCaptainControls snapshot={snapshot} total={total} disabled={disabled} onCommand={onCommand} /> : <p className="party-panel p-5 text-base leading-relaxed text-muted-foreground"><strong className="text-foreground">{snapshot.members.find(member => member.user_id === snapshot.room.user_id)?.username || 'The captain'}</strong> has the helm. Load your player, mark ready, and follow the shared countdown. Joined mid-episode? Match the reference time above, then press play.</p>}
      </div>
      <PartySidebar snapshot={snapshot} userId={user.id} disabled={disabled} onCommand={onCommand} />
    </div>
    <PartyEndDialog captain={captain} open={leaving} onOpenChange={setLeaving} disabled={busy || !online} onCommand={onCommand} onExit={onExit} />
  </div>;
}
