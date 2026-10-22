export interface CanonPirate {
  key: string;
  name: string;
  epithet: string;
  bounty: number;
  emoji: string;
  color: string;
}

export const CANON_BOUNTIES: CanonPirate[] = [
  { key: 'Gol_D._Roger', name: 'Gol D. Roger', epithet: 'Pirate King', bounty: 5_564_800_000, emoji: '☠️', color: 'from-yellow-800 to-amber-900' },
  { key: 'Edward_Newgate', name: 'Edward Newgate', epithet: 'Strongest Man in the World', bounty: 5_046_000_000, emoji: '🪦', color: 'from-blue-900 to-indigo-950' },
  { key: 'Kaidou', name: 'Kaido', epithet: 'Strongest Creature', bounty: 4_611_100_000, emoji: '🐉', color: 'from-red-900 to-rose-950' },
  { key: 'Charlotte_Linlin', name: 'Charlotte Linlin', epithet: 'Big Mom', bounty: 4_388_000_000, emoji: '🍰', color: 'from-pink-900 to-rose-900' },
  { key: 'Shanks', name: 'Shanks', epithet: 'Red-Haired', bounty: 4_048_900_000, emoji: '🍖', color: 'from-red-800 to-red-950' },
  { key: 'Marshall_D._Teach', name: 'Marshall D. Teach', epithet: 'Blackbeard', bounty: 3_996_000_000, emoji: '🏴‍☠️', color: 'from-slate-800 to-slate-950' },
  { key: 'Monkey_D._Luffy', name: 'Monkey D. Luffy', epithet: 'Nika / Joy Boy', bounty: 3_000_000_000, emoji: '🎩', color: 'from-amber-800 to-yellow-950' },
  { key: 'Trafalgar_D._Water_Law', name: 'Trafalgar D. Law', epithet: 'Surgeon of Death', bounty: 3_000_000_000, emoji: '⚕️', color: 'from-slate-700 to-slate-900' },
  { key: 'Eustass_Kid', name: 'Eustass Kid', epithet: 'Captain', bounty: 3_000_000_000, emoji: '⚙️', color: 'from-red-800 to-rose-950' },
  { key: 'Roronoa_Zoro', name: 'Roronoa Zoro', epithet: 'Pirate Hunter', bounty: 1_111_000_000, emoji: '⚔️', color: 'from-green-900 to-emerald-950' },
];
