import { parseHTML } from 'https://esm.sh/linkedom@0.18.12';
import { fetchSource } from './fetchSource.ts';

const BASE = 'https://onepiecedevilfruits.com';
interface SourceFruit { slug: string; name: string; romanizedName: string; image: string; sourceUrl: string; type?: string; user?: string; description?: string; debutArc?: string; }
function asset(value: string | null): string {
  if (!value) return '';
  const url = new URL(value.replaceAll('&amp;', '&'), BASE);
  return url.protocol === 'https:' && ['cd-opf.pages.dev', 'onepiecedevilfruits.com'].includes(url.hostname) ? url.href : '';
}
export async function fruitCatalog(): Promise<SourceFruit[]> {
  const { document } = parseHTML(await fetchSource(BASE + '/'));
  const entries = new Map<string, SourceFruit>();
  document.querySelectorAll('a[href*="/fruit/"]').forEach(link => {
    const url = new URL(link.getAttribute('href') || '', BASE);
    if (url.origin !== BASE) return;
    const slug = url.pathname.match(/^\/fruit\/([a-z0-9-]+)\/?$/)?.[1];
    if (!slug) return;
    const container = link.closest('li') || link;
    const text = (container.textContent || '').replace(/\s+/g, ' ').trim();
    const romanizedNode = [...container.querySelectorAll('p,span')].filter(node => node.textContent?.includes('no Mi')).sort((a, b) => (a.textContent?.length || 0) - (b.textContent?.length || 0))[0];
    const romanizedText = romanizedNode?.textContent || text;
    const romanizedName = romanizedText.match(/[A-Z][A-Za-z -]+no Mi(?:[, :]+Model[: ]+[A-Za-z -]+)?/)?.[0]?.trim() || '';
    const name = (container.querySelector('strong,h2,h3')?.textContent || link.querySelector('strong,h2,h3')?.textContent || text.split(/[\u3040-\u30ff\u3400-\u9fff]/)[0]).trim();
    const img = container.querySelector('img');
    const image = asset(img?.getAttribute('data-src') || img?.getAttribute('src') || null);
    if (name) entries.set(slug, { slug, name, romanizedName, image, sourceUrl: url.href });
  });
  if (entries.size < 10) throw new Error('Devil Fruit source layout could not be read. The saved catalog remains available.');
  return [...entries.values()];
}
export async function fruitDetail(slug: string): Promise<SourceFruit> {
  const sourceUrl = `${BASE}/fruit/${slug}/`;
  const { document } = parseHTML(await fetchSource(sourceUrl));
  const main = document.querySelector('main') || document.body;
  const name = main.querySelector('h1')?.textContent?.trim();
  if (!name) throw new Error('Devil Fruit source detail was not found.');
  const text = (main.textContent || '').replace(/\s+/g, ' ');
  const field = (label: string) => {
    const terms = [...main.querySelectorAll('dt')];
    const term = terms.find(node => node.textContent?.trim().toLowerCase() === label);
    return term?.nextElementSibling?.textContent?.trim() || '';
  };
  const img = [...main.querySelectorAll('img')].find(node => (node.getAttribute('src') || node.getAttribute('data-src') || '').includes('/fruits/'));
  const heading = [...main.querySelectorAll('h2')].find(node => node.textContent?.startsWith('About'));
  const description = heading?.nextElementSibling?.textContent?.trim() || '';
  return { slug, sourceUrl, name, romanizedName: text.match(/[A-Z][A-Za-z -]+no Mi(?:[, :]+Model[: ]+[A-Za-z -]+)?/)?.[0]?.trim() || '', image: asset(img?.getAttribute('data-src') || img?.getAttribute('src') || document.querySelector('meta[property="og:image"]')?.getAttribute('content') || null), type: field('type'), user: field('user'), debutArc: field('debut arc'), description: description.slice(0, 3000) };
}
