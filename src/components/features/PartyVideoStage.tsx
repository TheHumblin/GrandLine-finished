import { useState } from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck, Headphones, ExternalLink } from 'lucide-react';
import AnimePlayerFrame from '@/components/features/AnimePlayerFrame';
import { useAnimeServers } from '@/hooks/useAnimeServers';
import { DUB_CONFIRMED_THROUGH, zokoEpisodeUrl, hianimeEpisodeUrl } from '@/lib/animeServers';
import { EPISODE_LIST } from '@/data/episodes';
import type { PartyRoom, SendPartyCommand } from '@/types/watchParty';

interface PartyVideoStageProps { room: PartyRoom; captain: boolean; disabled: boolean; currentEpisode: number; showSpoilers: boolean; watched: boolean; onWatched: () => void; onCommand: SendPartyCommand; }
export default function PartyVideoStage({ room, captain, disabled, currentEpisode, showSpoilers, watched, onWatched, onCommand }: PartyVideoStageProps) {
  const availability = useAnimeServers(room.episode_number);
  const [reload, setReload] = useState(0);
  const dubAvailable = availability.data ? !!availability.data.dubUrl : room.episode_number <= DUB_CONFIRMED_THROUGH;
  const src = availability.data ? (room.audio === 'dub' ? availability.data.dubUrl : availability.data.subUrl) : zokoEpisodeUrl(room.episode_number, room.audio);
  const safe = showSpoilers || room.episode_number <= currentEpisode;
  const episode = EPISODE_LIST.find(item => item.number === room.episode_number);
  return <section className="party-panel overflow-hidden" aria-label="Party video player">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5 sm:px-6"><div><p className="party-overline mb-1 text-primary">Now on deck</p><h2 className="text-xl font-semibold text-foreground">One Piece · Episode {room.episode_number}</h2><p className="mt-1 text-sm text-muted-foreground">{safe ? episode?.title || 'Continue the adventure with your crew.' : 'Episode details hidden by your anti-spoiler setting.'}</p></div><span className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-2 text-sm text-foreground"><Headphones size={14} />{room.audio.toUpperCase()} · ZokoAnime</span></div>
    <div className="p-3 sm:p-4"><AnimePlayerFrame src={src} episodeNumber={room.episode_number} reloadKey={reload} /></div>
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-4 sm:px-6">
      <div className="flex flex-wrap items-center gap-2"><div className="flex items-center gap-1 rounded-xl border border-border p-1" aria-label="Shared audio track">
        {(['sub', 'dub'] as const).map(audio => <button key={audio} type="button" aria-pressed={room.audio === audio} disabled={disabled || !captain || audio === room.audio || (audio === 'dub' && !dubAvailable)} onClick={() => void onCommand({ action: 'audio', payload: { audio } })} className={`min-h-[44px] rounded-lg px-4 text-sm font-semibold ${room.audio === audio ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>{audio.toUpperCase()}</button>)}
      </div><button type="button" onClick={() => setReload(value => value + 1)} className="party-icon" aria-label="Reload your video player"><RefreshCw size={16} /></button><a href={hianimeEpisodeUrl(room.episode_number)} target="_blank" rel="noopener noreferrer" className="party-icon" aria-label="Open source player in a new tab"><ExternalLink size={16} /></a></div>
      <button type="button" onClick={onWatched} disabled={watched} className="party-secondary"><CheckCircle2 size={16} />{watched ? 'Watched' : 'Mark watched'}</button>
    </div>
    <p className="flex items-center gap-2 border-t border-border px-5 py-3 text-sm text-muted-foreground"><ShieldCheck size={16} className="shrink-0 text-primary" />{availability.isError ? 'Availability check failed. Try Reload or the source link.' : captain ? 'Audio changes apply to the whole crew.' : 'The captain chooses the episode and audio.'} {!dubAvailable && 'DUB is not currently listed.'}</p>
  </section>;
}
