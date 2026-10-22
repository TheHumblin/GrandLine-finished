import { useState } from 'react';
import { Anchor, Copy, Link2, LogOut, Check, Radio, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { partyInvitationUrl } from '@/lib/watchParty';
import type { PartyRoom } from '@/types/watchParty';

interface PartyRoomHeaderProps { room: PartyRoom; online: boolean; syncError: boolean; busy: boolean; onLeave: () => void; onRetry: () => void; }
export default function PartyRoomHeader({ room, online, syncError, busy, onLeave, onRetry }: PartyRoomHeaderProps) {
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const copy = (kind: 'code' | 'link') => {
    const value = kind === 'code' ? room.code : partyInvitationUrl(room.code);
    if (!navigator.clipboard) { toast.error(`Clipboard unavailable. Copy the room code manually: ${room.code}`); return; }
    void navigator.clipboard.writeText(value).then(() => {
      setCopied(kind); toast.success(kind === 'code' ? 'Room code copied.' : 'Invitation link copied.');
    }, () => toast.error(`Copy was blocked. Select the room code below: ${room.code}`));
  };
  return <header className="party-panel flex flex-col justify-between gap-6 p-5 sm:p-6 lg:flex-row lg:items-center">
    <div className="flex items-center gap-4"><span className="hidden rounded-2xl border border-primary/20 bg-primary/10 p-4 text-primary sm:block"><Anchor size={28} /></span><div>
      <p className="party-overline mb-2 text-primary">Crew Watch Party</p><h1 className="break-words text-2xl font-bold text-foreground sm:text-3xl">{room.name}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><Radio size={14} />{!online ? 'Offline · cues may be outdated' : syncError ? 'Reconnecting · cues may be outdated' : 'Cloud connected · refreshes every 3s'}</span><span>Expires {new Date(room.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
    </div></div>
    <div className="flex flex-wrap items-center gap-2"><span className="mr-1 select-all rounded-xl border border-border px-3 py-2 font-mono text-lg font-semibold tracking-wider text-primary">{room.code}</span>
      <button type="button" onClick={() => copy('code')} className="party-icon" aria-label="Copy room code">{copied === 'code' ? <Check size={18} /> : <Copy size={18} />}</button>
      <button type="button" onClick={() => copy('link')} className="party-secondary">{copied === 'link' ? <Check size={16} /> : <Link2 size={16} />}Invite crew</button>
      <button type="button" onClick={onLeave} disabled={busy} className="party-icon" aria-label="Leave room"><LogOut size={18} /></button>
      {syncError && <button type="button" onClick={onRetry} className="party-secondary"><AlertCircle size={16} />Reconnect</button>}
    </div>
  </header>;
}
