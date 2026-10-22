import { describe, expect, it } from 'vitest';
import { buildFruitCatalog } from '@/lib/fruitCatalog';
import { visibleFruit } from '@/lib/fruitVisibility';
import { raceSourceImage } from '@/data/raceImages';

describe('Source encyclopedia catalog', () => {
  it('matches source fruit names and artwork without duplicate entries', () => {
    const catalog = buildFruitCatalog([{ slug: 'gum-gum-fruit', name: 'Gum-Gum Fruit', romanizedName: 'Hito Hito no Mi, Model: Nika', image: 'https://cd-opf.pages.dev/fruits/verified.webp', sourceUrl: 'https://onepiecedevilfruits.com/fruit/gum-gum-fruit/' }]);
    expect(catalog.filter(fruit => fruit.sourceSlug === 'gum-gum-fruit')).toHaveLength(1);
    expect(catalog.find(fruit => fruit.id === 'gomu-gomu')!.image).toContain('cd-opf.pages.dev');
  });
  it('includes additional source fruits with conservative reveal checkpoints', () => {
    const catalog = buildFruitCatalog([{ slug: 'rumble-rumble-fruit', name: 'Rumble-Rumble Fruit', romanizedName: 'Goro Goro no Mi', image: '', sourceUrl: 'https://onepiecedevilfruits.com/fruit/rumble-rumble-fruit/' }]);
    const fruit = catalog.find(fruit => fruit.id === 'source-rumble-rumble-fruit')!;
    expect(fruit.type).toBe('Logia');
    expect(visibleFruit(fruit, { currentEpisode: 194, showSpoilers: false })).toBeNull();
    expect(visibleFruit(fruit, { currentEpisode: 195, showSpoilers: false })!.user).toBe('User history protected');
  });
  it('uses Ohara artwork without substituting unrelated character images', () => {
    expect(raceSourceImage('human')).toContain('thelibraryofohara.com');
    expect(raceSourceImage('long-neck', { snakenecks: 'https://thelibraryofohara.com/snakenecks.png' })).toContain('snakenecks.png');
    expect(raceSourceImage('skeleton')).toBe('');
  });
});
