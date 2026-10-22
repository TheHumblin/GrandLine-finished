import { Link } from 'react-router-dom';
import { BookOpen, Film, Zap, Globe, ChevronRight, Star, Trophy, ExternalLink, Brain, Users, Map, History } from 'lucide-react';
import onePieceLogo from '@/assets/one-piece-logo.png';
import homepageLogo from '@/assets/homepage-one-piece-logo.webp';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { OVAS } from '@/data/ovas';
import BountyPoster from '@/components/features/BountyPoster';

const FEATURES = [
  { icon: Globe, title: 'Episodes', description: 'All 1161+ episodes. Sub/Dub/H-SUB with Megaplay, Vidwish, and Kiwi-Stream servers. Saga/Arc navigation.', href: '/episodes', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
  { icon: Film, title: 'Movies', description: 'All 15 One Piece films with multiple servers per movie.', href: '/movies', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
  { icon: Film, title: 'OVAs', description: 'Eight bonus adventures, shorts, and film prologues with ZokoAnime playback. Earn 2M Beli for each completed title.', href: '/ovas', color: 'text-primary', bg: 'bg-primary/10 border-primary/30' },
  { icon: BookOpen, title: 'Colored Manga', description: '1131+ chapters of the Official Colored digital edition. Full in-site reader with SBS sections.', href: '/manga', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' },
  { icon: Zap, title: 'One Pace', description: 'One Piece at manga pace — all filler removed. Sub/Dub in 480p, 720p & 1080p.', href: '/one-pace', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30' },
  { icon: Globe, title: 'Devil Fruits', description: '25+ Devil Fruits documented with spoiler protection, wiki images, and full ability breakdowns.', href: '/encyclopedia', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
  { icon: Brain, title: 'Quiz', description: 'Test your knowledge. 10 random questions adapted to your current episode progress.', href: '/quiz', color: 'text-pink-400', bg: 'bg-pink-400/10 border-pink-400/30' },
  { icon: Users, title: 'Watch Party', description: 'Watch in sync with friends. Captain controls play/pause. Live crew chat included.', href: '/watch-party', color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/30' },
  { icon: Map, title: 'Arc Progress', description: 'Visual Grand Line voyage map — track completed arcs and saga milestones.', href: '/arc-progress', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
  { icon: History, title: 'Watch History', description: 'See every episode you have watched with timestamps. Continue right where you left off.', href: '/watch-history', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/30' },
];

export default function Index() {
  const { user } = useAuth();
  useTheme(user?.theme || 'strawhat');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero — full-bleed One Piece logo */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-background" style={{ minHeight: '55vh' }}>
        {/* Ocean wave lines */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.04) 60px, rgba(255,255,255,0.04) 61px)',
        }} />
        {/* Logo fills the blue area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={homepageLogo}
            alt="One Piece anime logo on an ocean-blue background"
            width={1200}
            height={675}
            fetchPriority="high"
            className="w-full h-full object-contain object-center drop-shadow-2xl"
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          />
        </div>
        {/* Bottom gradient to blend into page */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        {/* Overlay content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 sm:pb-8 flex flex-col items-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-semibold">
            <Star size={11} className="fill-current" />
            The Ultimate One Piece Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold gold-text glow-text tracking-wide">GrandLine</h1>
          <p className="text-xs sm:text-sm text-foreground/70 text-center max-w-xs sm:max-w-md">
            Episodes, movies, specials, OVAs, manga, One Pace, SBS, and Devil Fruits — all in one place.
          </p>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            <Link to="/episodes"
              className="flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base hover:bg-primary/90 transition-all min-h-[48px]">
              Start Watching <ChevronRight size={16} />
            </Link>
            <Link to="/manga"
              className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-background/80 border border-border text-foreground font-semibold text-sm sm:text-base hover:bg-muted transition-all min-h-[48px]">
              <BookOpen size={16} />
              Read Manga
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-border">
            {[
              { label: 'Episodes', value: '1,161+' },
              { label: 'Movies', value: '15' },
              { label: 'OVAs', value: String(OVAS.length) },
              { label: 'Chapters', value: '1,131+' },
              { label: 'Devil Fruits', value: '25+' },
            ].map(stat => (
              <div key={stat.label} className="px-3 sm:px-6 py-4 sm:py-5 text-center">
                <div className="text-xl sm:text-2xl font-bold gold-text">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold gold-text mb-2 sm:mb-3">Everything One Piece</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">One platform for the entire One Piece universe.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {FEATURES.map(feature => (
            <Link key={feature.title} to={feature.href}
              className={`card-hover group flex sm:block items-center gap-4 p-4 sm:p-5 rounded-2xl border bg-card ${feature.bg} relative overflow-hidden`}>
              <div className={`inline-flex shrink-0 p-2.5 rounded-xl bg-background/40 ${feature.color} sm:mb-4`}>
                <feature.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-0.5 sm:mb-1.5">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">{feature.description}</p>
                <div className={`hidden sm:flex items-center gap-1 mt-3 text-xs font-medium ${feature.color}`}>
                  Explore <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <ChevronRight size={14} className={`sm:hidden shrink-0 ${feature.color}`} />
            </Link>
          ))}
        </div>
      </section>

      {/* Profile / CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-screen-md mx-auto border-t border-border">
        {user ? (
          <div className="grid items-center gap-8 sm:grid-cols-[minmax(0,280px)_1fr]">
            <BountyPoster username={user.username} bounty={user.bounty} avatar={user.avatar} />
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Your Marine wanted poster</p>
              <h2 className="mt-3 text-2xl font-bold text-foreground">{user.username}</h2>
              <p className="mt-2 text-base italic text-muted-foreground">&ldquo;{user.epithet}&rdquo;</p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">Your bounty grows with every completed adventure. Update your poster photo and track your rewards in your profile.</p>
              <Link to="/profile" className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 text-base font-semibold text-primary hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                View your profile <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <img src={onePieceLogo} alt="One Piece" className="w-32 mx-auto mb-4 object-contain" />
            <h3 className="text-xl font-bold text-foreground mb-2">Join the Crew</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Create your pirate profile, track progress, earn bounty, and unlock your Marine Wanted Poster.
            </p>
            <button data-auth-trigger onClick={() => document.querySelector<HTMLButtonElement>('[data-auth-trigger]')?.click()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
              Create Account <ChevronRight size={14} />
            </button>
            <div className="mt-4 text-xs text-muted-foreground">
              <a href="https://onepiece.fandom.com/wiki/One_Piece_Wiki" target="_blank" rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1">
                <ExternalLink size={10} />
                Visit the One Piece Wiki
              </a>
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-border py-8 px-4 sm:px-6">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={onePieceLogo} alt="GrandLine" className="w-6 h-6 object-contain" />
            <span className="text-sm font-semibold gold-text">GrandLine</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            GrandLine is a fan site. One Piece is property of Eiichiro Oda / Shueisha / Toei Animation.
          </p>
          <a href="https://onepiece.fandom.com/wiki/One_Piece_Wiki" target="_blank" rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1">
            <ExternalLink size={10} />
            One Piece Wiki
          </a>
        </div>
      </footer>
    </div>
  );
}
