export async function fetchSource(url: string): Promise<string> {
  const response = await fetch(url, { headers: { Accept: 'text/html', 'User-Agent': 'GrandLineEncyclopedia/1.0' }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Encyclopedia source returned HTTP ${response.status}. Please retry later.`);
  return response.text();
}
