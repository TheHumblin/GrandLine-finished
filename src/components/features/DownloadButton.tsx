/**
 * DownloadButton
 *
 * Shows AnimeToki directory links only — no animesuge or GogoAnime.
 * Episode 1–1073, all movies & specials → general 1080p AnimeToki directory.
 * Episodes 1074+ → per-season AnimeToki directories.
 * Missing episodes (134, 740, 820) → dedicated missing-episodes directory.
 */

import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, ExternalLink, X, Film, Tv, FolderOpen } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DownloadLink {
  quality: string;
  url: string;
  provider?: string;
  isM3U8?: boolean;
  referer?: string;
}

export interface DownloadRecord {
  type: 'episode' | 'movie' | 'special';
  id: number;
  lang: 'sub' | 'dub';
  title: string;
  links: DownloadLink[];
  animeTokiDirLinks?: DownloadLink[];
  watchUrl: string;
  subWatchUrl?: string;
  dubWatchUrl?: string;
  fallbackUrl: string;
  gogoUrl?: string;
  savedAt: number;
}

interface Props {
  episodeNumber?: number;
  movieId?: number;
  specialId?: number;
  audioType?: 'sub' | 'dub';
  title?: string;
}

const HISTORY_KEY = 'grandline_download_history';

export function readDownloadHistory(): DownloadRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as DownloadRecord[]) : [];
  } catch { return []; }
}

// ─── AnimeToki directory links ────────────────────────────────────────────────

/** General 1080p pack — episodes 1-1073, all movies & specials */
const ANIMETOKI_GENERAL = {
  url: 'https://drive.animetoki.com/W0FuaW1lVG9raV0gT25lIFBpZWNlIDEwODBwIFtBbmld/',
  label: 'One Piece 1080p [Ani] — All Episodes / Movies / Specials',
};

/** Per-season packs for episodes 1074+ */
const ANIMETOKI_EP_DIRS: Array<{ min: number; max: number; url: string; label: string }> = [
  {
    min: 1074, max: 1085,
    url: 'https://cloud.animetoki.com/W0FuaW1lVG9raV0gU2Vhc29uIDIwIC0gV2FubyBDb3VudHJ5IFBhcnQgMg==/',
    label: 'Season 20 — Wano Country Pt. 2 (1074–1085)',
  },
  {
    min: 1086, max: 1108,
    url: 'https://drive.animetoki.com/W0FuaW1lVG9raV0gU2Vhc29uIDIxIC0gRWdnaGVhZCBBUkMg/',
    label: 'Season 21 — Egghead Arc (1086–1108)',
  },
  {
    min: 1109, max: 1155,
    url: 'https://drive.animetoki.com/W0FuaW1lVG9raV0gU2Vhc29uIDIxIC0gRWdnaGVhZCBBUkMgUGFydCAy/',
    label: 'Season 21 — Egghead Arc Part 2 (1109–1155)',
  },
  {
    min: 1156, max: 1170,
    url: 'https://drive.animetoki.com/W0FuaW1lVG9raV0gT25lIFBpZWNlIFNlYXNvbiAyMyBFbmdsaXNoIFN1YmJlZCAxMDgwcA==/',
    label: 'Season 23 — 1080p Sub (1156–1170)',
  },
];

const MISSING_EPISODES = new Set([134, 740, 820]);
const MISSING_EP_URL   = 'https://drive.animetoki.com/W0FuaW1lVG9raV0gT25lIHBpZWNlIE1pc3NpbmcgRXBpc29kZXM=/';

interface AnimeTokiEntry { url: string; label: string }

function getAnimeTokiEntries(ep?: number, mv?: number, sp?: number): AnimeTokiEntry[] {
  const results: AnimeTokiEntry[] = [];

  if (ep !== undefined) {
    // Missing episodes directory takes priority
    if (MISSING_EPISODES.has(ep)) {
      results.push({ url: MISSING_EP_URL, label: `Missing Episodes Directory (includes Ep ${ep})` });
    }
    // 1–1073 → general pack
    if (ep <= 1073) {
      results.push({ ...ANIMETOKI_GENERAL });
    } else {
      // 1074+ → season pack
      const season = ANIMETOKI_EP_DIRS.find(r => ep >= r.min && ep <= r.max);
      if (season) results.push({ url: season.url, label: season.label });
    }
  }

  if (mv !== undefined || sp !== undefined) {
    // Movies & specials → general pack
    results.push({ ...ANIMETOKI_GENERAL });
  }

  return results;
}

function getLabel(ep?: number, mv?: number, sp?: number): string {
  if (ep) return `Episode ${ep}`;
  if (mv) return `Movie ${mv}`;
  if (sp) return `Special ${sp}`;
  return 'Content';
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DownloadButton({ episodeNumber, movieId, specialId }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef   = useRef<HTMLButtonElement>(null);

  useEffect(() => { setOpen(false); }, [episodeNumber, movieId, specialId]);

  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [open]);

  const label   = getLabel(episodeNumber, movieId, specialId);
  const entries = getAnimeTokiEntries(episodeNumber, movieId, specialId);
  const isMovie   = !!movieId;
  const isSpecial = !!specialId;

  if (entries.length === 0) return null;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
          open
            ? 'bg-sky-900/30 border-sky-500/60 text-sky-300'
            : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:border-sky-500/40 hover:bg-muted/70'
        }`}
      >
        <Download size={12} />
        Download
        <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute bottom-full mb-2 right-0 w-[320px] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-2 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 min-w-0">
              {isMovie || isSpecial
                ? <Film size={13} className={isMovie ? 'text-yellow-400 shrink-0' : 'text-purple-400 shrink-0'} />
                : <Tv size={13} className="text-sky-400 shrink-0" />}
              <span className="text-sm font-semibold text-foreground truncate">{label}</span>
            </div>
            <button onClick={() => setOpen(false)}
              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <X size={13} />
            </button>
          </div>

          <div className="p-3 space-y-2">
            <p className="text-xs font-semibold text-sky-400 px-1 flex items-center gap-1.5">
              <FolderOpen size={10} /> AnimeToki — browse &amp; direct download
            </p>
            <p className="text-[10px] text-muted-foreground/60 px-1 leading-relaxed">
              Open the directory → click any file to download the MP4 directly. No sign-in required.
            </p>

            {entries.map((entry, i) => (
              <a
                key={i}
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-sky-900/15 border border-sky-600/40 hover:border-sky-400/70 hover:bg-sky-900/25 transition-all text-xs text-sky-300 group"
              >
                <FolderOpen size={11} className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold leading-snug">{entry.label}</div>
                  <div className="text-sky-300/40 text-[10px] truncate mt-0.5">{entry.url}</div>
                </div>
                <ExternalLink size={9} className="shrink-0 opacity-60 group-hover:opacity-100" />
              </a>
            ))}

            <p className="text-[10px] text-muted-foreground/40 text-center pt-1 border-t border-border">
              AnimeToki · 1080p direct downloads
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
