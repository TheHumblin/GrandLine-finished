import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, Play, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useEpisodeCatalog } from '@/hooks/useEpisodeCatalog';
import { useEpisodeBrowser } from '@/hooks/useEpisodeBrowser';
import { useFillerPreference } from '@/hooks/useFillerPreference';
import { filterEpisodeNumbers } from '@/lib/episodeFilters';
import EpisodeRow from '@/components/features/EpisodeRow';
import EpisodeSagaNavigation from '@/components/features/EpisodeSagaNavigation';
import EpisodeSagaChips from '@/components/features/EpisodeSagaChips';
import EpisodeTypeFilters from '@/components/features/EpisodeTypeFilters';
import EpisodePagination from '@/components/features/EpisodePagination';
import FillerFruitToggle from '@/components/features/FillerFruitToggle';
import type { EpisodeType } from '@/types';

export default function Episodes() {
  const { user, updateSettings } = useAuth();
  useTheme(user?.theme || 'strawhat');
  const catalog = useEpisodeCatalog();
  const { hideFiller, toggleFiller } = useFillerPreference(user, updateSettings);
  const browser = useEpisodeBrowser({ syncedEpisodes: catalog.episodes, total: catalog.total, currentEpisode: user?.currentEpisode || 0, hideFiller });
  const [showFilters, setShowFilters] = useState(false);
  const watched = new Set(user?.watchedEpisodes || []);
  const next = browser.continueEpisode;
  const selectType = (type: EpisodeType | null) => { if (type === 'filler' && hideFiller) toggleFiller(); browser.selectType(type); };
  const toggle = () => { if (!hideFiller && browser.selectedType === 'filler') browser.selectType(null); toggleFiller(); };
  const newNumbers = filterEpisodeNumbers(catalog.episodes.map(episode => episode.number), { hideFiller, selectedType: browser.selectedType });
  const overviewVisible = !browser.search && !browser.selectedSaga && !browser.selectedArc && !browser.selectedType;
  return (
    <div className="flex min-h-screen bg-background">
      <EpisodeSagaNavigation browser={browser} hideFiller={hideFiller} total={catalog.total} />
      <main className="min-w-0 flex-1">
        <header className="sticky top-14 z-10 border-b border-border bg-background/95 p-4 backdrop-blur-md sm:p-6 lg:top-16">
          <div className="mb-4 flex items-center justify-between gap-3"><h1 className="text-2xl font-bold gold-text">One Piece Episodes</h1><span className="text-base text-muted-foreground">{catalog.total.toLocaleString()} episodes</span></div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1"><label htmlFor="episode-search" className="mb-1 block text-base font-medium text-foreground">Search episodes</label><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><input id="episode-search" type="search" placeholder="Episode number, title or arc" value={browser.search} onChange={event => browser.setSearch(event.target.value)} className="min-h-[44px] w-full rounded-lg border border-border bg-input py-2 pl-9 pr-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary" /></div></div>
            <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters} className="flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-muted px-3 text-base font-medium text-foreground hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Filter size={16} />Filters</button><FillerFruitToggle active={hideFiller} onToggle={toggle} /></div>
          </div>
          {(showFilters || browser.selectedType) && <EpisodeTypeFilters selected={browser.selectedType} onChange={selectType} />}
          {hideFiller && <p role="status" className="mt-3 text-base text-primary">Filler hidden. Manga, anime and mixed canon stay visible.</p>}
          {user && user.currentEpisode > 0 && !user.showSpoilers && <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><EyeOff size={14} className="text-primary" />Anti-Spoiler ON — episodes after Ep. {user.currentEpisode + 5} are blurred.</p>}
        </header>
        <div className="p-4 sm:p-6">
          {next && overviewVisible && <section className="glow-border mb-4 flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4"><div><p className="text-base text-muted-foreground">Continue Watching{hideFiller ? ' · Filler skipped' : ''}</p><h2 className="text-lg font-semibold text-foreground">Episode {next}</h2></div><Link to={`/watch/${next}`} className="flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Play size={16} />Continue</Link></section>}
          {newNumbers.length > 0 && overviewVisible && <div className="mb-4 rounded-xl border border-primary/30 bg-card p-4"><p className="text-base font-semibold text-primary">{newNumbers.length} new synced episode{newNumbers.length === 1 ? '' : 's'} available</p><Link to={`/watch/${newNumbers[0]}`} className="inline-flex min-h-[44px] items-center text-base text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Watch episode {newNumbers[0]}</Link></div>}
          {catalog.loading && <p role="status" className="mb-3 text-base text-muted-foreground">Checking for newer episodes…</p>}
          <EpisodeSagaChips browser={browser} />
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold text-foreground">{browser.heading}</h2><span role="status" className="text-base text-muted-foreground">{browser.matchingCount.toLocaleString()} matching episodes</span></div>
          <div className="space-y-2">{browser.episodes.map(episode => <EpisodeRow key={episode.number} episode={episode} isWatched={watched.has(episode.number)} isSpoiler={Boolean(user && episode.number > Math.max(user.currentEpisode + 5, 5) && !user.showSpoilers)} />)}</div>
          {browser.matchingCount === 0 && <div className="rounded-xl border border-border bg-card px-4 py-12 text-center"><Search size={28} className="mx-auto mb-3 text-muted-foreground" /><h3 className="text-lg font-semibold text-foreground">No matching episodes</h3><p className="mt-2 text-base text-muted-foreground">Try another type, saga or search. A filler-only arc has no episodes when Filler Fruit is on.</p></div>}
          <EpisodePagination page={browser.page} totalPages={browser.totalPages} onChange={browser.setPage} />
        </div>
      </main>
    </div>
  );
}
