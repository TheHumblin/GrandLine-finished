import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { readEncyclopediaSource } from '@/lib/encyclopediaSources';
export function useRaceImages() {
  const query = useQuery({ queryKey: ['library-ohara-race-images'], queryFn: () => readEncyclopediaSource<Record<string, string>>('races'), staleTime: 6 * 60 * 60 * 1000, retry: 1 });
  useEffect(() => { if (query.error) toast.error('Ohara’s image index could not be refreshed.', { id: 'race-source', description: 'Confirmed source images remain available.' }); }, [query.error]);
  return query;
}
