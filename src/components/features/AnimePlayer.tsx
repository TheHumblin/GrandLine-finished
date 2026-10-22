import { useCallback, useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import AnimePlayerControls from '@/components/features/AnimePlayerControls';
import AnimePlayerFrame from '@/components/features/AnimePlayerFrame';
import AnimeAvailabilityNotice from '@/components/features/AnimeAvailabilityNotice';
import DownloadButton from '@/components/features/DownloadButton';
import { useAnimeServers } from '@/hooks/useAnimeServers';
import { DUB_CONFIRMED_THROUGH, zokoEpisodeUrl } from '@/lib/animeServers';
import type { AnimeAudio, AnimePlayerProps } from '@/types/animePlayer';

export default function AnimePlayer({ episodeNumber, nextEpisodeNumber, onNextEpisode }: AnimePlayerProps) {
  const availability = useAnimeServers(episodeNumber);
  const [audio, setAudio] = useState<AnimeAudio>('sub');
  const [reloadKey, setReloadKey] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const dubAvailable = availability.data ? !!availability.data.dubUrl : episodeNumber <= DUB_CONFIRMED_THROUGH;
  const activeAudio: AnimeAudio = audio === 'dub' && dubAvailable ? 'dub' : 'sub';
  const src = availability.data ? (activeAudio === 'dub' ? availability.data.dubUrl : availability.data.subUrl) : zokoEpisodeUrl(episodeNumber, activeAudio);
  const onEnded = useCallback(() => {
    if (nextEpisodeNumber && onNextEpisode) setCountdown(value => value ?? 7);
  }, [nextEpisodeNumber, onNextEpisode]);
  useEffect(() => { setCountdown(null); }, [episodeNumber, src, reloadKey]);
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) { setCountdown(null); onNextEpisode?.(); return; }
    const timer = setTimeout(() => setCountdown(value => value === null ? null : value - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onNextEpisode]);
  return (
    <section className="space-y-3" aria-label={`Watch One Piece episode ${episodeNumber}`}>
      <AnimePlayerControls audio={activeAudio} dubAvailable={dubAvailable} onAudioChange={setAudio}
        onReload={() => setReloadKey(value => value + 1)} />
      <AnimePlayerFrame src={src} episodeNumber={episodeNumber} reloadKey={reloadKey} onEnded={onEnded} />
      {countdown !== null && <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-card p-4" role="status">
        <span className="text-foreground">Next: episode {nextEpisodeNumber} in {countdown}s</span>
        <button type="button" onClick={() => setCountdown(null)} className="min-h-[44px] rounded-lg border border-border px-4 text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary">Cancel auto-next</button>
      </div>}
      <AnimeAvailabilityNotice episodeNumber={episodeNumber} dubAvailable={dubAvailable} checking={availability.isFetching}
        failed={availability.isError} checkedAt={availability.data?.checkedAt} onRefresh={() => { void availability.refetch(); }} />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-3">
        <span className="text-sm text-muted-foreground">ZokoAnime · {activeAudio.toUpperCase()} · Watch progress auto-saved</span>
        <div className="flex items-center gap-3">
          <DownloadButton episodeNumber={episodeNumber} audioType={activeAudio} />
          {nextEpisodeNumber && onNextEpisode && <button type="button" onClick={onNextEpisode}
            className="inline-flex min-h-[44px] items-center gap-1 rounded-lg px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary">Next episode <ChevronRight size={16} /></button>}
        </div>
      </div>
    </section>
  );
}
