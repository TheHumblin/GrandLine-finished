import { getEpisodeType } from '@/data/episodeTypes';
import type { EpisodeType } from '@/types';

export interface EpisodeFilterOptions { hideFiller: boolean; selectedType?: EpisodeType | null; }

export function filterEpisodeNumbers(numbers: number[], { hideFiller, selectedType }: EpisodeFilterOptions): number[] {
  return numbers.filter(number => {
    const type = getEpisodeType(number);
    return (!hideFiller || type !== 'filler') && (!selectedType || type === selectedType);
  });
}

export function episodeNumbers(start: number, end: number): number[] {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
}

export function getAdjacentEpisode(current: number, direction: 1 | -1, max: number, hideFiller: boolean): number | null {
  for (let number = current + direction; number >= 1 && number <= max; number += direction) {
    if (!hideFiller || getEpisodeType(number) !== 'filler') return number;
  }
  return null;
}
