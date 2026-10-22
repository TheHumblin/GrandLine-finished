import type { MangaChapter } from '@/types';

// Primary sources (WeebCentral)
const WC_BASE  = 'https://weebcentral.com/series/01J76XY7E9FNDZ1DBBM6PBJPFK/One-Piece';
const WCC_BASE = 'https://weebcentral.com/series/01J76XYAQSGEJPXCSCVPQ3MHZM/One-Piece-Digital-Colored-Comics';
// Backup source (readonepiece.com)
const BACKUP_BASE = 'https://ww13.readonepiece.com/manga/one-piece-digital-colored-comics';

export const WC_SERIES_URL  = WC_BASE;
export const WCC_SERIES_URL = WCC_BASE;
export const BACKUP_SERIES_URL = BACKUP_BASE;

export const MANGA_CHAPTERS: MangaChapter[] = [
  { id: 1, number: 1, title: 'Romance Dawn, for the New Era', volume: 1, pages: 53, releaseDate: '1997-07-22', arc: 'Romance Dawn Arc', saga: 'East Blue Saga', hasSBS: false, readUrl: `${WC_BASE}`, coloredUrl: `${WCC_BASE}`, backupUrl: `${BACKUP_BASE}/chapter-1/` },
  { id: 2, number: 2, title: 'They Call Him Straw Hat Luffy', volume: 1, pages: 26, releaseDate: '1997-07-22', arc: 'Romance Dawn Arc', saga: 'East Blue Saga', hasSBS: false, readUrl: `${WC_BASE}`, coloredUrl: `${WCC_BASE}`, backupUrl: `${BACKUP_BASE}/chapter-2/` },
  { id: 3, number: 3, title: 'Enter Zoro: Pirate Hunter', volume: 1, pages: 26, releaseDate: '1997-08-18', arc: 'Romance Dawn Arc', saga: 'East Blue Saga', hasSBS: false, readUrl: `${WC_BASE}`, coloredUrl: `${WCC_BASE}`, backupUrl: `${BACKUP_BASE}/chapter-3/` },
  { id: 4, number: 4, title: 'The Great Captain Morgan', volume: 1, pages: 26, releaseDate: '1997-09-01', arc: 'Romance Dawn Arc', saga: 'East Blue Saga', hasSBS: false, readUrl: `${WC_BASE}`, coloredUrl: `${WCC_BASE}`, backupUrl: `${BACKUP_BASE}/chapter-4/` },
  { id: 5, number: 5, title: 'Pirate King and Master Swordsman', volume: 1, pages: 26, releaseDate: '1997-09-15', arc: 'Romance Dawn Arc', saga: 'East Blue Saga', hasSBS: false, readUrl: `${WC_BASE}`, coloredUrl: `${WCC_BASE}`, backupUrl: `${BACKUP_BASE}/chapter-5/` },
  { id: 6, number: 6, title: 'A Crook Named Nami', volume: 1, pages: 26, releaseDate: '1997-09-22', arc: 'Romance Dawn Arc', saga: 'East Blue Saga', hasSBS: false, readUrl: `${WC_BASE}`, coloredUrl: `${WCC_BASE}`, backupUrl: `${BACKUP_BASE}/chapter-6/` },
  { id: 7, number: 7, title: 'Friends — Completely Illegal', volume: 1, pages: 26, releaseDate: '1997-09-29', arc: 'Romance Dawn Arc', saga: 'East Blue Saga', hasSBS: false, readUrl: `${WC_BASE}`, coloredUrl: `${WCC_BASE}`, backupUrl: `${BACKUP_BASE}/chapter-7/` },
  { id: 8, number: 8, title: 'Introducing Black-Leg Sanji', volume: 1, pages: 26, releaseDate: '1997-10-13', arc: 'Orange Town Arc', saga: 'East Blue Saga', hasSBS: false, readUrl: `${WC_BASE}`, coloredUrl: `${WCC_BASE}`, backupUrl: `${BACKUP_BASE}/chapter-8/` },
  { id: 9, number: 9, title: 'Opposite Poles', volume: 2, pages: 26, releaseDate: '1997-10-20', arc: 'Orange Town Arc', saga: 'East Blue Saga', hasSBS: false, readUrl: `${WC_BASE}`, coloredUrl: `${WCC_BASE}`, backupUrl: `${BACKUP_BASE}/chapter-9/` },
  { id: 10, number: 10, title: 'Incident at the Tavern', volume: 2, pages: 26, releaseDate: '1997-11-10', arc: 'Orange Town Arc', saga: 'East Blue Saga', hasSBS: false, readUrl: `${WC_BASE}`, coloredUrl: `${WCC_BASE}`, backupUrl: `${BACKUP_BASE}/chapter-10/` },
];

export function generateChapters(start: number, end: number): MangaChapter[] {
  const chapters: MangaChapter[] = [];
  const arcs = [
    { start: 1, end: 7, arc: 'Romance Dawn Arc', saga: 'East Blue Saga' },
    { start: 8, end: 21, arc: 'Orange Town Arc', saga: 'East Blue Saga' },
    { start: 22, end: 41, arc: 'Syrup Village Arc', saga: 'East Blue Saga' },
    { start: 42, end: 68, arc: 'Baratie Arc', saga: 'East Blue Saga' },
    { start: 69, end: 95, arc: 'Arlong Park Arc', saga: 'East Blue Saga' },
    { start: 96, end: 100, arc: 'Loguetown Arc', saga: 'East Blue Saga' },
    { start: 101, end: 216, arc: 'Alabasta Arc', saga: 'Alabasta Saga' },
    { start: 217, end: 302, arc: 'Skypiea Arc', saga: 'Sky Island Saga' },
    { start: 303, end: 441, arc: 'Water 7 / Enies Lobby', saga: 'Water 7 Saga' },
    { start: 442, end: 489, arc: 'Thriller Bark Arc', saga: 'Thriller Bark Saga' },
    { start: 490, end: 597, arc: 'Sabaody / Marineford', saga: 'Summit War Saga' },
    { start: 598, end: 653, arc: 'Fish-Man Island Arc', saga: 'Fish-Man Island Saga' },
    { start: 654, end: 801, arc: 'Punk Hazard / Dressrosa', saga: 'Dressrosa Saga' },
    { start: 802, end: 902, arc: 'Zou / Whole Cake Island', saga: 'Whole Cake Island Saga' },
    { start: 903, end: 1057, arc: 'Wano Country Arc', saga: 'Wano Country Saga' },
    { start: 1058, end: 9999, arc: 'Egghead Arc', saga: 'Final Saga' },
  ];
  for (let i = start; i <= end; i++) {
    const arcInfo = arcs.find(a => i >= a.start && i <= a.end) || arcs[arcs.length - 1];
    chapters.push({
      id: i,
      number: i,
      title: `Chapter ${i}`,
      volume: Math.ceil(i / 10),
      pages: 17 + (i % 5),
      releaseDate: '2000-01-01',
      arc: arcInfo.arc,
      saga: arcInfo.saga,
      hasSBS: i >= 43,
      readUrl: WC_BASE,
      coloredUrl: WCC_BASE,
      backupUrl: `${BACKUP_BASE}/chapter-${i}/`,
    });
  }
  return chapters;
}

export const ALL_CHAPTERS_COUNT = 1131;

// ─────────────────────────────────────────────────────────────────────────────
// ARC DEFINITIONS — used for the arc-by-arc reading progress breakdown
// ─────────────────────────────────────────────────────────────────────────────
export interface MangaArc {
  name: string;
  saga: string;
  start: number;
  end: number;     // last chapter in this arc (use ALL_CHAPTERS_COUNT for ongoing)
  color: string;   // Tailwind text colour class
  bg: string;      // Tailwind background class
  border: string;  // Tailwind border class
}

export const MANGA_ARCS: MangaArc[] = [
  // East Blue
  { name: 'Romance Dawn', saga: 'East Blue Saga', start: 1,    end: 7,    color: 'text-blue-300',   bg: 'bg-blue-900/20',   border: 'border-blue-700/30' },
  { name: 'Orange Town',  saga: 'East Blue Saga', start: 8,    end: 21,   color: 'text-blue-300',   bg: 'bg-blue-900/20',   border: 'border-blue-700/30' },
  { name: 'Syrup Village',saga: 'East Blue Saga', start: 22,   end: 41,   color: 'text-blue-300',   bg: 'bg-blue-900/20',   border: 'border-blue-700/30' },
  { name: 'Baratie',      saga: 'East Blue Saga', start: 42,   end: 68,   color: 'text-blue-300',   bg: 'bg-blue-900/20',   border: 'border-blue-700/30' },
  { name: 'Arlong Park',  saga: 'East Blue Saga', start: 69,   end: 95,   color: 'text-blue-300',   bg: 'bg-blue-900/20',   border: 'border-blue-700/30' },
  { name: 'Loguetown',    saga: 'East Blue Saga', start: 96,   end: 100,  color: 'text-blue-300',   bg: 'bg-blue-900/20',   border: 'border-blue-700/30' },
  // Alabasta Saga
  { name: 'Reverse Mountain', saga: 'Alabasta Saga', start: 101, end: 105, color: 'text-yellow-300', bg: 'bg-yellow-900/20', border: 'border-yellow-700/30' },
  { name: 'Whisky Peak',      saga: 'Alabasta Saga', start: 106, end: 114, color: 'text-yellow-300', bg: 'bg-yellow-900/20', border: 'border-yellow-700/30' },
  { name: 'Little Garden',    saga: 'Alabasta Saga', start: 115, end: 129, color: 'text-yellow-300', bg: 'bg-yellow-900/20', border: 'border-yellow-700/30' },
  { name: 'Drum Island',      saga: 'Alabasta Saga', start: 130, end: 154, color: 'text-yellow-300', bg: 'bg-yellow-900/20', border: 'border-yellow-700/30' },
  { name: 'Alabasta',         saga: 'Alabasta Saga', start: 155, end: 217, color: 'text-yellow-300', bg: 'bg-yellow-900/20', border: 'border-yellow-700/30' },
  // Sky Island Saga
  { name: 'Jaya',       saga: 'Sky Island Saga', start: 218, end: 236, color: 'text-sky-300',    bg: 'bg-sky-900/20',    border: 'border-sky-700/30' },
  { name: 'Skypiea',    saga: 'Sky Island Saga', start: 237, end: 302, color: 'text-sky-300',    bg: 'bg-sky-900/20',    border: 'border-sky-700/30' },
  // Water 7 Saga
  { name: 'Long Ring Long Land', saga: 'Water 7 Saga', start: 303, end: 321, color: 'text-teal-300',  bg: 'bg-teal-900/20',  border: 'border-teal-700/30' },
  { name: 'Water 7',             saga: 'Water 7 Saga', start: 322, end: 374, color: 'text-teal-300',  bg: 'bg-teal-900/20',  border: 'border-teal-700/30' },
  { name: 'Enies Lobby',         saga: 'Water 7 Saga', start: 375, end: 430, color: 'text-teal-300',  bg: 'bg-teal-900/20',  border: 'border-teal-700/30' },
  { name: 'Post-Enies Lobby',    saga: 'Water 7 Saga', start: 431, end: 441, color: 'text-teal-300',  bg: 'bg-teal-900/20',  border: 'border-teal-700/30' },
  // Thriller Bark
  { name: 'Thriller Bark', saga: 'Thriller Bark Saga', start: 442, end: 489, color: 'text-purple-300', bg: 'bg-purple-900/20', border: 'border-purple-700/30' },
  // Summit War Saga
  { name: 'Sabaody Archipelago', saga: 'Summit War Saga', start: 490, end: 513, color: 'text-red-300', bg: 'bg-red-900/20', border: 'border-red-700/30' },
  { name: 'Amazon Lily',         saga: 'Summit War Saga', start: 514, end: 524, color: 'text-red-300', bg: 'bg-red-900/20', border: 'border-red-700/30' },
  { name: 'Impel Down',          saga: 'Summit War Saga', start: 525, end: 549, color: 'text-red-300', bg: 'bg-red-900/20', border: 'border-red-700/30' },
  { name: 'Marineford',          saga: 'Summit War Saga', start: 550, end: 580, color: 'text-red-300', bg: 'bg-red-900/20', border: 'border-red-700/30' },
  { name: 'Post-War',            saga: 'Summit War Saga', start: 581, end: 597, color: 'text-red-300', bg: 'bg-red-900/20', border: 'border-red-700/30' },
  // Fish-Man Island Saga
  { name: 'Return to Sabaody', saga: 'Fish-Man Island Saga', start: 598, end: 602, color: 'text-cyan-300', bg: 'bg-cyan-900/20', border: 'border-cyan-700/30' },
  { name: 'Fish-Man Island',   saga: 'Fish-Man Island Saga', start: 603, end: 653, color: 'text-cyan-300', bg: 'bg-cyan-900/20', border: 'border-cyan-700/30' },
  // Dressrosa Saga
  { name: 'Punk Hazard', saga: 'Dressrosa Saga', start: 654, end: 699, color: 'text-orange-300', bg: 'bg-orange-900/20', border: 'border-orange-700/30' },
  { name: 'Dressrosa',   saga: 'Dressrosa Saga', start: 700, end: 801, color: 'text-orange-300', bg: 'bg-orange-900/20', border: 'border-orange-700/30' },
  // Whole Cake Island Saga
  { name: 'Zou',                 saga: 'Whole Cake Island Saga', start: 802, end: 824, color: 'text-pink-300', bg: 'bg-pink-900/20', border: 'border-pink-700/30' },
  { name: 'Whole Cake Island',   saga: 'Whole Cake Island Saga', start: 825, end: 902, color: 'text-pink-300', bg: 'bg-pink-900/20', border: 'border-pink-700/30' },
  { name: 'Levely',              saga: 'Whole Cake Island Saga', start: 903, end: 908, color: 'text-pink-300', bg: 'bg-pink-900/20', border: 'border-pink-700/30' },
  // Wano Country Saga
  { name: 'Wano Country', saga: 'Wano Country Saga', start: 909, end: 1057, color: 'text-rose-300', bg: 'bg-rose-900/20', border: 'border-rose-700/30' },
  // Final Saga
  { name: 'Egghead',  saga: 'Final Saga', start: 1058, end: 1120, color: 'text-amber-300', bg: 'bg-amber-900/20', border: 'border-amber-700/30' },
  { name: 'Elbaf',    saga: 'Final Saga', start: 1121, end: ALL_CHAPTERS_COUNT, color: 'text-amber-300', bg: 'bg-amber-900/20', border: 'border-amber-700/30' },
];

// ─────────────────────────────────────────────────────────────────────────────
// MILESTONE BADGES — unlocked at key chapter thresholds
// ─────────────────────────────────────────────────────────────────────────────
export interface MangaMilestone {
  chapter: number;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
}

export const MANGA_MILESTONES: MangaMilestone[] = [
  { chapter: 100,  label: 'East Blue Done',      emoji: '⚓', color: 'text-blue-300',   bg: 'bg-blue-900/30',   border: 'border-blue-600/50' },
  { chapter: 217,  label: 'Alabasta Done',        emoji: '🏜️', color: 'text-yellow-300', bg: 'bg-yellow-900/30', border: 'border-yellow-600/50' },
  { chapter: 302,  label: 'Skypiea Done',         emoji: '☁️', color: 'text-sky-300',    bg: 'bg-sky-900/30',    border: 'border-sky-600/50' },
  { chapter: 430,  label: 'Enies Lobby Done',     emoji: '⚖️', color: 'text-teal-300',   bg: 'bg-teal-900/30',   border: 'border-teal-600/50' },
  { chapter: 597,  label: 'Pre-Timeskip Done',    emoji: '🌊', color: 'text-red-300',    bg: 'bg-red-900/30',    border: 'border-red-600/50' },
  { chapter: 801,  label: 'Dressrosa Done',       emoji: '🌸', color: 'text-orange-300', bg: 'bg-orange-900/30', border: 'border-orange-600/50' },
  { chapter: 902,  label: 'WCI Done',             emoji: '🍰', color: 'text-pink-300',   bg: 'bg-pink-900/30',   border: 'border-pink-600/50' },
  { chapter: 1000, label: 'Ch. 1000 Club',        emoji: '⭐', color: 'text-primary',    bg: 'bg-primary/20',    border: 'border-primary/50' },
  { chapter: 1057, label: 'Wano Done',            emoji: '🗾', color: 'text-rose-300',   bg: 'bg-rose-900/30',   border: 'border-rose-600/50' },
  { chapter: 1120, label: 'Egghead Done',         emoji: '🤖', color: 'text-amber-300',  bg: 'bg-amber-900/30',  border: 'border-amber-600/50' },
  { chapter: ALL_CHAPTERS_COUNT, label: 'All Caught Up!', emoji: '🏴‍☠️', color: 'text-green-300', bg: 'bg-green-900/30', border: 'border-green-600/50' },
];

// ─────────────────────────────────────────────────────────────────────────────
// READ HISTORY — localStorage helpers
// ─────────────────────────────────────────────────────────────────────────────
export interface MangaReadEntry {
  chapter: number;
  title: string;
  arc: string;
  readAt: string; // ISO string
}

const HISTORY_KEY = (userId?: string) =>
  userId ? `grandline_manga_history_${userId}` : 'grandline_manga_history_guest';

export function getMangaReadHistory(userId?: string): MangaReadEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY(userId));
    if (!raw) return [];
    return JSON.parse(raw) as MangaReadEntry[];
  } catch {
    return [];
  }
}

export function addMangaReadHistory(entry: MangaReadEntry, userId?: string): void {
  try {
    const history = getMangaReadHistory(userId);
    const filtered = history.filter(h => h.chapter !== entry.chapter);
    const updated = [entry, ...filtered].slice(0, 30); // keep last 30
    localStorage.setItem(HISTORY_KEY(userId), JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function clearMangaReadHistory(userId?: string): void {
  localStorage.removeItem(HISTORY_KEY(userId));
}

// All SBS volumes — exported from dedicated file
export type { } from '@/data/sbs';
