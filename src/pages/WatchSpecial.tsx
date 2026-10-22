import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { SPECIALS } from '@/data/specials';
import SpecialPlayer from '@/components/features/SpecialPlayer';
import SpecialDetails from '@/components/features/SpecialDetails';
import SpecialRelatedList from '@/components/features/SpecialRelatedList';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export default function WatchSpecial() {
  const { id } = useParams<{ id: string }>();
  const special = SPECIALS.find(item => item.id === Number(id));
  const { user, updateSpecialProgress } = useAuth();
  useTheme(user?.theme || 'strawhat');
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (special && user) updateSpecialProgress(special.id);
  }, [special?.id, user?.id]);
  if (!special) return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center">
        <h1 className="mb-3 text-xl font-bold text-foreground">Special not found</h1>
        <Link to="/specials" className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Back to Specials</Link>
      </div>
    </main>
  );
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
        <Link to="/specials" className="mb-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg text-base text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <ChevronLeft size={18} aria-hidden="true" /> Back to Specials
        </Link>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <SpecialPlayer key={special.id} specialId={special.id} title={special.title} />
            <SpecialDetails special={special} />
          </div>
          <SpecialRelatedList currentId={special.id} />
        </div>
      </div>
    </main>
  );
}
