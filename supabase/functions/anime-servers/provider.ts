const HIANIME_BASE = 'https://hianime.at';

export interface ProviderAvailability {
  subUrl: string | null;
  dubUrl: string | null;
}

export async function fetchProviderAvailability(episode: number): Promise<ProviderAvailability> {
  const response = await fetch(`${HIANIME_BASE}/api/theme/episode/servers?episodeId=${episode}`, {
    headers: { Accept: 'application/json', Referer: `${HIANIME_BASE}/watch/one-piece-1?ep=${episode}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`HiAnime: HTTP ${response.status}`);
  const payload: { status?: boolean; html?: string } = await response.json();
  if (payload.status !== true || typeof payload.html !== 'string') throw new Error('HiAnime: invalid server list');
  const html = payload.html;
  const notice = html.match(/You are watching[\s\S]*?Episode\s+(\d+)/i);
  if (!notice || Number(notice[1]) !== episode) throw new Error('HiAnime: episode mismatch');
  const result: ProviderAvailability = { subUrl: null, dubUrl: null };
  // Inspect one opening tag at a time: never pair one server's track with another's hash.
  for (const match of html.matchAll(/<(?:div|a|button)\b[^>]*\bdata-server-name\s*=[^>]*>/gi)) {
    const attrs: Record<string, string> = {};
    for (const attr of match[0].matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/gs)) attrs[attr[1].toLowerCase()] = attr[3];
    if (attrs['data-server-name']?.toLowerCase() !== 'zokoanime') continue;
    const audio = attrs['data-type'];
    if (audio !== 'sub' && audio !== 'dub') continue;
    const hash = attrs['data-hash'];
    if (!hash || !/^[A-Za-z0-9+/=]+$/.test(hash)) continue;
    const url = new URL(atob(hash));
    // Only return official One Piece embed URLs, not redirects, advertising or arbitrary upstream hosts.
    if (url.origin !== 'https://zokoanime.video' || url.pathname !== `/stream/mal/21/${episode}/${audio}`) continue;
    if (audio === 'sub') result.subUrl = url.href;
    else result.dubUrl = url.href;
  }
  if (!result.subUrl && !result.dubUrl) throw new Error('HiAnime: no ZokoAnime servers listed for this episode');
  console.log('[HiAnime] Episode', episode, 'sub:', !!result.subUrl, 'dub:', !!result.dubUrl);
  return result;
}
