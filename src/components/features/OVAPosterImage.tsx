import { useState } from 'react';
import { Clapperboard } from 'lucide-react';

interface OVAPosterImageProps { src: string; title: string; className?: string }
export default function OVAPosterImage({ src, title, className = '' }: OVAPosterImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      {failedSource === src ? (
        <div role="img" aria-label={`${title} — poster unavailable`} className="flex h-full items-center justify-center p-4 text-muted-foreground">
          <Clapperboard size={32} aria-hidden="true" />
        </div>
      ) : (
        <img src={src} alt={`${title} OVA poster`} loading="lazy" decoding="async" referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
          onError={() => setFailedSource(src)} />
      )}
    </div>
  );
}
