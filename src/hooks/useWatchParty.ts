import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchPartySnapshot, runPartyCommand } from '@/lib/partyApi';
import { PARTY_POLL_MS } from '@/lib/watchParty';
import type { PartyCommand } from '@/types/watchParty';

export function useWatchParty(userId?: string, invitation?: string | null) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [online, setOnline] = useState(navigator.onLine);
  const cache = useQueryClient();
  useEffect(() => {
    setRoomId(userId && !invitation ? sessionStorage.getItem(`grandline_active_party_${userId}`) : null);
  }, [userId, invitation]);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update); window.addEventListener('offline', update);
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); };
  }, []);
  const query = useQuery({
    queryKey: ['watch-party', userId, roomId], queryFn: () => fetchPartySnapshot(roomId!),
    enabled: !!roomId && !!userId && online, refetchInterval: PARTY_POLL_MS,
    refetchIntervalInBackground: false, refetchOnWindowFocus: true, staleTime: 1000, retry: 1,
    structuralSharing: (previous, incoming) => {
      const old = previous as { server_now?: string } | undefined;
      const next = incoming as { server_now?: string };
      return old?.server_now && next.server_now && Date.parse(old.server_now) > Date.parse(next.server_now) ? previous : incoming;
    },
  });
  useEffect(() => { if (query.error) toast.error(query.error.message, { id: 'watch-party-sync' }); }, [query.error]);
  const mutation = useMutation({
    mutationFn: (command: PartyCommand) => runPartyCommand(roomId, command),
    onError: error => toast.error(error.message, { id: 'watch-party-action' }),
    onMutate: () => cache.cancelQueries({ queryKey: ['watch-party', userId, roomId] }),
    onSuccess: (snapshot, command) => {
      if (snapshot) {
        setRoomId(snapshot.room.id);
        cache.setQueryData(['watch-party', userId, snapshot.room.id], snapshot);
        if (userId) sessionStorage.setItem(`grandline_active_party_${userId}`, snapshot.room.id);
        if (command.action === 'create' || command.action === 'join') toast.success(command.action === 'create' ? 'Room created. Invite your crew.' : 'You joined the crew.');
      } else {
        if (userId) sessionStorage.removeItem(`grandline_active_party_${userId}`);
        cache.removeQueries({ queryKey: ['watch-party', userId, roomId] });
        setRoomId(null); toast.info(command.action === 'close' ? 'The watch party has ended.' : 'You left the watch party.');
      }
    },
  });
  const sendCommand = useCallback((command: PartyCommand): Promise<boolean> => {
    if (!online) { toast.error('You are offline. Reconnect before changing the room.'); return Promise.resolve(false); }
    return mutation.mutateAsync(command).then(() => true, () => false);
  }, [mutation.mutateAsync, online]);
  const forgetRoom = () => {
    if (userId) sessionStorage.removeItem(`grandline_active_party_${userId}`);
    setRoomId(null);
  };
  return { roomId, snapshot: query.data, error: query.error, connecting: !!roomId && !query.data,
    syncing: query.isFetching, online, busy: mutation.isPending, sendCommand, forgetRoom, retry: query.refetch };
}
