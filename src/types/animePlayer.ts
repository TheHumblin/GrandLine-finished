export type AnimeAudio = 'sub' | 'dub';
export type ZokoSource = 'mal' | 'anilist';

export interface AnimeAvailability {
  episodeNumber: number;
  subUrl: string | null;
  dubUrl: string | null;
  checkedAt: string;
}

export interface AnimePlayerProps {
  episodeNumber: number;
  nextEpisodeNumber?: number;
  onNextEpisode?: () => void;
}
