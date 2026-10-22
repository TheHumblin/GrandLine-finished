import { Link } from 'react-router-dom';
import { Clapperboard, Trophy } from 'lucide-react';
import { OVAS } from '@/data/ovas';
import { OVA_BOUNTY_REWARD } from '@/constants/bounty';

interface OVAOverviewProps { watchedCount: number; signedIn: boolean }
export default function OVAOverview({ watchedCount, signedIn }: OVAOverviewProps) {
  const percent = Math.round(watchedCount / OVAS.length * 100);
  return (
    <header className="border-b border-border bg-card/30">
      <div className="mx-auto grid max-w-screen-xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"><Clapperboard size={20} aria-hidden="true" /> BONUS ADVENTURES</p>
          <h1 className="gold-text text-3xl font-bold">One Piece OVAs</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">Explore eight OVAs, shorts, and film prologues — from Ganzack to Film Gold. Watch the ZokoAnime SUB tracks listed on HiAnime.</p>
          <p className="mt-3 text-base text-muted-foreground">Mark each title watched after finishing it to earn <strong className="text-primary">2 million Beli</strong> once. OVAs do not change your anime episode progress.</p>
        </div>
        <div className="rounded-xl border border-primary/30 bg-background p-5">
          <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold text-foreground">Your OVA collection</h2><Trophy size={20} className="text-primary" aria-hidden="true" /></div>
          <p className="mt-3 text-2xl font-bold text-primary">{watchedCount} / {OVAS.length} <span className="text-base font-normal text-muted-foreground">watched</span></p>
          <div role="progressbar" aria-label="OVA watch progress" aria-valuenow={watchedCount} aria-valuemin={0} aria-valuemax={OVAS.length} className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full origin-left bg-primary" style={{ transform: `scaleX(${percent / 100})` }} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{signedIn ? `${(watchedCount * OVA_BOUNTY_REWARD).toLocaleString()} Beli earned · ${percent}% complete` : 'Sign in to save progress and earn bounty.'}</p>
          <Link to="/leaderboard" className="mt-2 inline-flex min-h-[44px] items-center text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">View Bounty Board</Link>
        </div>
      </div>
    </header>
  );
}
