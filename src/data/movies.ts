import type { Movie } from '@/types';

// MAL IDs verified against the ZokoAnime hashes in HiAnime's movie server lists.
// Movie embed episode number is always 1; HiAnime ep IDs are separate identifiers.
export const MOVIE_MAL_IDS: Record<number, number> = {
  1:  459,    // MAL 459 = Movie 1 The Movie
  2:  460,    // MAL 460 = Movie 2 Clockwork Island
  3:  461,    // MAL 461 = Movie 3 Chopper's Kingdom
  4:  462,    // MAL 462 = Movie 4 Dead End Adventure
  5:  463,    // MAL 463 = Movie 5 Cursed Holy Sword
  6:  464,    // MAL 464 = Movie 6 Baron Omatsuri
  7:  465,    // MAL 465 = Movie 7 Karakuri Castle
  8:  2107,   // Movie 8 Episode of Alabasta
  9:  3848,   // Movie 9 Chopper Plus
  10: 4155,   // Movie 10 Strong World
  11: 9999,   // Movie 11 Straw Hat Chase
  12: 12859,  // Film Z
  13: 31490,  // Film Gold
  14: 38234,  // MAL 38234 = Stampede
  15: 50410,  // MAL 50410 = Film Red
};

// English dub tracks verified in HiAnime's ZokoAnime server lists.
// Sub-only: 1-7, 9, 11
// Has dub: 8, 10, 12, 13, 14, 15
export const MOVIE_HAS_DUB: Record<number, boolean> = {
  1:  false,
  2:  false,
  3:  false,
  4:  false,
  5:  false,
  6:  false,
  7:  false,
  8:  true,   // Episode of Alabasta - has dub
  9:  false,
  10: true,   // Strong World - has dub
  11: false,
  12: true,   // Film Z - has dub
  13: true,   // Film Gold - has dub
  14: true,   // Stampede - has dub
  15: true,   // Film Red - has dub
};

export const MOVIE_SLUGS: Record<number, string> = {
  1:  'one-piece-movie-1-8bhn7',
  2:  'one-piece-movie-2-clockwork-island-adventure-dxmn2',
  3:  'one-piece-movie-3-chopper-s-kingdom-on-the-island-of-strange-animals-dkpl4',
  4:  'one-piece-movie-4-dead-end-adventure-dmxw9',
  5:  'one-piece-movie-5-the-cursed-holy-sword-dkwz7',
  6:  'one-piece-movie-6-baron-omatsuri-and-the-secret-island-dpql3',
  7:  'one-piece-movie-7-the-giant-mechanical-soldier-of-karakuri-castle-dxnv8',
  8:  'one-piece-movie-8-episode-of-alabasta-dmzk5',
  9:  'one-piece-movie-9-episode-of-chopper-plus-dplm2',
  10: 'one-piece-film-strong-world-dmxp4',
  11: 'one-piece-3d-straw-hat-chase-dkwn9',
  12: 'one-piece-film-z-dmxl7',
  13: 'one-piece-film-gold-dplx3',
  14: 'one-piece-stampede-dmkv8',
  15: 'one-piece-film-red-dpln5',
};

export function getMovieUrl(movieId: number, type: 'sub' | 'dub' = 'sub'): string {
  const slug = MOVIE_SLUGS[movieId];
  if (!slug) return '';
  return `https://animesuge.cz/anime/${slug}/ep-1`;
}

export const MOVIES: Movie[] = [
  {
    id: 1,
    title: "One Piece: The Movie",
    year: 2000,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-the-movie.webp',
    synopsis: "Luffy and the Straw Hats search for the legendary treasure of Woonan, the Great Gold Pirate, in their very first big-screen adventure.",
    duration: "1h 0m",
    rating: 3.8,
    servers: [],
  },
  {
    id: 2,
    title: "Clockwork Island Adventure",
    year: 2001,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-clockwork-island-adventure.webp',
    synopsis: "The Trump Siblings steal the Going Merry and kidnap Nami. The Straw Hats must infiltrate Clockwork Island to save her.",
    duration: "1h 0m",
    rating: 4.0,
    servers: [],
  },
  {
    id: 3,
    title: "Chopper's Kingdom on the Island of Strange Animals",
    year: 2002,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-chopper-kingdom-of-strange-animal-island.webp',
    synopsis: "Chopper becomes the accidental king of a strange animal island while Luffy battles the Crown brothers.",
    duration: "1h 10m",
    rating: 3.9,
    servers: [],
  },
  {
    id: 4,
    title: "Dead End Adventure",
    year: 2003,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-dead-end-adventure.webp',
    synopsis: "The Straw Hats enter the Dead End Race, a secret pirate competition with a massive bounty prize — and a deadly trap at the finish.",
    duration: "1h 35m",
    rating: 4.3,
    servers: [],
  },
  {
    id: 5,
    title: "The Cursed Holy Sword",
    year: 2004,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-the-curse-of-the-sacred-sword.webp',
    synopsis: "Zoro is called to an island by a mysterious force connected to a cursed legendary blade.",
    duration: "1h 35m",
    rating: 4.0,
    servers: [],
  },
  {
    id: 6,
    title: "Baron Omatsuri and the Secret Island",
    year: 2005,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-baron-omatsuri-and-the-secret-island.webp',
    synopsis: "The Straw Hats visit a luxurious resort island. Behind the paradise facade lies Baron Omatsuri's dark and deadly secret.",
    duration: "1h 31m",
    rating: 4.5,
    servers: [],
  },
  {
    id: 7,
    title: "The Giant Mechanical Soldier of Karakuri Castle",
    year: 2006,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-the-giant-mechanical-soldier-of-karakuri-castle.webp',
    synopsis: "The crew discovers a mechanical island castle and faces its monstrous giant mechanical guardian in a battle for survival.",
    duration: "1h 34m",
    rating: 3.9,
    servers: [],
  },
  {
    id: 8,
    title: "Episode of Alabasta: The Desert Princess and the Pirates",
    year: 2007,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-episode-of-alabasta-the-desert-princess-and-the-pirates.webp',
    synopsis: "A condensed retelling of the beloved Alabasta arc, featuring the battle against Crocodile and Baroque Works.",
    duration: "1h 35m",
    rating: 4.2,
    servers: [],
  },
  {
    id: 9,
    title: "Episode of Chopper Plus: Bloom in Winter, Miracle Sakura",
    year: 2008,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-episode-of-chopper-plus-bloom-in-the-winter-miracle-sakura.webp',
    synopsis: "A retelling of the Drum Island arc with Brook as a Straw Hat member from the start.",
    duration: "1h 55m",
    rating: 4.1,
    servers: [],
  },
  {
    id: 10,
    title: "Strong World",
    year: 2009,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-film-strong-world.webp',
    synopsis: "The legendary pirate Shiki the Golden Lion captures Nami. The Straw Hats must storm his floating island fortress to save her.",
    duration: "1h 52m",
    rating: 4.6,
    servers: [],
  },
  {
    id: 11,
    title: "One Piece 3D: Straw Hat Chase",
    year: 2011,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-3d-straw-hat-chase.webp',
    synopsis: "A mysterious man steals Luffy's treasured straw hat, launching the crew on a wild aerial chase across the New World.",
    duration: "0h 30m",
    rating: 4.0,
    servers: [],
  },
  {
    id: 12,
    title: "Film Z",
    year: 2012,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-film-z.webp',
    synopsis: "Z, a former Marine admiral of legendary power, seeks to destroy the New World using ancient weapons. The Straw Hats stand in his way.",
    duration: "1h 47m",
    rating: 4.7,
    servers: [],
  },
  {
    id: 13,
    title: "Film Gold",
    year: 2016,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-film-gold.webp',
    synopsis: "The Straw Hats board the Gran Tesoro — the world's largest entertainment ship, ruled by the terrifying Gild Tesoro who turns everything to gold.",
    duration: "2h 0m",
    rating: 4.6,
    servers: [],
  },
  {
    id: 14,
    title: "Stampede",
    year: 2019,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-stampede.webp',
    synopsis: "Pirates from across the world gather for the Pirates Festival. But Douglas Bullet, a monster from Roger's era, threatens to destroy everything.",
    duration: "1h 41m",
    rating: 4.8,
    servers: [],
  },
  {
    id: 15,
    title: "Film Red",
    year: 2022,
    thumbnail: 'https://hianime.at/storage/media/2026/08/one-piece-film-red.webp',
    synopsis: "Uta — the world's most beloved singer and Shanks' daughter — performs her first live concert. But her dream of a world without pirates hides a devastating secret.",
    duration: "1h 55m",
    rating: 4.9,
    servers: [],
  },
];
