// Conservative checkpoints for the entire local dossier, not only a race's debut.
// For example: merfolk include Poseidon; Minks include Sulong; nobles include Im.
export const RACE_DETAIL_EPISODES: Record<string, number> = {
  human: 516, giant: 746, dwarf: 746, mink: 877, fishman: 574, merfolk: 574,
  skypiean: 195, birkan: 195, shandian: 195, lunarian: 1062,
  'long-limb': 400, 'long-neck': 877, 'three-eye': 877,
  'ancient-giant': 489, cyborg: 1085, skeleton: 574,
  'celestial-dragon': 889, wotan: 574, oni: 1085, buccaneer: 1129,
};

// Full Ohara sheets can contain later facts than the matching local dossier.
// Shared sheets use a single boundary everywhere, including the source gallery.
// Unknown/manga-only sheets have no boundary and remain protected with Anti-Spoiler on.
export const RACE_ARTWORK_EPISODES: Record<string, number> = {
  humans: 516, 'fish-men': 574, mermen: 574, angels: 195,
  giants: 1155, 'ancient-giants': 1085, dwarves: 746, minks: 1085,
  lunarians: 1109, longarms: 877, 'long-arms': 877, longlegs: 877, 'long-legs': 877,
  snakenecks: 877, 'snake-necks': 877, longnecks: 877,
  'three-eyed': 877, 'three-eyes': 877, 'three-eyeds': 877,
  watans: 574, onis: 1085, buccaneers: 1136, kuja: 516,
  'ancient-giant-blooded': 1085, 'half-dwarves': 746, 'half-fish-men': 746,
  'half-mermen': 574, 'half-longarms': 877, 'half-longlegs': 877,
  'half-snakenecks': 877, 'half-three-eyed': 877, 'half-minks': 877,
  'half-lunarian': 1109,
};
