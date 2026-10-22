import { useState } from 'react';
import { MessageCircle, Users, Check } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import PartyChat from '@/components/features/PartyChat';
import PartyCrewList from '@/components/features/PartyCrewList';
import type { PartySnapshot, SendPartyCommand } from '@/types/watchParty';

interface PartySidebarProps { snapshot: PartySnapshot; userId: string; disabled: boolean; onCommand: SendPartyCommand; }
export default function PartySidebar({ snapshot, userId, disabled, onCommand }: PartySidebarProps) {
  const [tab, setTab] = useState('chat');
  const me = snapshot.members.find(member => member.user_id === userId);
  const ready = snapshot.members.filter(member => member.ready).length;
  return <aside className="party-panel flex h-[680px] min-w-0 flex-col overflow-hidden lg:sticky lg:top-24" aria-label="Crew chat and members">
    <div className="border-b border-border p-4"><div className="mb-3 flex items-center gap-2"><MessageCircle size={18} className="text-primary" /><h2 className="text-lg font-semibold text-foreground">Den Den channel</h2><span className="ml-auto party-dot" /></div><div className="flex items-center justify-between gap-2"><span className="text-sm text-muted-foreground">{ready}/{snapshot.members.length} ready to sail</span><button type="button" disabled={disabled || !me} aria-pressed={!!me?.ready} onClick={() => void onCommand({ action: 'ready', payload: { ready: !me?.ready } })} className={`party-secondary !px-3 ${me?.ready ? 'party-success' : ''}`}><Check size={14} />{me?.ready ? 'Ready' : 'I’m ready'}</button></div></div>
    <Tabs.Root value={tab} onValueChange={setTab} className="flex min-h-0 flex-1 flex-col">
      <Tabs.List className="mx-4 mt-3 grid h-auto grid-cols-2 rounded-xl border border-border bg-muted/40 p-1" aria-label="Party sidebar"><Tabs.Trigger value="chat" className="flex min-h-[44px] items-center justify-center rounded-lg text-sm text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-primary"><MessageCircle size={14} className="mr-2" />Chat</Tabs.Trigger><Tabs.Trigger value="crew" className="flex min-h-[44px] items-center justify-center rounded-lg text-sm text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-primary"><Users size={14} className="mr-2" />Crew ({snapshot.members.length})</Tabs.Trigger></Tabs.List>
      <Tabs.Content value="chat" className="mt-2 min-h-0 flex-1 overflow-hidden"><PartyChat messages={snapshot.messages} userId={userId} disabled={disabled} onCommand={onCommand} /></Tabs.Content>
      <Tabs.Content value="crew" className="mt-2 min-h-0 flex-1 overflow-hidden"><PartyCrewList snapshot={snapshot} userId={userId} disabled={disabled} onCommand={onCommand} /></Tabs.Content>
    </Tabs.Root>
  </aside>;
}
