import { SAGAS } from '@/data/sagas';
import type { EpisodeBrowser } from '@/hooks/useEpisodeBrowser';

interface EpisodeSagaChipsProps { browser: EpisodeBrowser; }
export default function EpisodeSagaChips({ browser }: EpisodeSagaChipsProps) {
  return (
    <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-2 lg:hidden" aria-label="Choose a saga">
      <button type="button" onClick={browser.clearScope} className="min-h-[44px] shrink-0 rounded-full border border-border bg-muted px-4 text-base text-foreground hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">All</button>
      {SAGAS.map(saga => <button key={saga.id} type="button" aria-pressed={browser.selectedSaga === saga.id} onClick={() => browser.selectSaga(saga.id)} className={`min-h-[44px] shrink-0 whitespace-nowrap rounded-full border px-4 text-base font-medium hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${browser.selectedSaga === saga.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted text-foreground'}`}>{saga.name.replace(' Saga', '')}</button>)}
    </div>
  );
}
