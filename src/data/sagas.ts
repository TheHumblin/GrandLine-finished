import type { Saga } from '@/types';

export const SAGAS: Saga[] = [
  {
    id: 'east-blue',
    name: 'East Blue Saga',
    episodeRange: [1, 61],
    arcs: [
      { id: 'romance-dawn', name: 'Romance Dawn Arc', episodeRange: [1, 3], sagaId: 'east-blue' },
      { id: 'orange-town', name: 'Orange Town Arc', episodeRange: [4, 8], sagaId: 'east-blue' },
      { id: 'syrup-village', name: 'Syrup Village Arc', episodeRange: [9, 18], sagaId: 'east-blue' },
      { id: 'baratie', name: 'Baratie Arc', episodeRange: [19, 30], sagaId: 'east-blue' },
      { id: 'arlong-park', name: 'Arlong Park Arc', episodeRange: [31, 44], sagaId: 'east-blue' },
      { id: 'loguetown', name: 'Loguetown Arc', episodeRange: [45, 53], sagaId: 'east-blue' },
      { id: 'warship-island', name: 'Warship Island Arc (Filler)', episodeRange: [54, 60], sagaId: 'east-blue' },
      { id: 'east-blue-misc', name: 'Loguetown (cont.)', episodeRange: [61, 61], sagaId: 'east-blue' },
    ],
  },
  {
    id: 'alabasta',
    name: 'Alabasta Saga',
    episodeRange: [62, 143],
    arcs: [
      { id: 'reverse-mountain', name: 'Reverse Mountain Arc', episodeRange: [62, 63], sagaId: 'alabasta' },
      { id: 'whisky-peak', name: 'Whisky Peak Arc', episodeRange: [64, 67], sagaId: 'alabasta' },
      { id: 'coby-helmeppo', name: 'Coby & Helmeppo (Mixed)', episodeRange: [68, 69], sagaId: 'alabasta' },
      { id: 'little-garden', name: 'Little Garden Arc', episodeRange: [70, 77], sagaId: 'alabasta' },
      { id: 'drum-island', name: 'Drum Island Arc', episodeRange: [78, 91], sagaId: 'alabasta' },
      { id: 'alabasta', name: 'Alabasta Arc', episodeRange: [92, 130], sagaId: 'alabasta' },
      { id: 'post-alabasta', name: 'Post-Alabasta (Filler)', episodeRange: [131, 143], sagaId: 'alabasta' },
    ],
  },
  {
    id: 'sky-island',
    name: 'Sky Island Saga',
    episodeRange: [144, 228],
    arcs: [
      { id: 'ruluka-island', name: 'Ruluka Island Arc (Filler)', episodeRange: [136, 143], sagaId: 'sky-island' },
      { id: 'jaya', name: 'Jaya Arc', episodeRange: [144, 152], sagaId: 'sky-island' },
      { id: 'skypiea', name: 'Skypiea Arc', episodeRange: [153, 195], sagaId: 'sky-island' },
      { id: 'g8', name: 'G-8 Arc (Filler)', episodeRange: [196, 206], sagaId: 'sky-island' },
      { id: 'long-ring', name: 'Long Ring Long Land Arc', episodeRange: [207, 219], sagaId: 'sky-island' },
      { id: 'oceans-dream', name: "Ocean's Dream Arc (Filler)", episodeRange: [220, 224], sagaId: 'sky-island' },
      { id: 'foxys-return', name: "Foxy's Return Arc (Mixed)", episodeRange: [225, 228], sagaId: 'sky-island' },
    ],
  },
  {
    id: 'water-7',
    name: 'Water 7 Saga',
    episodeRange: [229, 325],
    arcs: [
      { id: 'water-7', name: 'Water 7 Arc', episodeRange: [229, 263], sagaId: 'water-7' },
      { id: 'enies-lobby', name: 'Enies Lobby Arc', episodeRange: [264, 312], sagaId: 'water-7' },
      { id: 'post-enies', name: 'Post-Enies Lobby Arc', episodeRange: [313, 325], sagaId: 'water-7' },
    ],
  },
  {
    id: 'thriller-bark',
    name: 'Thriller Bark Saga',
    episodeRange: [326, 384],
    arcs: [
      { id: 'ice-hunter', name: 'Ice Hunter Arc (Filler)', episodeRange: [326, 336], sagaId: 'thriller-bark' },
      { id: 'thriller-bark', name: 'Thriller Bark Arc', episodeRange: [337, 381], sagaId: 'thriller-bark' },
      { id: 'spa-island', name: 'Spa Island Arc (Filler)', episodeRange: [382, 384], sagaId: 'thriller-bark' },
    ],
  },
  {
    id: 'summit-war',
    name: 'Summit War Saga',
    episodeRange: [385, 516],
    arcs: [
      { id: 'sabaody', name: 'Sabaody Archipelago Arc', episodeRange: [385, 405], sagaId: 'summit-war' },
      { id: 'sabaody-filler', name: 'Post-Sabaody (Filler)', episodeRange: [406, 407], sagaId: 'summit-war' },
      { id: 'amazon-lily', name: 'Amazon Lily Arc', episodeRange: [408, 421], sagaId: 'summit-war' },
      { id: 'impel-down', name: 'Impel Down Arc', episodeRange: [422, 458], sagaId: 'summit-war' },
      { id: 'marineford', name: 'Marineford Arc', episodeRange: [459, 489], sagaId: 'summit-war' },
      { id: 'post-marineford', name: 'Post-War Arc', episodeRange: [490, 516], sagaId: 'summit-war' },
    ],
  },
  {
    id: 'fish-man-island',
    name: 'Fish-Man Island Saga',
    episodeRange: [517, 574],
    arcs: [
      { id: 'return-sabaody', name: 'Return to Sabaody Arc', episodeRange: [517, 522], sagaId: 'fish-man-island' },
      { id: 'fish-man-island', name: 'Fish-Man Island Arc', episodeRange: [523, 574], sagaId: 'fish-man-island' },
    ],
  },
  {
    id: 'dressrosa',
    name: 'Dressrosa Saga',
    episodeRange: [575, 746],
    arcs: [
      { id: 'punk-hazard', name: 'Punk Hazard Arc', episodeRange: [575, 629], sagaId: 'dressrosa' },
      { id: 'dressrosa', name: 'Dressrosa Arc', episodeRange: [630, 699], sagaId: 'dressrosa' },
      { id: 'zou-lead-in', name: 'Dressrosa Arc (cont.)', episodeRange: [700, 706], sagaId: 'dressrosa' },
      { id: 'dressrosa-2', name: 'Dressrosa Arc (cont.)', episodeRange: [707, 746], sagaId: 'dressrosa' },
    ],
  },
  {
    id: 'whole-cake',
    name: 'Whole Cake Island Saga',
    episodeRange: [747, 889],
    arcs: [
      { id: 'pre-zou-filler', name: 'Pre-Zou Filler', episodeRange: [747, 750], sagaId: 'whole-cake' },
      { id: 'zou', name: 'Zou Arc', episodeRange: [751, 779], sagaId: 'whole-cake' },
      { id: 'marine-rookie', name: 'Marine Rookie Arc (Filler)', episodeRange: [780, 782], sagaId: 'whole-cake' },
      { id: 'whole-cake-island', name: 'Whole Cake Island Arc', episodeRange: [783, 877], sagaId: 'whole-cake' },
      { id: 'levely', name: 'Levely Arc', episodeRange: [878, 889], sagaId: 'whole-cake' },
    ],
  },
  {
    id: 'wano',
    name: 'Wano Country Saga',
    episodeRange: [890, 1085],
    arcs: [
      { id: 'wano-act1', name: 'Wano Country (Act 1)', episodeRange: [890, 906], sagaId: 'wano' },
      { id: 'wano-act1-filler', name: 'Cidre Guild Arc (Filler)', episodeRange: [895, 896], sagaId: 'wano' },
      { id: 'wano-act2', name: 'Wano Country (Act 2)', episodeRange: [907, 953], sagaId: 'wano' },
      { id: 'wano-act3', name: 'Wano Country (Act 3)', episodeRange: [954, 1085], sagaId: 'wano' },
    ],
  },
  {
    id: 'final',
    name: 'Final Saga',
    episodeRange: [1086, 9999],
    arcs: [
      { id: 'egghead', name: 'Egghead Arc', episodeRange: [1086, 1122], sagaId: 'final' },
      { id: 'egghead-2', name: 'Egghead Arc (cont.)', episodeRange: [1122, 1164], sagaId: 'final' },
      { id: 'elbaf', name: 'Elbaf Arc', episodeRange: [1165, 9999], sagaId: 'final' },
    ],
  },
];

export const EPISODE_TYPE_INFO = {
  'manga-canon': { label: 'Manga Canon', color: 'canon', description: 'Directly adapted from the manga' },
  'anime-canon': { label: 'Anime Canon', color: 'anime-canon', description: 'Anime-original episodes classified as anime canon by AnimeFillerList' },
  'mixed-canon': { label: 'Mixed Canon', color: 'mixed', description: 'Mixed canon/filler episodes on AnimeFillerList' },
  'filler': { label: 'Filler', color: 'filler', description: 'Anime original non-canon content' },
};
