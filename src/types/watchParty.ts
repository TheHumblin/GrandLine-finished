import type { AnimeAudio } from '@/types/animePlayer';

export interface PartyRoom {
  id: string; code: string; user_id: string; name: string;
  episode_number: number; audio: AnimeAudio;
  playback_state: 'waiting' | 'playing' | 'paused'; position_seconds: number;
  starts_at: string | null; created_at: string; expires_at: string; updated_at: string;
}
export interface PartyMember {
  user_id: string; username: string; ready: boolean; joined_at: string; last_seen: string;
}
export interface PartyMessage {
  id: string; user_id: string; username: string; text: string;
  is_spoiler: boolean; kind: 'chat' | 'system'; created_at: string;
}
export interface PartySnapshot {
  room: PartyRoom; members: PartyMember[]; messages: PartyMessage[];
  server_now: string; receivedAt: number;
}
export type PartyAction = 'create' | 'join' | 'ready' | 'episode' | 'audio' | 'start' | 'pause' | 'seek' | 'message' | 'leave' | 'close';
export interface PartyCommand { action: PartyAction; payload?: Record<string, string | number | boolean>; }
export type SendPartyCommand = (command: PartyCommand) => Promise<boolean>;
