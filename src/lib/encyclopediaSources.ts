import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export async function readEncyclopediaSource<T>(kind: 'fruits' | 'fruit' | 'races', slug?: string): Promise<T> {
  const { data, error } = await supabase.functions.invoke('encyclopedia-sources', { body: { kind, slug } });
  if (error) {
    let message = error.message;
    if (error instanceof FunctionsHttpError) {
      const content = await error.context.text().catch(() => '');
      message = `Encyclopedia source (${error.context.status}): ${content || message}`;
    }
    throw new Error(message);
  }
  if (data?.error || !data?.data) throw new Error(data?.error || 'Encyclopedia source returned no data.');
  return data.data as T;
}
