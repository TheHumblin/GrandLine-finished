import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import AnimePlayerControls from '@/components/features/AnimePlayerControls';
import AnimePlayerFrame from '@/components/features/AnimePlayerFrame';
import OVAEpisodeSelector from '@/components/features/OVAEpisodeSelector';
import { OVA_SOURCES } from '@/data/ovaServers';
import type { AnimeAudio } from '@/types/animePlayer';

interface OVAPlayerProps { ovaId: number; title: string }
export default function OVAPlayer({ ovaId, title }: OVAPlayerProps) {
  const [part, setPart] = useState(1);
  const [audio, setAudio] = useState<AnimeAudio>('sub');
  const [reloadKey, setReloadKey] = useState(0);
  const episodes = OVA_SOURCES[ovaId] ?? [];
  const source = episodes.find(episode => episode.number === part);
  const activeAudio = audio === 'dub' && source?.dub ? 'dub' : 'sub';
  return (
    <section className="space-y-3" aria-label={`Watch ${title}`}>
      <OVAEpisodeSelector episodes={episodes} current={part} onChange={setPart} />
      <AnimePlayerControls audio={activeAudio} dubAvailable={!!source?.dub} onAudioChange={setAudio} serverLabel="ZokoAnime" onReload={() => setReloadKey(value => value + 1)} />
      <AnimePlayerFrame src={source?.[activeAudio] ?? null} reloadKey={reloadKey} contentTitle={`${title}${episodes.length > 1 ? ` — Part ${part}` : ''} — ZokoAnime`} />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <p className="text-sm leading-relaxed text-muted-foreground">ZokoAnime · SUB only. If playback is unavailable, try Reload or open HiAnime.</p>
        {source && <a href={source.hianimeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Open on HiAnime <ExternalLink size={16} aria-hidden="true" /></a>}
      </div>
    </section>
  );
}
