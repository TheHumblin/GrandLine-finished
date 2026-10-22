import { supabase } from '@/lib/supabase';
import { partySnapshotSchema } from '@/lib/partyValidations';
import type { PartyCommand, PartySnapshot } from '@/types/watchParty';

function parseSnapshot(data: unknown): PartySnapshot {
  const result = partySnapshotSchema.safeParse(data);
  if (!result.success) throw new Error('The room returned an unexpected response. Reconnect and try again.');
  return { ...result.data, receivedAt: Date.now() };
}
export async function fetchPartySnapshot(roomId: string): Promise<PartySnapshot> {
  const { data, error } = await supabase.rpc('watch_party_snapshot', { p_room_id: roomId });
  if (error) throw new Error(error.message);
  return parseSnapshot(data);
}
export async function runPartyCommand(roomId: string | null, command: PartyCommand): Promise<PartySnapshot | null> {
  console.log('[Watch party] Command:', command.action);
  const { data, error } = await supabase.rpc('watch_party_command', { p_action: command.action, p_room_id: roomId, p_payload: command.payload || {} });
  if (error) { console.warn('[Watch party] Command failed:', command.action, error.message); throw new Error(error.message); }
  if (command.action === 'leave' || command.action === 'close') return null;
  return parseSnapshot(data);
}
