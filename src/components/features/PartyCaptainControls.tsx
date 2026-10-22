import { Crown, Play, Pause, ChevronDown } from 'lucide-react';
import PartyEpisodeForm from '@/components/forms/PartyEpisodeForm';
import PartySeekForm from '@/components/forms/PartySeekForm';
import type { PartySnapshot, SendPartyCommand } from '@/types/watchParty';

interface PartyCaptainControlsProps { snapshot: PartySnapshot; total: number; disabled: boolean; onCommand: SendPartyCommand; }
export default function PartyCaptainControls({ snapshot, total, disabled, onCommand }: PartyCaptainControlsProps) {
  const { room, members } = snapshot;
  const allReady = members.length > 0 && members.every(member => member.ready);
  return <section className="party-panel p-5 sm:p-6" aria-label="Captain controls">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 className="flex items-center gap-2 text-lg font-semibold text-foreground"><Crown size={18} className="text-primary" />Captain’s helm</h2><span className="text-sm text-muted-foreground">{members.filter(member => member.ready).length}/{members.length} crew ready</span></div>
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" disabled={disabled || (room.playback_state !== 'playing' && !allReady)} onClick={() => void onCommand({ action: room.playback_state === 'playing' ? 'pause' : 'start' })} className="party-primary">{room.playback_state === 'playing' ? <Pause size={18} /> : <Play size={18} />}{room.playback_state === 'playing' ? 'Pause watch cue' : 'Start 10-second countdown'}</button>
      <span className="text-sm text-muted-foreground">{room.playback_state === 'playing' ? 'Pause your video player separately.' : allReady ? 'Everyone is ready. Take the helm.' : 'All online crew must mark ready first.'}</span>
    </div>
    <details className="mt-5 border-t border-border pt-2"><summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between text-base font-medium text-foreground">Change episode or reference time<ChevronDown size={16} /></summary><div className="mt-3 grid gap-6 xl:grid-cols-2"><PartyEpisodeForm episode={room.episode_number} total={total} disabled={disabled} onCommand={onCommand} /><PartySeekForm disabled={disabled} onCommand={onCommand} /></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Changing the episode resets the time and ready checks for everyone. Setting a cue pauses the shared timer, not the embedded video.</p></details>
  </section>;
}
