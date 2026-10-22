const BASE = 'https://thelibraryofohara.com/wp-content/uploads/2025/03/';
// Confirmed image files from the Library of Ohara race article and its attachment index.
export const LIBRARY_RACE_IMAGES: Record<string, string> = {
  human: BASE + 'humans.png', giant: BASE + 'giants.png', dwarf: BASE + 'dwarves.png',
  mink: BASE + 'minks.png', fishman: BASE + 'fish-men.png', merfolk: BASE + 'mermen.png',
  skypiean: BASE + 'angels.png', birkan: BASE + 'angels.png', shandian: BASE + 'angels.png',
  lunarian: BASE + 'lunarians.png', 'ancient-giant': BASE + 'ancient-giants.png',
  'celestial-dragon': BASE + 'humans.png', wotan: BASE + 'watans.png', oni: BASE + 'onis.png', buccaneer: BASE + 'buccaneers.png',
};
export const RACE_ASSET_KEYS: Record<string, string[]> = {
  human: ['humans'], giant: ['giants'], dwarf: ['dwarves'], mink: ['minks'], fishman: ['fish-men'], merfolk: ['mermen'],
  skypiean: ['angels'], birkan: ['angels'], shandian: ['angels'], lunarian: ['lunarians'],
  'long-limb': ['longarms', 'long-arms'], 'long-neck': ['snakenecks', 'snake-necks', 'longnecks'],
  'three-eye': ['three-eyed', 'three-eyes', 'three-eyeds'], 'ancient-giant': ['ancient-giants'],
  'celestial-dragon': ['humans'], wotan: ['watans'], oni: ['onis'], buccaneer: ['buccaneers'],
};
export function raceSourceImage(id: string, assets: Record<string, string> = {}): string {
  const filename = RACE_ASSET_KEYS[id]?.find(key => assets[key]);
  return filename ? assets[filename] : LIBRARY_RACE_IMAGES[id] || '';
}
