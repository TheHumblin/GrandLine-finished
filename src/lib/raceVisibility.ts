import { RACE_ARTWORK_EPISODES, RACE_DETAIL_EPISODES } from '@/data/raceSpoilers';
import { RACE_ASSET_KEYS } from '@/data/raceImages';
import type { Race } from '@/types';

export interface RaceProgress { currentEpisode: number; showSpoilers: boolean; }
const normalizeAssetKey = (key: string) => key.toLowerCase().replace(/-\d+$/, '');

export function raceUnlockEpisode(race: Race): number {
  return Math.max(race.appearsAtEpisode, RACE_DETAIL_EPISODES[race.id] ?? race.appearsAtEpisode);
}
export function isRaceLocked(race: Race, progress: RaceProgress): boolean {
  return !progress.showSpoilers && progress.currentEpisode < raceUnlockEpisode(race);
}
export function sourceArtworkUnlockEpisode(key: string): number | undefined {
  return RACE_ARTWORK_EPISODES[normalizeAssetKey(key)];
}
export function raceArtworkUnlockEpisode(id: string, assets: Record<string, string> = {}): number | undefined {
  const keys = RACE_ASSET_KEYS[id] ?? [];
  const matched = keys.find(key => assets[key]);
  return sourceArtworkUnlockEpisode(matched ?? keys[0] ?? '');
}
export function canViewRaceArtwork(unlockEpisode: number | undefined, progress: RaceProgress): boolean {
  return progress.showSpoilers || (unlockEpisode !== undefined && progress.currentEpisode >= unlockEpisode);
}
