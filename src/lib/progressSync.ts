import { supabase } from '@/lib/supabase';
import { migratePosterPhoto } from '@/lib/posterPhotos';
import { mergeProgress } from '@/lib/mergeProgress';
import { loadLocalProgress, saveLocalProgress, DIRTY_PROGRESS_KEY, CLOUD_PROGRESS_EVENT, PROGRESS_SYNC_EVENT } from '@/lib/progressStorage';
import type { ProgressSnapshot, ProgressSyncState } from '@/types/progress';
import { toast } from 'sonner';

const running = new Map<string, Promise<boolean>>();
const states = new Map<string, ProgressSyncState>();
export const getProgressSyncState = (id: string): ProgressSyncState => states.get(id) || { status: 'idle' };
function status(id: string, state: ProgressSyncState) {
  states.set(id, state);
  window.dispatchEvent(new CustomEvent(PROGRESS_SYNC_EVENT, { detail: id }));
}

async function sync(userId: string): Promise<boolean> {
  status(userId, { status: 'syncing' });
  try {
    for (let attempt = 0; attempt < 4; attempt++) {
      const { data, error } = await supabase.from('user_profiles').select('progress_data').eq('id', userId).maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Your cloud profile is missing. Sign out and sign in again, then retry.');
      const remote = (data.progress_data || {}) as ProgressSnapshot;
      const local = loadLocalProgress(userId);
      const version = localStorage.getItem(DIRTY_PROGRESS_KEY(userId));
      const merged = mergeProgress(remote, local);
      merged.avatar = await migratePosterPhoto(userId, merged.avatar);
      // A newer edit made during upload/fetch must never be overwritten by this request.
      if (version !== localStorage.getItem(DIRTY_PROGRESS_KEY(userId))) continue;
      if (merged.avatar !== local.avatar && local.avatar?.startsWith('data:image/')) {
        merged._fieldUpdatedAt = { ...merged._fieldUpdatedAt, avatar: new Date().toISOString() };
      }
      if (JSON.stringify(local) !== JSON.stringify(merged)) saveLocalProgress(userId, merged);
      // Never send embedded media to PostgREST, even when a legacy snapshot is malformed.
      if (merged.avatar?.startsWith('data:')) throw new Error('Re-upload your poster photo as JPG, PNG, WebP, or GIF.');
      // A read-only poll must not overwrite an unchanged remote snapshot.
      if (version || JSON.stringify(remote) !== JSON.stringify(merged)) {
        const { data: saved, error: saveError } = await supabase.from('user_profiles').update({ progress_data: merged }).eq('id', userId).select('id').maybeSingle();
        if (saveError) throw new Error(saveError.message);
        if (!saved) throw new Error('Cloud save was not permitted. Sign in again and retry.');
      }
      if (version !== localStorage.getItem(DIRTY_PROGRESS_KEY(userId))) continue;
      localStorage.removeItem(DIRTY_PROGRESS_KEY(userId));
      status(userId, { status: 'synced', syncedAt: new Date().toISOString() });
      toast.dismiss('progress-sync');
      window.dispatchEvent(new CustomEvent(CLOUD_PROGRESS_EVENT, { detail: userId }));
      console.log('[Progress sync] Saved media counts and photo URL to cloud');
      return true;
    }
    status(userId, { status: 'pending', message: 'New changes are queued. Retrying automatically.' });
    return false;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cloud connection unavailable. Please retry.';
    console.warn('[Progress sync]', message);
    const wasPending = localStorage.getItem(DIRTY_PROGRESS_KEY(userId));
    if (!wasPending) localStorage.setItem(DIRTY_PROGRESS_KEY(userId), crypto.randomUUID());
    status(userId, { status: 'pending', message });
    toast.error('Progress is safe on this device. Cloud sync will retry automatically.', { id: 'progress-sync', description: message });
    return false;
  }
}

export function syncProgressFromSupabase(userId: string): Promise<boolean> {
  const active = running.get(userId);
  if (active) return active;
  const request = sync(userId).finally(() => running.delete(userId));
  running.set(userId, request);
  return request;
}
