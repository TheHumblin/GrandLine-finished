import { useEffect, useRef, useState } from 'react';
import { MessageCircle, ArrowDown } from 'lucide-react';
import PartyChatMessage from '@/components/features/PartyChatMessage';
import PartyChatForm from '@/components/forms/PartyChatForm';
import type { PartyMessage, SendPartyCommand } from '@/types/watchParty';

interface PartyChatProps { messages: PartyMessage[]; userId: string; disabled: boolean; onCommand: SendPartyCommand; }
export default function PartyChat({ messages, userId, disabled, onCommand }: PartyChatProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const previous = useRef<string>();
  const [unread, setUnread] = useState(false);
  const latest = messages[messages.length - 1];
  useEffect(() => {
    const element = scroller.current;
    if (!element || latest?.id === previous.current) return;
    const nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 180;
    if (!previous.current || nearBottom || latest?.user_id === userId) element.scrollTop = element.scrollHeight;
    else setUnread(true);
    previous.current = latest?.id;
  }, [latest?.id, latest?.user_id, userId]);
  return <div className="relative flex h-full min-h-0 flex-col">
    <div ref={scroller} role="log" aria-label="Crew messages" aria-live="polite" aria-relevant="additions" className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4" onScroll={() => {
      const element = scroller.current; if (element && element.scrollHeight - element.scrollTop - element.clientHeight < 40) setUnread(false);
    }}>
      {messages.length === 0 && <div className="py-12 text-center"><MessageCircle size={32} className="mx-auto mb-4 text-primary" /><p className="font-medium text-foreground">The crew chat starts here.</p><p className="mt-2 text-base leading-relaxed text-muted-foreground">Say hello. Keep future-episode reveals behind a spoiler tag.</p></div>}
      {messages.map(message => <PartyChatMessage key={message.id} message={message} mine={message.user_id === userId} />)}
    </div>
    {unread && <button type="button" className="party-secondary absolute bottom-56 left-1/2 -translate-x-1/2 whitespace-nowrap !bg-card" onClick={() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; setUnread(false); }}><ArrowDown size={16} />New messages</button>}
    <PartyChatForm disabled={disabled} onCommand={onCommand} />
  </div>;
}
