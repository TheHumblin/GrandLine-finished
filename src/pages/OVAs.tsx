import { OVAS } from '@/data/ovas';
import OVACard from '@/components/features/OVACard';
import OVAOverview from '@/components/features/OVAOverview';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { countWatchedOVAs } from '@/lib/bounty';

export default function OVAs() {
  const { user } = useAuth();
  useTheme(user?.theme || 'strawhat');
  const watched = new Set(user?.watchedOVAs ?? []);
  return (
    <div className="min-h-screen bg-background">
      <OVAOverview watchedCount={countWatchedOVAs(user?.watchedOVAs)} signedIn={!!user} />
      <main className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold text-foreground">Browse bonus adventures</h2><p className="text-sm text-muted-foreground">8 titles · 9 listed videos · ZokoAnime</p></div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {OVAS.map(ova => <OVACard key={ova.id} ova={ova} watched={watched.has(ova.id)} />)}
        </div>
      </main>
    </div>
  );
}
