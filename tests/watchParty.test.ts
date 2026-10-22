import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { formatPartyTime, getPartyCue, getSnapshotClock, normalizeRoomCode } from '@/lib/watchParty';
import { roomCodeSchema, createPartySchema, chatSchema, cueTimeSchema } from '@/lib/partyValidations';
import type { PartyRoom, PartySnapshot } from '@/types/watchParty';

const room: PartyRoom = { id: 'room', code: 'A1B2C3D4', user_id: 'captain', name: 'Crew night', episode_number: 1180, audio: 'sub', playback_state: 'waiting', position_seconds: 90, starts_at: null, created_at: '2026-10-22T00:00:00Z', expires_at: '2026-10-23T00:00:00Z', updated_at: '2026-10-22T00:00:00Z' };
const start = Date.parse('2026-10-22T00:00:10Z');
describe('Cloud watch party cues', () => {
  it('counts down without advancing the reference time prematurely', () => {
    const cue = getPartyCue({ ...room, playback_state: 'playing', starts_at: new Date(start).toISOString() }, start - 5000);
    expect(cue).toEqual({ countdown: 5, seconds: 90, phase: 'countdown' });
  });
  it('advances after the shared start and preserves a paused position', () => {
    expect(getPartyCue({ ...room, playback_state: 'playing', starts_at: new Date(start).toISOString() }, start + 7000).seconds).toBe(97);
    expect(getPartyCue({ ...room, playback_state: 'paused' }, start + 7000).seconds).toBe(90);
  });
  it('uses server time instead of the user’s wall clock', () => {
    const snapshot = { room, server_now: new Date(start).toISOString(), receivedAt: 1_000_000, members: [], messages: [] } as PartySnapshot;
    expect(getSnapshotClock(snapshot, 1_004_000)).toBe(start + 4000);
  });
  it('formats reference time and bounds it to three hours', () => {
    expect(formatPartyTime(97)).toBe('01:37'); expect(formatPartyTime(-20)).toBe('00:00');
    expect(getPartyCue({ ...room, playback_state: 'playing', starts_at: new Date(start).toISOString() }, start + 99_999_000).seconds).toBe(10800);
  });
});
describe('Party form validation', () => {
  it('accepts codes and invitation links, not legacy device-local codes', () => {
    expect(normalizeRoomCode(' a1b2c3d4 ')).toBe('A1B2C3D4');
    expect(normalizeRoomCode('https://example.com/watch-party?room=a1b2c3d4')).toBe('A1B2C3D4');
    expect(roomCodeSchema.safeParse({ code: 'A1B2C3' }).success).toBe(false);
    expect(normalizeRoomCode('https://')).toBe('');
    expect(normalizeRoomCode('https://example.com/watch-party')).toBe('');
  });
  it('allows episode 1180 but rejects invalid episode numbers', () => {
    const schema = createPartySchema(1180);
    expect(schema.safeParse({ name: 'Crew', episode: 1180 }).success).toBe(true);
    for (const episode of [0, 1181, 2.5, NaN]) expect(schema.safeParse({ name: 'Crew', episode }).success).toBe(false);
  });
  it('requires meaningful chat and accepts spoiler tagging', () => {
    expect(chatSchema.safeParse({ text: '   ', spoiler: false }).success).toBe(false);
    expect(chatSchema.safeParse({ text: 'A reveal', spoiler: true }).success).toBe(true);
    expect(chatSchema.safeParse({ text: 'a'.repeat(501), spoiler: false }).success).toBe(false);
  });
  it('validates manual seek cues', () => {
    expect(cueTimeSchema.safeParse({ time: '02:30' }).success).toBe(true);
    for (const time of ['2:99', '-1:00', '180:01', 'abc']) expect(cueTimeSchema.safeParse({ time }).success).toBe(false);
  });
});
describe('Watch party integration contract', () => {
  it('uses authenticated cloud commands and visible-tab polling rather than local room data', () => {
    const api = readFileSync('src/lib/partyApi.ts', 'utf8');
    const hook = readFileSync('src/hooks/useWatchParty.ts', 'utf8');
    expect(api).toContain("supabase.rpc('watch_party_command'");
    expect(hook).toContain('refetchInterval: PARTY_POLL_MS');
    expect(hook).toContain('refetchIntervalInBackground: false');
    expect(api).not.toContain('localStorage');
  });
  it('does not pretend to control a cross-origin player', () => {
    const cue = readFileSync('src/components/features/PartyPlaybackCue.tsx', 'utf8');
    expect(cue).toContain('Play, pause, and seek inside the external player are manual');
    const player = readFileSync('src/components/features/PartyVideoStage.tsx', 'utf8');
    expect(player).not.toContain('postMessage');
    expect(player).toContain('Mark watched');
    expect(cue).toContain('connected ? clock : getPartyCue');
    expect(player).not.toContain('sandbox=');
  });
});
