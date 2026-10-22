import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen, Film, Globe, Map, History, Users, Award, Trophy,
  Tv, List, Menu, X, LogOut, User, ExternalLink, Zap, ShoppingBag, Download,
  Bell, Reply, MessageSquare, Check, Trash2, Megaphone, Clapperboard,
} from 'lucide-react';
import ThemeLogo from '@/components/features/ThemeLogo';
import AuthModal from '@/components/features/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

const NAV_LINKS = [
  { href: '/episodes', label: 'Episodes', icon: Globe },
  { href: '/movies', label: 'Movies', icon: Film },
  { href: '/specials', label: 'Specials', icon: Tv },
  { href: '/ovas', label: 'OVAs', icon: Clapperboard },
  { href: '/live-action', label: 'Live Action', icon: Film },
  { href: '/manga', label: 'Manga', icon: BookOpen },
  { href: '/one-pace', label: 'One Pace', icon: Zap },
  { href: '/encyclopedia', label: 'Devil Fruits', icon: Globe },
  { href: '/races', label: 'Races', icon: Users },
  { href: '/watch-order', label: 'Watch Order', icon: List },
  { href: '/watch-party', label: 'Watch Party', icon: Users },
  { href: '/arc-progress', label: 'Arc Progress', icon: Map },
  { href: '/watch-history', label: 'History', icon: History },
  { href: '/downloads', label: 'Downloads', icon: Download },
  { href: '/leaderboard', label: 'Bounty Board', icon: Award },
  { href: '/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/quiz', label: 'Quiz', icon: Trophy },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function NotificationBell() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAllRead, markRead, deleteNotification } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open && unreadCount > 0) markAllRead(); }}
        className="relative p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">{unreadCount}</span>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Check size={10} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                <Bell size={24} className="opacity-30" />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs opacity-60">Reply notifications appear here</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors group ${!n.read ? 'bg-primary/5' : ''}`}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.type === 'comment_reply' ? 'bg-primary/20' : 'bg-muted'}`}>
                    {n.type === 'comment_reply' ? (
                      <Reply size={13} className="text-primary" />
                    ) : (
                      <MessageSquare size={13} className="text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-relaxed ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground/60">{timeAgo(n.created_at)}</span>
                      {n.episode_number && (
                        <Link
                          to={`/watch/${n.episode_number}`}
                          onClick={() => { markRead(n.id); setOpen(false); }}
                          className="text-xs text-primary hover:underline"
                        >
                          Ep {n.episode_number} →
                        </Link>
                      )}
                    </div>
                  </div>

                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                  )}

                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive transition-all shrink-0"
                    title="Dismiss"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">Reply to comments to notify crew members</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AnnouncementBanner() {
  const [text, setText] = useState('');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => {
      const msg = localStorage.getItem('grandline_announcement') || '';
      setText(msg);
      // Reset dismissed state if announcement changed
      if (msg) setDismissed(false);
    };
    check();
    // Poll every 5 seconds so it appears quickly after admin posts
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!text || dismissed) return null;

  return (
    <div className="relative flex items-center justify-center gap-3 px-4 py-2 bg-primary/15 border-b border-primary/30 text-sm text-foreground">
      <Megaphone size={14} className="text-primary shrink-0" />
      <span className="text-center leading-snug">{text}</span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  );
}

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [pgActive, setPgActive] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const check = () => setPgActive(document.documentElement.classList.contains('theme-poneglyph'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/90" style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" aria-label="GrandLine home" className="flex items-center gap-2 group shrink-0 min-h-[44px] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <ThemeLogo theme={user?.theme || 'strawhat'} poneglyphActive={pgActive} />
              <span className={`text-lg font-bold tracking-wide${pgActive ? ' navbar-title-poneglyph' : ' gold-text'}`}>
                GrandLine
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 mx-4">
              {NAV_LINKS.map(link => (
                <Link key={link.href} to={link.href}
                  className={`nav-link flex items-center gap-1 whitespace-nowrap shrink-0 px-2 py-1.5 rounded-md text-xs font-medium transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    location.pathname.startsWith(link.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}>
                  <link.icon size={11} />
                  {link.label}
                  {link.href === '/shop' && (
                    <span className="ml-0.5 text-[9px] px-1 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-bold leading-none">NEW</span>
                  )}
                </Link>
              ))}
              {user?.isAdmin && (
                <Link to="/admin"
                  className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-yellow-400 hover:bg-yellow-900/20 transition-colors font-semibold whitespace-nowrap shrink-0 min-h-[36px]">
                  ⚙ Admin
                </Link>
              )}
              <a href="https://onepiece.fandom.com/wiki/One_Piece_Wiki" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors whitespace-nowrap shrink-0 min-h-[36px]">
                <ExternalLink size={11} />
                Wiki
              </a>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {user ? (
                <div className="flex items-center gap-2">
                  {/* Notification Bell */}
                  <NotificationBell />

                  <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img src={user.avatar} alt={user.username}
                      className="w-8 h-8 rounded-full border-2 border-primary/50 object-cover"
                      onError={e => { const t = e.currentTarget; if (!t.dataset.fb) { t.dataset.fb='1'; t.src=`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.username)}`; } }} />
                    <div className="hidden sm:block">
                      <div className="text-xs font-semibold text-foreground leading-tight flex items-center gap-1">
                        {user.username}
                        {user.isAdmin && <span className="text-yellow-400">⚙</span>}
                      </div>
                      <div className="text-xs text-primary leading-tight">
                        {user.bounty >= 1_000_000_000 ? `${(user.bounty / 1_000_000_000).toFixed(1)}B` : `${(user.bounty / 1_000_000).toFixed(0)}M`} Beli
                      </div>
                    </div>
                  </Link>
                  <button onClick={logout} className="p-2 rounded text-muted-foreground hover:text-destructive transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" title="Log out">
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <button onClick={() => setAuthOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors min-h-[44px]">
                  <User size={14} />
                  Sign In
                </button>
              )}
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-xl max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(link => (
                <Link key={link.href} to={link.href} onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors min-h-[44px] ${
                    location.pathname.startsWith(link.href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}>
                  <link.icon size={16} />
                  {link.label}
                  {link.href === '/shop' && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-bold">NEW</span>
                  )}
                </Link>
              ))}
              {user?.isAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-yellow-400 font-semibold min-h-[44px]">
                  ⚙ Admin Panel
                </Link>
              )}
              <a href="https://onepiece.fandom.com/wiki/One_Piece_Wiki" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors min-h-[44px]">
                <ExternalLink size={16} />
                One Piece Wiki
              </a>
              {!user && (
                <button onClick={() => { setMenuOpen(false); setAuthOpen(true); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary text-sm font-semibold min-h-[44px]">
                  <User size={16} />
                  Sign In / Create Account
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
      <AnnouncementBanner />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
