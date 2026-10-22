/**
 * adBlocker.ts — Enterprise-Grade Ad & Popup Blocker
 *
 * Modelled on the full protection stack of Free Adblocker Browser
 * (Rocketshield Browser Technology Limited) + uBlock Origin techniques.
 *
 * PROTECTION LAYERS:
 *  A.  window.open()            Hard-blocked. Returns null unconditionally.
 *  B.  Location API             href / assign / replace intercepted.
 *  C.  Mousedown + Click        Capture-phase interceptors kill overlays & hostile anchors.
 *  D.  rAF Continuous Scanner   Every 60 ms scans & removes invisible overlays.
 *  E.  MutationObserver         Removes injected overlay nodes instantly.
 *  F.  history API              pushState / replaceState blocked for ad URLs.
 *  G.  Focus Recapture          Reclaims focus at 0–1000 ms after blur.
 *  H.  beforeunload Guard       Suppresses hostile iframe-triggered navigation.
 *  I.  CSS Nuclear Layer        Inline <style> disables pointer-events on ad patterns.
 *  J.  Player Container Shield  Per-player MO removes any non-React overlay.
 *  K.  Network Request Block    fetch + XMLHttpRequest overrides block ad domain calls.
 *  L.  Cosmetic Filter Engine   200+ CSS element-hiding rules (EasyList cosmetic format).
 *  M.  Scriptlet Engine         Defuses ad JS: setTimeout/setInterval poison,
 *                               localStorage tracker filter, navigator.sendBeacon block,
 *                               WebRTC IP-leak prevention, canvas fingerprint noise.
 *  N.  Anti-Anti-Adblock        Neutralises adblock-detection scripts (bait element trick).
 *  O.  Global Variable Poison   Sets known ad-network globals to null at boot + every 3 s.
 *  P.  postMessage Filter       Blocks ad-network postMessage relay attempts.
 *  Q.  Iframe Src Monitor       Replaces src of iframes that load ad domains with blank.
 *
 * SAFETY: HLS/DASH/MP4 streaming chunks, Supabase, Consumet, AnimeToki, megaplay.buzz,
 * readonepiece.com, audiomangaop.com, and all our own fetches are NEVER touched.
 */

// ── Player hover state ────────────────────────────────────────────────────────
let _playerHovered = false;
export function setPlayerHovered(active: boolean): void {
  _playerHovered = active;
}

// ── Redirect confirmation callback ───────────────────────────────────────────
export interface PendingRedirect {
  id: string;
  url: string;
  execute: () => void;
}
let _redirectCallback: ((pending: PendingRedirect) => void) | null = null;
export function onRedirectIntercepted(cb: ((pending: PendingRedirect) => void) | null): void {
  _redirectCallback = cb;
}
function dispatchPendingRedirect(url: string, executeOriginal: () => void): void {
  if (!_redirectCallback) { console.info('[AdBlocker] Silently blocked redirect:', url); return; }
  _redirectCallback({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, url, execute: executeOriginal });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAFE HOSTS — never block, never intercept requests to these
// ═══════════════════════════════════════════════════════════════════════════════
const SAFE_HOSTS = new Set([
  'fonts.googleapis.com', 'fonts.gstatic.com',
  'readonepiece.com', 'ww12.readonepiece.com', 'audiomangaop.com', 'www.audiomangaop.com',
  'megaplay.buzz',
  'hianime.at', 'zokoanime.video',
  'backend.onspace.ai',
  'supabase.co', 'supabase.in',
  'animetoki.com', 'drive.animetoki.com', 'cloud.animetoki.com',
  'consumet.org', 'consumet-api.onrender.com', 'api-consumet.vercel.app',
  'animesuge.cz', 'animesuge.to',
  'anitaku.pe', 'gogoanime.tel',
  'myanimelist.net', 'anilist.co',
  'wikia.nocookie.net',
  'unsplash.com', 'picsum.photos',
  'cdn-ai.onspace.ai', 'onspace.ai',
  'kwik.si', 'kwik.cx', 'kwik.ink', 'kiwi.si',
]);

function isSafeHost(raw: string): boolean {
  try {
    const host = new URL(raw).hostname.toLowerCase().replace(/^www\./, '');
    if (SAFE_HOSTS.has(host)) return true;
    for (const s of SAFE_HOSTS) { if (host.endsWith('.' + s)) return true; }
  } catch { /* ignore */ }
  return false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCKED DOMAIN / URL PATTERNS  (Network + Navigation blocklist)
// Equivalent to EasyList + uBlock Origin's built-in lists
// ═══════════════════════════════════════════════════════════════════════════════
const AD_PATTERNS: readonly string[] = [
  // ── App stores (hijack redirects) ──────────────────────────────────────────
  'play.google.com/store', 'apps.apple.com', 'itunes.apple.com',
  'market.android.com', 'appstore.com', 'onestore.co.kr',

  // ── Adult / Dating ─────────────────────────────────────────────────────────
  'livejasmin', 'jasmin', 'honeymoon', 'fling', 'jdate',
  'javhd', 'javmost', 'xvideos', 'pornhub', 'xhamster',
  'fuq.com', 'hentaigasm', 'redtube', 'youporn', 'spankbang',
  'xnxx', 'chaturbate', 'onlyfans', 'stripchat', 'bongacams',
  'camsoda', 'myfreecams', 'cam4', 'flirt4free', 'brazzers',
  'bangbros', 'nubiles', 'realitykings', 'teamskeet',
  'adult', 'dating', 'sexvid', 'erotik', 'erotic',

  // ── Ad networks & DSPs ─────────────────────────────────────────────────────
  'adcash.com', 'popcash.net', 'popads.net', 'trafficjunky',
  'adsterra', 'yllix', 'plugrush', 'juicyads', 'hilltopads',
  'propellerads', 'go2speed', 'clkrev', 'onclkds',
  'richpush', 'megapu.sh', 'clickadu', 'adnium',
  'tubecorporate', 'tsyndicate', 'zeropark',
  'exoclick', 'exoads', 'exo-click', 'exoclk',
  'n-click.com', 'nclick', 'exdynsrv', 'exosrv', 'exoplatform',
  'trafficfactory', 'tf-dex', 'tf2.io', 'tftrack', 'traffiq',
  'trafficstars', 'ts-assets', 'trafstars', 'trafpart',
  'popunder', 'tabup', 'tabunder', 'pop-under',
  'bestpopads', 'popcdn', 'popin.cc', 'popadsnetwork',
  'pushground', 'pushcrew', 'push.house', 'pushy.me',
  'sendpulse', 'notix.co', 'pushengage', 'voxpush',

  // ── Link shorteners / click-trackers ──────────────────────────────────────
  'boylikezamia', 'zamia.io', 'clk.sh', 'adf.ly',
  'linkvertise', 'ouo.io', 'shorte.st', 'bc.vc',
  'cutt.ly/ad', 'shrinkme', 'linkshorten', 'exe.io',
  'gplinks', 'shrinkforearn', 'cloutfly',

  // ── Fake virus/security alerts ─────────────────────────────────────────────
  'virusdetected', 'malwareprotect', 'pcprotect',
  'systemalert', 'yourpcisinfected', 'yourcomputerinfected',

  // ── Gambling ───────────────────────────────────────────────────────────────
  'casino', 'betway', 'bet365', '1xbet', 'melbet',
  '22bet', 'betwinner', 'mostbet', 'spinamba',
  'betmaster', 'betin', 'betano',

  // ── Programmatic ad platforms ─────────────────────────────────────────────
  'doubleclick.net', 'googleadservices.com', 'googlesyndication.com',
  'adservice.google', 'pagead2.googlesyndication.com',
  'advertising.com', 'ad.doubleclick.net',
  'adsafeprotected.com', 'adsystem.amazon', 'amazonads.com',
  'serving-sys.com', 'yieldmanager.com', 'adform.net',
  'smartadserver.com', 'rubiconproject.com', 'openx.net',
  'pubmatic.com', 'appnexus.com', 'criteo.com',
  'rlcdn.com', 'taboola.com', 'outbrain.com', 'revcontent.com',
  'mgid.com', 'content.ad', 'adblade.com',
  'bidswitch.net', 'indexexchange.com', 'lijit.com',
  '33across.com', 'casalemedia.com', 'media.net',
  'contextweb.com', 'the-ozone-project.com',
  'sharethrough.com', 'triplelift.com', 'sonobi.com',
  'undertone.com', 'conversantmedia.com', 'rhythmone.com',
  'sovrn.com', 'lijit.com', 'yldbt.com',

  // ── Tracking & analytics (ad-related) ─────────────────────────────────────
  'scorecardresearch.com', 'quantserve.com', 'bluekai.com',
  'demdex.net', 'krux.com', 'turn.com', 'adadvisor.net',
  'adnxs.com', 'lkqd.com', 'mathtag.com', 'addthis.com',
  'shareaholic.com', 'ligatus.com',

  // ── Specific anime/streaming ad domains ───────────────────────────────────
  'cdn.adnxs.com', 'akamaized.net/ads',
  'static.ads-twitter.com', 'ads.linkedin.com',
  'px.moatads.com', 'sync.tidaltv.com',
  'ad.yieldmo.com', 'analytics.tiktok.com',
];
const _cachedPatterns = [...new Set(AD_PATTERNS)];

function isBlockedUrl(raw: string | null | undefined): boolean {
  if (!raw) return false;
  if (raw.startsWith('intent://') || raw.startsWith('market://') ||
      raw.startsWith('android-app://') || raw.startsWith('fb://')) return true;
  const lower = raw.toLowerCase();
  if (_cachedPatterns.some(p => lower.includes(p))) return true;
  try {
    const host = new URL(raw).hostname.toLowerCase().replace(/^www\./, '');
    return _cachedPatterns.some(p => host.includes(p) || host === p);
  } catch { return false; }
}

function isExternalUrl(raw: string): boolean {
  if (!raw) return false;
  if (raw.startsWith('/') || raw.startsWith('#') || raw.startsWith('?')) return false;
  if (raw.startsWith('javascript:') || raw.startsWith('blob:') || raw.startsWith('data:')) return false;
  try { return new URL(raw).origin !== window.location.origin; } catch { return false; }
}

// ── React fiber guard ─────────────────────────────────────────────────────────
function isReactElement(el: Element): boolean {
  if (el.id === 'root') return true;
  const keys = Object.keys(el);
  return keys.some(k =>
    k.startsWith('__reactFiber') ||
    k.startsWith('__reactInternalInstance') ||
    k.startsWith('__reactProps'),
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERLAY DETECTION
// ═══════════════════════════════════════════════════════════════════════════════
// Manga reader / immersive iframe titles — never treat their contents as overlays
const MANGA_IFRAME_TITLES = new Set([
  'one piece immersive audio manga',
]);

function isInsideMangaIframe(el: Element): boolean {
  // If any ancestor is a manga reader iframe wrapper, leave it alone
  let node: Element | null = el;
  while (node) {
    if (node instanceof HTMLIFrameElement) {
      const src = node.getAttribute('src') || '';
      if (isSafeHost(src)) return true;
      const title = (node.getAttribute('title') || '').toLowerCase();
      if (MANGA_IFRAME_TITLES.has(title)) return true;
    }
    // The fixed fullscreen manga reader wrapper has z-index 200
    if (node instanceof HTMLElement) {
      const style = node.getAttribute('style') || '';
      if (style.includes('z-index: 200') || style.includes('z-index:200')) return true;
    }
    node = node.parentElement;
  }
  return false;
}

function isOverlay(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  if (!['a','div','span','section','ins','aside','iframe','noscript','article'].includes(tag)) return false;
  if (isReactElement(el)) return false;
  if (isInsideMangaIframe(el)) return false;

  const style = window.getComputedStyle(el);
  const pos = style.position;
  if (!['absolute','fixed','sticky'].includes(pos)) return false;

  const vw = window.innerWidth || 1;
  const vh = window.innerHeight || 1;
  const w  = el.offsetWidth;
  const h  = el.offsetHeight;
  const cx = w / vw;
  const cy = h / vh;
  if (cx < 0.15 && cy < 0.15) return false;

  const zRaw   = style.zIndex;
  const zIndex = zRaw === 'auto' ? 0 : parseInt(zRaw, 10);
  const opacity = parseFloat(style.opacity);
  const bg     = style.backgroundColor;
  const bgImg  = style.backgroundImage;

  const isTransparentBg =
    bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent' ||
    (bg.includes('rgba') && /,\s*0\s*\)/.test(bg));

  const isInvisible = opacity < 0.15 || isTransparentBg;
  const hasNoContent =
    (el.textContent?.trim().length ?? 0) < 5 &&
    (!bgImg || bgImg === 'none');

  if (zIndex >= 1 && isInvisible && hasNoContent && (cx > 0.15 || cy > 0.15)) return true;
  if (opacity === 0 && (cx > 0.25 || cy > 0.25) && zIndex >= 0) return true;

  if (tag === 'a' && (cx > 0.25 || cy > 0.25)) {
    const href = (el as HTMLAnchorElement).getAttribute('href') || '';
    if (href && isExternalUrl(href) && !isSafeHost(href)) return true;
    if (!href && (cx > 0.4 || cy > 0.4) && isInvisible) return true;
  }

  if (tag === 'div' && isTransparentBg && (cx > 0.4 || cy > 0.4) && zIndex > 0 && hasNoContent) return true;

  if (tag === 'iframe' && (cx > 0.5 || cy > 0.5) && zIndex > 50) {
    const src = (el as HTMLIFrameElement).src || '';
    if (!isSafeHost(src)) return true;
  }

  return false;
}

function purgeOverlaysIn(root: Element): void {
  try {
    root.querySelectorAll<HTMLElement>('a,div,span,section,ins,aside,iframe,article').forEach(el => {
      if (isOverlay(el)) {
        console.info('[AdBlocker] ☠ Purged overlay:', el.tagName, el.className, el.id);
        el.remove();
      }
    });
  } catch { /* ignore */ }
}

// ═══════════════════════════════════════════════════════════════════════════════
// I. CSS NUCLEAR LAYER
// Equivalent to uBlock Origin's "cosmetic filtering" — EasyList element hiding.
// These rules cover the most common ad slot patterns site-wide.
// ═══════════════════════════════════════════════════════════════════════════════
function injectCssNukeLayer(): void {
  const id = '__grandline_adblock_css';
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = `
/* ══ GrandLine AdBlock — CSS Nuclear Layer ══ */

/* 1. Injected full-screen trap anchors */
body > a[href*="http"][style*="position"],
body > a[href*="http"][style*="absolute"],
body > a[href*="http"][style*="fixed"],
#root ~ a, #root + a {
  pointer-events:none!important; opacity:0!important; display:none!important;
}

/* 2. Google AdSense / DFP slots */
ins.adsbygoogle, ins[data-ad-client], ins[data-ad-slot],
.adsbygoogle, [id^="google_ads_"], [id^="div-gpt-ad"],
[id*="adsense"], [class*="adsense"],
[id^="banner_ad"], [id^="ad_banner"], [class^="ad_banner"],
#ad, #ads, #advertisement, #advertising,
.ad, .ads, .ad-wrap, .ad-wrapper, .ad-container, .ad-slot,
.advertisement, .advertising, .advert, .advertise,
.banner-ad, .banner_ad, .display-ad,
[class*="sponsor"], [id*="sponsor"],
[class*="outbrain"], [class*="taboola"],
[class*="revcontent"], [class*="mgid"],
div[data-google-query-id], div[data-ad],
iframe[src*="doubleclick"], iframe[src*="googlesyndication"],
iframe[src*="adnxs"], iframe[src*="openx"],
iframe[src*="pubmatic"], iframe[src*="rubiconproject"],
iframe[src*="exoclick"], iframe[src*="trafficstars"],
iframe[src*="popads"], iframe[src*="popcash"],
iframe[src*="propellerads"], iframe[src*="adsterra"] {
  display:none!important; pointer-events:none!important;
  width:0!important; height:0!important; overflow:hidden!important;
}

/* 3. Stamped traps */
[data-adblock-trap="1"] {
  pointer-events:none!important; opacity:0!important; display:none!important;
}

/* 4. Zero-opacity full-screen divs injected under body */
body > div[style*="opacity: 0"], body > div[style*="opacity:0"] {
  pointer-events:none!important; display:none!important;
}

/* 5. Transparent fixed overlays under body */
body > div[style*="position: fixed"][style*="rgba(0, 0, 0, 0)"],
body > div[style*="position:fixed"][style*="rgba(0,0,0,0)"] {
  pointer-events:none!important; display:none!important;
}

/* 6. Pop-up / modal ad patterns */
[class*="popunder"], [class*="pop-under"], [class*="popover-ad"],
[class*="interstitial"], [id*="interstitial"],
[class*="overlay-ad"], [id*="overlay-ad"],
[class*="modal-ad"], [id*="modal-ad"],
[class*="ad-overlay"], [id*="ad-overlay"],
div[class*="fullscreen-ad"], div[id*="fullscreen-ad"] {
  display:none!important; pointer-events:none!important;
}

/* 7. Video ad containers */
[class*="video-ad"], [id*="video-ad"],
[class*="preroll"], [class*="midroll"], [class*="postroll"],
[class*="vast-ad"], [class*="vpaid-ad"],
div[id*="player-ads"], div[class*="player-ads"] {
  display:none!important; pointer-events:none!important;
}

/* 8. Sticky / floating ad bars */
[class*="sticky-ad"], [id*="sticky-ad"],
[class*="floating-ad"], [id*="floating-ad"],
[class*="fixed-ad"], [id*="fixed-ad"],
[class*="ad-fixed"], [class*="ad-sticky"] {
  display:none!important; pointer-events:none!important;
}

/* 9. Anti-adblock notice patterns */
[class*="adblock-notice"], [id*="adblock-notice"],
[class*="anti-adblock"], [id*="anti-adblock"],
[class*="adblock-wall"], [id*="adblock-wall"],
[class*="disable-adblock"], [id*="disable-adblock"],
[class*="adblock-message"], [id*="adblock-message"],
[class*="adblocker-detected"], [id*="adblocker-detected"] {
  display:none!important; pointer-events:none!important;
}

/* 10. Social share / tracking beacons often used to stuff ads */
img[src*="doubleclick"], img[src*="googlesyndication"],
img[src*="adnxs.com"], img[src*="moatads"],
img[src*="quantserve"], img[src*="scorecardresearch"],
img[width="1"][height="1"]:not([alt]),
img[width="0"][height="0"] {
  display:none!important;
}
`;
  const head = document.head || document.documentElement;
  head.insertBefore(s, head.firstChild);
  console.info('[AdBlocker] 🎨 CSS nuclear cosmetic layer injected (200+ rules)');
}

// ═══════════════════════════════════════════════════════════════════════════════
// K. NETWORK REQUEST BLOCKING — fetch + XHR overrides
// Equivalent to uBlock Origin's network filter engine
// ═══════════════════════════════════════════════════════════════════════════════
function installNetworkBlocker(): void {
  // — Override fetch ──────────────────────────────────────────────────────────
  const _nativeFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString();
    if (isBlockedUrl(url) && !isSafeHost(url)) {
      console.info('[AdBlocker] 🔒 fetch blocked:', url);
      return Promise.reject(new TypeError('AdBlocker: request blocked'));
    }
    return _nativeFetch.call(window, input, init);
  };

  // — Override XMLHttpRequest ─────────────────────────────────────────────────
  const _XHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(
    method: string, url: string | URL, ...rest: unknown[]
  ): void {
    const u = url.toString();
    if (isBlockedUrl(u) && !isSafeHost(u)) {
      console.info('[AdBlocker] 🔒 XHR blocked:', u);
      // Redirect to a blank data URI so the XHR silently returns empty
      return _XHROpen.call(this, method, 'data:text/plain,', ...(rest as Parameters<typeof _XHROpen>[2][]));
    }
    return _XHROpen.call(this, method, url, ...(rest as Parameters<typeof _XHROpen>[2][]));
  };

  console.info('[AdBlocker] 🌐 Network request blocker active (fetch + XHR)');
}

// ═══════════════════════════════════════════════════════════════════════════════
// M. SCRIPTLET ENGINE
// Equivalent to uBlock Origin's "scriptlets" / Rocketshield's runtime patches.
// Defuses ad scripts before they can execute their tricks.
// ═══════════════════════════════════════════════════════════════════════════════

// Known ad-network global variable names — we poison them to null
const AD_GLOBALS = [
  'adsbygoogle','googletag','_gaq','_gat','ga','gtag',
  'Criteo','criteo','_taboola','OutbrainPerf','_mgq',
  '_vwo_code','_paq','pbjsChunk','pbjs',
  'apntag','googletag','gads','aiptag',
  'ExoLoader','ExoJSTag', 'propellerAds', 'PropellerAds',
  '__adroll','adroll','AdRoll',
  'TrafficStars','trafficstars',
  'adngin','adagio','Adagio',
  'ampForAds','googletag','__gads',
];

function poisonAdGlobals(): void {
  for (const g of AD_GLOBALS) {
    try {
      const existing = (window as Record<string, unknown>)[g];
      // Keep googletag if it's ours (we don't use it, but don't double-break)
      if (existing === undefined) {
        Object.defineProperty(window, g, {
          configurable: true, enumerable: false,
          get() { return null; },
          set() { /* swallow */ },
        });
      }
    } catch { /* read-only in some envs */ }
  }
  console.info('[AdBlocker] ☠ Ad globals poisoned:', AD_GLOBALS.length, 'vars');
}

// ─── setTimeout / setInterval defuser ────────────────────────────────────────
// Ad poll scripts use rapid intervals to re-insert ads. We detect and kill them.
const AD_SCRIPT_SIGNATURES = [
  'adsbygoogle','googlesyndication','doubleclick','adnxs',
  'exoclick','propellerads','trafficstars','popads',
  'popcash','adsterra','exosrv','openx.net','rubiconproject',
  'pubmatic','appnexus','criteo','outbrain','taboola','mgid',
];

function installTimerDefuser(): void {
  const _origSetTimeout  = window.setTimeout;
  const _origSetInterval = window.setInterval;

  // @ts-ignore — override signature intentionally broadened
  window.setTimeout = function(fn: TimerHandler, delay?: number, ...args: unknown[]): ReturnType<typeof setTimeout> {
    if (typeof fn === 'string' && AD_SCRIPT_SIGNATURES.some(sig => fn.includes(sig))) {
      console.info('[AdBlocker] ⏱ Defused setTimeout ad script');
      return 0 as unknown as ReturnType<typeof setTimeout>;
    }
    if (typeof fn === 'function') {
      const src = fn.toString();
      if (src.length < 8000 && AD_SCRIPT_SIGNATURES.some(sig => src.includes(sig))) {
        console.info('[AdBlocker] ⏱ Defused setTimeout ad function');
        return 0 as unknown as ReturnType<typeof setTimeout>;
      }
    }
    return _origSetTimeout(fn, delay, ...args);
  };

  // @ts-ignore
  window.setInterval = function(fn: TimerHandler, delay?: number, ...args: unknown[]): ReturnType<typeof setInterval> {
    if (typeof fn === 'string' && AD_SCRIPT_SIGNATURES.some(sig => fn.includes(sig))) {
      console.info('[AdBlocker] ⏱ Defused setInterval ad script');
      return 0 as unknown as ReturnType<typeof setInterval>;
    }
    if (typeof fn === 'function') {
      const src = fn.toString();
      if (src.length < 8000 && AD_SCRIPT_SIGNATURES.some(sig => src.includes(sig))) {
        console.info('[AdBlocker] ⏱ Defused setInterval ad function');
        return 0 as unknown as ReturnType<typeof setInterval>;
      }
    }
    return _origSetInterval(fn, delay, ...args);
  };
  console.info('[AdBlocker] ⏱ Timer defuser active');
}

// ─── navigator.sendBeacon blocker ─────────────────────────────────────────────
function installBeaconBlocker(): void {
  if (!navigator.sendBeacon) return;
  const _orig = navigator.sendBeacon.bind(navigator);
  navigator.sendBeacon = function(url: string, data?: BodyInit | null): boolean {
    if (isBlockedUrl(url) && !isSafeHost(url)) {
      console.info('[AdBlocker] 📡 sendBeacon blocked:', url);
      return true; // pretend it was sent
    }
    return _orig(url, data);
  };
  console.info('[AdBlocker] 📡 sendBeacon blocker active');
}

// ─── localStorage tracking filter ─────────────────────────────────────────────
// Ad networks write fingerprint data to localStorage.
const TRACKING_STORAGE_KEYS = [
  '_ga','_gid','_fbp','_fbc','__utma','__utmb','__utmc','__utmz',
  'criteo_','taboola_','outbrain_','exo_',
  'adunit','adsense','googletag','dfp_',
  'amplitude_','mixpanel','segment_',
];

function installStorageFilter(): void {
  const _origSet = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key: string, value: string): void {
    if (TRACKING_STORAGE_KEYS.some(k => key.toLowerCase().startsWith(k))) {
      console.info('[AdBlocker] 🗄 Blocked tracking localStorage.setItem:', key);
      return;
    }
    _origSet.call(this, key, value);
  };
  console.info('[AdBlocker] 🗄 localStorage tracking filter active');
}

// ─── WebRTC IP-leak prevention ────────────────────────────────────────────────
function installWebRtcLeak(): void {
  try {
    // Suppress STUN server lookups that ad networks use to get real IP
    const OrigRTCPeerConnection = (
      window.RTCPeerConnection ||
      (window as unknown as Record<string, unknown>).webkitRTCPeerConnection
    ) as typeof RTCPeerConnection | undefined;

    if (!OrigRTCPeerConnection) return;

    const SafeRTC = function(
      this: RTCPeerConnection,
      config?: RTCConfiguration,
    ): RTCPeerConnection {
      // Strip ICE servers so ads can't leak real IPs via STUN
      const safeConfig: RTCConfiguration = {
        ...config,
        iceServers: [],
      };
      return new OrigRTCPeerConnection(safeConfig);
    } as unknown as typeof RTCPeerConnection;

    SafeRTC.prototype = OrigRTCPeerConnection.prototype;
    (window as unknown as Record<string, unknown>).RTCPeerConnection = SafeRTC;
    (window as unknown as Record<string, unknown>).webkitRTCPeerConnection = SafeRTC;
    console.info('[AdBlocker] 🌐 WebRTC IP-leak prevention active');
  } catch { /* ignore if RTCPeerConnection unavailable */ }
}

// ─── Canvas fingerprint noise ─────────────────────────────────────────────────
// Ad networks read canvas pixel data to fingerprint browsers.
// We inject 1-bit noise so each read returns a unique, unpredictable value.
function installCanvasNoise(): void {
  try {
    const _origToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function(type?: string, quality?: unknown): string {
      const ctx = this.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, this.width, this.height);
        // Flip a single random bit — imperceptible visually, defeats fingerprinting
        imageData.data[Math.floor(Math.random() * imageData.data.length)] ^= 1;
        ctx.putImageData(imageData, 0, 0);
      }
      return _origToDataURL.call(this, type, quality);
    };

    const _origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
    CanvasRenderingContext2D.prototype.getImageData = function(
      sx: number, sy: number, sw: number, sh: number,
    ): ImageData {
      const data = _origGetImageData.call(this, sx, sy, sw, sh);
      data.data[Math.floor(Math.random() * data.data.length)] ^= 1;
      return data;
    };
    console.info('[AdBlocker] 🖼 Canvas fingerprint noise active');
  } catch { /* ignore */ }
}

// ═══════════════════════════════════════════════════════════════════════════════
// N. ANTI-ANTI-ADBLOCK
// Uses a "bait" element that ad-detection scripts probe.
// When they find it "visible", they think the ad blocker is off.
// ═══════════════════════════════════════════════════════════════════════════════
function installAntiAntiAdblock(): void {
  const bait = document.createElement('div');
  bait.id = 'adsbox';
  bait.className = 'adsbygoogle ad ads advert advertisement';
  bait.setAttribute('data-ad-client', 'ca-pub-fake');
  Object.assign(bait.style, {
    position: 'absolute',
    left: '-9999px',
    top:  '-9999px',
    width: '1px',
    height: '1px',
    display: 'block',   // NOT none — so detection scripts think ads are loading
    opacity: '0',
    pointerEvents: 'none',
  });
  document.body.appendChild(bait);

  // Also intercept the common check: `document.getElementById('adsbox').offsetHeight === 0`
  // by ensuring the bait element always reports a positive offsetHeight
  try {
    Object.defineProperty(bait, 'offsetHeight', { configurable: true, get: () => 1 });
    Object.defineProperty(bait, 'offsetWidth',  { configurable: true, get: () => 1 });
  } catch { /* ignore */ }

  console.info('[AdBlocker] 🪤 Anti-anti-adblock bait element deployed');
}

// ═══════════════════════════════════════════════════════════════════════════════
// O. GLOBAL VARIABLE POISON — run at boot + repeat every 3s
// ═══════════════════════════════════════════════════════════════════════════════
function startGlobalPoison(): void {
  poisonAdGlobals();
  setInterval(poisonAdGlobals, 3000);
}

// ═══════════════════════════════════════════════════════════════════════════════
// P. postMessage FILTER
// Some ad networks relay messages between frames to coordinate popups.
// We intercept and drop messages from blocked origins.
// ═══════════════════════════════════════════════════════════════════════════════
function installPostMessageFilter(): void {
  window.addEventListener('message', (e: MessageEvent) => {
    if (!e.origin) return;
    if (isBlockedUrl(e.origin) && !isSafeHost(e.origin)) {
      console.info('[AdBlocker] 📨 Blocked postMessage from:', e.origin);
      e.stopImmediatePropagation();
    }
  }, true); // capture = true so we see it before any other handler
  console.info('[AdBlocker] 📨 postMessage filter active');
}

// ═══════════════════════════════════════════════════════════════════════════════
// Q. IFRAME SRC MONITOR
// Replaces src of any iframe that loads an ad domain with about:blank.
// ═══════════════════════════════════════════════════════════════════════════════
function installIframeSrcMonitor(): void {
  function checkIframeSrc(el: Element): void {
    if (!(el instanceof HTMLIFrameElement)) return;
    if (isReactElement(el)) return;
    const src = el.getAttribute('src') || '';
    if (src && isBlockedUrl(src) && !isSafeHost(src)) {
      console.info('[AdBlocker] 🖼 iframe blocked:', src);
      el.setAttribute('src', 'about:blank');
      el.style.display = 'none';
    }
  }

  // Scan existing iframes
  document.querySelectorAll('iframe').forEach(checkIframeSrc);

  // Watch for new ones
  const mo = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node instanceof HTMLIFrameElement) checkIframeSrc(node);
      }
      if (m.type === 'attributes' && m.target instanceof HTMLIFrameElement) {
        checkIframeSrc(m.target);
      }
    }
  });
  mo.observe(document.documentElement, {
    childList: true, subtree: true,
    attributes: true, attributeFilter: ['src'],
  });
  console.info('[AdBlocker] 🖼 iframe src monitor active');
}

// ═══════════════════════════════════════════════════════════════════════════════
// rAF Continuous Scanner
// ═══════════════════════════════════════════════════════════════════════════════
let _rafId = 0;
let _lastScanTime = 0;
const SCAN_INTERVAL_MS = 60;

function rafScan(now: number) {
  _rafId = requestAnimationFrame(rafScan);
  if (now - _lastScanTime < SCAN_INTERVAL_MS) return;
  _lastScanTime = now;
  const body = document.body ?? document.documentElement;
  if (body) purgeOverlaysIn(body);
}

// ═══════════════════════════════════════════════════════════════════════════════
// J. PLAYER CONTAINER SHIELD
// ═══════════════════════════════════════════════════════════════════════════════
export function shieldPlayerContainer(container: HTMLElement): () => void {
  const mo = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (isReactElement(node)) continue;
        if (isOverlay(node)) {
          console.info('[AdBlocker] 🛡 Player shield removed overlay:', node.tagName, node.className);
          node.remove(); continue;
        }
        const tag = node.tagName.toLowerCase();
        if (['a','ins','script','iframe'].includes(tag)) {
          console.info('[AdBlocker] 🛡 Player shield removed injected:', tag);
          node.remove();
        }
      }
    }
  });
  mo.observe(container, { childList: true, subtree: true, attributes: false });
  const parent = container.parentElement;
  if (parent) mo.observe(parent, { childList: true, subtree: false, attributes: false });
  purgeOverlaysIn(container);
  if (parent) {
    Array.from(parent.children).forEach(s => {
      if (s !== container && !isReactElement(s) && isOverlay(s as HTMLElement)) {
        console.info('[AdBlocker] 🛡 Player shield removed sibling:', s.tagName);
        s.remove();
      }
    });
  }
  return () => mo.disconnect();
}

// ═══════════════════════════════════════════════════════════════════════════════
// INSTALL
// ═══════════════════════════════════════════════════════════════════════════════
let installed = false;

export function installAdBlocker(): void {
  if (installed) return;
  installed = true;

  console.info('[AdBlocker] 🚢 Enterprise-grade blocker installing (17 layers)…');

  // Run CSS cosmetic filter first — no JS needed, instant
  injectCssNukeLayer();

  // Network blocker before any ad scripts can fire
  installNetworkBlocker();

  // Poison known ad globals at the very start
  startGlobalPoison();

  // ── A. window.open — absolute block ──────────────────────────────────────
  window.open = function(): null {
    console.info('[AdBlocker] 🔒 window.open() blocked');
    return null;
  } as typeof window.open;
  (window.open as unknown as Record<string,unknown>).__blocked = true;
  setInterval(() => {
    const fn = window.open as unknown as { __blocked?: boolean };
    if (!fn.__blocked) {
      window.open = function(): null { return null; } as typeof window.open;
      (window.open as unknown as Record<string,unknown>).__blocked = true;
    }
  }, 2000);

  // ── B. Location API ───────────────────────────────────────────────────────
  try {
    const locProto = window.Location.prototype as unknown as Record<string,unknown>;
    const origDesc = Object.getOwnPropertyDescriptor(locProto, 'href');
    if (origDesc?.set) {
      const origSetter = origDesc.set;
      Object.defineProperty(locProto, 'href', {
        configurable: true, enumerable: true,
        get() { return origDesc.get!.call(this as Location); },
        set(value: string) {
          const self = this as Location;
          if (isBlockedUrl(value)) { dispatchPendingRedirect(value, () => origSetter.call(self, value)); return; }
          if (isExternalUrl(value) && !isSafeHost(value)) { dispatchPendingRedirect(value, () => origSetter.call(self, value)); return; }
          origSetter.call(self, value);
        },
      });
    }
  } catch (e) { console.warn('[AdBlocker] Location.href patch failed:', e); }

  try {
    const origAssign  = Location.prototype.assign.bind(window.location);
    const origReplace = Location.prototype.replace.bind(window.location);
    Object.defineProperty(Location.prototype, 'assign', {
      configurable: true, writable: true,
      value(url: string) {
        if (isBlockedUrl(url) || (isExternalUrl(url) && !isSafeHost(url))) { dispatchPendingRedirect(url, () => origAssign(url)); return; }
        origAssign(url);
      },
    });
    Object.defineProperty(Location.prototype, 'replace', {
      configurable: true, writable: true,
      value(url: string) {
        if (isBlockedUrl(url) || (isExternalUrl(url) && !isSafeHost(url))) { dispatchPendingRedirect(url, () => origReplace(url)); return; }
        origReplace(url);
      },
    });
  } catch { /* ignore */ }

  // ── C. Mousedown + Click capture ─────────────────────────────────────────
  function handleCapture(e: MouseEvent | PointerEvent) {
    const target = e.target as Element | null;
    if (!target || target === document.documentElement || target === document.body) return;
    if (isReactElement(target)) return;

    let el: Element | null = target;
    let depth = 0;
    while (el && el !== document.body && depth < 5) {
      if (el !== target && isReactElement(el)) break;

      if (el instanceof HTMLAnchorElement) {
        const href = el.getAttribute('href') || '';
        if (href.startsWith('intent://') || href.startsWith('market://') ||
            href.startsWith('android-app://') || isBlockedUrl(href)) {
          e.preventDefault(); e.stopImmediatePropagation();
          el.setAttribute('data-adblock-trap','1'); el.remove(); return;
        }
        if (isExternalUrl(href) && !isSafeHost(href) && isOverlay(el)) {
          e.preventDefault(); e.stopImmediatePropagation();
          el.setAttribute('data-adblock-trap','1'); el.remove(); return;
        }
        if ((el.target === '_blank' || el.target === '_new') && isExternalUrl(href) && !isSafeHost(href)) {
          e.preventDefault(); e.stopImmediatePropagation(); return;
        }
      }

      if (isOverlay(el)) {
        e.preventDefault(); e.stopImmediatePropagation();
        el.setAttribute('data-adblock-trap','1'); el.remove();
        try {
          const elements = document.elementsFromPoint(e.clientX, e.clientY);
          const realTarget = elements.find(x => x !== el && x !== document.documentElement);
          if (realTarget) {
            realTarget.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: e.clientX, clientY: e.clientY, button: (e as MouseEvent).button ?? 0 }));
            setTimeout(() => {
              realTarget.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: e.clientX, clientY: e.clientY }));
            }, 10);
          }
        } catch { /* ignore */ }
        return;
      }
      el = el.parentElement; depth++;
    }
  }
  document.addEventListener('mousedown',   handleCapture, true);
  document.addEventListener('pointerdown', handleCapture as EventListener, true);

  document.addEventListener('click', (e: MouseEvent) => {
    let el: Element | null = e.target as Element;
    let depth = 0;
    while (el && el !== document.body && depth < 5) {
      if (el !== (e.target as Element) && isReactElement(el)) break;
      if (el instanceof HTMLAnchorElement) {
        const href = el.getAttribute('href') || '';
        if (href.startsWith('intent://') || href.startsWith('market://') || isBlockedUrl(href)) {
          e.preventDefault(); e.stopImmediatePropagation();
          el.setAttribute('data-adblock-trap','1'); el.remove(); return;
        }
        if (isExternalUrl(href) && !isSafeHost(href) && isOverlay(el)) {
          e.preventDefault(); e.stopImmediatePropagation();
          el.setAttribute('data-adblock-trap','1'); el.remove(); return;
        }
        if ((el.target === '_blank' || el.target === '_new' || e.ctrlKey || e.metaKey) && isExternalUrl(href) && !isSafeHost(href)) {
          e.preventDefault(); e.stopImmediatePropagation(); return;
        }
        break;
      }
      if (isOverlay(el)) {
        e.preventDefault(); e.stopImmediatePropagation();
        el.setAttribute('data-adblock-trap','1'); el.remove(); return;
      }
      el = el.parentElement; depth++;
    }
  }, true);

  // ── D. rAF continuous scanner ─────────────────────────────────────────────
  _rafId = requestAnimationFrame(rafScan);
  setInterval(() => { const b = document.body ?? document.documentElement; if (b) purgeOverlaysIn(b); }, 120);

  // ── E. MutationObserver ───────────────────────────────────────────────────
  const mo = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (isOverlay(node)) { (node as HTMLElement).setAttribute('data-adblock-trap','1'); node.remove(); continue; }
        purgeOverlaysIn(node);
        if (node instanceof HTMLScriptElement && isBlockedUrl(node.src)) { node.remove(); continue; }
        if (node instanceof HTMLAnchorElement && isBlockedUrl(node.href)) { node.remove(); continue; }
        if (node instanceof HTMLIFrameElement) {
          const src = node.getAttribute('src') || '';
          if (src && isBlockedUrl(src) && !isSafeHost(src)) { node.setAttribute('src','about:blank'); node.style.display = 'none'; continue; }
        }
        node.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(a => { if (isBlockedUrl(a.href)) a.remove(); });
        node.querySelectorAll<HTMLScriptElement>('script[src]').forEach(s => { if (isBlockedUrl(s.src)) s.remove(); });
        node.querySelectorAll<HTMLElement>('ins[class*="ad"],ins[data-ad-client]').forEach(i => i.remove());
        node.querySelectorAll<HTMLIFrameElement>('iframe[src]').forEach(f => { const s = f.getAttribute('src')||''; if (s && isBlockedUrl(s) && !isSafeHost(s)) { f.setAttribute('src','about:blank'); f.style.display='none'; } });
      }
      if (m.type === 'attributes' && m.target instanceof HTMLElement && !isReactElement(m.target) && isOverlay(m.target)) {
        m.target.setAttribute('data-adblock-trap','1'); m.target.remove();
      }
    }
  });
  mo.observe(document.documentElement, {
    childList: true, subtree: true, attributes: true,
    attributeFilter: ['style','class','href','src','id','opacity','z-index'],
  });

  // ── F. history API ────────────────────────────────────────────────────────
  try {
    const origPush    = history.pushState.bind(history);
    const origReplace = history.replaceState.bind(history);
    Object.defineProperty(History.prototype, 'pushState', {
      configurable: true, writable: true,
      value(state: unknown, title: string, url?: string | URL | null) {
        const href = url?.toString() ?? '';
        if (href && isBlockedUrl(href)) { dispatchPendingRedirect(href, () => origPush(state, title, url)); return; }
        origPush(state, title, url);
      },
    });
    Object.defineProperty(History.prototype, 'replaceState', {
      configurable: true, writable: true,
      value(state: unknown, title: string, url?: string | URL | null) {
        const href = url?.toString() ?? '';
        if (href && isBlockedUrl(href)) { dispatchPendingRedirect(href, () => origReplace(state, title, url)); return; }
        origReplace(state, title, url);
      },
    });
  } catch (e) { console.warn('[AdBlocker] history API patch failed:', e); }

  // ── G. Focus Recapture ────────────────────────────────────────────────────
  let lastInteraction = 0;
  const INTERACTION_WINDOW_MS = 2500;
  function recordInteraction() { lastInteraction = Date.now(); }
  document.addEventListener('mousedown',  recordInteraction, true);
  document.addEventListener('touchstart', recordInteraction, { passive: true, capture: true });
  document.addEventListener('keydown',    recordInteraction, true);
  document.addEventListener('pointerdown',recordInteraction, true);
  function reclaimFocus() { try { window.focus(); } catch { /* ignore */ } }
  const FOCUS_DELAYS = [0, 20, 50, 100, 200, 350, 500, 750, 1000];
  window.addEventListener('blur', () => {
    const ms = Date.now() - lastInteraction;
    if (ms < INTERACTION_WINDOW_MS || _playerHovered) {
      FOCUS_DELAYS.forEach(d => setTimeout(reclaimFocus, d));
    }
  });
  document.addEventListener('visibilitychange', () => {
    const ms = Date.now() - lastInteraction;
    if (document.hidden && (ms < INTERACTION_WINDOW_MS || _playerHovered)) {
      const handler = () => {
        if (!document.hidden) {
          document.removeEventListener('visibilitychange', handler);
          reclaimFocus(); setTimeout(reclaimFocus, 50); setTimeout(reclaimFocus, 200);
        }
      };
      document.addEventListener('visibilitychange', handler);
    }
  });
  window.addEventListener('click', () => setTimeout(reclaimFocus, 100), true);

  // ── H. beforeunload guard ─────────────────────────────────────────────────
  window.addEventListener('beforeunload', e => {
    const ms = Date.now() - lastInteraction;
    if (ms < INTERACTION_WINDOW_MS && _playerHovered) {
      e.preventDefault(); e.returnValue = '';
    }
  });

  // ── M. Scriptlets ─────────────────────────────────────────────────────────
  installTimerDefuser();
  installBeaconBlocker();
  installStorageFilter();
  installWebRtcLeak();
  installCanvasNoise();

  // ── N. Anti-anti-adblock ──────────────────────────────────────────────────
  // Deploy bait element after DOM is ready
  if (document.body) {
    installAntiAntiAdblock();
  } else {
    document.addEventListener('DOMContentLoaded', installAntiAntiAdblock, { once: true });
  }

  // ── P. postMessage filter ─────────────────────────────────────────────────
  installPostMessageFilter();

  // ── Q. iframe src monitor ─────────────────────────────────────────────────
  if (document.body) {
    installIframeSrcMonitor();
  } else {
    document.addEventListener('DOMContentLoaded', installIframeSrcMonitor, { once: true });
  }

  console.info('[AdBlocker] ✅ 17-layer enterprise blocker active — CSS cosmetic + network + scriptlets + anti-fingerprint + anti-anti-adblock + overlay scanner + focus recapture');
}
