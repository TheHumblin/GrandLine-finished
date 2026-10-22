import { Lock } from 'lucide-react';
import ArtworkDialog from '@/components/features/ArtworkDialog';
interface RaceArtworkViewerProps { src: string; name: string; protectedArtwork: boolean; unlockEpisode?: number; }
export default function RaceArtworkViewer({ src, name, protectedArtwork, unlockEpisode }: RaceArtworkViewerProps) {
  if (protectedArtwork) return <p className="flex items-start gap-2 text-base leading-relaxed text-foreground"><Lock size={18} className="mt-1 shrink-0 text-primary" aria-hidden="true" />{unlockEpisode ? `Full artwork unlocks after Ep. ${unlockEpisode.toLocaleString()}. Its text and characters include later story details.` : 'This sheet stays protected until its anime reveal checkpoint is established.'}</p>;
  if (!src) return <p className="text-base leading-relaxed text-foreground">The source has no matched infographic for this entry. No unrelated character image is substituted.</p>;
  return <ArtworkDialog src={src} name={name} />;
}
