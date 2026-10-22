import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { RACES } from '@/data/races';
import { RACE_ARTWORK_EPISODES } from '@/data/raceSpoilers';
import { canViewRaceArtwork, isRaceLocked, raceArtworkUnlockEpisode, raceUnlockEpisode, sourceArtworkUnlockEpisode } from '@/lib/raceVisibility';

const progress = (currentEpisode: number, showSpoilers = false) => ({ currentEpisode, showSpoilers });
describe('Progressive race artwork Anti-Spoiler', () => {
  it('protects guests and unlocks each dossier exactly at its checkpoint', () => {
    for (const race of RACES) {
      const boundary = raceUnlockEpisode(race);
      expect(isRaceLocked(race, progress(0))).toBe(true);
      expect(isRaceLocked(race, progress(boundary - 1))).toBe(true);
      expect(isRaceLocked(race, progress(boundary))).toBe(false);
      expect(isRaceLocked(race, progress(0, true))).toBe(false);
    }
  });
  it('unlocks artwork with Anti-Spoiler still on, not only when it is disabled', () => {
    for (const [key, boundary] of Object.entries(RACE_ARTWORK_EPISODES)) {
      expect(canViewRaceArtwork(sourceArtworkUnlockEpisode(key), progress(boundary - 1))).toBe(false);
      expect(canViewRaceArtwork(sourceArtworkUnlockEpisode(key), progress(boundary))).toBe(true);
    }
  });
  it('uses the same boundary for shared sheets and the gallery', () => {
    for (const id of ['skypiean', 'birkan', 'shandian']) {
      expect(raceArtworkUnlockEpisode(id)).toBe(sourceArtworkUnlockEpisode('angels'));
    }
    expect(raceArtworkUnlockEpisode('human')).toBe(sourceArtworkUnlockEpisode('humans'));
    expect(raceArtworkUnlockEpisode('long-limb', { 'long-arms': 'image.png' })).toBe(sourceArtworkUnlockEpisode('long-arms'));
    expect(sourceArtworkUnlockEpisode('half-longarms-1')).toBe(sourceArtworkUnlockEpisode('half-longarms'));
  });
  it('keeps later source sheets protected after the dossier unlocks', () => {
    const lunarian = RACES.find(race => race.id === 'lunarian')!;
    const boundary = raceArtworkUnlockEpisode(lunarian.id)!;
    expect(isRaceLocked(lunarian, progress(1062))).toBe(false);
    expect(canViewRaceArtwork(boundary, progress(1062))).toBe(false);
    expect(canViewRaceArtwork(boundary, progress(boundary))).toBe(true);
    const buccaneer = RACES.find(race => race.id === 'buccaneer')!;
    expect(isRaceLocked(buccaneer, progress(1128))).toBe(true);
    expect(isRaceLocked(buccaneer, progress(1129))).toBe(false);
  });
  it('does not invent checkpoints for manga-only or unmatched sheets', () => {
    for (const key of ['aliens', 'mystery-giants', 'races', 'unknown-source']) {
      expect(sourceArtworkUnlockEpisode(key)).toBeUndefined();
      expect(canViewRaceArtwork(sourceArtworkUnlockEpisode(key), progress(1180))).toBe(false);
      expect(canViewRaceArtwork(sourceArtworkUnlockEpisode(key), progress(0, true))).toBe(true);
    }
  });
  it('revokes artwork immediately when progress or spoiler preferences change', () => {
    const boundary = sourceArtworkUnlockEpisode('lunarians');
    expect(canViewRaceArtwork(boundary, progress(0, true))).toBe(true);
    expect(canViewRaceArtwork(boundary, progress(0))).toBe(false);
    expect(canViewRaceArtwork(boundary, progress(1109))).toBe(true);
    expect(canViewRaceArtwork(boundary, progress(1108))).toBe(false);
  });
  it('avoids blanket artwork hiding and withholds locked image URLs from the UI', () => {
    const page = readFileSync(new URL('../src/pages/Races.tsx', import.meta.url), 'utf8');
    const gallery = readFileSync(new URL('../src/components/features/RaceSourceGallery.tsx', import.meta.url), 'utf8');
    expect(page).not.toContain('protectedArtwork={!showSpoilers}');
    expect(page).toContain('src={protectedArtwork ? undefined : raceSourceImage');
    expect(page).toContain('src={artworkProtected(selected) ? undefined : raceSourceImage');
    expect(gallery.indexOf('if (!unlocked) return')).toBeLessThan(gallery.indexOf('const name = key.replace'));
  });
});
