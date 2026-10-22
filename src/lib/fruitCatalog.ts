import { DEVIL_FRUITS, FRUIT_TYPES } from '@/data/devilFruits';
import { sourceFruitReveal } from '@/data/sourceFruitReveals';
import type { EncyclopediaFruit, SourceFruit } from '@/types/encyclopedia';

const normalize = (value: string) => value.toLowerCase().replace(/kiro/g, 'kilo').replace(/daibutsu/g, 'buddha').replace(/[^a-z0-9]/g, '');
function fruitKey(name: string): string {
  if (name.includes('Nika')) return normalize('Hito Hito no Mi, Model: Nika');
  return normalize(name);
}
export function mergeFruitSource(fruit: EncyclopediaFruit, source?: SourceFruit): EncyclopediaFruit {
  if (!source) return fruit;
  const type = FRUIT_TYPES.find(type => type === source.type);
  return { ...fruit, englishName: source.name, sourceUrl: source.sourceUrl, sourceSlug: source.slug, image: source.image || fruit.image, ...(type ? { type, classificationVerified: true } : {}), ...(source.user ? { user: source.user } : {}), ...(source.description ? { description: source.description } : {}) };
}
export function buildFruitCatalog(sources: SourceFruit[] = []): EncyclopediaFruit[] {
  const used = new Set<string>();
  const known = DEVIL_FRUITS.map(fruit => {
    const source = sources.find(entry => fruitKey(entry.romanizedName) === fruitKey(fruit.name));
    if (source) used.add(source.slug);
    return mergeFruitSource({ ...fruit, classificationVerified: true }, source);
  });
  const extra: EncyclopediaFruit[] = sources.filter(source => !used.has(source.slug)).map(source => {
    const reveal = sourceFruitReveal(source.romanizedName);
    const sourceType = FRUIT_TYPES.find(type => type === source.type);
    return {
      id: `source-${source.slug}`, name: source.romanizedName || source.name, englishName: source.name,
      type: reveal?.type || sourceType || 'Paramecia', classificationVerified: Boolean(reveal || sourceType),
      user: source.user || 'Select for source details', ability: '', description: '', awakened: false,
      image: source.image, firstAppearance: reveal ? `Protected until episode ${reveal.episode} (completed-arc checkpoint)` : 'Spoiler boundary not yet verified',
      appearsAtEpisode: reveal?.episode || 0, status: 'Unknown' as const, sourceUrl: source.sourceUrl, sourceSlug: source.slug,
    };
  });
  return [...known, ...extra];
}
