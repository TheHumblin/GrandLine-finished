import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface AnimePlayerFrameProps {
  src: string | null;
  episodeNumber?: number;
  contentTitle?: string;
  reloadKey: number;
  onEnded?: () => void;
}

export default function AnimePlayerFrame({ src, episodeNumber, contentTitle, reloadKey, onEnded }: AnimePlayerFrameProps) {
  const iframe = useRef<HTMLIFrameElement>(null);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    setLoading(!!src); setSlow(false);
    if (!src) return;
    loadTimer.current = setTimeout(() => { setLoading(false); setSlow(true); }, 15000);
    return () => { if (loadTimer.current) clearTimeout(loadTimer.current); };
  }, [src, reloadKey]);
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!src || event.origin !== new URL(src).origin || event.source !== iframe.current?.contentWindow) return;
      let message: unknown = event.data;
      if (typeof message === 'string') {
        try { message = JSON.parse(message); } catch { return; }
      }
      if (!message || typeof message !== 'object') return;
      const payload = message as Record<string, unknown>;
      const name = payload.event ?? payload.type;
      if (name === 'complete' || name === 'ended') onEnded?.();
      if (name === 'error') {
        if (loadTimer.current) clearTimeout(loadTimer.current);
        setLoading(false); setSlow(true);
        toast.error('ZokoAnime could not play this video. Try Reload or open HiAnime.');
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [src, onEnded]);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-background">
      {src ? <iframe ref={iframe} key={`${src}-${reloadKey}`} src={src} title={contentTitle ?? `One Piece Episode ${episodeNumber} — ZokoAnime`}
        className="h-full w-full border-0" allowFullScreen allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => { if (loadTimer.current) clearTimeout(loadTimer.current); setLoading(false); setSlow(false); }}
        onError={() => { if (loadTimer.current) clearTimeout(loadTimer.current); setLoading(false); setSlow(true); }} />
        : <p className="flex h-full items-center justify-center p-6 text-center text-foreground">This audio track is not listed on ZokoAnime.</p>}
      {src && loading && <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/90 text-foreground" role="status">Loading ZokoAnime player…</div>}
      {slow && <p className="pointer-events-none absolute bottom-12 left-3 right-3 rounded-lg bg-background/90 p-3 text-center text-sm text-foreground" role="status">Player is slow to respond. Try Reload or the HiAnime link below.</p>}
    </div>
  );
}
