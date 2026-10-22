import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('../src/pages/LiveAction.tsx', import.meta.url), 'utf8');
describe('Live action Server 1', () => {
  it('retains only the original Server 2 endpoint, labelled Server 1', () => {
    expect(source).toContain("label: 'Server 1'");
    expect(source).toContain('https://www.2embed.cc/embedtv/${TMDB_ID}&s=${s}&e=${e}');
    expect(source).not.toMatch(/label: 'Server [2-9]'/);
    expect(source).not.toMatch(/https:\/\/(?:vidsrc|vidlink|embed\.su|player\.autoembed)/);
  });
  it('defaults episode selections to the retained provider', () => {
    expect(source).toContain("useState<ServerKey>('twoembed')");
    expect(source).toContain("setActiveServer('twoembed')");
    expect(source).toContain('updateLiveActionProgress(ep.id)');
  });
});
