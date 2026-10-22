import { Tv } from 'lucide-react';
import { SPECIALS, SPECIAL_HAS_DUB } from '@/data/specials';
import SpecialCard from '@/components/features/SpecialCard';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export default function Specials() {
  const { user } = useAuth();
  useTheme(user?.theme || 'strawhat');
  const watched = new Set(user?.watchedSpecials ?? []);
  const watchedCount = SPECIALS.filter(special => watched.has(special.id)).length;
  const dubCount = SPECIALS.filter(special => SPECIAL_HAS_DUB[special.id]).length;
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/30 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-3 flex items-center gap-3">
            <Tv size={24} className="text-primary" aria-hidden="true" />
            <h1 className="gold-text text-3xl font-bold">One Piece Specials</h1>
          </div>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            Retellings, side stories, and Wano recaps — including all four Barto’s Secret Room episodes, Fan Letter, and Heroines.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-base text-muted-foreground">
            <span><strong className="font-semibold text-foreground">{SPECIALS.length}</strong> titles</span>
            <span><strong className="font-semibold text-primary">{dubCount}</strong> with SUB + DUB</span>
            <span><strong className="font-semibold text-foreground">{watchedCount} / {SPECIALS.length}</strong> watched</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-foreground">Browse specials</h2>
          <p className="text-sm text-muted-foreground">Existing ratings are out of 5.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {SPECIALS.map(special => <SpecialCard key={special.id} special={special} watched={watched.has(special.id)} />)}
        </div>
      </main>
    </div>
  );
}
