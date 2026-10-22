/**
 * Downloads page — /downloads
 *
 * Shows every episode, movie, and special the user has clicked "Download" on.
 * Reads from localStorage (all users) and merges Supabase data (logged-in users).
 * Each item shows its cached KiwiStream links so users can re-access without
 * reopening the video page.
 */

import { useState, useEffect } from 'react';
import { Download, Tv, Film, ExternalLink, Play, Trash2, RefreshCw, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { readDownloadHistory, type DownloadRecord, type DownloadLink } from '@/components/features/DownloadButton';

function formatBadge(link: DownloadLink): { label: string; cls: string } | null {
  if (link.quality === 'Download Page') return null;
  if (link.isM3U8) return { label: 'HLS', cls: 'bg-orange-900/30 text-orange-300 border-orange-700/30' };
  return { label: 'MP4', cls: 'bg-emerald-900/40 text-emerald-400 border-emerald-700/40' };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const HISTORY_KEY = 'grandline_download_history';

function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function qualityBadgeClass(q: string): string {
  if (q.includes('1080')) return 'bg-blue-900/40 text-blue-400 border-blue-700/40';
  if (q.includes('720'))  return 'bg-green-900/40 text-green-400 border-green-700/40';
  if (q.includes('480'))  return 'bg-yellow-900/40 text-yellow-400 border-yellow-700/40';
  if (q.includes('360'))  return 'bg-orange-900/40 text-orange-400 border-orange-700/40';
  return 'bg-muted text-muted-foreground border-border';
}

function typeColor(type: DownloadRecord['type']): string {
  if (type === 'movie')   return 'text-yellow-400';
  if (type === 'special') return 'text-purple-400';
  return 'text-primary';
}

function typeLabel(type: DownloadRecord['type']): string {
  if (type === 'movie')   return 'Movie';
  if (type === 'special') return 'Special';
  return 'Episode';
}

function navigatePath(record: DownloadRecord): string {
  if (record.type === 'movie')   return `/movies/${record.id}`;
  if (record.type === 'special') return `/specials/${record.id}`;
  return `/watch/${record.id}`;
}

// ─── Record card ─────────────────────────────────────────────────────────────

function DownloadCard({ record, onRemove }: { record: DownloadRecord; onRemove: () => void }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const sortedLinks = [...(record.links || [])].sort((a, b) => {
    const order = ['1080p', '720p', '480p', '360p'];
    const ai = order.findIndex(q => a.quality.includes(q.replace('p', '')));
    const bi = order.findIndex(q => b.quality.includes(q.replace('p', '')));
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const hasLinks = sortedLinks.length > 0;

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-200">
      {/* Card header */}
      <div className="flex items-center gap-3 p-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl border border-border bg-muted/40 flex items-center justify-center shrink-0`}>
          {record.type === 'episode' ? (
            <Tv size={16} className={typeColor(record.type)} />
          ) : (
            <Film size={16} className={typeColor(record.type)} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold uppercase tracking-wide ${typeColor(record.type)}`}>
              {typeLabel(record.type)}
            </span>
            <span className="text-xs text-muted-foreground/60">·</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 border border-border text-muted-foreground font-medium">
              {record.lang.toUpperCase()}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{record.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(record.savedAt)}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => navigate(navigatePath(record))}
            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            title="Go to watch page"
          >
            <Play size={13} />
          </button>
          <button
            onClick={() => setExpanded(e => !e)}
            className={`p-2 rounded-lg transition-colors ${
              expanded
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            title={expanded ? 'Hide links' : 'Show download links'}
          >
            <Download size={13} />
          </button>
          <button
            onClick={onRemove}
            className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
            title="Remove from history"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Expandable links panel */}
      {expanded && (
        <div className="border-t border-border bg-muted/20 p-3 space-y-2">
          {/* AnimeToki browse directory links */}
          {(record.animeTokiDirLinks ?? []).length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-sky-400 px-1 flex items-center gap-1.5">
                <ExternalLink size={10} /> AnimeToki 1080p — browse &amp; download
              </p>
              {(record.animeTokiDirLinks ?? []).map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-900/10 border border-sky-700/30 hover:border-sky-500/60 hover:bg-sky-900/20 transition-all text-xs text-sky-300"
                >
                  <Download size={10} className="shrink-0" />
                  <span className="truncate flex-1">
                    {link.url.split('/').slice(-1)[0].replace(/%5B/g, '[').replace(/%5D/g, ']').replace(/%20/g, ' ').replace(/\/$/, '') || 'Browse directory'}
                  </span>
                  <ExternalLink size={9} className="ml-auto shrink-0" />
                </a>
              ))}
            </div>
          )}

          {/* Direct download links */}
          {hasLinks && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground/70 px-1">Download links (MP4):</p>
              {sortedLinks.map((link, i) => {
                const fmt = formatBadge(link);
                return (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={!link.isM3U8 && link.quality !== 'Download Page' ? true : undefined}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl border transition-all group/link ${
                      !link.isM3U8 && link.quality !== 'Download Page'
                        ? 'bg-emerald-900/10 border-emerald-700/30 hover:border-emerald-500/60 hover:bg-emerald-900/20'
                        : 'bg-muted/40 border-border hover:border-primary/40 hover:bg-muted/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Download size={11} className={`transition-colors shrink-0 ${
                        !link.isM3U8 && link.quality !== 'Download Page'
                          ? 'text-emerald-400 group-hover/link:text-emerald-300'
                          : 'text-muted-foreground group-hover/link:text-primary'
                      }`} />
                      <span className={`text-xs px-1.5 py-0.5 rounded-full border font-bold ${qualityBadgeClass(link.quality)}`}>
                        {link.quality}
                      </span>
                      {fmt && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full border font-bold ${fmt.cls}`}>
                          {fmt.label}
                        </span>
                      )}
                    </div>
                    <ExternalLink size={10} className="text-muted-foreground/60 group-hover/link:text-primary transition-colors shrink-0" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Watch links — sub + dub */}
          <div className={`${hasLinks ? 'border-t border-border pt-2 mt-1' : ''} space-y-1.5`}>
            <p className="text-xs text-muted-foreground/60 px-1 font-semibold flex items-center gap-1.5">
              <Play size={9} className="text-teal-400" /> animesuge.cz — watch + download on site
            </p>
            {((record as Record<string, unknown>).subWatchUrl as string | undefined || record.watchUrl) && (
              <a
                href={((record as Record<string, unknown>).subWatchUrl as string | undefined) ?? record.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-900/10 border border-teal-700/30 hover:border-teal-500/60 hover:bg-teal-900/20 transition-all text-xs text-teal-300"
              >
                <Play size={10} className="shrink-0" />
                <span className="flex-1 truncate">{record.title} — Sub (H-SUB)</span>
                <ExternalLink size={9} className="ml-auto shrink-0" />
              </a>
            )}
            {((record as Record<string, unknown>).dubWatchUrl as string | undefined) && (
              <a
                href={(record as Record<string, unknown>).dubWatchUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-900/10 border border-blue-700/30 hover:border-blue-500/60 hover:bg-blue-900/20 transition-all text-xs text-blue-300"
              >
                <Play size={10} className="shrink-0" />
                <span className="flex-1 truncate">{record.title} — Dub (A-DUB)</span>
                <ExternalLink size={9} className="ml-auto shrink-0" />
              </a>
            )}
            {record.gogoUrl && (
              <a
                href={record.gogoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-900/10 border border-amber-700/30 hover:border-amber-500/60 hover:bg-amber-900/20 transition-all text-xs text-amber-300"
              >
                <Download size={10} className="shrink-0" />
                <span className="truncate">GogoAnime — click Download on page</span>
                <ExternalLink size={9} className="ml-auto shrink-0" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type FilterType = 'all' | 'episode' | 'movie' | 'special';

export default function Downloads() {
  const [records, setRecords] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isMerged, setIsMerged] = useState(false);

  // Load from localStorage + merge Supabase
  useEffect(() => {
    const local = readDownloadHistory();
    setRecords(local);
    setLoading(false);

    // Merge from Supabase if logged in
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data } = await supabase
        .from('user_profiles')
        .select('progress_data')
        .eq('id', session.user.id)
        .single();

      if (data?.progress_data) {
        const remoteDownloads = ((data.progress_data as Record<string, unknown>).downloads as DownloadRecord[]) || [];
        if (remoteDownloads.length > 0) {
          // Merge: de-dupe by type+id+lang, keep newest
          const merged = [...local];
          for (const remote of remoteDownloads) {
            const exists = merged.find(r => r.type === remote.type && r.id === remote.id && r.lang === remote.lang);
            if (!exists) merged.push(remote);
            else if (remote.savedAt > exists.savedAt) {
              const idx = merged.indexOf(exists);
              merged[idx] = remote;
            }
          }
          merged.sort((a, b) => b.savedAt - a.savedAt);
          setRecords(merged);
          // Update localStorage with merged
          try { localStorage.setItem(HISTORY_KEY, JSON.stringify(merged.slice(0, 200))); } catch { /* ignore */ }
          setIsMerged(true);
        }
      }
    });
  }, []);

  const handleRemove = (record: DownloadRecord) => {
    const updated = records.filter(r => !(r.type === record.type && r.id === record.id && r.lang === record.lang));
    setRecords(updated);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
  };

  const handleClearAll = () => {
    setRecords([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch { /* ignore */ }
  };

  // Filter + search
  const filtered = records.filter(r => {
    if (filter !== 'all' && r.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.title.toLowerCase().includes(q) || String(r.id).includes(q);
    }
    return true;
  });

  const counts = {
    all: records.length,
    episode: records.filter(r => r.type === 'episode').length,
    movie: records.filter(r => r.type === 'movie').length,
    special: records.filter(r => r.type === 'special').length,
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Download size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-cinzel">Downloads</h1>
              <p className="text-sm text-muted-foreground">
                {records.length === 0
                  ? 'No downloads yet'
                  : `${records.length} saved item${records.length !== 1 ? 's' : ''}`}
                {isMerged && <span className="ml-2 text-xs text-primary/70">· synced</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search downloads…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-muted/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-muted-foreground shrink-0" />
            {(['all', 'episode', 'movie', 'special'] as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  filter === f
                    ? 'bg-primary/20 border-primary/60 text-primary'
                    : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {counts[f] > 0 && (
                  <span className="ml-1 text-muted-foreground/60">({counts[f]})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={20} className="animate-spin text-primary" />
          </div>
        )}

        {/* Empty state */}
        {!loading && records.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/40 border border-border flex items-center justify-center mb-4">
              <Download size={24} className="text-muted-foreground/40" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-2">No downloads yet</p>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Click the <span className="text-primary font-medium">Download</span> button on any episode, movie, or special to save KiwiStream links here for easy re-access.
            </p>
          </div>
        )}

        {/* No results for current filter */}
        {!loading && records.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search size={20} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No results for "{search}"</p>
          </div>
        )}

        {/* Records list */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map(record => (
              <DownloadCard
                key={`${record.type}-${record.id}-${record.lang}`}
                record={record}
                onRemove={() => handleRemove(record)}
              />
            ))}
          </div>
        )}

        {/* Clear all */}
        {!loading && records.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-red-400 hover:bg-red-900/20 border border-border hover:border-red-800/40 transition-all"
            >
              <Trash2 size={12} />
              Clear all download history
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
