import type { OVAEpisodeSource } from '@/types/ova';

interface OVAEpisodeSelectorProps { episodes: OVAEpisodeSource[]; current: number; onChange: (part: number) => void }
export default function OVAEpisodeSelector({ episodes, current, onChange }: OVAEpisodeSelectorProps) {
  if (episodes.length < 2) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold text-foreground">Choose a part</h2>
      <div role="group" aria-label="OVA parts" className="flex flex-wrap gap-2">
        {episodes.map(part => <button key={part.number} type="button" aria-pressed={current === part.number} onClick={() => onChange(part.number)}
          className={`min-h-[44px] rounded-lg border px-4 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${current === part.number ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground hover:bg-muted'}`}>{part.label}</button>)}
      </div>
    </div>
  );
}
