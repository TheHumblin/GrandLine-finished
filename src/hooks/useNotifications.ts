import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export interface Notification {
  id: string;
  user_id: string;
  from_user_id: string | null;
  type: string;
  message: string;
  read: boolean;
  comment_id: string | null;
  episode_number: number | null;
  created_at: string;
  from_user?: { username: string; avatar?: string } | null;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30);

    if (data) {
      // Fetch from_user info for each notification
      const enriched: Notification[] = await Promise.all(
        data.map(async (n) => {
          if (!n.from_user_id) return { ...n, from_user: null };
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('username, progress_data')
            .eq('id', n.from_user_id)
            .single();
          return {
            ...n,
            from_user: profile
              ? {
                  username: profile.username || 'Pirate',
                  avatar:
                    (profile.progress_data as Record<string, unknown>)?.avatar as string | undefined,
                }
              : null,
          };
        })
      );
      setNotifications(enriched);
      setUnreadCount(enriched.filter((n) => !n.read).length);
    }
    setLoading(false);
  }, [user]);

  const markAllRead = useCallback(async () => {
    if (!user) return;
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [user]);

  const markRead = useCallback(async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll every 30s for new notifications
      const interval = setInterval(fetchNotifications, 30_000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAllRead,
    markRead,
    deleteNotification,
  };
}
