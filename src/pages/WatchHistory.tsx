import { Link } from 'react-router-dom';
import { History, Play, Clock, Trash2, Anchor } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { SAGAS } from '@/data/sagas';
import { OVAS } from '@/data/ovas';
import { MOVIES } from '@/data/movies';
import { toast } from 'sonner';

function getArcForEpisode(num: number): string {
  for (const saga of SAGAS) {
    for (const arc of saga.arcs) {
      if (num >= arc.episodeRange[0] && num <= arc.episodeRange[1]) return arc.name;
    }
  }
  return 'Unknown Arc';
}

export default function WatchHistory() {
  const { user, updateSettings } = useAuth();
  useTheme(user?.theme || 'strawhat');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm px-4">
          <History size={48} className="text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold gold-text mb-2">Watch History</h2>
          <p className="text-muted-foreground mb-6">Sign in to track your watching history.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            <Anchor size={16} />
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const history = user.watchHistory || [];
  const continueEp = user.currentEpisode > 0 ? user.currentEpisode + 1 : null;

  const clearHistory = () => {
    updateSettings({ watchHistory: [] });
    toast.success('Watch history cleared.');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/30 px-4 sm:px-6 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <History size={24} className="text-primary" />
                <h1 className="text-3xl font-bold gold-text">Watch History</h1>
              </div>
              <p className="text-muted-foreground">{history.length} entries in your history — episodes and completed OVAs.</p>
            </div>
            {history.length > 0 && (
              <button onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-destructive/40 text-destructive text-sm hover:bg-destructive/10 transition-colors">
                <Trash2 size={14} />
                Clear History
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        {/* Continue watching */}
        {continueEp && (
          <div className="mb-6 p-5 rounded-2xl bg-primary/10 border border-primary/30 glow-border">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Continue Watching</div>
                <div className="text-xl font-bold text-foreground">Episode {continueEp}</div>
                <div className="text-sm text-muted-foreground">{getArcForEpisode(continueEp)}</div>
              </div>
              <Link to={`/watch/${continueEp}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                <Play size={16} />
                Continue
              </Link>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Overall Progress</span>
                <span>{user.watchedEpisodes.length} / 1179</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${Math.min((user.watchedEpisodes.length / 1179) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        )}

        {history.length === 0 ? (
          <div className="text-center py-24">
            <History size={48} className="mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No watch history yet</h3>
            <p className="text-muted-foreground mb-6">Watch episodes or mark completed OVAs watched to build your history.</p>
            <Link to="/episodes" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
              <Play size={16} />
              Browse Episodes
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="font-semibold text-foreground mb-3">Recently Watched</h2>
            {history.map((entry, idx) => {
              const ova = entry.type === 'ova' ? OVAS.find(item => item.id === entry.episodeNumber) : undefined;
              const movie = entry.type === 'movie' ? MOVIES.find(item => item.id === entry.episodeNumber) : undefined;
              const title = entry.type === 'ova' ? ova?.title ?? 'OVA' : entry.type === 'movie' ? movie?.title ?? 'Movie' : `Episode ${entry.episodeNumber}`;
              const arc = entry.type === 'ova' ? 'OVA · Completed' : entry.type === 'movie' ? 'Movie' : getArcForEpisode(entry.episodeNumber);
              const href = entry.type === 'ova' ? `/ovas/${entry.episodeNumber}` : entry.type === 'movie' ? `/movies/${entry.episodeNumber}` : `/watch/${entry.episodeNumber}`;
              const date = new Date(entry.watchedAt);
              return (
                <div key={idx} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/40 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">{entry.episodeNumber}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-foreground">{title}</div>
                    <div className="text-xs text-muted-foreground">{arc}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Clock size={11} />
                      {date.toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <Link to={href} aria-label={`Watch ${title}`}
                    className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <Play size={14} className="text-primary ml-0.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
