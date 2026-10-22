import { Calendar, Clock, Star } from 'lucide-react';
import { SPECIAL_HAS_DUB, type Special } from '@/data/specials';

interface SpecialDetailsProps { special: Special }
export default function SpecialDetails({ special }: SpecialDetailsProps) {
  return (
    <div className="mt-6 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">{special.title}</h1>
      <div className="flex flex-wrap items-center gap-4 text-base text-muted-foreground">
        {typeof special.rating === 'number' && <span className="flex items-center gap-1 font-semibold text-primary"><Star size={16} aria-hidden="true" /> {special.rating} / 5</span>}
        <span className="flex items-center gap-1"><Calendar size={16} aria-hidden="true" /> {special.year}</span>
        <span className="flex items-center gap-1"><Clock size={16} aria-hidden="true" /> {special.duration}</span>
        {special.episodeCount > 1 && <span>{special.episodeCount} episodes</span>}
        {SPECIAL_HAS_DUB[special.id] && <span className="rounded border border-primary/30 bg-primary/10 px-2 py-1 text-sm font-semibold text-primary">SUB + DUB</span>}
      </div>
      <p className="rounded-xl border border-border bg-card/50 p-4 text-base leading-relaxed text-muted-foreground">{special.synopsis}</p>
    </div>
  );
}
