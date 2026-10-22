import { describe, expect, it } from 'vitest';
import { DEVIL_FRUITS } from '@/data/devilFruits';
import { visibleFruit } from '@/lib/fruitVisibility';
import { buildFruitCatalog } from '@/lib/fruitCatalog';
const fruit = (id: string) => DEVIL_FRUITS.find(fruit => fruit.id === id)!;
const progress = (currentEpisode: number, showSpoilers = false) => ({ currentEpisode, showSpoilers });
describe('Devil Fruit Anti-Spoiler', () => {
  it('protects guests and zero-progress users without a grace window', () => {
    expect(visibleFruit(fruit('gomu-gomu'), progress(0))).toBeNull();
    expect(visibleFruit(fruit('bara-bara'), progress(4))).toBeNull();
    expect(visibleFruit(fruit('bara-bara'), progress(5))).not.toBeNull();
  });
  it('hides Nika identity, true classification, and Gear 5 before their reveal', () => {
    const safe = visibleFruit(fruit('gomu-gomu'), progress(100))!;
    expect(safe.name).toBe('Gomu Gomu no Mi');
    expect(safe.type).toBe('Paramecia');
    expect(safe.awakened).toBe(false);
    expect(JSON.stringify(safe)).not.toMatch(/Nika|Gear 5|Sun God/);
    expect(visibleFruit(fruit('gomu-gomu'), progress(1071))!.type).toBe('Mythical Zoan');
  });
  it('does not expose later fruit users or awakenings', () => {
    expect(visibleFruit(fruit('mera-mera'), progress(100))!.user).toBe('Portgas D. Ace');
    expect(visibleFruit(fruit('mera-mera'), progress(678))!.user).toBe('Sabo');
    expect(visibleFruit(fruit('suke-suke'), progress(400))!.user).toBe('Absalom');
    expect(visibleFruit(fruit('gura-gura'), progress(470))!.user).not.toContain('Teach');
    expect(visibleFruit(fruit('ope-ope'), progress(400))!.awakened).toBe(false);
  });
  it('keeps unknown boundaries and unwatched movie fruits protected', () => {
    const extra = buildFruitCatalog([{ slug: 'example', name: 'Example Fruit', romanizedName: 'Example no Mi', image: '', sourceUrl: 'https://onepiecedevilfruits.com/fruit/example/' }]).find(entry => entry.id === 'source-example')!;
    expect(visibleFruit(extra, progress(1180))).toBeNull();
    expect(visibleFruit(fruit('fuwa-fuwa'), progress(1180))).toBeNull();
    expect(visibleFruit(fruit('fuwa-fuwa'), { ...progress(0), watchedMovies: [10] })).not.toBeNull();
  });
  it('allows explicit spoiler opt-out and revokes visible detail on opt-in', () => {
    expect(visibleFruit(fruit('inu-inu-kyubi'), progress(0, true))).not.toBeNull();
    expect(visibleFruit(fruit('inu-inu-kyubi'), progress(0))).toBeNull();
  });
});
