import { Link } from 'react-router-dom';
import { Check, Play } from 'lucide-react';
import OVAPosterImage from '@/components/features/OVAPosterImage';
import type { OVA } from '@/types/ova';

interface OVACardProps { ova: OVA; watched: boolean }
export default function OVACard({ ova, watched }: OVACardProps) {
  return (
    <Link to={`/ovas/${ova.id}`} className="group block overflow-hidden rounded-xl border border-border bg-card transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transform-none">
      <div className="relative aspect-[2/3] overflow-hidden">
        <OVAPosterImage src={ova.thumbnail} title={ova.title} className="h-full w-full" />
        {watched && <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-lg border border-border bg-background/95 px-2 py-1 text-sm font-semibold text-primary"><Check size={14} aria-hidden="true" /> Watched</span>}
        <span className="pointer-events-none absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-background/95 text-primary"><Play size={20} aria-hidden="true" /></span>
      </div>
      <div className="space-y-2 p-4">
        <p className="text-sm text-muted-foreground">{ova.context}</p>
        <h2 className="text-base font-semibold leading-snug text-foreground">{ova.title}</h2>
        <p className="text-sm text-muted-foreground">{ova.duration} · SUB</p>
        <p className="text-sm font-semibold text-primary">{watched ? 'Bounty recorded' : '+2M Beli on completion'}</p>
      </div>
    </Link>
  );
}
