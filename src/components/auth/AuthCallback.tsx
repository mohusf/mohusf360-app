import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  useEffect(() => {
    if (!supabase) return;
    // Supabase handles the OAuth callback automatically via URL hash
    // Just redirect to the app after processing
    supabase.auth.getSession().then(() => {
      window.location.href = '/';
    });
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--t2)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔐</div>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>Signing you in...</div>
      </div>
    </div>
  );
}
