import { corsHeaders } from '../_shared/cors.ts';
import { fruitCatalog, fruitDetail } from './fruits.ts';
import { raceImages } from './races.ts';

const cache = new Map<string, { data: unknown; until: number }>();
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  if (req.method !== 'POST') return reply({ error: 'Use POST.' }, 405);
  try {
    const { kind, slug } = await req.json();
    if (!['fruits', 'fruit', 'races'].includes(kind)) return reply({ error: 'Unknown encyclopedia source.' }, 400);
    if (kind === 'fruit' && (typeof slug !== 'string' || !/^[a-z0-9-]{1,120}$/.test(slug))) return reply({ error: 'Invalid fruit identifier.' }, 400);
    const key = `${kind}:${kind === 'fruit' ? slug : ''}`;
    const saved = cache.get(key);
    if (saved && saved.until > Date.now()) return reply({ data: saved.data });
    console.log('[Encyclopedia] Reading source:', kind);
    const data = kind === 'fruits' ? await fruitCatalog() : kind === 'races' ? await raceImages() : await fruitDetail(slug);
    if (cache.size > 500) cache.clear();
    cache.set(key, { data, until: Date.now() + 6 * 60 * 60 * 1000 });
    return reply({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Encyclopedia source unavailable.';
    console.error('[Encyclopedia]', message);
    return reply({ error: message }, 502);
  }
});
