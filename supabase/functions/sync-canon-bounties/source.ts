import { parseHTML } from 'https://esm.sh/linkedom@0.18.12';

export interface CanonSource { key: string; name: string; }
export const CANON_SOURCES: CanonSource[] = [
  { key: 'Gol_D._Roger', name: 'Gol D. Roger' },
  { key: 'Edward_Newgate', name: 'Edward Newgate' },
  { key: 'Kaidou', name: 'Kaido' },
  { key: 'Charlotte_Linlin', name: 'Charlotte Linlin' },
  { key: 'Shanks', name: 'Shanks' },
  { key: 'Marshall_D._Teach', name: 'Marshall D. Teach' },
  { key: 'Monkey_D._Luffy', name: 'Monkey D. Luffy' },
  { key: 'Trafalgar_D._Water_Law', name: 'Trafalgar D. Law' },
  { key: 'Eustass_Kid', name: 'Eustass Kid' },
  { key: 'Roronoa_Zoro', name: 'Roronoa Zoro' },
];

export function extractCanonBounty(html: string): number {
  const { document } = parseHTML(html);
  const value = document.querySelector('[data-source="bounty"] .pi-data-value');
  if (!value) throw new Error('One Piece Wiki: bounty infobox was not found.');
  value.querySelectorAll('sup').forEach(node => node.remove());
  // First infobox value is the current/last canon bounty; never pick another character's amount or a historic maximum.
  const match = value.textContent?.match(/\b[1-9]\d{0,2}(?:,\d{3}){2,}\b/);
  const bounty = match ? Number(match[0].replaceAll(',', '')) : 0;
  if (!Number.isSafeInteger(bounty) || bounty < 1_000_000 || bounty > 20_000_000_000) throw new Error('One Piece Wiki: bounty format could not be verified.');
  return bounty;
}

export async function fetchCanonBounty(key: string): Promise<number> {
  const response = await fetch(`https://onepiece.fandom.com/wiki/${encodeURIComponent(key)}?action=render`, {
    headers: { Accept: 'text/html', 'User-Agent': 'GrandLineCanonChecker/1.0' },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`One Piece Wiki: HTTP ${response.status}`);
  return extractCanonBounty(await response.text());
}
