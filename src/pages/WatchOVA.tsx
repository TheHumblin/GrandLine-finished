import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { OVAS } from '@/data/ovas';
import { OVA_SOURCES } from '@/data/ovaServers';
import OVAPlayer from '@/components/features/OVAPlayer';
import OVAWatchedAction from '@/components/features/OVAWatchedAction';
import OVARelatedList from '@/components/features/OVARelatedList';
import PlayerErrorBoundary from '@/components/features/PlayerErrorBoundary';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export default function WatchOVA() {
  const { id } = useParams<{ id: string }>();
  const ova = OVAS.find(item => item.id === Number(id));
  const { user } = useAuth();
  useTheme(user?.theme || 'strawhat');
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [id]);
  if (!ova) return <main className="min-h-screen bg-background p-8 text-center text-foreground"><h1 className="text-2xl font-bold">OVA not found</h1><Link to="/ovas" className="mt-4 inline-flex min-h-[44px] items-center px-3 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Back to OVAs</Link></main>;
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
        <Link to="/ovas" className="mb-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg text-base text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><ChevronLeft size={18} aria-hidden="true" /> Back to OVAs</Link>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <header className="mb-6"><p className="mb-2 text-sm font-semibold text-primary">{ova.context} · {ova.duration}</p><h1 className="text-2xl font-bold text-foreground">{ova.title}</h1></header>
            <PlayerErrorBoundary key={ova.id}><OVAPlayer ovaId={ova.id} title={ova.title} /></PlayerErrorBoundary>
            <OVAWatchedAction ovaId={ova.id} multipart={(OVA_SOURCES[ova.id]?.length ?? 0) > 1} />
            <section className="mt-6 rounded-xl border border-border bg-card p-4"><h2 className="mb-2 text-lg font-semibold text-foreground">About this OVA</h2><p className="text-base leading-relaxed text-muted-foreground">{ova.synopsis}</p></section>
          </div>
          <OVARelatedList currentId={ova.id} />
        </div>
      </div>
    </main>
  );
}
