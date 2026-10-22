import { useCallback, useEffect, useState } from 'react';
import { getProgressSyncState, syncProgressFromSupabase } from '@/lib/progressSync';
import { PROGRESS_SYNC_EVENT } from '@/lib/progressStorage';
import type { ProgressSyncState } from '@/types/progress';

export function useProgressSync(userId?: string) {
  const [state, setState] = useState<ProgressSyncState>({ status: 'idle' });
  useEffect(() => {
    if (!userId) return;
    setState(getProgressSyncState(userId));
    const listener = (event: Event) => {
      if (event instanceof CustomEvent && event.detail === userId) setState(getProgressSyncState(userId));
    };
    window.addEventListener(PROGRESS_SYNC_EVENT, listener);
    return () => window.removeEventListener(PROGRESS_SYNC_EVENT, listener);
  }, [userId]);
  const retry = useCallback(() => userId ? syncProgressFromSupabase(userId) : Promise.resolve(false), [userId]);
  return { ...state, retry };
}
