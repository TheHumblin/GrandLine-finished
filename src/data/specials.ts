import type { ServerOption } from '@/types';
import { SPECIAL_SOURCES, getZokoSpecialUrl } from '@/data/specialServers';

// IDs decoded from HiAnime's listed ZokoAnime embeds, not guessed from titles.
// Barto (15) uses direct anime IDs rather than a MAL ID.
export const SPECIAL_MAL_IDS: Record<number, number> = {
  1: 1094, 2: 1237, 3: 1238, 4: 2020, 5: 2107, 6: 15323, 7: 16239,
  8: 19123, 9: 25161, 10: 31289, 11: 32051, 12: 33338,
  13: 36215, 14: 37902, 16: 60022, 17: 62233,
};

// Show dub badges only for tracks actually listed by this source.
export const SPECIAL_HAS_DUB: Record<number, boolean> = Object.fromEntries(
  Object.entries(SPECIAL_SOURCES).map(([id, episodes]) => [Number(id), episodes.some(episode => !!episode.dub)]),
);

export interface Special {
  id: number;
  title: string;
  year: number;
  thumbnail: string | null;
  synopsis: string;
  duration: string;
  rating?: number;
  animesugeSlug: string;
  episodeCount: number;
}

// Compatibility helpers for existing consumers of the catalog's slug field.
export function getSpecialUrl(slug: string, episode = 1): string {
  const special = SPECIALS.find(item => item.animesugeSlug === slug);
  return special ? getZokoSpecialUrl(special.id, episode, 'sub') ?? '' : '';
}
export function getSpecialServers(slug: string): { sub: ServerOption[]; dub: ServerOption[]; hsub: ServerOption[] } {
  const special = SPECIALS.find(item => item.animesugeSlug === slug);
  const source = special ? SPECIAL_SOURCES[special.id]?.[0] : undefined;
  return {
    sub: source ? [{ name: 'zokoanime-sub', label: 'ZokoAnime', type: 'sub', url: source.sub }] : [],
    dub: source?.dub ? [{ name: 'zokoanime-dub', label: 'ZokoAnime', type: 'dub', url: source.dub }] : [],
    hsub: [],
  };
}

export const SPECIALS: Special[] = [
  {
    id: 1,
    title: "Adventure in the Ocean's Navel",
    year: 2000,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-adventure-in-the-oceans-navel.webp',
    synopsis: "The Straw Hats get trapped in a giant whirlpool and must work together to escape before it drags them to the ocean floor.",
    duration: "0h 30m",
    rating: 4.0,
    animesugeSlug: 'one-piece-special-adventure-in-the-ocean-s-navel-dzii6',
    episodeCount: 1,
  },
  {
    id: 2,
    title: "Open Upon the Great Sea! A Father's Huge, HUGE Dream!",
    year: 2003,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-open-upon-the-great-sea-a-fathers-huge-huge-dream.webp',
    synopsis: "A father sets sail to find his missing children across the Grand Line, crossing paths with the Straw Hat Pirates.",
    duration: "1h 05m",
    rating: 4.0,
    animesugeSlug: 'one-piece-special-open-upon-the-great-sea-a-father-s-huge-huge-dream-dmxi8',
    episodeCount: 1,
  },
  {
    id: 3,
    title: "Protect! The Last Great Stage",
    year: 2003,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-protect-the-last-great-performance.webp',
    synopsis: "The Straw Hats help a dying singer fulfill his final wish: to perform one last great concert for his daughter.",
    duration: "1h 05m",
    rating: 4.1,
    animesugeSlug: 'one-piece-special-protect-the-last-great-stage-dflz3',
    episodeCount: 1,
  },
  {
    id: 4,
    title: "The Detective Memoirs of Chief Straw Hat Luffy",
    year: 2005,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-the-detective-memoirs-of-chief-straw-hat-luffy.webp',
    synopsis: "A comedic Edo Period alternate-universe special where Luffy and crew are detectives in feudal Japan.",
    duration: "42m",
    rating: 4.0,
    animesugeSlug: 'one-piece-special-the-detective-memoirs-of-chief-straw-hat-luffy-dmtf6',
    episodeCount: 1,
  },
  {
    id: 5,
    title: "Episode of Alabasta: The Desert Princess and the Pirates",
    year: 2007,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-episode-of-alabasta-the-desert-princess-and-the-pirates.webp',
    synopsis: "A condensed retelling of the Alabasta arc — one of the most beloved story arcs in One Piece history.",
    duration: "1h 34m",
    rating: 4.3,
    animesugeSlug: 'one-piece-special-episode-of-alabasta-the-desert-princess-and-the-pirates-dol71',
    episodeCount: 1,
  },
  {
    id: 6,
    title: "Episode of Nami: Tears of a Navigator and the Bonds of Friends",
    year: 2012,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-episode-of-nami-tears-of-a-navigator-and-the-bonds-of-friends.webp',
    synopsis: "A retelling of Nami's tragic backstory — the story of the Arlong Park arc from her perspective.",
    duration: "1h 24m",
    rating: 4.4,
    animesugeSlug: 'one-piece-special-episode-of-nami-tears-of-a-navigator-and-the-bonds-of-friends-dskl9',
    episodeCount: 1,
  },
  {
    id: 7,
    title: "Episode of Luffy: Hand Island Adventure",
    year: 2012,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-episode-of-luffy-adventure-on-hand-island.webp',
    synopsis: "Luffy reunites with a childhood friend on Hand Island and remembers Ace's final moments during the post-war era.",
    duration: "1h 05m",
    rating: 4.1,
    animesugeSlug: 'one-piece-special-episode-of-luffy-hand-island-adventure-dklm4',
    episodeCount: 1,
  },
  {
    id: 8,
    title: "Episode of Merry: The Tale of One More Friend",
    year: 2013,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-episode-of-merry-the-tale-of-one-more-friend.webp',
    synopsis: "A full retelling of the Going Merry's story — from her launch to her legendary final voyage. Bring tissues.",
    duration: "1h 47m",
    rating: 4.8,
    animesugeSlug: 'one-piece-special-episode-of-merry-the-tale-of-one-more-friend-dqpi2',
    episodeCount: 1,
  },
  {
    id: 9,
    title: "3D2Y: Overcome Ace's Death! Luffy's Vow to His Friends",
    year: 2014,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-3d2y-overcoming-aces-death-luffys-pledge-to-his-friends.webp',
    synopsis: "Set during the two-year timeskip — Luffy faces the Empress Hancock's nemesis and grows stronger to protect his crew.",
    duration: "1h 47m",
    rating: 4.6,
    animesugeSlug: 'one-piece-3d2y-overcome-ace-s-death-luffy-s-vow-to-his-friends-dmkj5',
    episodeCount: 1,
  },
  {
    id: 10,
    title: "Episode of Sabo: The Three Brothers' Bond – The Miraculous Reunion and the Inherited Will",
    year: 2015,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-episode-of-sabo-bond-of-three-brothers-a-miraculous-reunion-and-an-inherited-will.webp',
    synopsis: "Sabo, Luffy, and Ace — the story of three brothers bound by blood and will. A retelling from Sabo's perspective.",
    duration: "1h 46m",
    rating: 4.5,
    animesugeSlug: 'one-piece-special-episode-of-sabo-the-three-brothers-bond-dmxp3',
    episodeCount: 1,
  },
  {
    id: 11,
    title: "Adventure of Nebulandia",
    year: 2015,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-adventure-of-nebulandia.webp',
    synopsis: "The Straw Hats battle Foxy the Silver Fox again on Nebulandia — a mysterious island that nullifies all Devil Fruit powers.",
    duration: "1h 46m",
    rating: 4.1,
    animesugeSlug: 'one-piece-special-adventure-of-nebulandia-dmxr4',
    episodeCount: 1,
  },
  {
    id: 12,
    title: "Heart of Gold",
    year: 2016,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-heart-of-gold.webp',
    synopsis: "The Straw Hats encounter a girl who ate a strange fruit and can produce pure gold. A dangerous pirate pursues her across the seas.",
    duration: "1h 44m",
    rating: 4.3,
    animesugeSlug: 'one-piece-special-heart-of-gold-dxln7',
    episodeCount: 1,
  },
  {
    id: 13,
    title: "Episode of East Blue: Luffy and His Four Friends' Great Adventure",
    year: 2017,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-episode-of-east-blue-luffy-and-his-four-crewmates-great-adventure.webp',
    synopsis: "A feature-length retelling of the entire East Blue saga — how Luffy assembled his original crew before the Grand Line.",
    duration: "2h 00m",
    rating: 4.4,
    animesugeSlug: 'one-piece-special-episode-of-east-blue-luffy-and-his-four-friends-great-adventure-dmlx9',
    episodeCount: 1,
  },
  {
    id: 14,
    title: "Episode of Sky Island",
    year: 2018,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-episode-of-skypiea.webp',
    synopsis: "A condensed retelling of the Skypiea arc — the crew's legendary adventure on the sky island above the clouds.",
    duration: "1h 45m",
    rating: 4.2,
    animesugeSlug: 'one-piece-special-episode-of-sky-island-dmnp1',
    episodeCount: 1,
  },
  {
    id: 15,
    title: "Barto's Secret Room",
    year: 2021,
    thumbnail: 'https://hianime.at/storage/media/2026/09/one-piece-barto-s-secret-room.webp',
    synopsis: "Bartolomeo and guests revisit the Straw Hats' Wano adventures across four recap episodes, from Zoro and Sanji's battles to Luffy's fight with Kaido.",
    duration: '24m per episode',
    animesugeSlug: 'one-piece-barto-s-secret-room-9840',
    episodeCount: 4,
  },
  {
    id: 16,
    title: 'One Piece Fan Letter',
    year: 2024,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-fan-letter.webp',
    synopsis: "On Sabaody Archipelago, a young girl who admires Nami sets out on a small adventure. Ordinary people's lives intertwine as the Straw Hat Pirates prepare to reunite.",
    duration: '24m',
    animesugeSlug: 'one-piece-fan-letter-1965',
    episodeCount: 1,
  },
  {
    id: 17,
    title: 'One Piece: Heroines',
    year: 2026,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-heroines.webp',
    synopsis: 'After buying shoes that hurt her feet, Nami meets designer Lebno, who offers to remake them if she models in his show. The story follows Nami and craftsperson Miucha, with an appearance by Robin.',
    duration: '23m',
    animesugeSlug: 'one-piece-heroines-2827',
    episodeCount: 1,
  },
];
