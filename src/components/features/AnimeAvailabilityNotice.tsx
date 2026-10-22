import { CalendarDays, CheckCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { hianimeEpisodeUrl } from '@/lib/animeServers';

interface AnimeAvailabilityNoticeProps {
  episodeNumber: number;
  dubAvailable: boolean;
  checking: boolean;
  failed: boolean;
  checkedAt?: string;
  onRefresh: () => void;
}

export default function AnimeAvailabilityNotice({ episodeNumber, dubAvailable, checking, failed, checkedAt, onRefresh }: AnimeAvailabilityNoticeProps) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground" aria-live="polite">
          {failed ? <AlertCircle size={16} className="text-destructive" /> : <CheckCircle size={16} className="text-primary" />}
          {failed ? 'Availability check unavailable' : checking ? 'Checking HiAnime audio tracks…' : dubAvailable ? `Episode ${episodeNumber}: SUB + DUB` : `Episode ${episodeNumber}: SUB · Dub not yet listed`}
        </p>
        <button type="button" onClick={onRefresh} disabled={checking}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border px-3 text-sm text-foreground transition-colors hover:border-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50">
          <RefreshCw size={14} /> Check availability
        </button>
      </div>
      <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
        <CalendarDays size={16} className="mt-1 shrink-0" />
        Elbaf dubs are expected on Tuesdays. New tracks unlock when HiAnime lists them; availability is rechecked every five minutes while this page is open, not predicted from the calendar.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{checkedAt ? `Last checked: ${new Date(checkedAt).toLocaleString()}` : failed ? 'Using previously confirmed availability where possible.' : 'Episode 1156’s dub is confirmed available.'}</span>
        <a href={hianimeEpisodeUrl(episodeNumber)} target="_blank" rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 font-semibold text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          Open episode {episodeNumber} on HiAnime <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
