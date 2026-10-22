import { Search } from 'lucide-react';
import { FRUIT_TYPES } from '@/data/devilFruits';
import type { DevilFruit } from '@/types';
interface DevilFruitFiltersProps { search: string; onSearch: (value: string) => void; type: DevilFruit['type'] | null; onType: (value: DevilFruit['type'] | null) => void; }
export default function DevilFruitFilters({ search, onSearch, type, onType }: DevilFruitFiltersProps) {
  return <section className="mb-6 space-y-4" aria-label="Filter Devil Fruits">
    <div className="max-w-md"><label htmlFor="fruit-search" className="mb-2 block text-base font-medium text-foreground">Search revealed fruits or users</label>
      <div className="relative"><Search size={18} className="absolute left-3 top-3 text-primary" aria-hidden="true" />
        <input id="fruit-search" type="search" value={search} onChange={event => onSearch(event.target.value)} placeholder="Fruit name or user" className="min-h-[44px] w-full rounded-xl border border-border bg-input py-2 pl-10 pr-4 text-base text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </div>
    </div>
    <div className="flex flex-wrap gap-2">{[null, ...FRUIT_TYPES].map(item => <button key={item || 'all'} onClick={() => onType(item === type ? null : item)} aria-pressed={type === item} className={`min-h-[44px] rounded-lg border px-3 text-base font-medium transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${type === item ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground'}`}>{item || 'All Types'}</button>)}</div>
  </section>;
}
