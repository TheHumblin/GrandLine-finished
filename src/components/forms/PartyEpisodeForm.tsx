import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SkipForward, AlertCircle } from 'lucide-react';
import { episodeSchema } from '@/lib/partyValidations';
import type { SendPartyCommand } from '@/types/watchParty';

interface PartyEpisodeFormProps { episode: number; total: number; disabled: boolean; onCommand: SendPartyCommand; }
interface EpisodeFields { episode: number; }
export default function PartyEpisodeForm({ episode, total, disabled, onCommand }: PartyEpisodeFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EpisodeFields>({ resolver: zodResolver(episodeSchema(total)), defaultValues: { episode } });
  useEffect(() => { reset({ episode }); }, [episode, reset]);
  return <form onSubmit={handleSubmit(values => onCommand({ action: 'episode', payload: { ...values } }))} className="space-y-2">
    <label htmlFor="captain-episode" className="block text-sm font-medium text-muted-foreground">Episode selection · 1–{total.toLocaleString()}</label>
    <div className="flex flex-wrap gap-2"><input id="captain-episode" type="number" min={1} max={total} disabled={disabled} {...register('episode', { valueAsNumber: true })} className="party-input !w-24" aria-invalid={!!errors.episode} /><button type="submit" disabled={disabled} className="party-secondary">Load episode</button><button type="button" disabled={disabled || episode >= total} onClick={() => void onCommand({ action: 'episode', payload: { episode: episode + 1 } })} className="party-secondary"><SkipForward size={16} />Next</button></div>
    {errors.episode && <p role="alert" className="flex gap-2 text-sm text-destructive"><AlertCircle size={16} />{errors.episode.message}</p>}
  </form>;
}
