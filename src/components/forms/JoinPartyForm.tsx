import { useEffect } from 'react';
import { UserPlus, ArrowRight, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roomCodeSchema } from '@/lib/partyValidations';
import { normalizeRoomCode } from '@/lib/watchParty';
import type { SendPartyCommand } from '@/types/watchParty';

interface JoinPartyFormProps { invitation?: string | null; signedIn: boolean; busy: boolean; onSignIn: () => void; onCommand: SendPartyCommand; }
interface JoinPartyFields { code: string; }
export default function JoinPartyForm({ invitation, signedIn, busy, onSignIn, onCommand }: JoinPartyFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<JoinPartyFields>({ resolver: zodResolver(roomCodeSchema), defaultValues: { code: invitation || '' } });
  useEffect(() => { if (invitation) setValue('code', invitation.toUpperCase()); }, [invitation, setValue]);
  return <form onSubmit={handleSubmit(values => onCommand({ action: 'join', payload: { ...values } }))} className="border-t border-border bg-muted/20 p-6 sm:p-8 lg:border-l lg:border-t-0">
    <UserPlus size={24} className="mb-4 text-primary" /><h2 className="text-xl font-semibold text-foreground">Already have an invite?</h2>
    <p className="mb-6 mt-3 text-base leading-relaxed text-muted-foreground">Your captain saved you a seat. Enter their code or paste an invitation link.</p>
    <label htmlFor="party-code" className="mb-2 block text-base font-medium">Invitation code</label>
    <input id="party-code" {...register('code')} autoComplete="off" spellCheck={false} placeholder="A1B2C3D4" maxLength={200} className="party-input font-mono uppercase tracking-[0.2em]" aria-invalid={!!errors.code} onPaste={event => {
      event.preventDefault(); setValue('code', normalizeRoomCode(event.clipboardData.getData('text')), { shouldValidate: true });
    }} />
    {errors.code && <p role="alert" className="mt-2 flex gap-2 text-sm text-destructive"><AlertCircle size={16} />{errors.code.message}</p>}
    <button type={signedIn ? 'submit' : 'button'} onClick={signedIn ? undefined : onSignIn} disabled={busy || (signedIn && !watch('code').trim())} className="party-secondary mt-4 w-full">{busy ? 'Connecting…' : signedIn ? 'Join the crew' : 'Sign in to join'}<ArrowRight size={16} /></button>
    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Room codes are private. Share only with the people you want aboard.</p>
  </form>;
}
