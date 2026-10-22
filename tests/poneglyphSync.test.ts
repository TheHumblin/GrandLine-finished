import { describe, expect, it } from 'vitest';
import { mergeProgress } from '@/lib/mergeProgress';

describe('Legendary Poneglyph persistence', () => {
  it('retains an active overlay and ownership during ordinary cloud merges', () => {
    const merged = mergeProgress({ ownedSkins: ['poneglyph'], poneglyphActive: true }, { theme: 'strawhat' });
    expect(merged.poneglyphActive).toBe(true);
    expect(merged.ownedSkins).toContain('poneglyph');
  });
  it('honors a newer deactivation from another device', () => {
    const merged = mergeProgress({ poneglyphActive: false, _fieldUpdatedAt: { poneglyphActive: '2026-10-22T12:00:00Z' } }, { poneglyphActive: true, _fieldUpdatedAt: { poneglyphActive: '2026-10-21T12:00:00Z' } });
    expect(merged.poneglyphActive).toBe(false);
  });
});
