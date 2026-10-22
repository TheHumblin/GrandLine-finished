import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LA_EPISODES } from '@/data/liveAction';
import { calculateEarnedBounty } from '@/lib/bounty';
import { mergeProgress } from '@/lib/mergeProgress';

const admin = readFileSync(new URL('../src/pages/Admin.tsx', import.meta.url), 'utf8');
const player = readFileSync(new URL('../src/pages/LiveAction.tsx', import.meta.url), 'utf8');
describe('Pirate King live-action completion', () => {
  it('uses the shared catalog for both playback and admin Max Out', () => {
    expect(admin).toContain("import { LA_EPISODES } from '@/data/liveAction'");
    expect(player).toContain("import { LA_EPISODES } from '@/data/liveAction'");
    expect(player).not.toContain('const LA_EPISODES:');
    const action = admin.slice(admin.indexOf('const maxOutProgress ='), admin.indexOf('const watchedCount ='));
    expect(action).toContain('watchedLiveAction: LA_EPISODES.map(episode => episode.id)');
    expect(action).toContain('currentEpisode: MAX_EPISODES');
    expect(action).not.toContain('showSpoilers:');
  });
  it('includes eight episodes in each season without duplicate IDs', () => {
    expect(LA_EPISODES.filter(episode => episode.season === 1)).toHaveLength(8);
    expect(LA_EPISODES.filter(episode => episode.season === 2)).toHaveLength(8);
    expect(new Set(LA_EPISODES.map(episode => episode.id)).size).toBe(16);
  });
  it('keeps complete live-action progress through cloud reconciliation and rewards it once', () => {
    const all = LA_EPISODES.map(episode => episode.id);
    const merged = mergeProgress({ watchedLiveAction: [1, 2, 9] }, { watchedLiveAction: all });
    expect(new Set(merged.watchedLiveAction)).toEqual(new Set(all));
    expect(merged.watchedLiveAction).toHaveLength(16);
    expect(calculateEarnedBounty(merged)).toBe(32_000_000);
    expect(mergeProgress(merged, { watchedLiveAction: all }).watchedLiveAction).toHaveLength(16);
  });
});
