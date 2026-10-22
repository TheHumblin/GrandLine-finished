/**
 * sync-episodes — Edge Function
 * Uses Jikan API (MyAnimeList) to discover new One Piece episodes.
 * One Piece MAL ID = 21. Jikan v4 returns 100 eps per page.
 * Safe to call repeatedly (upsert on conflict).
 *
 * All synced episodes use megaplay.buzz for streaming:
 *   https://megaplay.buzz/stream/ani/21/{epNum}/sub  (Megaplay-1, AniList)
 *   https://megaplay.buzz/stream/mal/21/{epNum}/sub  (Megaplay-2, MAL)
 * These URLs are built by VideoPlayer.tsx automatically from episode_number.
 * No server URLs need to be stored — only episode metadata.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// One Piece MAL ID (same as AniList ID = 21)
const ONE_PIECE_MAL_ID = 21;

// Highest episode in the static data file — sync only fetches ABOVE this
const STATIC_MAX_EPISODE = 1162;

/**
 * Arc classification table — updated as new arcs air.
 * Each entry: [minEpisode, arc, saga]
 * Ordered descending so first match wins.
 */
const ARC_TABLE: [number, string, string][] = [
  [1126, 'Elbaf Arc',                'Final Saga'],
  [1086, 'Egghead Arc',              'Final Saga'],
  [1058, 'Egghead Arc (Transition)', 'Final Saga'],
  [1, 'Egghead Arc', 'Final Saga'], // fallback for anything after static range
];

function classifyEpisode(epNum: number): { arc: string; saga: string } {
  for (const [min, arc, saga] of ARC_TABLE) {
    if (epNum >= min) return { arc, saga };
  }
  return { arc: 'Unknown Arc', saga: 'Final Saga' };
}

interface JikanEpisode {
  mal_id: number;
  title: string;
  title_japanese?: string;
  aired?: string;
  score?: number | null;
  filler?: boolean;
  recap?: boolean;
  synopsis?: string | null;
}

interface SyncedEpisode {
  episode_number: number;
  title: string;
  air_date: string;
  thumbnail: string;
  arc: string;
  saga: string;
  synopsis: string;
  duration: string;
}

/**
 * Fetch a page of One Piece episodes from Jikan API.
 * Returns null on failure.
 */
async function fetchJikanPage(page: number): Promise<JikanEpisode[] | null> {
  const url = `https://api.jikan.moe/v4/anime/${ONE_PIECE_MAL_ID}/episodes?page=${page}`;
  console.log(`Fetching Jikan page ${page}: ${url}`);
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.log(`Jikan page ${page} returned HTTP ${res.status}`);
      return null;
    }
    const json = await res.json();
    return json?.data ?? null;
  } catch (err) {
    console.log(`Jikan page ${page} fetch failed:`, String(err));
    return null;
  }
}

/**
 * Fetch anime details for a thumbnail image.
 */
async function fetchAnimeThumb(): Promise<string> {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${ONE_PIECE_MAL_ID}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return '';
    const json = await res.json();
    return json?.data?.images?.jpg?.large_image_url
      || json?.data?.images?.jpg?.image_url
      || '';
  } catch {
    return '';
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find highest episode already in DB
    const { data: maxRow } = await supabase
      .from('synced_episodes')
      .select('episode_number')
      .order('episode_number', { ascending: false })
      .limit(1)
      .single();

    const dbMax = maxRow?.episode_number ?? 0;
    const currentMax = Math.max(STATIC_MAX_EPISODE, dbMax);
    const checkFrom = currentMax + 1;

    console.log(`Checking for episodes > ${currentMax} (DB max: ${dbMax})`);

    // Calculate which Jikan page(s) contain the episodes we need
    // Jikan returns 100 eps per page; also check two pages ahead for safety
    const startPage = Math.ceil(checkFrom / 100);
    const endPage = startPage + 2; // Check current and next two pages to catch splits & delayed metadata

    const newEpisodes: SyncedEpisode[] = [];

    // Fetch anime thumbnail once (reuse for all new eps if individual thumbs unavailable)
    const animeThumbnail = await fetchAnimeThumb();
    console.log(`Anime thumbnail: ${animeThumbnail ? 'found' : 'not found'}`);

    for (let page = startPage; page <= endPage; page++) {
      const episodes = await fetchJikanPage(page);
      if (!episodes || episodes.length === 0) {
        console.log(`No episodes on page ${page}, stopping.`);
        break;
      }

      for (const ep of episodes) {
        const epNum = ep.mal_id;
        if (epNum <= currentMax) continue; // Already have this one

        const { arc, saga } = classifyEpisode(epNum);

        // Clean title: strip "One Piece - ", "One Piece: ", roman numeral episode prefixes
        const rawTitle = ep.title || '';
        const cleanTitle = rawTitle
          .replace(/^One Piece\s*[-:,]\s*/i, '')
          .replace(/^Episode\s+\d+\s*[-:,]?\s*/i, '')
          .trim() || `One Piece Episode ${epNum}`;

        // Build a synopsis — use Jikan synopsis if available, else generate one
        const synopsis = ep.synopsis?.trim()
          || `${arc} — Episode ${epNum} of One Piece.`;

        // Determine if filler (Jikan provides filler/recap flags)
        const isFiller = ep.filler === true;
        const isRecap = ep.recap === true;
        const episodeType = isRecap ? 'recap' : isFiller ? 'filler' : 'manga-canon';

        newEpisodes.push({
          episode_number: epNum,
          title: cleanTitle,
          air_date: ep.aired ? ep.aired.split('T')[0] : new Date().toISOString().split('T')[0],
          thumbnail: animeThumbnail,
          arc,
          saga,
          synopsis,
          duration: '24m',
        });

        console.log(`✓ Queued ep ${epNum} [${episodeType}]: "${cleanTitle}"`);
      }

      // Jikan rate limit: be kind (300ms between requests)
      if (page < endPage) await new Promise(r => setTimeout(r, 300));
    }

    // Update scheduled_jobs last_run
    await supabase
      .from('scheduled_jobs')
      .update({
        last_run: new Date().toISOString(),
        next_run: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      })
      .eq('job_name', 'sync-episodes');

    if (newEpisodes.length === 0) {
      console.log('No new episodes found via Jikan.');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Already up to date. No new episodes found.',
          checkedFrom: checkFrom,
          currentMax,
          newCount: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upsert discovered episodes
    const { error: upsertError } = await supabase
      .from('synced_episodes')
      .upsert(newEpisodes, { onConflict: 'episode_number' });

    if (upsertError) {
      console.error('Upsert error:', upsertError);
      return new Response(
        JSON.stringify({ success: false, error: `DB upsert: ${upsertError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Synced ${newEpisodes.length} new episode(s).`);
    return new Response(
      JSON.stringify({
        success: true,
        message: `Synced ${newEpisodes.length} new episode(s).`,
        newEpisodes: newEpisodes.map(e => ({ number: e.episode_number, title: e.title })),
        newCount: newEpisodes.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('sync-episodes fatal error:', err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
