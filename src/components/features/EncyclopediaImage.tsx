import { useEffect, useState } from 'react';
import { ImageOff, Lock } from 'lucide-react';
interface EncyclopediaImageProps { src?: string; name: string; className?: string; protectedArtwork?: boolean; }
export default function EncyclopediaImage({ src, name, className = '', protectedArtwork = false }: EncyclopediaImageProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (protectedArtwork || !src || failed) return <div className={`flex flex-col items-center justify-center gap-2 bg-muted text-foreground ${className}`} role="img" aria-label={protectedArtwork ? 'Artwork hidden by Anti-Spoiler' : `${name}: source image unavailable`}>
    {protectedArtwork ? <Lock size={24} aria-hidden="true" /> : <ImageOff size={24} aria-hidden="true" />}
    <span className="px-2 text-center text-sm">{protectedArtwork ? 'Artwork protected' : 'Image unavailable'}</span>
  </div>;
  return <img src={src} alt={name} className={className} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} />;
}
