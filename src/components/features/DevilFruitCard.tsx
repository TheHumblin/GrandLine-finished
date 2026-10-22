import { Lock, Zap } from 'lucide-react';
import DevilFruitArtwork from '@/components/features/DevilFruitArtwork';
import type { EncyclopediaFruit } from '@/types/encyclopedia';
interface DevilFruitCardProps { fruit: EncyclopediaFruit | null; selected: boolean; onSelect: () => void; }
export default function DevilFruitCard({ fruit, selected, onSelect }: DevilFruitCardProps) {
  return <button type="button" onClick={onSelect} disabled={!fruit} aria-pressed={selected} className={`min-h-[164px] rounded-2xl border p-4 text-left transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring enabled:hover:-translate-y-1 enabled:active:scale-[0.98] disabled:cursor-not-allowed ${selected ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}>
    {!fruit ? <div className="flex flex-col items-center gap-3 py-6 text-foreground"><Lock size={24} /><span className="text-base font-semibold">Undiscovered fruit</span><span className="text-center text-sm">Protected by your story progress</span></div> : <>
      <div className="flex items-start gap-3"><DevilFruitArtwork src={fruit.image} slug={fruit.sourceSlug} name={fruit.name} className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted" />
        <div><span className="text-sm font-medium text-primary">{fruit.classificationVerified === false ? 'Type not verified' : fruit.type}</span><h2 className="mt-1 text-base font-semibold leading-snug text-foreground">{fruit.name}</h2></div>
      </div>
      <p className="mt-3 text-base text-foreground">User: {fruit.user}</p>
      {fruit.ability && <p className="mt-2 line-clamp-2 text-base leading-relaxed text-foreground/80">{fruit.ability}</p>}
      {fruit.awakened && <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary"><Zap size={16} />Awakened</p>}
    </>}
  </button>;
}
