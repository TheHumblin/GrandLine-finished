import { OVA_BOUNTY_REWARD } from '@/constants/bounty';
import { OVAS } from '@/data/ovas';

const OVA_IDS = new Set(OVAS.map(ova => ova.id));
export function countWatchedOVAs(value: unknown): number {
  if (!Array.isArray(value)) return 0;
  return new Set(value.filter((id): id is number => typeof id === 'number' && OVA_IDS.has(id))).size;
}

// One shared calculation for the authenticated profile and public bounty board.
export function calculateEarnedBounty(progress: object): number {
  const data = progress as Record<string, unknown>;
  const count = (key: string) => Array.isArray(data[key]) ? (data[key] as unknown[]).length : 0;
  const chapters = typeof data.currentMangaChapter === 'number' ? data.currentMangaChapter : 0;
  return count('watchedEpisodes') * 1_000_000 + count('watchedMovies') * 5_000_000
    + count('watchedSpecials') * 2_000_000 + count('watchedLiveAction') * 2_000_000
    + countWatchedOVAs(data.watchedOVAs) * OVA_BOUNTY_REWARD + chapters * 100_000;
}
