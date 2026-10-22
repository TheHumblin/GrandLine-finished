import { useState } from 'react';
import { LogOut, Anchor } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import type { SendPartyCommand } from '@/types/watchParty';

interface PartyEndDialogProps { captain: boolean; open: boolean; onOpenChange: (open: boolean) => void; disabled: boolean; onCommand: SendPartyCommand; onExit: () => void; }
export default function PartyEndDialog({ captain, open, onOpenChange, disabled, onCommand, onExit }: PartyEndDialogProps) {
  const [pending, setPending] = useState(false);
  const leave = async (end: boolean) => {
    setPending(true);
    const success = await onCommand({ action: end ? 'close' : 'leave' });
    setPending(false);
    if (success) { onOpenChange(false); onExit(); }
  };
  return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm" /><Dialog.Content className="watch-party fixed left-1/2 top-1/2 z-[101] w-[calc(100%-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 text-foreground shadow-2xl" onEscapeKeyDown={event => { if (pending) event.preventDefault(); }} onPointerDownOutside={event => { if (pending) event.preventDefault(); }}> 
    <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><Anchor size={24} /></div>
    <Dialog.Title className="mt-4 text-2xl font-semibold">Leave the lounge?</Dialog.Title><Dialog.Description className="mt-3 text-base leading-relaxed text-muted-foreground">{captain ? 'Leave and hand the helm to the next online crew member, or end the party for everyone. If no one else is online, leaving ends the room.' : 'Your crew can keep watching. Rejoin with the invitation code while the room is active.'}</Dialog.Description>
    <div className="mt-4 flex flex-wrap gap-2"><button type="button" className="party-secondary" disabled={pending} onClick={() => onOpenChange(false)}>Stay aboard</button><button type="button" className="party-secondary" disabled={disabled || pending} onClick={() => void leave(false)}><LogOut size={16} />Leave room</button></div>
    {captain && <button type="button" className="party-secondary !border-destructive/40 !text-destructive" disabled={disabled || pending} onClick={() => void leave(true)}>End party for everyone</button>}
  </Dialog.Content></Dialog.Portal></Dialog.Root>;
}
