import { useState, useEffect, useCallback, useRef } from 'react';
import { ShieldAlert, X, ExternalLink, Shield } from 'lucide-react';
import { onRedirectIntercepted, type PendingRedirect } from '@/lib/adBlocker';

const AUTO_BLOCK_SECONDS = 10;

interface RedirectToastProps {
  pending: PendingRedirect;
  onAllow: () => void;
  onBlock: () => void;
}

function getDisplayDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return url.slice(0, 40); }
}

function RedirectToast({ pending, onAllow, onBlock }: RedirectToastProps) {
  const [countdown, setCountdown] = useState(AUTO_BLOCK_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(intervalRef.current!);
          onBlock();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [onBlock]);

  const domain = getDisplayDomain(pending.url);
  const progress = (countdown / AUTO_BLOCK_SECONDS) * 100;

  return (
    <div className="w-80 bg-card border border-yellow-600/40 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Countdown progress bar */}
      <div
        className="h-1 bg-yellow-500/70 transition-all duration-1000 ease-linear"
        style={{ width: `${progress}%` }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-900/40 border border-yellow-600/40 flex items-center justify-center shrink-0">
            <ShieldAlert size={18} className="text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">
              Redirect Intercepted
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Something wants to take you to:
            </p>
          </div>
          <button
            onClick={onBlock}
            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Destination URL */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border mb-4 min-w-0">
          <ExternalLink size={12} className="text-muted-foreground shrink-0" />
          <span className="text-xs text-foreground font-mono truncate" title={pending.url}>
            {domain}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onBlock}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Shield size={13} />
            Block It ({countdown}s)
          </button>
          <button
            onClick={onAllow}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-muted/30 text-muted-foreground text-sm hover:text-foreground hover:bg-muted transition-colors"
          >
            Allow
          </button>
        </div>

        <p className="text-xs text-muted-foreground/60 text-center mt-2">
          Auto-blocks in {countdown}s · You can keep watching
        </p>
      </div>
    </div>
  );
}

/**
 * RedirectGuard — mounts once in App.tsx, listens for intercepted redirects
 * from adBlocker.ts and shows a confirmation toast for each one.
 */
export default function RedirectGuard() {
  const [queue, setQueue] = useState<PendingRedirect[]>([]);

  const handleIncoming = useCallback((pending: PendingRedirect) => {
    setQueue(q => [...q, pending]);
  }, []);

  useEffect(() => {
    onRedirectIntercepted(handleIncoming);
    return () => onRedirectIntercepted(null);
  }, [handleIncoming]);

  const dismiss = useCallback((id: string) => {
    setQueue(q => q.filter(p => p.id !== id));
  }, []);

  const handleAllow = useCallback((pending: PendingRedirect) => {
    dismiss(pending.id);
    pending.execute();
  }, [dismiss]);

  const handleBlock = useCallback((id: string) => {
    dismiss(id);
    console.info('[RedirectGuard] User blocked redirect:', id);
  }, [dismiss]);

  if (queue.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-4 z-[500] flex flex-col gap-3 items-end pointer-events-none">
      {queue.map(pending => (
        <div key={pending.id} className="pointer-events-auto">
          <RedirectToast
            pending={pending}
            onAllow={() => handleAllow(pending)}
            onBlock={() => handleBlock(pending.id)}
          />
        </div>
      ))}
    </div>
  );
}
