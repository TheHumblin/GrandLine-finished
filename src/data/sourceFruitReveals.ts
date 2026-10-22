import type { DevilFruit } from '@/types';
interface SourceFruitReveal { type: DevilFruit['type']; episode: number; }
// Conservative completed-arc checkpoints for additional source fruits.
// Unlisted fruits remain locked rather than inventing an anime reveal boundary.
const groups: { type: DevilFruit['type']; episode: number; names: string[] }[] = [
  { type: 'Logia', episode: 53, names: ['Moku Moku no Mi'] },
  { type: 'Logia', episode: 195, names: ['Goro Goro no Mi'] },
  { type: 'Logia', episode: 629, names: ['Yuki Yuki no Mi'] },
  { type: 'Logia', episode: 1085, names: ['Mori Mori no Mi'] },
  { type: 'Zoan', episode: 130, names: ['Mogu Mogu no Mi', 'Inu Inu no Mi, Model: Dachshund', 'Inu Inu no Mi, Model: Jackal', 'Tori Tori no Mi, Model: Falcon', 'Ushi Ushi no Mi, Model: Bison'] },
  { type: 'Zoan', episode: 195, names: ['Uma Uma no Mi'] },
  { type: 'Zoan', episode: 312, names: ['Inu Inu no Mi, Model: Wolf', 'Zo Zo no Mi', 'Zou Zou no Mi'] },
  { type: 'Zoan', episode: 629, names: ['Sara Sara no Mi, Model: Ahorotoru'] },
  { type: 'Zoan', episode: 746, names: ['Mushi Mushi no Mi, Model: Suzumebachi', 'Mushi Mushi no Mi, Model: Kabutomushi'] },
  { type: 'Ancient Zoan', episode: 1085, names: ['Ryu Ryu no Mi, Model: Allosaurus', 'Ryu Ryu no Mi, Model: Spinosaurus', 'Neko Neko no Mi, Model: Saber Tiger', 'Ryu Ryu no Mi, Model: Triceratops', 'Ryu Ryu no Mi, Model: Pachycephalosaurus', 'Kumo Kumo no Mi, Model: Rosamygale Grauvogeli'] },
  { type: 'Mythical Zoan', episode: 1085, names: ['Inu Inu no Mi, Model: Tanuki', 'Hito Hito no Mi, Model: Onyudo'] },
  { type: 'Paramecia', episode: 312, names: ['Awa Awa no Mi', 'Beri Beri no Mi', 'Sabi Sabi no Mi', 'Shari Shari no Mi'] },
  { type: 'Paramecia', episode: 489, names: ['Kira Kira no Mi', 'Woshu Woshu no Mi'] },
  { type: 'Paramecia', episode: 574, names: ['Mato Mato no Mi'] },
  { type: 'Paramecia', episode: 746, names: ['Buki Buki no Mi', 'Giro Giro no Mi', 'Jake Jake no Mi', 'Ton Ton no Mi', 'Nui Nui no Mi', 'Guru Guru no Mi', 'Beta Beta no Mi', 'Ato Ato no Mi', 'Ishi Ishi no Mi', 'Sui Sui no Mi', 'Hira Hira no Mi', 'Pamu Pamu no Mi', 'Chiyu Chiyu no Mi', 'Nagi Nagi no Mi'] },
  { type: 'Paramecia', episode: 877, names: ['Bisu Bisu no Mi', 'Pero Pero no Mi', 'Kuri Kuri no Mi', 'Buku Buku no Mi', 'Shibo Shibo no Mi', 'Memo Memo no Mi', 'Mira Mira no Mi', 'Tama Tama no Mi', 'Hoya Hoya no Mi', 'Netsu Netsu no Mi', 'Kuku Kuku no Mi', 'Bata Bata no Mi', 'Shiro Shiro no Mi'] },
  { type: 'Paramecia', episode: 1085, names: ['Kibi Kibi no Mi', 'Toki Toki no Mi', 'Juku Juku no Mi', 'Fuku Fuku no Mi', 'Fude Fude no Mi', 'Oto Oto no Mi', 'Maki Maki no Mi', 'Kobu Kobu no Mi', 'Oshi Oshi no Mi'] },
];
export const normalizeFruitName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
const reveals = new Map<string, SourceFruitReveal>();
groups.forEach(group => group.names.forEach(name => reveals.set(normalizeFruitName(name), { type: group.type, episode: group.episode })));
export const sourceFruitReveal = (name: string): SourceFruitReveal | undefined => reveals.get(normalizeFruitName(name));
