import type { ThemeName } from '@/types';

// ── Crew Names ─────────────────────────────────────────────────────────────────
export interface CrewItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  rarityColor: string;
}

export const CREW_LIST: CrewItem[] = [
  { id: 'strawhat-pirates', name: 'Straw Hat Pirates', emoji: '🎩', cost: 0, description: 'The crew that will shake the world!', rarity: 'Common', rarityColor: 'text-slate-300' },
  { id: 'blackbeard-pirates', name: 'Blackbeard Pirates', emoji: '🏴‍☠️', cost: 2_000_000, description: 'The darkness that swallowed two Devil Fruits.', rarity: 'Common', rarityColor: 'text-slate-300' },
  { id: 'redhair-pirates', name: 'Red Hair Pirates', emoji: '🍖', cost: 5_000_000, description: "Shanks' legendary crew of the New World.", rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'cross-guild', name: 'Cross Guild', emoji: '⚔️', cost: 5_000_000, description: 'Buggy, Mihawk, and Crocodile — a new Yonko crew.', rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'whitebeard-pirates', name: 'Whitebeard Pirates', emoji: '🪦', cost: 8_000_000, description: "The world's strongest man and his family of 1,600.", rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'beast-pirates', name: 'Beast Pirates', emoji: '🐉', cost: 8_000_000, description: "Kaido's crew of SMILE fruit users — the strongest army.", rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'big-mom-pirates', name: 'Big Mom Pirates', emoji: '🍰', cost: 8_000_000, description: "Charlotte Linlin's enormous family empire on Whole Cake Island.", rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'roger-pirates', name: 'Roger Pirates', emoji: '☠️', cost: 20_000_000, description: 'The only crew to conquer the Grand Line and find One Piece.', rarity: 'Rare', rarityColor: 'text-blue-400' },
  { id: 'rocks-pirates', name: 'Rocks Pirates', emoji: '⚡', cost: 20_000_000, description: "The God Valley incident. Rocks D. Xebec's terrifying crew.", rarity: 'Rare', rarityColor: 'text-blue-400' },
  { id: 'heart-pirates', name: 'Heart Pirates', emoji: '⚕️', cost: 10_000_000, description: "Trafalgar Law's Submarine Pirates — the Surgeon of Death.", rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'kid-pirates', name: 'Kid Pirates', emoji: '⚙️', cost: 10_000_000, description: "Eustass Kid's magnetic crew of the New World.", rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'donquixote-pirates', name: 'Donquixote Pirates', emoji: '🦩', cost: 15_000_000, description: "Doflamingo's family of strings and darkness. Fufufu...", rarity: 'Rare', rarityColor: 'text-blue-400' },
  { id: 'sun-pirates', name: 'Sun Pirates', emoji: '☀️', cost: 10_000_000, description: "Fisher Tiger's liberating crew — defenders of Fish-Man Island.", rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'kuja-pirates', name: 'Kuja Pirates', emoji: '🏹', cost: 12_000_000, description: "The Pirate Empress Boa Hancock's all-female warrior crew.", rarity: 'Rare', rarityColor: 'text-blue-400' },
  { id: 'thriller-bark-pirates', name: 'Thriller Bark Pirates', emoji: '🦇', cost: 8_000_000, description: "Gecko Moria's shadow army aboard the world's largest ship.", rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'fire-tank-pirates', name: 'Fire Tank Pirates', emoji: '🔥', cost: 10_000_000, description: "Capone Bege's mafia-style crew — the Godfather of the seas.", rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'bonney-pirates', name: 'Bonney Pirates', emoji: '🍕', cost: 8_000_000, description: "Jewelry Bonney's crew — she can change anyone's age.", rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'hawkins-pirates', name: 'Hawkins Pirates', emoji: '🃏', cost: 8_000_000, description: "Basil Hawkins reads fate with tarot cards — a Supernova.", rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'on-air-pirates', name: 'On Air Pirates', emoji: '🎵', cost: 8_000_000, description: "Scratchmen Apoo's music-powered crew — the Roar of the Sea.", rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'fallen-monk-pirates', name: 'Fallen Monk Pirates', emoji: '☯️', cost: 8_000_000, description: "Urouge's mysterious sky-island Supernova crew.", rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'drake-pirates', name: 'Drake Pirates', emoji: '🦕', cost: 8_000_000, description: "X Drake — the Marine spy who leads his own pirate crew.", rarity: 'Uncommon', rarityColor: 'text-green-400' },
  { id: 'buggy-pirates', name: 'Buggy Pirates', emoji: '🤡', cost: 2_000_000, description: "Captain Buggy the Star Clown — now a Yonko somehow!", rarity: 'Common', rarityColor: 'text-slate-300' },
  { id: 'void-century', name: 'Void Century', emoji: '📜', cost: 500_000_000, description: 'The Ancient Kingdom. The lost 100 years erased by the World Government.', rarity: 'Legendary', rarityColor: 'text-yellow-300' },
];

// ── Skin definitions — ONLY Poneglyph skin remains ───────────────────────────
export interface SkinShopItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  features: string[];
  rarity: 'Legendary';
  rarityColor: string;
  themeKey?: ThemeName;
}

export const SHOP_SKINS: SkinShopItem[] = [
  {
    id: 'poneglyph',
    name: 'Void Century (Poneglyph)',
    emoji: '📜',
    cost: 1_000_000_000,
    description: 'The lost history. The truth they tried to erase.',
    features: [
      'Text glitches until hovered — READ THE PONEGLYPHS',
      'Glitch Text FX — All headings glitch until hovered site-wide',
      'Ancient Symbols — Cryptic glyphs float across backgrounds',
      'Scan Line FX — A travelling scan line sweeps each page',
      'Animated Border — Pulsing aurora gradient frames cards',
    ],
    rarity: 'Legendary',
    rarityColor: 'text-yellow-300',
    themeKey: undefined,
  },
];

export const SHOP_KEY = (uid: string) => `grandline_shop_${uid}`;

export function getShopState(uid: string) {
  try {
    return JSON.parse(localStorage.getItem(SHOP_KEY(uid)) || '{}');
  } catch {
    return {};
  }
}

export function saveShopState(uid: string, data: object) {
  const existing = getShopState(uid);
  localStorage.setItem(SHOP_KEY(uid), JSON.stringify({ ...existing, ...data }));
}
