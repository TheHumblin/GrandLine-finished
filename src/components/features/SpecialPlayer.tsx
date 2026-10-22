import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import AnimePlayerControls from '@/components/features/AnimePlayerControls';
import AnimePlayerFrame from '@/components/features/AnimePlayerFrame';
import SpecialEpisodeSelector from '@/components/features/SpecialEpisodeSelector';
import DownloadButton from '@/components/features/DownloadButton';
import { SPECIAL_SOURCES, getSpecialEpisodeSource, getZokoSpecialUrl } from '@/data/specialServers';
import type { AnimeAudio } from '@/types/animePlayer';

interface SpecialPlayerProps { specialId: number; title: string }
export default function SpecialPlayer({ specialId, title }: SpecialPlayerProps) {
  const [episode, setEpisode] = useState(1);
  const [audio, setAudio] = useState<AnimeAudio>('sub');
  const [reloadKey, setReloadKey] = useState(0);
  const sources = SPECIAL_SOURCES[specialId] ?? [];
  const source = getSpecialEpisodeSource(specialId, episode);
  const dubAvailable = !!source?.dub;
  const activeAudio: AnimeAudio = audio === 'dub' && dubAvailable ? 'dub' : 'sub';
  const src = getZokoSpecialUrl(specialId, episode, activeAudio);
  return (
    <section className="space-y-3" aria-label={`Watch ${title}`}>
      <SpecialEpisodeSelector episodes={sources} current={episode} onChange={setEpisode} />
      <AnimePlayerControls audio={activeAudio} dubAvailable={dubAvailable} onAudioChange={setAudio}
        serverLabel="ZokoAnime" onReload={() => setReloadKey(value => value + 1)} />
      <AnimePlayerFrame src={src} reloadKey={reloadKey}
        contentTitle={`${title}${sources.length > 1 ? ` — Episode ${episode}` : ''} — ZokoAnime`} />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          ZokoAnime · {activeAudio.toUpperCase()}{sources.length > 1 && ` · Episode ${episode} of ${sources.length}`}
          {!dubAvailable && ' · Sub only'}
        </p>
        <DownloadButton specialId={specialId} audioType={activeAudio} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <p className="text-sm leading-relaxed text-muted-foreground">If playback is unavailable, try Reload or open this special on HiAnime.</p>
        {source && <a href={source.hianimeUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          Open on HiAnime <ExternalLink size={16} aria-hidden="true" />
        </a>}
      </div>
    </section>
  );
}
