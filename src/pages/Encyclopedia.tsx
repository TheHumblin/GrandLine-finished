import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useDevilFruitCatalog } from '@/hooks/useDevilFruitCatalog';
import { useDevilFruitDetail } from '@/hooks/useDevilFruitDetail';
import { visibleFruit } from '@/lib/fruitVisibility';
import { mergeFruitSource } from '@/lib/fruitCatalog';
import DevilFruitHero from '@/components/features/DevilFruitHero';
import DevilFruitFilters from '@/components/features/DevilFruitFilters';
import DevilFruitCard from '@/components/features/DevilFruitCard';
import DevilFruitDetails from '@/components/features/DevilFruitDetails';
import type { DevilFruit } from '@/types';

export default function Encyclopedia() {
  const { user, loading: authLoading } = useAuth();
  useTheme(user?.theme || 'strawhat');
  const catalog = useDevilFruitCatalog();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<DevilFruit['type'] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const progress = useMemo(() => ({ currentEpisode: user?.currentEpisode || 0, showSpoilers: !authLoading && Boolean(user?.showSpoilers), watchedMovies: user?.watchedMovies || [] }), [user, authLoading]);
  const views = useMemo(() => catalog.fruits.map(fruit => ({ id: fruit.id, fruit: visibleFruit(fruit, progress) })), [catalog.fruits, progress]);
  // Search and type filters operate only on the protected projection, never on future identities.
  const filtered = views.filter(({ fruit }) => fruit ? (!type || fruit.classificationVerified !== false && fruit.type === type) && (!search || `${fruit.name} ${fruit.englishName || ''} ${fruit.user}`.toLowerCase().includes(search.trim().toLowerCase())) : !search && !type);
  const selected = catalog.fruits.find(fruit => fruit.id === selectedId);
  const selectedVisible = selected && visibleFruit(selected, progress);
  const details = useDevilFruitDetail(selectedVisible ? selected?.sourceSlug : undefined);
  const selectedView = selectedVisible && selected ? visibleFruit(mergeFruitSource(selected, details.data), progress) : null;
  return <main className="min-h-screen bg-background">
    <DevilFruitHero count={catalog.fruits.length} currentEpisode={progress.currentEpisode} showSpoilers={progress.showSpoilers} loading={catalog.isLoading} failed={catalog.isError} retry={() => void catalog.refetch()} />
    <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
      <DevilFruitFilters search={search} onSearch={setSearch} type={type} onType={setType} />
      <p className="mb-4 text-base text-foreground" aria-live="polite">{views.filter(view => view.fruit).length} revealed · {views.filter(view => !view.fruit).length} protected</p>
      <div className={`grid gap-6 ${selectedView ? 'lg:grid-cols-[minmax(0,1fr)_360px]' : ''}`}>
        <section className="grid content-start gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Devil Fruits">
          {filtered.map(view => <DevilFruitCard key={view.id} fruit={view.fruit} selected={selectedView?.id === view.id} onSelect={() => setSelectedId(view.id)} />)}
          {!filtered.length && <p className="col-span-full rounded-xl border border-dashed border-border p-8 text-base text-foreground">No revealed fruits match these filters. Future names and users are excluded from search.</p>}
        </section>
        {selectedView && <DevilFruitDetails fruit={selectedView} loading={details.isFetching} onClose={() => setSelectedId(null)} />}
      </div>
    </div>
  </main>;
}
