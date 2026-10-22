import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EPISODE_LIST, getEpisodeType } from '@/data/episodes';
import { SAGAS, EPISODE_TYPE_INFO } from '@/data/sagas';
import { episodeNumbers, filterEpisodeNumbers, getAdjacentEpisode } from '@/lib/episodeFilters';
import type { Episode, EpisodeType } from '@/types';

const PAGE_SIZE = 50;
interface EpisodeBrowserOptions { syncedEpisodes: Episode[]; total: number; currentEpisode: number; hideFiller: boolean; }

export function useEpisodeBrowser({ syncedEpisodes, total, currentEpisode, hideFiller }: EpisodeBrowserOptions) {
  const [params, setParams] = useSearchParams();
  const selectedSaga = params.get('saga');
  const selectedArc = params.get('arc');
  const search = params.get('search') || '';
  const type = params.get('type');
  const selectedType: EpisodeType | null = type && Object.prototype.hasOwnProperty.call(EPISODE_TYPE_INFO, type) ? type as EpisodeType : null;
  const requestedPage = Math.max(1, Math.floor(Number(params.get('page')) || 1));
  const continueEpisode = currentEpisode > 0 ? getAdjacentEpisode(currentEpisode, 1, total, hideFiller) : null;
  const change = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    next.delete('page');
    Object.entries(updates).forEach(([key, value]) => { if (value) next.set(key, value); else next.delete(key); });
    setParams(next, { replace: true });
  };
  const saga = SAGAS.find(item => item.id === selectedSaga);
  const arc = SAGAS.flatMap(item => item.arcs).find(item => item.id === selectedArc);
  const filtered = useMemo(() => {
    const map = new Map([...EPISODE_LIST, ...syncedEpisodes].map(episode => [episode.number, episode]));
    const start = search ? 1 : arc?.episodeRange[0] ?? saga?.episodeRange[0] ?? (selectedType ? 1 : continueEpisode ?? 1);
    const end = search ? total : Math.min(arc?.episodeRange[1] ?? saga?.episodeRange[1] ?? total, total);
    return filterEpisodeNumbers(episodeNumbers(start, end), { hideFiller, selectedType }).map(number => {
      const found = map.get(number);
      if (found) return { ...found, type: getEpisodeType(number) };
      const parent = SAGAS.find(item => number >= item.episodeRange[0] && number <= item.episodeRange[1]);
      const section = parent?.arcs.find(item => number >= item.episodeRange[0] && number <= item.episodeRange[1]);
      return { id: number, number, title: `Episode ${number}`, thumbnail: '', type: getEpisodeType(number), saga: parent?.name || 'Final Saga', arc: section?.name || 'Unknown Arc', duration: '24m', airDate: '', synopsis: '' };
    }).filter(episode => !search || `${episode.number} ${episode.title} ${episode.arc}`.toLowerCase().includes(search.toLowerCase()));
  }, [syncedEpisodes, total, search, selectedType, saga, arc, continueEpisode, hideFiller]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  return {
    selectedSaga, selectedArc, search, selectedType, page, totalPages, continueEpisode,
    episodes: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), matchingCount: filtered.length,
    heading: search ? `Search: “${search}”` : arc?.name || saga?.name || (selectedType ? EPISODE_TYPE_INFO[selectedType].label : continueEpisode ? `Starting from Ep. ${continueEpisode}` : 'All Episodes'),
    setSearch: (value: string) => change({ search: value, saga: null, arc: null }),
    selectSaga: (id: string) => change({ saga: id, arc: null, search: null }),
    selectArc: (sagaId: string, arcId: string) => change({ saga: sagaId, arc: arcId, search: null }),
    selectType: (value: EpisodeType | null) => change({ type: value }),
    clearScope: () => change({ saga: null, arc: null, search: null }),
    setPage: (value: number) => change({ page: String(value) }),
  };
}

export type EpisodeBrowser = ReturnType<typeof useEpisodeBrowser>;
