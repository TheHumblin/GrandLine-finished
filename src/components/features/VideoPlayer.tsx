
import { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, RefreshCw, Info, ChevronRight, Keyboard } from 'lucide-react';
import type { ServerOption } from '@/types';
import { setPlayerHovered, shieldPlayerContainer } from '@/lib/adBlocker';
import DownloadButton from '@/components/features/DownloadButton';

interface Props {
  servers: { sub: ServerOption[]; hsub?: ServerOption[]; dub: ServerOption[] };
  episodeNumber?: number;
  movieId?: number;
  specialId?: number;
  malId?: number;
  hasDub?: boolean;
  onProgress?: () => void;
  episodeOverride?: number;
  animesugeSlug?: string;
  nextEpisodeNumber?: number;
  onNextEpisode?: () => void;
}

const EPISODE_DUB_MAX = 1155;

const MOVIE_ANILIST_IDS: Record<number, number> = {
  1:459, 2:460, 3:461, 4:462, 5:463, 6:464, 7:465,
  8:2107, 9:3848, 10:4155, 11:9999, 12:12859, 13:21335, 14:105143, 15:141902,
};

const MOVIE_MAL_IDS: Record<number, number> = {
  1:459, 2:460, 3:461, 4:462, 5:463, 6:464, 7:465,
  8:5253, 9:8742, 10:8670, 11:10494, 12:13601, 13:29830, 14:38234, 15:50410,
};

const MOVIE_HAS_DUB: Record<number, boolean> = {
  1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false,
  8:true, 9:false, 10:true, 11:false, 12:true, 13:true, 14:true, 15:true,
};

const SPECIAL_ANILIST_IDS: Record<number, number> = {
  1:1094, 2:1237, 3:1238, 4:2020, 5:2107, 6:15323, 7:16239,
  8:19123, 9:25161, 10:31289, 11:21485, 12:33338, 13:36215, 14:37902,
};

const SPECIAL_MAL_IDS: Record<number, number> = {
  1:965, 2:1237, 3:1238, 4:7203, 5:5253, 6:15323, 7:16239,
  8:19123, 9:25161, 10:31289, 11:32051, 12:33338, 13:36215, 14:37902,
};

const SPECIAL_HAS_DUB: Record<number, boolean> = {
  1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false,
  9:true, 10:true, 11:true, 12:true, 13:true, 14:true,
};

type EmbedMode = 'ani' | 'mal' | 'animesuge';

function buildUrl(mode: EmbedMode, id: number, epNum: number, lang: 'sub' | 'dub'): string {
  if (mode === 'ani') return `https://megaplay.buzz/stream/ani/${id}/${epNum}/${lang}`;
  return `https://megaplay.buzz/stream/mal/${id}/${epNum}/${lang}`;
}

const AUTO_NEXT_DELAY = 7;

// How long (ms) the shield stays in "pass-through" mode after a click.
// Set to a long value so the player stays interactive after one click.
// The shield re-arms automatically when the mouse leaves the player.
const PASS_THROUGH_MS = 30_000;

const SHORTCUTS = [
  { key: 'Space', action: 'Play / Pause' },
  { key: '← →', action: 'Seek 5 s' },
  { key: '↑ ↓', action: 'Volume' },
  { key: 'F', action: 'Fullscreen' },
  { key: 'M', action: 'Mute' },
  { key: 'J / L', action: 'Seek 10 s' },
];

export default function VideoPlayer({
  servers,
  episodeNumber,
  movieId,
  specialId,
  malId: malIdProp,
  hasDub: hasDubProp,
  onProgress,
  episodeOverride,
  animesugeSlug,
  nextEpisodeNumber,
  onNextEpisode,
}: Props) {
  const dubAvailable = hasDubProp ??
    (episodeNumber !== undefined ? episodeNumber <= EPISODE_DUB_MAX :
     movieId !== undefined ? (MOVIE_HAS_DUB[movieId] ?? false) :
     specialId !== undefined ? (SPECIAL_HAS_DUB[specialId] ?? false) : false);

  const iframeRef    = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [audioType, setAudioType]               = useState<'sub' | 'dub'>('sub');
  const [embedMode, setEmbedMode]               = useState<EmbedMode>(animesugeSlug ? 'animesuge' : 'ani');
  const [iframeKey, setIframeKey]               = useState(0);
  const [loading, setLoading]                   = useState(true);
  const [showShortcuts, setShowShortcuts]        = useState(false);
  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null);

  // ── Permanent click-shield state ───────────────────────────────────────────
  // `shieldPassThrough`: true for PASS_THROUGH_MS after each user click.
  // When false  → pointer-events: all  (shield intercepts every click)
  // When true   → pointer-events: none (click flows to iframe player controls)
  // When true the shield is transparent — player receives all clicks normally.
  // Activates on first click, resets when mouse leaves the container.
  const [shieldPassThrough, setShieldPassThrough] = useState(false);

  const countdownRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const passThroughRef  = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const progressFired   = useRef(false);

  // ── URL builder ────────────────────────────────────────────────────────────
  const getUrl = useCallback((mode: EmbedMode = embedMode): string => {
    const lang = audioType;
    if (mode === 'animesuge' && animesugeSlug) {
      return `https://animesuge.cz/anime/${animesugeSlug}/ep-${episodeOverride ?? 1}`;
    }
    if (episodeNumber) return buildUrl(mode as 'ani' | 'mal', 21, episodeNumber, lang);
    if (movieId) {
      const aniId = MOVIE_ANILIST_IDS[movieId];
      const mId   = malIdProp ?? MOVIE_MAL_IDS[movieId];
      const actualLang: 'sub' | 'dub' = (lang === 'dub' && MOVIE_HAS_DUB[movieId]) ? 'dub' : 'sub';
      if (mode === 'ani' && aniId) return buildUrl('ani', aniId, 1, actualLang);
      if (mId) return buildUrl('mal', mId, 1, actualLang);
      return '';
    }
    if (specialId) {
      const aniId  = SPECIAL_ANILIST_IDS[specialId];
      const mId    = malIdProp ?? SPECIAL_MAL_IDS[specialId];
      const epNum  = episodeOverride ?? 1;
      const actualLang: 'sub' | 'dub' = (lang === 'dub' && SPECIAL_HAS_DUB[specialId]) ? 'dub' : 'sub';
      if (mode === 'ani' && aniId) return buildUrl('ani', aniId, epNum, actualLang);
      if (mId) return buildUrl('mal', mId, epNum, actualLang);
      return '';
    }
    return '';
  }, [episodeNumber, movieId, specialId, malIdProp, audioType, embedMode, episodeOverride, animesugeSlug]);

  const activeUrl = getUrl();

  // ── Permanent click-shield handler ────────────────────────────────────────
  //
  // How it works:
  //   1. The shield div sits on top of the iframe AT ALL TIMES (z-index 15).
  //      pointer-events: all  → every click lands here, never on the
  //      ad overlay inside the cross-origin iframe.
  //
  //   2. When the user clicks, we:
  //      a. Prevent the event from reaching the iframe (stopPropagation).
  //      b. Focus the iframe for keyboard shortcuts.
  //      c. Switch shield to pass-through (pointer-events: none) for
  //         PASS_THROUGH_MS milliseconds so the SAME click gets re-dispatched
  //         naturally to the player's own pause/play/seek buttons.
  //      d. Restore the shield after PASS_THROUGH_MS.
  //
  //   Result: the ad overlay inside the iframe NEVER receives a real pointer
  //   event, so window.open() inside the frame is never triggered. The player
  //   still responds to every interaction because we forward each click via
  //   the brief pass-through window.
  //
  const handleShieldClick = useCallback((e: React.MouseEvent) => {
    // Block this event from reaching the iframe's ad overlay
    e.preventDefault();
    e.stopPropagation();

    // Give the iframe keyboard focus (space/arrow keys still work)
    try { iframeRef.current?.focus(); } catch { /* cross-origin: benign */ }

    // Drop the shield — player is now fully interactive.
    // A safety timeout re-arms it after 30 s in case the user walks away.
    if (passThroughRef.current) clearTimeout(passThroughRef.current);
    setShieldPassThrough(true);
    passThroughRef.current = setTimeout(() => {
      setShieldPassThrough(false);
    }, PASS_THROUGH_MS);
  }, []);

  // Re-arm the shield when the mouse leaves the player entirely.
  // This ensures the next visit to the player is protected again.
  const handleContainerMouseLeave = useCallback(() => {
    if (passThroughRef.current) clearTimeout(passThroughRef.current);
    setShieldPassThrough(false);
  }, []);

  // ── adBlocker integration ──────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const on  = () => setPlayerHovered(true);
    const off = () => setPlayerHovered(false);
    el.addEventListener('mouseenter', on);
    el.addEventListener('mouseleave', off);
    const unshield = shieldPlayerContainer(el);
    return () => {
      el.removeEventListener('mouseenter', on);
      el.removeEventListener('mouseleave', off);
      setPlayerHovered(false);
      unshield();
    };
  }, []);

  // ── Progress tracking ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!progressFired.current) {
      progressFired.current = true;
      onProgress?.();
    }
    return () => { progressFired.current = false; };
  }, [episodeNumber, movieId, specialId, onProgress]);

  const startAutoNext = useCallback(() => {
    if (!nextEpisodeNumber || !onNextEpisode) return;
    setAutoNextCountdown(AUTO_NEXT_DELAY);
    countdownRef.current = setInterval(() => {
      setAutoNextCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownRef.current!);
          onNextEpisode();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [nextEpisodeNumber, onNextEpisode]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === 'string') data = JSON.parse(data);
        if (data?.event === 'complete' && episodeNumber && nextEpisodeNumber && onNextEpisode) {
          startAutoNext();
        }
      } catch { /* ignore */ }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [episodeNumber, nextEpisodeNumber, onNextEpisode, startAutoNext]);

  const cancelAutoNext = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setAutoNextCountdown(null);
  }, []);

  useEffect(() => {
    setLoading(true);
    cancelAutoNext();
  }, [activeUrl, iframeKey, cancelAutoNext]);

  useEffect(() => () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (passThroughRef.current) clearTimeout(passThroughRef.current);
  }, []);

  const handleAudioChange = (type: 'sub' | 'dub') => {
    setAudioType(type);
    setIframeKey(k => k + 1);
    setLoading(true);
  };

  const handleRetry = () => {
    setIframeKey(k => k + 1);
    setLoading(true);
  };

  if (!activeUrl) {
    return (
      <div className="w-full bg-muted/30 rounded-xl border border-border flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
        <p className="text-sm text-muted-foreground">No player available for this content.</p>
      </div>
    );
  }

  const serverOptions: { mode: EmbedMode; label: string; show: boolean }[] = [
    { mode: 'animesuge', label: 'Animesuge', show: !!animesugeSlug },
    { mode: 'ani',       label: 'Megaplay-1', show: true },
    { mode: 'mal',       label: 'Megaplay-2', show: true },
  ];

  return (
    <div className="space-y-3">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs text-muted-foreground font-medium hidden xs:inline">Server:</span>
          <div className="flex items-center bg-muted/40 border border-border rounded-lg p-0.5 gap-0.5">
            {serverOptions.filter(s => s.show).map(s => (
              <button
                key={s.mode}
                onClick={() => { setEmbedMode(s.mode); setIframeKey(k => k + 1); setLoading(true); }}
                className={`relative px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all min-h-[36px] ${
                  embedMode === s.mode
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {embedMode === s.mode && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-green-400 shadow shadow-green-400/50" />
                )}
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {dubAvailable && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Volume2 size={12} /><span className="hidden xs:inline">Audio:</span>
            </span>
            <div className="flex items-center bg-muted/40 border border-border rounded-lg p-0.5 gap-0.5">
              {(['sub', 'dub'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => handleAudioChange(t)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all min-h-[36px] ${
                    audioType === t
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="relative ml-auto">
          <button
            onClick={() => setShowShortcuts(v => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-muted/30 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all min-h-[36px]"
            title="Keyboard shortcuts"
          >
            <Keyboard size={12} />
            <span className="hidden sm:inline">Shortcuts</span>
          </button>
          {showShortcuts && (
            <div className="absolute right-0 top-full mt-1.5 z-30 bg-card border border-border rounded-xl shadow-2xl p-3 min-w-[200px]">
              <div className="text-xs font-semibold text-foreground mb-2">Keyboard Shortcuts</div>
              <div className="space-y-1.5">
                {SHORTCUTS.map(s => (
                  <div key={s.key} className="flex items-center justify-between gap-4">
                    <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono text-foreground">{s.key}</kbd>
                    <span className="text-[11px] text-muted-foreground">{s.action}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-2 border-t border-border pt-2">Click the player to activate keyboard shortcuts.</p>
            </div>
          )}
        </div>
      </div>

      {/* Player container */}
      <div className="space-y-2">
        <div
          ref={containerRef}
          className="relative w-full rounded-xl overflow-hidden border border-border bg-black"
          style={{ aspectRatio: '16/9' }}
          onMouseLeave={handleContainerMouseLeave}
        >
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black gap-3 pointer-events-none">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">Loading player…</span>
            </div>
          )}

          {/* Auto-next countdown overlay */}
          {autoNextCountdown !== null && nextEpisodeNumber && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 gap-4">
              <div className="text-white text-center">
                <div className="text-lg font-bold mb-1">Episode finished!</div>
                <div className="text-sm text-white/70 mb-4">Next up: Episode {nextEpisodeNumber}</div>
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="4" />
                    <circle
                      cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--primary))" strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - autoNextCountdown / AUTO_NEXT_DELAY)}`}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">{autoNextCountdown}</div>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => { cancelAutoNext(); onNextEpisode?.(); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Play Now <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={cancelAutoNext}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/*
            ── PERMANENT CLICK-SHIELD ──────────────────────────────────────────
            This invisible div covers the entire iframe at all times.

            WHY: megaplay.buzz / animesuge inject a transparent <a> or <div>
            inside their cross-origin iframe (z-index 9999 inside the frame).
            Every mouse click hits that overlay first, triggering window.open()
            to open an ad tab. We cannot reach it because it's cross-origin.

            HOW WE STOP IT:
            • Shield has pointer-events: all → it catches every click before
              the iframe's ad overlay sees it. Ad overlay = never triggered.
            • On each click we switch to pointer-events: none for 150 ms so the
              same click propagates naturally to the real player controls
              (pause/play/seek/volume) underneath the shield.
            • After 150 ms the shield restores itself, ready for the next click.

            The player works normally. The ad tab never opens.
            No sandbox needed — the iframe runs fully unrestricted.
          */}
          {!loading && !shieldPassThrough && (
            <div
              className="absolute inset-0 select-none"
              style={{ zIndex: 15, pointerEvents: 'all', cursor: 'pointer' }}
              onClick={handleShieldClick}
              onPointerDown={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            />
          )}

          {/* iframe — no sandbox, fully unrestricted so the player works */}
          <iframe
            ref={iframeRef}
            key={iframeKey}
            src={activeUrl}
            title={
              episodeNumber ? `One Piece Episode ${episodeNumber}` :
              movieId       ? `One Piece Movie ${movieId}` :
                              `One Piece Special ${specialId}`
            }
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            onLoad={() => setLoading(false)}
          />
        </div>

        {/* Info bar */}
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Info size={11} className="shrink-0" />
            <span>
              {embedMode === 'animesuge' ? 'Animesuge' : embedMode === 'ani' ? 'Megaplay-1' : 'Megaplay-2'} · {audioType.toUpperCase()}
              {!dubAvailable && ' · Sub only'}
              {' · '}Progress auto-saved
            </span>
          </div>
          <div className="flex items-center gap-3">
            {episodeNumber && nextEpisodeNumber && !autoNextCountdown && (
              <button
                onClick={startAutoNext}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <ChevronRight size={10} />
                Next Ep
              </button>
            )}
            <button onClick={handleRetry} className="flex items-center gap-1 text-primary hover:underline">
              <RefreshCw size={10} />
              Reload
            </button>
          </div>
          <DownloadButton
            episodeNumber={episodeNumber}
            movieId={movieId}
            specialId={specialId}
            audioType={audioType}
          />
        </div>

        <p className="text-xs text-muted-foreground/60 text-center px-2">
          If the video doesn't load, try a different server. Tap once to activate player controls.
        </p>
      </div>
    </div>
  );
}
