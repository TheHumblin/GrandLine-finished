import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import { ShoppingBag, Lock, CheckCircle, Tag, Zap, Star } from 'lucide-react';
import { CREW_LIST, SHOP_SKINS, getShopState, saveShopState } from '@/data/shop';
import { getOwnedSkins } from '@/lib/skinOwnership';
import { usePoneglyphSkin } from '@/hooks/usePoneglyphSkin';

function formatBerri(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  return n.toLocaleString();
}

export default function Shop() {
  const { user, updateSettings, persistProgress } = useAuth();
  useTheme(user?.theme || 'strawhat');
  const poneglyphSkin = usePoneglyphSkin();
  const [tab, setTab] = useState<'crews' | 'skins'>('crews');
  const [shopState, setShopState] = useState<{
    ownedCrews: string[];
    ownedSkins: string[];
    activeCrew: string;
  }>({ ownedCrews: ['strawhat-pirates'], ownedSkins: [], activeCrew: 'strawhat-pirates' });

  useEffect(() => {
    if (user) {
      const s = getShopState(user.id);
      setShopState({
        ownedCrews: s.ownedCrews || ['strawhat-pirates'],
        ownedSkins: getOwnedSkins(user.id, user.ownedSkins),
        activeCrew: s.activeCrew || 'strawhat-pirates',
      });
    }
  }, [user?.id, user?.ownedSkins]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm">
          <ShoppingBag size={40} className="text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold gold-text mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-4">You need an account to use the shop.</p>
        </div>
      </div>
    );
  }

  const berri = user.bounty;

  const buyCrew = (crew: typeof CREW_LIST[0]) => {
    const owned = shopState.ownedCrews.includes(crew.id);
    if (owned) {
      const newState = { ...shopState, activeCrew: crew.id };
      saveShopState(user.id, { ownedCrews: newState.ownedCrews, ownedSkins: newState.ownedSkins, activeCrew: crew.id });
      setShopState(newState);
      updateSettings({ crew: crew.name });
      toast.success(`Now sailing with the ${crew.name}!`);
      return;
    }
    if (crew.cost === 0) {
      const newOwned = [...shopState.ownedCrews, crew.id];
      const newState = { ...shopState, ownedCrews: newOwned, activeCrew: crew.id };
      saveShopState(user.id, { ownedCrews: newOwned, ownedSkins: shopState.ownedSkins, activeCrew: crew.id });
      setShopState(newState);
      updateSettings({ crew: crew.name });
      toast.success(`Joined the ${crew.name}!`);
      return;
    }
    if (berri < crew.cost) {
      toast.error(`Not enough Beli! Need ${formatBerri(crew.cost)} — earn more by watching episodes.`);
      return;
    }
    const newBerri = berri - crew.cost;
    const newOwned = [...shopState.ownedCrews, crew.id];
    const newState = { ...shopState, ownedCrews: newOwned, activeCrew: crew.id };
    saveShopState(user.id, { ownedCrews: newOwned, ownedSkins: shopState.ownedSkins, activeCrew: crew.id });
    setShopState(newState);
    persistProgress({ bounty: newBerri } as Parameters<typeof persistProgress>[0]);
    updateSettings({ crew: crew.name });
    toast.success(`Joined the ${crew.name}! −${formatBerri(crew.cost)} Beli`);
  };

  const buyPoneglyph = () => {
    const skin = SHOP_SKINS[0];
    const owned = shopState.ownedSkins.includes(skin.id);
    if (owned) {
      poneglyphSkin.activate();
      return;
    }
    if (berri < skin.cost) {
      toast.error(`Not enough Beli! Need ${formatBerri(skin.cost)} — that's 1 Billion Beli.`);
      return;
    }
    const newBerri = berri - skin.cost;
    const newOwned = [...shopState.ownedSkins, skin.id];
    const newState = { ...shopState, ownedSkins: newOwned };
    saveShopState(user.id, { ownedCrews: shopState.ownedCrews, ownedSkins: newOwned, activeCrew: shopState.activeCrew });
    setShopState(newState);
    persistProgress({ bounty: newBerri, ownedSkins: newOwned, poneglyphActive: true });
    toast.success('Poneglyph skin unlocked! The Void Century has been revealed. −1B Beli');
  };

  const poneglyph = SHOP_SKINS[0];
  const poneglyphOwned = shopState.ownedSkins.includes(poneglyph.id);
  const poneglyphCanAfford = berri >= poneglyph.cost;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/20 px-4 sm:px-6 py-8">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <ShoppingBag size={24} className="text-primary" />
                <h1 className="text-3xl font-bold gold-text">Pirate Shop</h1>
              </div>
              <p className="text-muted-foreground text-sm">Spend your Beli on crew affiliations and the legendary Poneglyph skin.</p>
            </div>
            <div className="bg-card border border-primary/30 rounded-xl px-4 py-2.5">
              <div className="text-xs text-muted-foreground">Your Beli</div>
              <div className="text-xl font-bold text-primary">{berri.toLocaleString()}—</div>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            {[
              { id: 'crews', label: 'Crew Affiliations', icon: Tag },
              { id: 'skins', label: 'UI Skins', icon: Star },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as 'crews' | 'skins')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  tab === t.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/30 text-muted-foreground border-border hover:text-foreground hover:border-primary/40'
                }`}>
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-6">
        {/* CREWS TAB */}
        {tab === 'crews' && (
          <div>
            <div className="text-xs text-muted-foreground mb-4 bg-card border border-border rounded-xl px-4 py-3">
              Your crew affiliation appears on your Bounty Poster and Profile. Click an owned crew to equip it.
              <span className="text-yellow-300 font-semibold"> Void Century</span> costs <span className="text-yellow-300 font-semibold">500M Beli</span>.
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {CREW_LIST.map(crew => {
                const owned = shopState.ownedCrews.includes(crew.id);
                const active = shopState.activeCrew === crew.id;
                const canAfford = berri >= crew.cost;
                return (
                  <button key={crew.id} onClick={() => buyCrew(crew)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                      active
                        ? crew.rarity === 'Legendary'
                          ? 'border-yellow-400 bg-yellow-900/20 shadow-lg shadow-yellow-400/20'
                          : 'border-primary bg-primary/10'
                        : owned
                        ? 'border-green-600/60 bg-green-900/10 hover:border-green-500'
                        : canAfford
                        ? 'border-border bg-card hover:border-primary/40 hover:bg-muted/30'
                        : 'border-border/40 bg-muted/10 opacity-60'
                    }`}>
                    <span className="text-2xl shrink-0">{crew.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold ${crew.rarityColor}`}>{crew.name}</span>
                        {active && <CheckCircle size={13} className="text-primary shrink-0" />}
                        {owned && !active && <span className="text-xs text-green-400 font-semibold">Owned</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{crew.description}</div>
                      <div className={`text-xs font-semibold ${crew.rarityColor} mt-0.5`}>{crew.rarity}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      {crew.cost === 0 || owned ? (
                        <span className={`text-xs font-bold ${active ? 'text-primary' : owned ? 'text-green-400' : 'text-muted-foreground'}`}>
                          {active ? 'Active ✓' : owned ? 'Click to Equip' : 'Free'}
                        </span>
                      ) : (
                        <div className="flex flex-col items-end gap-0.5">
                          {!canAfford && <Lock size={11} className="text-muted-foreground" />}
                          <span className={`text-xs font-bold ${canAfford ? 'text-primary' : 'text-muted-foreground'}`}>{formatBerri(crew.cost)}</span>
                          <span className="text-xs text-muted-foreground">Beli</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SKINS TAB — Only Poneglyph */}
        {tab === 'skins' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-xs text-muted-foreground mb-6 bg-card border border-border rounded-xl px-4 py-3">
              The Poneglyph skin is the only UI skin — the most legendary item in the shop.
              Once purchased, it unlocks glitch effects, floating ancient symbols, and an aurora border site-wide.
            </div>

            {/* Legendary Poneglyph Card */}
            <div className={`relative rounded-2xl border-2 overflow-hidden transition-all ${
              poneglyphOwned
                ? 'border-yellow-400 shadow-2xl shadow-yellow-400/30'
                : poneglyphCanAfford
                ? 'border-yellow-600/60 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-400/20'
                : 'border-border/40 opacity-80'
            }`}>
              {/* Glowing bg */}
              <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-slate-900 to-stone-950" />
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59,130,246,0.03) 2px, rgba(59,130,246,0.03) 4px)`,
                }} />

              <div className="relative p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl">📜</span>
                      <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-black tracking-wider">LEGENDARY</span>
                    </div>
                    <h2 className="text-2xl font-black text-yellow-300">Void Century</h2>
                    <p className="text-stone-400 text-sm italic">(Poneglyph) — The lost history. The truth they tried to erase.</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-stone-500 font-semibold tracking-wider">COST</div>
                    <div className="text-xl font-black text-yellow-300">1,000,000,000</div>
                    <div className="text-xs text-stone-500">Beli</div>
                  </div>
                </div>

                {/* Glitch text teaser */}
                <div className="mb-6 p-4 rounded-xl bg-blue-900/20 border border-blue-700/30">
                  <div className="text-blue-300 font-black text-lg tracking-[0.15em] mb-1 font-mono"
                    style={{ textShadow: '0 0 8px rgba(96,165,250,0.5)' }}>
                    READ THE PONEGLYPHS
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-400/70">
                    <Zap size={10} />
                    <span>Text glitches until hovered — site-wide</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {poneglyph.features.map((feature, i) => {
                    const icons = ['⚡', '🔮', '📡', '🌌', '✨'];
                    const [title, desc] = feature.split(' — ');
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-stone-900/60 border border-stone-700/40">
                        <span className="text-lg shrink-0">{icons[i]}</span>
                        <div>
                          <div className="text-sm font-bold text-stone-200">{title}</div>
                          {desc && <div className="text-xs text-stone-500 mt-0.5">{desc}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                {poneglyphOwned ? (
                  <div className="w-full py-4 rounded-xl bg-yellow-400/20 border-2 border-yellow-400/60 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle size={18} className="text-yellow-400" />
                      <span className="text-yellow-300 font-black text-lg">VOID CENTURY UNLOCKED</span>
                    </div>
                    <p className="text-stone-400 text-xs mt-1">The Poneglyphs have been read. The truth is yours.</p>
                  </div>
                ) : (
                  <button
                    onClick={buyPoneglyph}
                    disabled={!poneglyphCanAfford}
                    className={`w-full py-4 rounded-xl font-black text-lg tracking-wider transition-all active:scale-[0.98] ${
                      poneglyphCanAfford
                        ? 'bg-gradient-to-r from-yellow-600 to-amber-500 text-stone-900 hover:from-yellow-500 hover:to-amber-400 shadow-lg shadow-yellow-400/30'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {poneglyphCanAfford ? (
                      <span className="flex items-center justify-center gap-2">
                        <Zap size={18} />
                        PURCHASE FOR 1B BELI
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Lock size={16} />
                        NEED {formatBerri(poneglyph.cost - berri)} MORE BELI
                      </span>
                    )}
                  </button>
                )}

                {!poneglyphOwned && (
                  <p className="text-center text-xs text-stone-600 mt-3">
                    You have {berri.toLocaleString()} Beli · Need {(1_000_000_000).toLocaleString()} Beli
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
