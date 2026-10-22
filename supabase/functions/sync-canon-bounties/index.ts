import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { CANON_SOURCES, fetchCanonBounty } from './source.ts';

const DAY = 24 * 60 * 60 * 1000;
const reply = (body: object, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return reply({ error: 'Use POST.' }, 405);
  try {
    const admin = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '');
    // Public read workflow: no user session required. Only fixed sources can be refreshed.
    const { data: job, error: jobError } = await admin.from('scheduled_jobs').select('last_run,next_run').eq('job_name', 'sync-canon-bounties').maybeSingle();
    if (jobError) throw new Error(jobError.message);
    if (job?.next_run && new Date(job.next_run).getTime() > Date.now()) return reply({ success: true, cached: true, checkedAt: job.last_run });
    const { data: claimed, error: claimError } = await admin.rpc('claim_canon_bounty_refresh');
    if (claimError) throw new Error(claimError.message);
    if (!claimed) return reply({ success: true, cached: true });
    const failures: string[] = [];
    let verified = 0;
    // Two requests at a time keeps the public source and edge runtime load bounded.
    for (let i = 0; i < CANON_SOURCES.length; i += 2) {
      await Promise.all(CANON_SOURCES.slice(i, i + 2).map(async source => {
        try {
          const bounty = await fetchCanonBounty(source.key);
          const { error } = await admin.from('canon_bounties').upsert({ character_key: source.key, name: source.name, bounty, source_url: `https://onepiece.fandom.com/wiki/${source.key}`, checked_at: new Date().toISOString() }, { onConflict: 'character_key' });
          if (error) throw new Error(error.message);
          verified++;
        } catch (error) {
          console.warn('[Canon bounty]', source.key, String(error));
          failures.push(source.name);
        }
      }));
    }
    const now = new Date().toISOString();
    const { error: scheduleError } = await admin.from('scheduled_jobs').update({ last_run: now, next_run: new Date(Date.now() + (failures.length ? 60 * 60 * 1000 : DAY)).toISOString() }).eq('job_name', 'sync-canon-bounties');
    if (scheduleError) throw new Error(scheduleError.message);
    console.log('[Canon bounty] Verified:', verified, 'Unchanged on source failure:', failures.length);
    return reply({ success: verified > 0, verified, failures, checkedAt: now, message: failures.length ? 'Some sources were unavailable. Last verified values retained; retry in one hour.' : 'Canon bounties verified for today.' });
  } catch (error) {
    console.error('[Canon bounty]', String(error));
    return reply({ error: 'Canon source check unavailable. Last verified values are retained.' }, 503);
  }
});
