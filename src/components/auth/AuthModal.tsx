import { useState } from 'react';
import { toast } from '../layout/Toast';
import { isSupabaseConfigured } from '../../lib/supabase';

interface Props {
  open: boolean;
  onClose: () => void;
  onAuth: () => void;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
}

export default function AuthModal({ open, onClose, onAuth, signUp, signIn, signInWithGoogle }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) { toast('Please fill all fields'); return; }
    if (password.length < 6) { toast('Password must be 6+ characters'); return; }
    if (!isSupabaseConfigured()) { toast('Backend not configured yet'); return; }

    setLoading(true);
    const { error } = mode === 'signup'
      ? await signUp(email, password)
      : await signIn(email, password);
    setLoading(false);

    if (error) { toast(error); return; }
    if (mode === 'signup') { toast('Check your email to verify your account'); }
    else { onAuth(); }
    onClose();
  };

  const handleGoogle = async () => {
    if (!isSupabaseConfigured()) { toast('Backend not configured yet'); return; }
    const { error } = await signInWithGoogle();
    if (error) toast(error);
  };

  return (
    <>
      <div className="ov on" onClick={onClose} />
      <div className="mdl on" role="dialog" aria-modal="true">
        <div className="bar" />
        <h3>{mode === 'signin' ? 'Sign In' : 'Create Account'}</h3>
        <div className="sub">{mode === 'signin' ? 'Access your data across devices' : 'Start your 360 journey'}</div>

        <button
          onClick={handleGoogle}
          style={{
            width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--s4)',
            background: 'var(--s3)', color: 'var(--t1)', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px', marginBottom: '14px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '10px 0 14px', color: 'var(--t3)', fontSize: '11px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--s4)' }} />
          <span>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--s4)' }} />
        </div>

        <div className="fg">
          <label className="fl">Email</label>
          <input className="fi" type="email" placeholder="you@example.com" value={email}
            onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <div className="fg">
          <label className="fl">Password</label>
          <input className="fi" type="password" placeholder="6+ characters" value={password}
            onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        <button className="btn btn-p" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>

        <button className="btn btn-g" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>

        <button className="btn btn-g" onClick={onClose} style={{ fontSize: '13px' }}>
          Continue without account
        </button>
      </div>
    </>
  );
}
