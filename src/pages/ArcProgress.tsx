import { useState } from 'react';
import { Trophy, CheckCircle, Lock, ChevronDown, Map } from 'lucide-react';
import { SAGAS } from '@/data/sagas';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

const SAGA_COLORS: Record<string, string> = {
  'east-blue': 'from-blue-500 to-cyan-400',
  'alabasta': 'from-yellow-500 to-amber-400',
  'sky-island': 'from-sky-400 to-blue-300',
  'water-7': 'from-teal-500 to-emerald-400',
  'thriller-bark': 'from-purple-600 to-violet-500',
  'summit-war': 'from-red-600 to-orange-500',
  'fish-man-island': 'from-cyan-500 to-blue-400',
  'dressrosa': 'from-pink-500 to-rose-400',
  'whole-cake': 'from-pink-400 to-purple-400',
  'wano': 'from-red-500 to-amber-500',
  'final': 'from-indigo-500 to-purple-500',
};

const SAGA_ICONS: Record<string, string> = {
  'east-blue': '⚓',
  'alabasta': '🏜️',
  'sky-island': '☁️',
  'water-7': '🚂',
  'thriller-bark': '👻',
  'summit-war': '⚔️',
  'fish-man-island': '🐠',
  'dressrosa': '🌹',
  'whole-cake': '🎂',
  'wano': '⛩️',
  'final': '🌟',
};

export default function ArcProgress() {
  const { user } = useAuth();
  useTheme(user?.theme || 'strawhat');

  const currentEpisode = user?.currentEpisode || 0;
  const watchedEpisodes = new Set(user?.watchedEpisodes || []);

  // Find the saga the user is currently watching to auto-expand it
  const currentSagaId = SAGAS.find(s =>
    currentEpisode > 0 && currentEpisode >= s.episodeRange[0] && currentEpisode <= s.episodeRange[1]
  )?.id || null;

  const [expandedSaga, setExpandedSaga] = useState<string | null>(currentSagaId);

  const getSagaProgress = (saga: typeof SAGAS[0]) => {
    const [start, end] = saga.episodeRange;
    const total = Math.min(end, 1179) - start + 1;
    const watched = Array.from(watchedEpisodes).filter(ep => ep >= start && ep <= Math.min(end, 1179)).length;
    return { watched, total, pct: total > 0 ? (watched / total) * 100 : 0 };
  };

  const getArcProgress = (arc: typeof SAGAS[0]['arcs'][0]) => {
    const [start, end] = arc.episodeRange;
    const total = Math.min(end, 1179) - start + 1;
    const watched = Array.from(watchedEpisodes).filter(ep => ep >= start && ep <= Math.min(end, 1179)).length;
    return { watched, total, pct: total > 0 ? (watched / total) * 100 : 0 };
  };

  const totalWatched = watchedEpisodes.size;
  const overallPct = (totalWatched / 1179) * 100;

  const completedArcs = SAGAS.flatMap(s => s.arcs).filter(arc => {
    const [start, end] = arc.episodeRange;
    const total = Math.min(end, 1179) - start + 1;
    const watched = Array.from(watchedEpisodes).filter(ep => ep >= start && ep <= Math.min(end, 1179)).length;
    return watched >= total && total > 0;
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/30 px-4 sm:px-6 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Map size={24} className="text-primary" />
            <h1 className="text-3xl font-bold gold-text">Grand Line Voyage</h1>
          </div>
          <p className="text-muted-foreground">Track your progress across every arc and saga on your journey to Laugh Tale.</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        {/* Overall stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Episodes Watched', value: totalWatched, max: 1179, icon: '▶' },
            { label: 'Overall Progress', value: `${overallPct.toFixed(1)}%`, icon: '📊' },
            { label: 'Arcs Completed', value: completedArcs, max: SAGAS.flatMap(s => s.arcs).length, icon: '🏆' },
            { label: 'Current Episode', value: currentEpisode || '—', icon: '📍' },
          ].map(stat => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold gold-text">{stat.value}</div>
              {'max' in stat && stat.max && (
                <div className="text-xs text-muted-foreground">/ {stat.max}</div>
              )}
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-foreground">Overall Voyage Progress</span>
            <span className="text-muted-foreground">{totalWatched} / 1179 episodes</span>
          </div>
          <div className="h-4 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${overallPct}%`,
                background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))',
              }}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-right">
            {overallPct >= 100 ? '🎉 Journey Complete!' : `${(100 - overallPct).toFixed(1)}% remaining to Laugh Tale`}
          </div>
        </div>

        {/* Saga cards */}
        <div className="space-y-4">
          {SAGAS.map(saga => {
            const sagaProgress = getSagaProgress(saga);
            const isExpanded = expandedSaga === saga.id;
            const isStarted = sagaProgress.watched > 0;
            const isComplete = sagaProgress.pct >= 100;
            const isLocked = currentEpisode < saga.episodeRange[0] - 20 && !isStarted;
            const isCurrentSaga = saga.id === currentSagaId && currentEpisode > 0;
            const gradientClass = SAGA_COLORS[saga.id] || 'from-primary to-accent';

            return (
              <div
                key={saga.id}
                className={`rounded-2xl border-2 overflow-hidden transition-all ${
                  isCurrentSaga
                    ? 'border-primary/70 bg-primary/5 shadow-[0_0_20px_hsl(var(--primary)/0.12)]'
                    : isComplete
                    ? 'border-green-500/40 bg-green-900/10'
                    : isStarted
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                <button
                  onClick={() => setExpandedSaga(isExpanded ? null : saga.id)}
                  className="w-full p-4 sm:p-5 flex items-center gap-4 text-left"
                >
                  {/* Saga icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
                    {SAGA_ICONS[saga.id] || '⚓'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-foreground">{saga.name}</h3>
                      {isCurrentSaga && (
                        <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-primary/20 border border-primary/50 text-primary font-bold leading-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                          Current Saga
                        </span>
                      )}
                      {isComplete && <CheckCircle size={14} className="text-green-400 shrink-0" />}
                      {isLocked && <Lock size={14} className="text-muted-foreground shrink-0" />}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Ep. {saga.episodeRange[0]}–{Math.min(saga.episodeRange[1], 1179)} · {saga.arcs.length} arcs
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden max-w-xs">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-700`}
                        style={{ width: `${sagaProgress.pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right shrink-0 hidden sm:block">
                    <div className="text-lg font-bold text-foreground">{sagaProgress.watched}</div>
                    <div className="text-xs text-muted-foreground">/ {sagaProgress.total}</div>
                    <div className={`text-xs font-semibold ${isComplete ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {sagaProgress.pct.toFixed(0)}%
                    </div>
                  </div>

                  <ChevronDown
                    size={18}
                    className={`text-muted-foreground transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Arc breakdown */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t border-border/50 pt-4">
                    <div className="space-y-3">
                      {saga.arcs.map(arc => {
                        const arcProgress = getArcProgress(arc);
                        const arcComplete = arcProgress.pct >= 100;
                        const arcStarted = arcProgress.watched > 0;
                        const isCurrentArc = currentEpisode > 0 &&
                          currentEpisode >= arc.episodeRange[0] &&
                          currentEpisode <= arc.episodeRange[1];

                        return (
                          <div
                            key={arc.id}
                            className={`flex items-center gap-3 rounded-xl transition-all ${
                              isCurrentArc
                                ? 'border-2 border-primary/60 bg-primary/10 px-3 py-2'
                                : ''
                            }`}
                          >
                            {arcComplete ? (
                              <CheckCircle size={16} className="text-green-400 shrink-0" />
                            ) : arcStarted ? (
                              <div className="w-4 h-4 rounded-full border-2 border-primary shrink-0 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-border shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                                  <span className={`text-sm truncate ${
                                    isCurrentArc ? 'text-primary font-semibold'
                                    : arcComplete ? 'text-green-400 font-medium'
                                    : arcStarted ? 'text-foreground'
                                    : 'text-muted-foreground'
                                  }`}>
                                    {arc.name}
                                  </span>
                                  {isCurrentArc && (
                                    <span className="shrink-0 flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-black leading-none">
                                      <span className="w-1 h-1 rounded-full bg-white/70 animate-pulse" />
                                      Now Watching
                                    </span>
                                  )}
                                  <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-muted/70 text-muted-foreground font-medium">
                                    {arcProgress.total} eps
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                  {arcProgress.watched}/{arcProgress.total}
                                </span>
                              </div>
                              <div className="text-[10px] text-muted-foreground/60 mb-1">
                                Ep. {arc.episodeRange[0]}–{arc.episodeRange[1]}
                              </div>
                              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-500`}
                                  style={{ width: `${arcProgress.pct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2"><CheckCircle size={12} className="text-green-400" /> Completed</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2 border-primary" /> In Progress</div>
          <div className="flex items-center gap-2"><Lock size={12} /> Not yet reached</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Now Watching</div>
        </div>
      </div>
    </div>
  );
}
