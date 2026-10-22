import { useState } from 'react';
import { Brain, Trophy, Lock, CheckCircle, XCircle, ChevronRight, RotateCcw, Unlock, BookOpen, Sword, Globe, Star, AlertCircle } from 'lucide-react';
import {
  getQuestionsForEpisode,
  getLockedCount,
  getNextUnlockEpisode,
  getCategoryBreakdown,
  QUIZ_QUESTIONS,
} from '@/data/quizQuestions';
import type { QuizQuestion } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

const MIN_EPISODES_TO_UNLOCK = 10;
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Combat:        <Sword size={12} />,
  Characters:    <Star size={12} />,
  World:         <Globe size={12} />,
  Story:         <BookOpen size={12} />,
  Lore:          <BookOpen size={12} />,
  Powers:        <Sword size={12} />,
  Ships:         <Globe size={12} />,
  Bounties:      <Trophy size={12} />,
  Organizations: <Globe size={12} />,
};

type QuizState = 'start' | 'playing' | 'review';

export default function Quiz() {
  const { user } = useAuth();
  useTheme(user?.theme || 'strawhat');

  const watchedCount   = user?.watchedEpisodes.length || 0;
  const currentEp      = user?.currentEpisode || 0;
  const progress       = Math.max(currentEp, watchedCount);
  const isUnlocked     = progress >= MIN_EPISODES_TO_UNLOCK;

  const availableQs    = getQuestionsForEpisode(progress);
  const lockedCount    = getLockedCount(progress);
  const nextUnlock     = getNextUnlockEpisode(progress);
  const categoryBreak  = getCategoryBreakdown(progress);
  const totalQ         = QUIZ_QUESTIONS.length;

  const [state, setState]             = useState<QuizState>('start');
  const [questions, setQuestions]     = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [selected, setSelected]       = useState<number | null>(null);
  const [answers, setAnswers]         = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = () => {
    const qs = getQuestionsForEpisode(progress);
    setQuestions(qs);
    setCurrentIdx(0);
    setSelected(null);
    setAnswers(new Array(qs.length).fill(null));
    setShowExplanation(false);
    setState('playing');
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const newAnswers = [...answers];
    newAnswers[currentIdx] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setState('review');
    }
  };

  const score    = answers.filter((a, i) => a === questions[i]?.correctIndex).length;
  const currentQ = questions[currentIdx];

  const difficultyColor = (d: QuizQuestion['difficulty']) =>
    d === 'easy' ? 'text-green-400' : d === 'medium' ? 'text-yellow-400' : 'text-red-400';

  // ── Locked ───────────────────────────────────────────────────────────────────
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <Lock size={56} className="text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Locked</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Watch at least <strong className="text-primary">{MIN_EPISODES_TO_UNLOCK} episodes</strong> to unlock the quiz.
            Questions are drawn only from episodes you've seen — no spoilers.
          </p>
          <div className="bg-card border border-border rounded-xl p-4 mb-5">
            <div className="text-sm text-muted-foreground mb-1">Your progress</div>
            <div className="text-3xl font-bold gold-text">{progress} / {MIN_EPISODES_TO_UNLOCK}</div>
            <div className="mt-2 w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(100, (progress / MIN_EPISODES_TO_UNLOCK) * 100)}%` }}
              />
            </div>
          </div>
          {!user && <p className="text-xs text-muted-foreground">Sign in to track your episode count.</p>}
        </div>
      </div>
    );
  }

  // ── Start screen ─────────────────────────────────────────────────────────────
  if (state === 'start') {
    const pctUnlocked = Math.round((availableQs.length / totalQ) * 100);
    const diffCounts = { easy: 0, medium: 0, hard: 0 };
    getQuestionsForEpisode(progress).forEach(q => diffCounts[q.difficulty]++);
    // Sample 10 for display
    const samplePool = QUIZ_QUESTIONS.filter(q => q.episodeRange[1] <= progress);
    const easyN   = samplePool.filter(q => q.difficulty === 'easy').length;
    const medN    = samplePool.filter(q => q.difficulty === 'medium').length;
    const hardN   = samplePool.filter(q => q.difficulty === 'hard').length;

    return (
      <div className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mx-auto mb-4">
              <Brain size={36} className="text-primary" />
            </div>
            <h1 className="text-3xl font-bold gold-text mb-2">One Piece Quiz</h1>
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
              10 random questions pulled <strong className="text-foreground">only from episodes you've watched</strong> — zero spoilers beyond your progress.
            </p>
          </div>

          {/* Progress card */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-foreground">Your Quiz Pool</div>
              <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                <Unlock size={12} />
                {samplePool.length} / {totalQ} questions unlocked
              </div>
            </div>

            {/* Unlock progress bar */}
            <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden mb-1">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pctUnlocked}%`,
                  background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent, var(--primary))))',
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mb-4">
              <span>Ep 1</span>
              <span className="font-semibold text-foreground">Your progress: Ep {progress}</span>
              <span>Ep 1100+</span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: 'Easy',   count: easyN,  color: 'text-green-400',  bg: 'bg-green-900/20 border-green-700/30' },
                { label: 'Medium', count: medN,   color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700/30' },
                { label: 'Hard',   count: hardN,  color: 'text-red-400',    bg: 'bg-red-900/20 border-red-700/30' },
              ].map(d => (
                <div key={d.label} className={`rounded-xl border p-2.5 text-center ${d.bg}`}>
                  <div className={`text-xl font-bold ${d.color}`}>{d.count}</div>
                  <div className="text-xs text-muted-foreground">{d.label}</div>
                </div>
              ))}
            </div>

            {/* Category chips */}
            {Object.keys(categoryBreak).length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground mb-2">Unlocked categories:</div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(categoryBreak).sort((a, b) => b[1] - a[1]).map(([cat, n]) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold"
                    >
                      {CATEGORY_ICONS[cat] ?? <Star size={10} />}
                      {cat} ×{n}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Locked hint */}
          {lockedCount > 0 && nextUnlock && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-muted/30 border border-border text-xs text-muted-foreground mb-6">
              <Lock size={13} className="shrink-0 mt-0.5 text-muted-foreground/60" />
              <span>
                <strong className="text-foreground">{lockedCount} questions</strong> are still locked.
                Watch up to <strong className="text-primary">episode {nextUnlock}</strong> to unlock the next batch.
              </span>
            </div>
          )}

          {samplePool.length < 10 && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-yellow-900/20 border border-yellow-700/30 text-xs text-yellow-300 mb-6">
              <AlertCircle size={13} className="shrink-0 mt-0.5" />
              <span>
                Only <strong>{samplePool.length}</strong> questions available at your progress. Keep watching to unlock more!
              </span>
            </div>
          )}

          <button
            onClick={startQuiz}
            disabled={samplePool.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Brain size={18} />
            Start Quiz · {Math.min(10, samplePool.length)} Questions
          </button>
        </div>
      </div>
    );
  }

  // ── Review screen ─────────────────────────────────────────────────────────────
  if (state === 'review') {
    const pct   = Math.round((score / questions.length) * 100);
    const grade = pct >= 90 ? 'Legendary' : pct >= 70 ? 'Great' : pct >= 50 ? 'Good' : 'Keep watching!';
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Trophy size={48} className="text-primary mx-auto mb-3" />
            <h2 className="text-3xl font-bold gold-text mb-1">{grade}</h2>
            <p className="text-muted-foreground mb-4">You scored {score} / {questions.length} ({pct}%)</p>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden max-w-xs mx-auto">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${pct}%`, background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent, var(--primary))))' }}
              />
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const correct    = userAnswer === q.correctIndex;
              return (
                <div key={q.id} className={`p-4 rounded-xl border ${correct ? 'bg-green-900/20 border-green-700/40' : 'bg-red-900/20 border-red-700/40'}`}>
                  <div className="flex items-start gap-3">
                    {correct
                      ? <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
                      : <XCircle    size={18} className="text-red-400 shrink-0 mt-0.5" />}
                    <div>
                      <div className="text-sm font-semibold text-foreground mb-1">Q{i + 1}: {q.question}</div>
                      <div className="text-xs text-green-400 mb-0.5">✓ {q.options[q.correctIndex]}</div>
                      {!correct && (
                        <div className="text-xs text-red-400 mb-0.5">
                          ✗ You said: {userAnswer !== null ? q.options[userAnswer] : 'No answer'}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground italic">{q.explanation}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={() => setState('start')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              <RotateCcw size={16} />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Playing state ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span className="flex items-center gap-1.5">
              <Brain size={14} />
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span className={`text-xs font-semibold ${difficultyColor(currentQ.difficulty)}`}>
              {currentQ.difficulty.toUpperCase()} · {currentQ.category}
            </span>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-bar-fill" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-5">
          <h2 className="text-lg font-semibold text-foreground leading-relaxed mb-1">{currentQ.question}</h2>
          <div className="text-xs text-muted-foreground">
            Score: {answers.filter((a, i) => a !== null && a === questions[i]?.correctIndex).length} correct so far
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-5">
          {currentQ.options.map((opt, i) => {
            let cls = 'bg-card border-border text-foreground hover:border-primary/50';
            if (selected !== null) {
              if (i === currentQ.correctIndex) cls = 'bg-green-900/30 border-green-500 text-green-300';
              else if (i === selected)         cls = 'bg-red-900/30 border-red-500 text-red-300';
              else                             cls = 'bg-card border-border text-muted-foreground opacity-50';
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className={`w-full text-left p-4 rounded-xl border-2 text-sm transition-all ${cls} disabled:cursor-default`}
              >
                <span className="font-semibold mr-3">{['A', 'B', 'C', 'D'][i]}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-muted/40 border border-border rounded-xl p-4 mb-5">
            <div className="flex items-start gap-2">
              {selected === currentQ.correctIndex
                ? <CheckCircle size={16} className="text-green-400 shrink-0 mt-0.5" />
                : <XCircle    size={16} className="text-red-400 shrink-0 mt-0.5" />}
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">
                  {selected === currentQ.correctIndex ? 'Correct!' : 'Incorrect'}
                </div>
                <div className="text-sm text-muted-foreground">{currentQ.explanation}</div>
              </div>
            </div>
          </div>
        )}

        {selected !== null && (
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            {currentIdx < questions.length - 1
              ? <><span>Next Question</span> <ChevronRight size={16} /></>
              : <><span>See Results</span>   <Trophy size={16} /></>}
          </button>
        )}
      </div>
    </div>
  );
}
