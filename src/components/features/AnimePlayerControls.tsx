import { RefreshCw, Volume2 } from 'lucide-react';
import type { AnimeAudio } from '@/types/animePlayer';

interface AnimePlayerControlsProps {
  audio: AnimeAudio;
  dubAvailable: boolean;
  onAudioChange: (audio: AnimeAudio) => void;
  onReload: () => void;
  serverLabel?: string;
}
const CONTROL = 'min-h-[44px] rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50';

export default function AnimePlayerControls({ audio, dubAvailable, onAudioChange, onReload, serverLabel = 'ZokoAnime · MAL' }: AnimePlayerControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex min-h-[44px] items-center rounded-xl border border-primary/30 bg-primary/10 px-4 text-sm font-semibold text-primary">
        {serverLabel}
      </span>
      <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1" role="group" aria-label="Audio language">
        <Volume2 size={16} className="mx-2 text-muted-foreground" aria-hidden="true" />
        {(['sub', 'dub'] as const).map(value => (
          <button key={value} type="button" aria-pressed={audio === value} disabled={value === 'dub' && !dubAvailable}
            title={value === 'dub' && !dubAvailable ? 'Dub not yet listed on HiAnime' : undefined}
            onClick={() => onAudioChange(value)}
            className={`${CONTROL} ${audio === value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            {value.toUpperCase()}
          </button>
        ))}
      </div>
      <button type="button" onClick={onReload} className={`${CONTROL} ml-auto inline-flex items-center gap-2 border border-border text-foreground hover:border-primary hover:bg-muted`}>
        <RefreshCw size={16} /> Reload
      </button>
    </div>
  );
}
