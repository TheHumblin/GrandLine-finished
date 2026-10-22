import { useState } from 'react';
import { X, Mail, Lock, User, Shield, KeyRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
}

type Mode = 'login' | 'register' | 'verify';

export default function AuthModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingUsername, setPendingUsername] = useState('');
  const [pendingPassword, setPendingPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, sendOtp, verifyOtpAndSetPassword } = useAuth();

  if (!open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back, nakama!');
      onClose();
    } else {
      toast.error(result.error || 'Login failed.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const result = await sendOtp(email);
    setLoading(false);
    if (result.success) {
      setPendingEmail(email);
      setPendingUsername(username);
      setPendingPassword(password);
      toast.success('Verification code sent to your email!');
      setMode('verify');
    } else {
      toast.error(result.error || 'Registration failed.');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) { toast.error('Enter the 4-digit code from your email.'); return; }
    setLoading(true);
    const result = await verifyOtpAndSetPassword(pendingEmail, code, pendingPassword, pendingUsername);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome to the crew! Your pirate adventure begins!');
      onClose();
    } else {
      toast.error(result.error || 'Verification failed. Check the code and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold gold-text">
              {mode === 'login' ? 'Set Sail' : mode === 'register' ? 'Join the Crew' : 'Verify Your Identity'}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {mode === 'login' ? 'Sign in to your account'
                : mode === 'register' ? 'Create your pirate profile'
                : `Enter the 4-digit code sent to ${pendingEmail}`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                {loading ? 'Setting Sail...' : 'Set Sail!'}
              </button>
              <p className="text-center text-sm text-muted-foreground">
                New to the Grand Line?{' '}
                <button type="button" onClick={() => setMode('register')} className="text-primary hover:underline font-medium">Join the Crew</button>
              </p>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Pirate Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" required value={username} onChange={e => setUsername(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Straw Hat Luffy" minLength={3} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Min. 6 characters" minLength={6} />
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-primary/10 border border-primary/20 rounded-lg p-3">
                <Mail size={12} className="shrink-0 mt-0.5 text-primary" />
                <span>A real 4-digit verification code will be sent to your email address.</span>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
              <p className="text-center text-sm text-muted-foreground">
                Already a crew member?{' '}
                <button type="button" onClick={() => setMode('login')} className="text-primary hover:underline font-medium">Sign In</button>
              </p>
            </form>
          )}

          {mode === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-3">
                  <KeyRound size={24} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Check your email at <strong className="text-foreground">{pendingEmail}</strong> for a 4-digit code.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 text-center">Verification Code</label>
                <input type="text" required value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full px-4 py-4 rounded-lg bg-input border border-border text-foreground text-center text-3xl tracking-[0.6em] font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="0000" maxLength={4} />
              </div>
              <button type="submit" disabled={loading || code.length !== 4}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                {loading ? 'Verifying...' : 'Verify & Join Crew!'}
              </button>
              <button type="button" onClick={() => setMode('register')}
                className="w-full text-sm text-muted-foreground hover:text-foreground text-center">
                Back to registration
              </button>
            </form>
          )}
        </div>

        {/* Bounty system notice */}
        <div className="px-6 pb-5">
          <div className="text-xs text-muted-foreground text-center border-t border-border pt-4">
            Earn bounty: +1M per episode · +5M per movie · +2M per special or OVA · +100K per manga chapter
          </div>
        </div>
      </div>
    </div>
  );
}
