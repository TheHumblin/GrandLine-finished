import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Eye, Film, Settings, ExternalLink, ChevronDown, Tv, Tv2, ShoppingBag, CheckCircle, Zap } from 'lucide-react';
import { useAuth, getUnlockedTitles } from '@/hooks/useAuth';
import ThemeSwitcher from '@/components/features/ThemeSwitcher';
import { useTheme } from '@/hooks/useTheme';
import LegendarySkinCard from '@/components/features/LegendarySkinCard';
import { CREW_LIST, getShopState, saveShopState } from '@/data/shop';
import { toast } from 'sonner';
import BountyPoster from '@/components/features/BountyPoster';
import { countWatchedOVAs } from '@/lib/bounty';
import { OVA_BOUNTY_REWARD } from '@/constants/bounty';
import { OVAS } from '@/data/ovas';
import ProgressSyncStatus from '@/components/features/ProgressSyncStatus';
import { usePosterPhotoUpload } from '@/hooks/usePosterPhotoUpload';

function formatBounty(n: number): string {
  return n.toLocaleString() + '—';
}

const EPITHETS_INFO = [
  { min: 0, label: 'Cabin Boy', description: 'Just started the journey' },
  { min: 20, label: 'Rookie Pirate', description: 'Watch 20+ episodes' },
  { min: 50, label: 'Star of the Sea', description: 'Watch 50+ episodes' },
  { min: 100, label: 'Pirate Hunter', description: 'Watch 100+ episodes' },
  { min: 200, label: 'Surgeon of Death', description: 'Watch 200+ episodes' },
  { min: 300, label: 'Warlord of the Sea', description: 'Watch 300+ episodes' },
  { min: 500, label: 'Emperor of the Sea', description: 'Watch 500+ episodes' },
  { min: 1000, label: 'Pirate King', description: 'Watch 1000+ episodes' },
];

export default function Profile() {
  const { user, logout, updateSettings, selectTitle } = useAuth();
  useTheme((user?.theme as import('@/types').ThemeName) || 'strawhat');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTitlePicker, setShowTitlePicker] = useState(false);
  const [shopState, setShopState] = useState<{ ownedCrews: string[]; ownedSkins: string[]; activeCrew: string }>(
    { ownedCrews: ['strawhat-pirates'], ownedSkins: [], activeCrew: 'strawhat-pirates' }
  );

  useEffect(() => {
    if (user) {
      const s = getShopState(user.id);
      setShopState({
        ownedCrews: s.ownedCrews || ['strawhat-pirates'],
        ownedSkins: s.ownedSkins || [],
        activeCrew: s.activeCrew || 'strawhat-pirates',
      });
    }
  }, [user?.id]);

  const equipCrew = (crewId: string) => {
    if (!user) return;
    const crew = CREW_LIST.find(c => c.id === crewId);
    if (!crew) return;
    const newState = { ...shopState, activeCrew: crewId };
    saveShopState(user.id, { ownedCrews: newState.ownedCrews, ownedSkins: newState.ownedSkins, activeCrew: crewId });
    setShopState(newState);
    updateSettings({ crew: crew.name });
    toast.success(`Now sailing with the ${crew.name}!`);
  };

  const { upload: handleAvatarUpload, uploading } = usePosterPhotoUpload({
    userId: user?.id,
    onUploaded: avatar => updateSettings({ avatar }),
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm">
          <h2 className="text-2xl font-bold gold-text mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Create your Bounty Board profile and track your pirate journey.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const watchedCount = user.watchedEpisodes.length;
  const watchedMoviesCount = user.watchedMovies.length;
  const watchedSpecialsCount = (user.watchedSpecials || []).length;
  const watchedOVAsCount = countWatchedOVAs(user.watchedOVAs);
  const watchedLiveActionCount = (user.watchedLiveAction || []).length;
  const progress = Math.min(watchedCount / 1179 * 100, 100);
  const nextEpithet = EPITHETS_INFO.find((e) => e.min > watchedCount);
  const unlockedTitles = getUnlockedTitles(watchedCount);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[320px_1fr] gap-8">

          {/* ── Wanted Poster ───────────────────────────────────────────── */}
          <div>
            <BountyPoster username={user.username} bounty={user.bounty} avatar={user.avatar} onPhotoChange={() => { if (!uploading) fileInputRef.current?.click(); }} />
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" aria-label="Upload wanted poster photo" disabled={uploading} className="hidden" onChange={handleAvatarUpload} />
            {uploading && <p className="mt-2 text-base text-primary" role="status">Uploading poster photo…</p>}
            <ProgressSyncStatus userId={user.id} />

            {/* Keep account controls outside the supplied poster artwork. */}
            <div className="relative mt-3">
              <button type="button" onClick={() => setShowTitlePicker(!showTitlePicker)} disabled={unlockedTitles.length <= 1} aria-expanded={showTitlePicker}
                className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 text-base text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-default disabled:opacity-70">
                <span className="italic">&ldquo;{user.epithet}&rdquo;</span><ChevronDown size={16} aria-hidden="true" />
              </button>
              {showTitlePicker && unlockedTitles.length > 1 && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border bg-card p-2 shadow-xl">
                  <p className="px-2 py-2 text-base font-semibold text-foreground">Choose your title</p>
                  {unlockedTitles.map(title => (
                    <button key={title} type="button" aria-pressed={user.epithet === title}
                      onClick={() => { selectTitle(title); setShowTitlePicker(false); toast.success(`Title: "${title}"`); }}
                      className={`min-h-[44px] w-full rounded-lg px-2 text-left text-base hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${user.epithet === title ? 'font-semibold text-primary' : 'text-foreground'}`}>
                      {title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {user.isAdmin && <Link to="/admin" className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Settings size={16} /> Admin dashboard</Link>}

            {/* Bounty breakdown */}
            <div className="mt-3 bg-card border border-border rounded-xl p-4 text-xs text-muted-foreground space-y-1.5">
              <div className="font-semibold text-foreground text-sm mb-2">How Bounty is Earned</div>
              <div className="flex justify-between"><span>Episodes ({watchedCount})</span><span className="text-primary font-semibold">{(watchedCount * 1_000_000).toLocaleString()} Beli</span></div>
              <div className="flex justify-between"><span>Movies ({watchedMoviesCount})</span><span className="text-primary font-semibold">{(watchedMoviesCount * 5_000_000).toLocaleString()} Beli</span></div>
              <div className="flex justify-between"><span>Specials ({watchedSpecialsCount})</span><span className="text-primary font-semibold">{(watchedSpecialsCount * 2_000_000).toLocaleString()} Beli</span></div>
              <div className="flex justify-between"><span>OVAs ({watchedOVAsCount})</span><span className="text-primary font-semibold">{(watchedOVAsCount * OVA_BOUNTY_REWARD).toLocaleString()} Beli</span></div>
              <div className="flex justify-between"><span>Live Action ({(user.watchedLiveAction || []).length})</span><span className="text-primary font-semibold">{((user.watchedLiveAction || []).length * 2_000_000).toLocaleString()} Beli</span></div>
              <div className="flex justify-between"><span>Manga ch. ({user.currentMangaChapter || 0})</span><span className="text-primary font-semibold">{((user.currentMangaChapter || 0) * 100_000).toLocaleString()} Beli</span></div>
              <div className="flex justify-between border-t border-border pt-1 mt-1">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-primary font-bold">{user.bounty.toLocaleString()}—</span>
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-3 space-y-2">
              <button
                onClick={() => updateSettings({ showSpoilers: !user.showSpoilers })}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${user.showSpoilers ? 'bg-yellow-900/30 border-yellow-700/40 text-yellow-400' : 'bg-card border-border text-muted-foreground hover:text-foreground'}`}
              >
                <Eye size={16} />
                Anti-Spoiler: {user.showSpoilers ? 'OFF' : 'ON'}
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* ── Stats & Settings ─────────────────────────────────────────── */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Trophy size={16} className="text-primary" />
                Pirate Progress
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                {[
                  { label: 'Episodes', value: watchedCount, icon: Eye },
                  { label: 'Movies', value: watchedMoviesCount, icon: Film },
                  { label: 'Specials', value: watchedSpecialsCount, icon: Tv },
                  { label: 'OVAs', value: watchedOVAsCount, icon: Film },
                  { label: 'Live Action', value: watchedLiveActionCount, icon: Tv2 },
                  { label: 'Bounty', value: formatBounty(user.bounty), icon: Trophy },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-xl bg-muted/40">
                    <stat.icon size={16} className="text-primary mx-auto mb-1" />
                    <div className="text-xl font-bold gold-text">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Anime Progress</span>
                  <span>{watchedCount} / 1179 ({progress.toFixed(1)}%)</span>
                </div>
                <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
              </div>
              {nextEpithet && (
                <div className="mt-4 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                  Next rank: <span className="text-primary font-semibold">"{nextEpithet.label}"</span> — {nextEpithet.description}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-semibold text-foreground">OVA Collection</h3><span className="text-base font-semibold text-primary">{watchedOVAsCount} / {OVAS.length}</span></div>
              <div role="progressbar" aria-label="OVA completion" aria-valuenow={watchedOVAsCount} aria-valuemin={0} aria-valuemax={OVAS.length} className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full origin-left bg-primary" style={{ transform: `scaleX(${watchedOVAsCount / OVAS.length})` }} /></div>
              <p className="mt-3 text-base text-muted-foreground">Each completed title earns 2 million Beli once, independently of anime progress.</p>
              <Link to="/ovas" className="mt-3 inline-flex min-h-[44px] items-center text-base font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Browse OVAs</Link>
            </div>

            {/* Epithet Ladder */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4">Epithet Ladder</h3>
              <div className="space-y-2">
                {EPITHETS_INFO.map((e) => {
                  const unlocked = watchedCount >= e.min;
                  return (
                    <div key={e.label} className={`flex items-center gap-3 p-2.5 rounded-lg ${unlocked ? 'bg-primary/10' : 'opacity-40'}`}>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${unlocked ? 'bg-primary' : 'bg-muted-foreground'}`} />
                      <div className="flex-1">
                        <span className={`text-sm font-semibold ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>"{e.label}"</span>
                        <span className="text-xs text-muted-foreground ml-2">— {e.description}</span>
                      </div>
                      {user.epithet === e.label && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold">Active</span>
                      )}
                      {unlocked && user.epithet !== e.label && (
                        <button
                          onClick={() => { selectTitle(e.label); toast.success(`Title: "${e.label}"`); }}
                          className="text-xs px-2 py-0.5 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                        >
                          Use
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shop & Themes */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <ShoppingBag size={16} className="text-primary" />
                Skins & Themes
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Apply your owned skins and crew affiliations below. Buy more in the Pirate Shop.</p>

              {/* UI Themes */}
              <ThemeSwitcher />

              <LegendarySkinCard />

              {/* Owned Crew Affiliations */}
              {shopState.ownedCrews.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2">Crew Affiliations</div>
                  <div className="space-y-2">
                    {shopState.ownedCrews.map(crewId => {
                      const crew = CREW_LIST.find(c => c.id === crewId);
                      if (!crew) return null;
                      const isActive = shopState.activeCrew === crewId;
                      return (
                        <div key={crewId} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isActive ? 'border-primary/60 bg-primary/10' : 'border-border bg-muted/20 hover:border-primary/30'
                        }`}>
                          <span className="text-lg shrink-0">{crew.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-bold ${crew.rarityColor}`}>{crew.name}</div>
                            <div className="text-xs text-muted-foreground">{crew.rarity}</div>
                          </div>
                          {isActive ? (
                            <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                              <CheckCircle size={13} />
                              Active
                            </div>
                          ) : (
                            <button
                              onClick={() => equipCrew(crewId)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-primary/40 text-primary bg-primary/10 hover:bg-primary/20 transition-all"
                            >
                              Equip
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <Link
                to="/shop"
                className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
              >
                <ShoppingBag size={14} />
                Open Pirate Shop
              </Link>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Settings size={16} className="text-primary" />
                Resources
              </h3>
              <a
                href="https://onepiece.fandom.com/wiki/One_Piece_Wiki"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/40 transition-all text-sm text-foreground"
              >
                <ExternalLink size={14} className="text-primary" />
                One Piece Wiki — Fandom
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
