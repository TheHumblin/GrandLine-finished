import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { User, ThemeName, WatchHistoryEntry } from '@/types';
import { calculateEarnedBounty } from '@/lib/bounty';
import { OVAS } from '@/data/ovas';
import { loadLocalProgress, saveLocalProgress, LOCAL_PROGRESS_KEY, PROGRESS_EVENT, DIRTY_PROGRESS_KEY } from '@/lib/progressStorage';
import { syncProgressFromSupabase } from '@/lib/progressSync';
import type { ProgressSnapshot } from '@/types/progress';

const ADMIN_EMAIL = 'cordelllawson999@gmail.com';

export interface AuthUser extends User {}

function mapSupabaseUser(user: SupabaseUser): AuthUser {
  const meta = user.user_metadata || {};
  return {
    id: user.id,
    username: meta.username || meta.full_name || user.email!.split('@')[0],
    email: user.email!,
    avatar: meta.avatar_url || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.email || user.id)}`,
    epithet: 'Cabin Boy',
    bounty: 0,
    watchedEpisodes: [],
    watchedMovies: [],
    watchedSpecials: [],
    watchedOVAs: [],
    currentEpisode: 0,
    currentMangaChapter: 0,
    joinDate: user.created_at || new Date().toISOString(),
    crew: 'Straw Hat Pirates',
    theme: 'strawhat',
    showSpoilers: false,
    isAdmin: user.email === ADMIN_EMAIL,
    selectedTitle: 'Cabin Boy',
  };
}

function generateEpithet(watchedCount: number): string {
  if (watchedCount >= 1000) return 'Pirate King';
  if (watchedCount >= 500) return 'Emperor of the Sea';
  if (watchedCount >= 300) return 'Warlord of the Sea';
  if (watchedCount >= 200) return 'Surgeon of Death';
  if (watchedCount >= 100) return 'Pirate Hunter';
  if (watchedCount >= 50) return 'Star of the Sea';
  if (watchedCount >= 20) return 'Rookie Pirate';
  return 'Cabin Boy';
}

// Admin-exclusive titles that bypass episode requirements
export const ADMIN_EXCLUSIVE_TITLES = [
  'Fleet Admiral', 'King of the Pirates', 'The Grand Architect',
  'Lurking Legend', 'Voice of All Things', 'Nika, the Sun God',
];

export function getUnlockedTitles(watchedCount: number): string[] {
  const all = [
    { min: 0, label: 'Cabin Boy' },
    { min: 20, label: 'Rookie Pirate' },
    { min: 50, label: 'Star of the Sea' },
    { min: 100, label: 'Pirate Hunter' },
    { min: 200, label: 'Surgeon of Death' },
    { min: 300, label: 'Warlord of the Sea' },
    { min: 500, label: 'Emperor of the Sea' },
    { min: 1000, label: 'Pirate King' },
  ];
  return all.filter(e => watchedCount >= e.min).map(e => e.label);
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const mergeWithProgress = useCallback((base: AuthUser): AuthUser => {
    const local = loadLocalProgress(base.id) as Partial<AuthUser> & { _adminBounty?: number };
    const watchedCount = (local.watchedEpisodes || []).length;
    const earned = generateEpithet(watchedCount);
    const unlockedTitles = getUnlockedTitles(watchedCount);
    const isAdmin = base.email === ADMIN_EMAIL;
    // Admin-exclusive titles are always valid for the admin
    const titleIsValid = (t: string | undefined) =>
      !!t && (unlockedTitles.includes(t) || (isAdmin && ADMIN_EXCLUSIVE_TITLES.includes(t)));
    const selectedTitle = titleIsValid(local.selectedTitle) ? local.selectedTitle! : earned;
    // Admin bounty override takes precedence over calculated bounty
    const calculatedBounty = calculateEarnedBounty(local);
    const bounty = (isAdmin && typeof local._adminBounty === 'number') ? local._adminBounty : calculatedBounty;
    return {
      ...base,
      ...local,
      epithet: selectedTitle,
      selectedTitle,
      bounty,
      isAdmin,
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      if (session?.user) {
        const base = mapSupabaseUser(session.user);
        setUser(mergeWithProgress(base));
        void syncProgressFromSupabase(base.id);
      }
      if (error) console.warn('[Auth] Session initialization:', error.message);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_IN' && session?.user) {
        const base = mapSupabaseUser(session.user);
        setUser(mergeWithProgress(base));
        setLoading(false);
        // Start database/storage requests outside Supabase's auth lock.
        setTimeout(() => { if (mounted) void syncProgressFromSupabase(base.id); }, 0);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        const base = mapSupabaseUser(session.user);
        setUser(mergeWithProgress(base));
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [mergeWithProgress]);

  useEffect(() => {
    const refreshProgress = (event: Event) => {
      setUser(prev => {
        if (!prev) return prev;
        const matches = event instanceof StorageEvent
          ? event.key === LOCAL_PROGRESS_KEY(prev.id)
          : event instanceof CustomEvent && event.detail === prev.id;
        return matches ? mergeWithProgress(prev) : prev;
      });
    };
    window.addEventListener(PROGRESS_EVENT, refreshProgress);
    window.addEventListener('storage', refreshProgress);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refreshProgress);
      window.removeEventListener('storage', refreshProgress);
    };
  }, [mergeWithProgress]);

  useEffect(() => {
    if (!user?.id) return;
    const id = user.id;
    const retry = () => { if (document.visibilityState === 'visible') void syncProgressFromSupabase(id); };
    const interval = setInterval(() => {
      if (localStorage.getItem(DIRTY_PROGRESS_KEY(id))) retry();
    }, 30_000);
    const poll = setInterval(retry, 60_000);
    window.addEventListener('online', retry);
    window.addEventListener('focus', retry);
    return () => {
      clearInterval(interval); clearInterval(poll);
      window.removeEventListener('online', retry);
      window.removeEventListener('focus', retry);
    };
  }, [user?.id]);

  const sendOtp = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const verifyOtpAndSetPassword = useCallback(async (
    email: string, token: string, password: string, username: string
  ): Promise<{ success: boolean; error?: string }> => {
    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (verifyError) return { success: false, error: verifyError.message };

    const { error: updateError } = await supabase.auth.updateUser({
      password,
      data: { username },
    });
    if (updateError) return { success: false, error: updateError.message };
    return { success: true };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const persistProgress = useCallback((updates: Partial<AuthUser> & { _adminBounty?: number; bounty?: number }) => {
    if (!user) return;
    // Perform side effects once, outside React's state updater (including Strict Mode).
    const existing = loadLocalProgress(user.id);
    const merged = { ...user, ...existing, ...updates };
    const isAdmin = user.email === ADMIN_EMAIL;
      // Persist admin bounty override separately
      const adminBountyOverride = updates._adminBounty ?? (updates.bounty !== undefined && isAdmin ? updates.bounty : (existing._adminBounty as number | undefined));
      const now = new Date().toISOString();
      const fieldUpdatedAt = { ...existing._fieldUpdatedAt };
      Object.keys(updates).forEach(key => { fieldUpdatedAt[key] = now; });
      const progressSnapshot: ProgressSnapshot = {
        _updatedAt: now,
        _fieldUpdatedAt: fieldUpdatedAt,
        watchedEpisodes: merged.watchedEpisodes,
        watchedMovies: merged.watchedMovies,
        watchedSpecials: merged.watchedSpecials || [],
        watchedOVAs: merged.watchedOVAs || [],
        watchedLiveAction: merged.watchedLiveAction || [],
        currentEpisode: merged.currentEpisode,
        currentMangaChapter: merged.currentMangaChapter,
        theme: merged.theme,
        poneglyphActive: merged.poneglyphActive,
        ownedSkins: merged.ownedSkins || [],
        showSpoilers: merged.showSpoilers,
        avatar: merged.avatar,
        selectedTitle: merged.selectedTitle,
        watchHistory: merged.watchHistory,
        hideFiller: merged.hideFiller,
        crew: merged.crew,
      };
      if (isAdmin && adminBountyOverride !== undefined) {
        progressSnapshot._adminBounty = adminBountyOverride;
      }
      saveLocalProgress(user.id, progressSnapshot, true);
      void syncProgressFromSupabase(user.id);
      const watchedCount = merged.watchedEpisodes.length;
      const calculatedBounty = calculateEarnedBounty(merged);
      const bounty = (isAdmin && adminBountyOverride !== undefined) ? adminBountyOverride : calculatedBounty;
      const unlockedTitles = getUnlockedTitles(watchedCount);
      // Admin can keep any title including exclusive ones
      const titleIsValid = (t: string | undefined) =>
        !!t && (unlockedTitles.includes(t) || (isAdmin && ADMIN_EXCLUSIVE_TITLES.includes(t)));
      const selectedTitle = titleIsValid(merged.selectedTitle) ? merged.selectedTitle! : generateEpithet(watchedCount);
      setUser({ ...merged, bounty, epithet: selectedTitle, selectedTitle });
  }, [user]);

  const updateProgress = useCallback((episodeNumber: number) => {
    if (!user) return;
    const latest = loadLocalProgress(user.id);
    const watchedEpisodes = Array.from(new Set([...(latest.watchedEpisodes ?? user.watchedEpisodes), episodeNumber]));
    const currentEpisode = Math.max(latest.currentEpisode ?? user.currentEpisode, episodeNumber);
    const watchHistory: WatchHistoryEntry[] = [
      { episodeNumber, watchedAt: new Date().toISOString(), type: 'episode' },
      ...(latest.watchHistory ?? user.watchHistory ?? []).filter(h => h.type !== 'episode' || h.episodeNumber !== episodeNumber),
    ].slice(0, 100);
    persistProgress({ watchedEpisodes, currentEpisode, watchHistory });
  }, [user, persistProgress]);

  const updateMovieProgress = useCallback((movieId: number) => {
    if (!user) return;
    const watchedMovies = Array.from(new Set([...(loadLocalProgress(user.id).watchedMovies ?? user.watchedMovies), movieId]));
    persistProgress({ watchedMovies });
  }, [user, persistProgress]);

  const updateLiveActionProgress = useCallback((episodeId: number) => {
    if (!user) return;
    const watchedLiveAction = Array.from(new Set([...(loadLocalProgress(user.id).watchedLiveAction ?? user.watchedLiveAction ?? []), episodeId]));
    persistProgress({ watchedLiveAction });
  }, [user, persistProgress]);

  const updateSpecialProgress = useCallback((specialId: number) => {
    if (!user) return;
    const watchedSpecials = Array.from(new Set([...(loadLocalProgress(user.id).watchedSpecials ?? user.watchedSpecials ?? []), specialId]));
    persistProgress({ watchedSpecials });
  }, [user, persistProgress]);

  const updateOVAProgress = useCallback((ovaId: number): boolean => {
    if (!user || !OVAS.some(ova => ova.id === ovaId)) return false;
    const latest = loadLocalProgress(user.id);
    const watchedOVAs = Array.from(new Set([...(user.watchedOVAs || []), ...(latest.watchedOVAs || [])]));
    if (watchedOVAs.includes(ovaId)) return false;
    watchedOVAs.push(ovaId);
    const watchHistory: WatchHistoryEntry[] = [
      { episodeNumber: ovaId, watchedAt: new Date().toISOString(), type: 'ova' },
      ...(latest.watchHistory ?? user.watchHistory ?? []).filter(entry => entry.type !== 'ova' || entry.episodeNumber !== ovaId),
    ].slice(0, 100);
    console.log('[OVA progress] Recording completed title:', ovaId);
    persistProgress({ watchedOVAs, watchHistory });
    return true;
  }, [user, persistProgress]);

  const updateMangaProgress = useCallback((chapter: number) => {
    if (!user) return;
    persistProgress({ currentMangaChapter: Math.max(user.currentMangaChapter, chapter) });
  }, [user, persistProgress]);

  const updateTheme = useCallback((theme: ThemeName) => {
    persistProgress({ theme });
  }, [persistProgress]);

  const updateSettings = useCallback((settings: Partial<AuthUser>) => {
    persistProgress(settings);
  }, [persistProgress]);

  const selectTitle = useCallback((title: string) => {
    // Admin can select any title including exclusive ones
    persistProgress({ selectedTitle: title, epithet: title });
  }, [persistProgress]);

  return {
    user,
    loading,
    login,
    sendOtp,
    verifyOtpAndSetPassword,
    logout,
    updateProgress,
    updateMovieProgress,
    updateSpecialProgress,
    updateOVAProgress,
    updateMangaProgress,
    updateLiveActionProgress,
    updateTheme,
    updateSettings,
    selectTitle,
    persistProgress,
    isAuthenticated: !!user,
  };
}

export type { WatchHistoryEntry } from '@/types';
