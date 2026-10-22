import type { OVAEpisodeSource } from '@/types/ova';

const WATCH = 'https://hianime.at/watch/';
const STREAM = 'https://zokoanime.video/stream/';
function single(slug: string, ep: number, mal: number, indexPhp = false): OVAEpisodeSource[] {
  return [{ number: 1, label: 'Full video',
    hianimeUrl: `${indexPhp ? 'https://hianime.at/index.php/watch/' : WATCH}${slug}?ep=${ep}`,
    sub: `${STREAM}mal/${mal}/1/sub`, dub: null }];
}

// Exact embed destinations decoded from HiAnime's server lists, not its ep IDs.
// No DUB tracks were listed for these sources at verification time.
export const OVA_SOURCES: Record<number, OVAEpisodeSource[]> = {
  1: single('one-piece-defeat-the-pirate-ganzack-4350', 55108, 466),
  2: single('one-piece-dream-soccer-king-5346', 68739, 2386, true),
  3: single('one-piece-djangos-dance-carnival-5336', 68721, 2385),
  4: single('one-piece-take-aim-the-pirate-baseball-king-5339', 68724, 2490),
  5: single('one-piece-romance-dawn-story-5344', 68737, 5252),
  6: single('one-piece-film-strong-world-episode-0-5305', 68664, 8740, true),
  7: [
    { number: 1, label: 'Part 1', hianimeUrl: `${WATCH}one-piece-glorious-island-5333?ep=68697`, sub: `${STREAM}mal/16468/1/sub`, dub: null },
    // HiAnime labels the second item HD-1, but its actual destination is ZokoAnime.
    { number: 2, label: 'Part 2', hianimeUrl: `${WATCH}one-piece-glorious-island-5333?ep=68698`, sub: `${STREAM}mal/16468/2/sub`, dub: null },
  ],
  8: single('one-piece-film-gold-episode-0-711-ver-5304', 68662, 33606),
};
