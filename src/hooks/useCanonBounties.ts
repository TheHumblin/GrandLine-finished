import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CANON_BOUNTIES } from '@/data/canonBounties';
import { refreshCanonSources } from '@/lib/canonRefresh';

interface CanonBountyRow { character_key: string; bounty: number; source_url: string; checked_at: string; }
export function useCanonBounties() {
  const [sourceMessage, setSourceMessage] = useState<string>();
  const query = useQuery({
    queryKey: ['canon-bounties'],
    queryFn: async () => {
      const { data, error } = await supabase.from('canon_bounties').select('character_key,bounty,source_url,checked_at');
      if (error) throw new Error('Canon bounty updates are unavailable. Last known values are still shown.');
      return (data || []) as CanonBountyRow[];
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
  const refetch = query.refetch;
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      if (document.visibilityState !== 'visible') return;
      const result = await refreshCanonSources();
      if (mounted) { setSourceMessage(result.error || result.message); await refetch(); }
    };
    void check();
    const timer = setInterval(() => void check(), 5 * 60_000);
    const onFocus = () => void check();
    window.addEventListener('focus', onFocus);
    return () => { mounted = false; clearInterval(timer); window.removeEventListener('focus', onFocus); };
  }, [refetch]);
  const pirates = useMemo(() => CANON_BOUNTIES.map(pirate => {
    const saved = query.data?.find(row => row.character_key === pirate.key);
    return { ...pirate, bounty: saved ? Number(saved.bounty) : pirate.bounty, checkedAt: saved?.checked_at, sourceUrl: saved?.source_url || `https://onepiece.fandom.com/wiki/${pirate.key}` };
  }).sort((a, b) => b.bounty - a.bounty), [query.data]);
  const checked = pirates.map(pirate => pirate.checkedAt).filter((date): date is string => !!date).sort();
  return { pirates, lastChecked: checked.length === pirates.length ? checked[0] : undefined, error: query.error, sourceMessage, refresh: query.refetch };
}
