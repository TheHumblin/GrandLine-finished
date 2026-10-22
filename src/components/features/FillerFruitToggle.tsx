import fillerFruit from '@/assets/filler-fruit.png';

interface FillerFruitToggleProps { active: boolean; onToggle: () => void; }

export default function FillerFruitToggle({ active, onToggle }: FillerFruitToggleProps) {
  return (
    <button type="button" role="switch" aria-checked={active} onClick={onToggle} title="Hide all AnimeFillerList filler episodes. Manga, anime and mixed canon stay visible." className={`flex min-h-[44px] items-center gap-2 rounded-lg border px-3 py-2 text-base font-medium transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-primary/50 bg-primary/15 text-primary' : 'border-border bg-muted text-foreground hover:bg-muted/70'}`}>
      <img src={fillerFruit} alt="Gomu Gomu no Mi fruit" className="h-8 w-8 object-contain" />
      Filler Fruit {active ? 'ON' : 'OFF'}
      <span className="sr-only">{active ? 'Filler episodes hidden' : 'Filler episodes visible'}</span>
    </button>
  );
}
