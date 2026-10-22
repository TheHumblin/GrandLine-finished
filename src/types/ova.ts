export interface OVA {
  id: number;
  title: string;
  thumbnail: string;
  synopsis: string;
  duration: string;
  context: string;
}

export interface OVAEpisodeSource {
  number: number;
  label: string;
  hianimeUrl: string;
  sub: string;
  dub: string | null;
}
