export type WatchItemType = 'episodes' | 'movie' | 'special' | 'ova' | 'short';

export interface WatchItem {
  type: WatchItemType;
  label: string;
  description: string;
  episodeRange?: [number, number];
  movieId?: number;
  specialId?: number;
  link: string;
  isEssential: boolean;
}

export interface WatchArc {
  title: string;
  items: WatchItem[];
}

export interface WatchSaga {
  id: string;
  name: string;
  color: string;
  arcs: WatchArc[];
}

export const WATCH_ORDER: WatchSaga[] = [
  {
    id: 'east-blue',
    name: 'East Blue Saga',
    color: 'from-blue-900 to-cyan-900',
    arcs: [
      {
        title: 'Romance Dawn Arc',
        items: [
          { type: 'episodes', label: 'Episodes 1–3', description: 'Romance Dawn arc — Luffy sets sail', episodeRange: [1, 3], link: '/watch/1', isEssential: true },
        ],
      },
      {
        title: 'Orange Town Arc',
        items: [
          { type: 'episodes', label: 'Episodes 4–8', description: 'Orange Town arc — Buggy the Clown', episodeRange: [4, 8], link: '/watch/4', isEssential: true },
          { type: 'ova', label: 'Defeat Him! The Pirate Ganzack!', description: 'Non-canon OVA — optional', link: '/specials', isEssential: false },
        ],
      },
      {
        title: 'Syrup Village Arc',
        items: [
          { type: 'episodes', label: 'Episodes 9–18', description: 'Syrup Village arc — Usopp joins', episodeRange: [9, 18], link: '/watch/9', isEssential: true },
        ],
      },
      {
        title: 'Baratie Arc',
        items: [
          { type: 'movie', label: 'Movie 1: One Piece: The Movie', description: 'Optional movie — set in East Blue', movieId: 1, link: '/movies/1', isEssential: false },
          { type: 'episodes', label: 'Episodes 19–30', description: 'Baratie arc — Sanji joins', episodeRange: [19, 30], link: '/watch/19', isEssential: true },
        ],
      },
      {
        title: 'Arlong Park Arc',
        items: [
          { type: 'episodes', label: 'Episodes 31–44', description: 'Arlong Park arc — Nami\'s backstory', episodeRange: [31, 44], link: '/watch/31', isEssential: true },
        ],
      },
      {
        title: 'Loguetown Arc',
        items: [
          { type: 'episodes', label: 'Episode 45', description: 'Loguetown — bounty posted!', episodeRange: [45, 45], link: '/watch/45', isEssential: true },
          { type: 'episodes', label: 'Episodes 46–47', description: 'Buggy\'s Crew Adventure Chronicles', episodeRange: [46, 47], link: '/watch/46', isEssential: false },
          { type: 'episodes', label: 'Episodes 48–53', description: 'Loguetown arc continued', episodeRange: [48, 53], link: '/watch/48', isEssential: true },
          { type: 'movie', label: 'Movie 2: Clockwork Island Adventure', description: 'Optional movie', movieId: 2, link: '/movies/2', isEssential: false },
          { type: 'special', label: 'Special: Adventure in the Ocean\'s Navel', description: 'Optional TV special', specialId: 1, link: '/specials/1', isEssential: false },
          { type: 'short', label: 'Jango\'s Dance Carnival Short', description: 'Comedy short — optional', link: '/specials', isEssential: false },
        ],
      },
      {
        title: 'Warship Island Arc (Filler)',
        items: [
          { type: 'episodes', label: 'Episodes 54–61', description: 'Warship Island arc — filler, skippable', episodeRange: [54, 61], link: '/watch/54', isEssential: false },
          { type: 'special', label: 'Special: Episode of East Blue', description: 'Great recap of the East Blue Saga', specialId: 12, link: '/specials/12', isEssential: false },
        ],
      },
    ],
  },
  {
    id: 'alabasta',
    name: 'Alabasta Saga',
    color: 'from-yellow-900 to-amber-900',
    arcs: [
      {
        title: 'Reverse Mountain Arc',
        items: [
          { type: 'episodes', label: 'Episodes 62–63', description: 'Reverse Mountain arc — Grand Line begins!', episodeRange: [62, 63], link: '/watch/62', isEssential: true },
        ],
      },
      {
        title: 'Whisky Peak Arc',
        items: [
          { type: 'episodes', label: 'Episodes 64–67', description: 'Whisky Peak arc', episodeRange: [64, 67], link: '/watch/64', isEssential: true },
        ],
      },
      {
        title: 'Little Garden Arc',
        items: [
          { type: 'episodes', label: 'Episodes 68–69', description: 'Diary of Koby-Meppo (filler but fun)', episodeRange: [68, 69], link: '/watch/68', isEssential: false },
          { type: 'episodes', label: 'Episodes 70–77', description: 'Little Garden arc — dinosaur island', episodeRange: [70, 77], link: '/watch/70', isEssential: true },
        ],
      },
      {
        title: 'Drum Island Arc',
        items: [
          { type: 'episodes', label: 'Episodes 78–91', description: 'Drum Island arc — Chopper joins', episodeRange: [78, 91], link: '/watch/78', isEssential: true },
          { type: 'short', label: 'Dream Soccer King Short', description: 'Optional comedy short', link: '/specials', isEssential: false },
        ],
      },
      {
        title: 'Alabasta Arc',
        items: [
          { type: 'episodes', label: 'Episodes 92–130', description: 'Alabasta arc — fight against Crocodile', episodeRange: [92, 130], link: '/watch/92', isEssential: true },
          { type: 'movie', label: 'Movie 8: Episode of Alabasta', description: 'Condensed retelling of the arc', movieId: 8, link: '/movies/8', isEssential: false },
          { type: 'movie', label: 'Movie 3: Chopper\'s Kingdom', description: 'Optional Chopper movie', movieId: 3, link: '/movies/3', isEssential: false },
        ],
      },
      {
        title: 'Post-Alabasta Arc (Filler)',
        items: [
          { type: 'episodes', label: 'Episodes 131–135', description: 'Post-Alabasta filler arc', episodeRange: [131, 135], link: '/watch/131', isEssential: false },
        ],
      },
    ],
  },
  {
    id: 'skyisland',
    name: 'Sky Island Saga',
    color: 'from-sky-900 to-indigo-900',
    arcs: [
      {
        title: 'Goat Island / Ruluka Island (Filler)',
        items: [
          { type: 'episodes', label: 'Episodes 136–138', description: 'Goat Island arc — filler, skippable', episodeRange: [136, 138], link: '/watch/136', isEssential: false },
          { type: 'movie', label: 'Movie 4: Dead End Adventure', description: 'Best early movie', movieId: 4, link: '/movies/4', isEssential: false },
          { type: 'movie', label: 'Movie 5: The Cursed Holy Sword', description: 'Zoro-focused movie', movieId: 5, link: '/movies/5', isEssential: false },
          { type: 'special', label: 'Special: Open Upon the Great Sea!', description: 'Father\'s dream special', specialId: 2, link: '/specials/2', isEssential: false },
          { type: 'short', label: 'Take Aim! The Pirate Baseball King Short', description: 'Comedy short', link: '/specials', isEssential: false },
          { type: 'episodes', label: 'Episodes 139–143', description: 'Ruluka Island arc — filler, skippable', episodeRange: [139, 143], link: '/watch/139', isEssential: false },
        ],
      },
      {
        title: 'Jaya Arc',
        items: [
          { type: 'episodes', label: 'Episodes 144–152', description: 'Jaya arc — Blackbeard first appears!', episodeRange: [144, 152], link: '/watch/144', isEssential: true },
        ],
      },
      {
        title: 'Skypiea Arc',
        items: [
          { type: 'episodes', label: 'Episodes 153–195', description: 'Skypiea arc — sky island adventure', episodeRange: [153, 195], link: '/watch/153', isEssential: true },
          { type: 'special', label: 'Special: Episode of Sky Island', description: 'Condensed retelling of Skypiea', specialId: 13, link: '/specials/13', isEssential: false },
        ],
      },
      {
        title: 'G-8 Arc (Filler)',
        items: [
          { type: 'episodes', label: 'Episodes 196–206', description: 'G-8 arc — highly regarded filler!', episodeRange: [196, 206], link: '/watch/196', isEssential: false },
          { type: 'movie', label: 'Movie 6: Baron Omatsuri', description: 'Darkest One Piece movie — recommended', movieId: 6, link: '/movies/6', isEssential: false },
        ],
      },
    ],
  },
  {
    id: 'water7',
    name: 'Water 7 Saga',
    color: 'from-teal-900 to-blue-900',
    arcs: [
      {
        title: 'Long Ring Long Land Arc',
        items: [
          { type: 'episodes', label: 'Episodes 207–219', description: 'Long Ring Long Land — Foxy arc', episodeRange: [207, 219], link: '/watch/207', isEssential: false },
          { type: 'special', label: 'Special: Protect! The Last Great Stage', description: 'Emotional music special', specialId: 3, link: '/specials/3', isEssential: false },
          { type: 'episodes', label: 'Episodes 220–228', description: 'Ocean\'s Dream / Foxy\'s Return (filler)', episodeRange: [220, 228], link: '/watch/220', isEssential: false },
          { type: 'movie', label: 'Movie 7: Giant Mechanical Soldier', description: 'Karakuri Castle movie', movieId: 7, link: '/movies/7', isEssential: false },
        ],
      },
      {
        title: 'Water 7 Arc',
        items: [
          { type: 'episodes', label: 'Episodes 229–263', description: 'Water 7 arc — Usopp leaves the crew', episodeRange: [229, 263], link: '/watch/229', isEssential: true },
        ],
      },
      {
        title: 'Enies Lobby Arc',
        items: [
          { type: 'episodes', label: 'Episodes 264–290, 293–302, 304–312', description: 'Enies Lobby arc — one of the greatest arcs in anime!', episodeRange: [264, 312], link: '/watch/264', isEssential: true },
          { type: 'episodes', label: 'Episodes 291–292, 303, 406–407', description: 'Boss Luffy Historical Specials (filler)', episodeRange: [291, 292], link: '/watch/291', isEssential: false },
        ],
      },
      {
        title: 'Post-Enies Lobby Arc',
        items: [
          { type: 'episodes', label: 'Episodes 313–325', description: 'Post-Enies Lobby — Sunny is born!', episodeRange: [313, 325], link: '/watch/313', isEssential: true },
          { type: 'movie', label: 'Movie 9: Episode of Chopper Plus', description: 'Chopper Drum Island retelling with Brook', movieId: 9, link: '/movies/9', isEssential: false },
        ],
      },
    ],
  },
  {
    id: 'thriller-bark',
    name: 'Thriller Bark Saga',
    color: 'from-purple-950 to-violet-900',
    arcs: [
      {
        title: 'Thriller Bark Arc',
        items: [
          { type: 'episodes', label: 'Episodes 326–335', description: 'Ice Hunter arc — filler before Thriller Bark', episodeRange: [326, 335], link: '/watch/326', isEssential: false },
          { type: 'episodes', label: 'Episode 336', description: 'Chopper Man Special — fun filler episode', episodeRange: [336, 336], link: '/watch/336', isEssential: false },
          { type: 'episodes', label: 'Episodes 337–381', description: 'Thriller Bark arc — Brook joins! Zoro\'s sacrifice', episodeRange: [337, 381], link: '/watch/337', isEssential: true },
          { type: 'episodes', label: 'Episodes 382–384', description: 'Spa Island arc — filler, skippable', episodeRange: [382, 384], link: '/watch/382', isEssential: false },
        ],
      },
    ],
  },
  {
    id: 'summit-war',
    name: 'Summit War Saga',
    color: 'from-red-950 to-rose-900',
    arcs: [
      {
        title: 'Sabaody Archipelago Arc',
        items: [
          { type: 'episodes', label: 'Episodes 426–429', description: 'Little East Blue arc — filler', episodeRange: [426, 429], link: '/watch/426', isEssential: false },
          { type: 'ova', label: 'Strong World Episode 0 OVA', description: 'OVA — Shiki backstory', link: '/specials', isEssential: false },
          { type: 'movie', label: 'Movie 10: Strong World', description: 'Canon-adjacent — watch before Sabaody!', movieId: 10, link: '/movies/10', isEssential: true },
          { type: 'short', label: 'Straw Hat Chase Short', description: 'Short film', link: '/specials', isEssential: false },
          { type: 'episodes', label: 'Episodes 385–405', description: 'Sabaody Archipelago arc — Kuma splits the crew', episodeRange: [385, 405], link: '/watch/385', isEssential: true },
        ],
      },
      {
        title: 'Amazon Lily / Impel Down / Marineford',
        items: [
          { type: 'episodes', label: 'Episodes 408–417', description: 'Amazon Lily arc — Luffy meets Boa Hancock', episodeRange: [408, 417], link: '/watch/408', isEssential: true },
          { type: 'episodes', label: 'Episodes 418–456', description: 'Impel Down arc — breaking into the world\'s most secure prison', episodeRange: [418, 456], link: '/watch/418', isEssential: true },
          { type: 'episodes', label: 'Episodes 457–489', description: 'Marineford arc — THE war arc. Bring tissues.', episodeRange: [457, 489], link: '/watch/457', isEssential: true },
          { type: 'episodes', label: 'Episodes 490–516', description: 'Post-War arc — aftermath', episodeRange: [490, 516], link: '/watch/490', isEssential: true },
          { type: 'special', label: '3D2Y Special', description: 'Covers the 2-year timeskip gap', specialId: 9, link: '/specials/9', isEssential: false },
        ],
      },
    ],
  },
  {
    id: 'fishman',
    name: 'Fish-Man Island Saga',
    color: 'from-cyan-950 to-teal-900',
    arcs: [
      {
        title: 'Fish-Man Island Arc',
        items: [
          { type: 'episodes', label: 'Episodes 517–522', description: 'Return to Sabaody arc — reunited after 2 years!', episodeRange: [517, 522], link: '/watch/517', isEssential: true },
          { type: 'special', label: 'Special: Episode of Nami', description: 'Nami\'s story retelling', specialId: 6, link: '/specials/6', isEssential: false },
          { type: 'episodes', label: 'Episodes 523–574', description: 'Fish-Man Island arc', episodeRange: [523, 574], link: '/watch/523', isEssential: true },
        ],
      },
    ],
  },
  {
    id: 'dressrosa',
    name: 'Dressrosa Saga',
    color: 'from-orange-950 to-red-900',
    arcs: [
      {
        title: 'Punk Hazard Arc',
        items: [
          { type: 'episodes', label: 'Episodes 575–578', description: 'Z\'s Ambition arc — filler before Film Z', episodeRange: [575, 578], link: '/watch/575', isEssential: false },
          { type: 'movie', label: 'Movie 12: Film Z', description: 'Watch the Z films before Punk Hazard', movieId: 12, link: '/movies/12', isEssential: false },
          { type: 'special', label: 'Special: Episode of Luffy', description: 'Post-war Hand Island adventure', specialId: 7, link: '/specials/7', isEssential: false },
          { type: 'episodes', label: 'Episodes 579–625', description: 'Punk Hazard arc — Law alliance!', episodeRange: [579, 625], link: '/watch/579', isEssential: true },
          { type: 'special', label: 'Special: Episode of Merry', description: 'The Going Merry\'s story — recommended!', specialId: 8, link: '/specials/8', isEssential: true },
        ],
      },
      {
        title: 'Dressrosa Arc',
        items: [
          { type: 'episodes', label: 'Episodes 626–628', description: 'Caesar Retrieval arc — filler', episodeRange: [626, 628], link: '/watch/626', isEssential: false },
          { type: 'episodes', label: 'Episodes 629–746', description: 'Dressrosa arc — Donquixote Doflamingo!', episodeRange: [629, 746], link: '/watch/629', isEssential: true },
          { type: 'special', label: 'Special: Episode of Sabo', description: 'Three brothers\' bond — recommended!', specialId: 10, link: '/specials/10', isEssential: true },
        ],
      },
    ],
  },
  {
    id: 'whole-cake',
    name: 'Whole Cake Island Saga',
    color: 'from-pink-950 to-rose-900',
    arcs: [
      {
        title: 'Zou Arc',
        items: [
          { type: 'episodes', label: 'Episodes 747–750', description: 'Silver Mine arc — filler', episodeRange: [747, 750], link: '/watch/747', isEssential: false },
          { type: 'special', label: 'Special: Heart of Gold', description: 'Pre-Film Gold special', specialId: 11, link: '/specials/11', isEssential: false },
          { type: 'movie', label: 'Movie 13: Film Gold', description: 'Watch after Heart of Gold', movieId: 13, link: '/movies/13', isEssential: false },
          { type: 'episodes', label: 'Episodes 751–779', description: 'Zou arc — Minks and Raizo!', episodeRange: [751, 779], link: '/watch/751', isEssential: true },
        ],
      },
      {
        title: 'Whole Cake Island Arc',
        items: [
          { type: 'episodes', label: 'Episodes 780–782', description: 'Marine Rookie arc — filler', episodeRange: [780, 782], link: '/watch/780', isEssential: false },
          { type: 'episodes', label: 'Episodes 783–877', description: 'Whole Cake Island arc — Big Mom saga!', episodeRange: [783, 877], link: '/watch/783', isEssential: true },
          { type: 'episodes', label: 'Episodes 878–889', description: 'Levely arc — world leaders gather', episodeRange: [878, 889], link: '/watch/878', isEssential: true },
        ],
      },
    ],
  },
  {
    id: 'wano',
    name: 'Wano Country Saga',
    color: 'from-red-900 to-orange-900',
    arcs: [
      {
        title: 'Wano Arc',
        items: [
          { type: 'episodes', label: 'Episodes 890–894', description: 'Wano Country Act 1 — Luffy arrives in Wano', episodeRange: [890, 894], link: '/watch/890', isEssential: true },
          { type: 'episodes', label: 'Episodes 895–896', description: 'Cidre Guild arc — filler', episodeRange: [895, 896], link: '/watch/895', isEssential: false },
          { type: 'movie', label: 'Movie 14: Stampede', description: 'Pirates Festival — all-stars movie!', movieId: 14, link: '/movies/14', isEssential: false },
          { type: 'episodes', label: 'Episodes 897–958', description: 'Wano Country Act 2 — alliances form', episodeRange: [897, 958], link: '/watch/897', isEssential: true },
          { type: 'episodes', label: 'Episodes 959–1051', description: 'Wano Country Act 3 — Oden\'s past + Onigashima raid!', episodeRange: [959, 1051], link: '/watch/959', isEssential: true },
        ],
      },
      {
        title: 'Land of Wano Arc',
        items: [
          { type: 'movie', label: 'Movie 15: Film Red', description: 'Shanks\' daughter — emotional masterpiece', movieId: 15, link: '/movies/15', isEssential: false },
          { type: 'episodes', label: 'Episodes 1052–1085', description: 'Land of Wano arc — aftermath', episodeRange: [1052, 1085], link: '/watch/1052', isEssential: true },
          { type: 'episodes', label: 'Episodes 1086–1088', description: 'Prologue to Egghead', episodeRange: [1086, 1088], link: '/watch/1086', isEssential: true },
        ],
      },
    ],
  },
  {
    id: 'egghead',
    name: 'Egghead Saga',
    color: 'from-violet-900 to-purple-900',
    arcs: [
      {
        title: 'Egghead Island Arc',
        items: [
          { type: 'episodes', label: 'Episodes 1089–1155', description: 'Egghead Island arc — Dr. Vegapunk\'s island', episodeRange: [1089, 1155], link: '/watch/1089', isEssential: true },
        ],
      },
    ],
  },
  {
    id: 'elbaph',
    name: 'Elbaph',
    color: 'from-emerald-900 to-green-900',
    arcs: [
      {
        title: 'Elbaph Arc',
        items: [
          { type: 'episodes', label: 'Episodes 1156–Current', description: 'Elbaph arc — currently airing!', episodeRange: [1156, 1161], link: '/watch/1156', isEssential: true },
        ],
      },
    ],
  },
];
