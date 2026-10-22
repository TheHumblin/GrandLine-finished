import type { ProgressSnapshot } from '@/types/progress';

export const PROGRESS_EVENT = 'grandline:progress-updated';
export const CLOUD_PROGRESS_EVENT = 'grandline:cloud-progress-synced';
export const PROGRESS_SYNC_EVENT = 'grandline:sync-status';
export const LOCAL_PROGRESS_KEY = (id: string) => `grandline_progress_${id}`;
export const DIRTY_PROGRESS_KEY = (id: string) => `grandline_progress_pending_${id}`;

export function loadLocalProgress(userId: string): ProgressSnapshot {
  try { return JSON.parse(localStorage.getItem(LOCAL_PROGRESS_KEY(userId)) || '{}') as ProgressSnapshot; }
  catch { return {}; }
}

export function saveLocalProgress(userId: string, data: ProgressSnapshot, pending = false) {
  localStorage.setItem(LOCAL_PROGRESS_KEY(userId), JSON.stringify(data));
  if (pending) localStorage.setItem(DIRTY_PROGRESS_KEY(userId), crypto.randomUUID());
  queueMicrotask(() => window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: userId })));
}
