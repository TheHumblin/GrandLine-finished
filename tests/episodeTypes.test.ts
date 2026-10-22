import { describe, expect, it } from 'vitest';
import { ANIME_CANON_EPISODES, FILLER_EPISODES, MANGA_CANON_EPISODES, MIXED_CANON_EPISODES, getEpisodeType } from '@/data/episodeTypes';
import { episodeNumbers, filterEpisodeNumbers, getAdjacentEpisode } from '@/lib/episodeFilters';

describe('AnimeFillerList classifications', () => {
  it('matches all four source lists without gaps or overlap through 1168', () => {
    const lists = [MANGA_CANON_EPISODES, ANIME_CANON_EPISODES, MIXED_CANON_EPISODES, FILLER_EPISODES];
    expect(FILLER_EPISODES.size).toBe(94);
    for (let number = 1; number <= 1168; number++) expect(lists.filter(list => list.has(number))).toHaveLength(1);
  });
  it('corrects filler and canon episodes that were previously mislabelled', () => {
    expect(getEpisodeType(196)).toBe('filler');
    expect(getEpisodeType(1030)).toBe('filler');
    expect(getEpisodeType(500)).toBe('manga-canon');
    expect(getEpisodeType(213)).toBe('anime-canon');
    expect(getEpisodeType(226)).toBe('mixed-canon');
  });
  it('hides every filler while retaining anime and mixed canon', () => {
    const visible = filterEpisodeNumbers(episodeNumbers(1, 1180), { hideFiller: true });
    expect(visible).toHaveLength(1086);
    expect(visible.some(number => FILLER_EPISODES.has(number))).toBe(false);
    expect(visible).toContain(50);
    expect(visible).toContain(61);
  });
  it('filters the entire catalog rather than only the first 50 episodes', () => {
    expect(filterEpisodeNumbers(episodeNumbers(1, 1180), { hideFiller: false, selectedType: 'filler' })).toHaveLength(94);
  });
  it('skips complete filler arcs forward and backward and respects catalog bounds', () => {
    expect(getAdjacentEpisode(53, 1, 1180, true)).toBe(61);
    expect(getAdjacentEpisode(61, -1, 1180, true)).toBe(53);
    expect(getAdjacentEpisode(195, 1, 1180, true)).toBe(207);
    expect(getAdjacentEpisode(1180, 1, 1180, true)).toBeNull();
  });
});
