import { useStore } from '../../store/appStore';
import { calcLifeScore } from '../../lib/lifeScore';
import type { User } from '@supabase/supabase-js';

interface Props {
  user?: User | null;
  subscription?: { isPro: boolean; plan: string; status: string; willCancel: boolean; expiresAt: string | null };
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export default function MeView({ user, subscription, onSignIn, onSignOut }: Props) {
  const state = useStore();
  const { goals, loadDemo, resetAll } = state;
  const sc = calcLifeScore(state);

  let daysSinceExport = 999;
  try {
    const lastExp = parseInt(localStorage.getItem('m360_lastExport') || '0');
    if (lastExp) daysSinceExport = Math.floor((Date.now() - lastExp) / 864e5);
  } catch { /* ignore */ }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mohusf360-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    try { localStorage.setItem('m360_lastExport', Date.now().toString()); } catch { /* ignore */ }
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          state.importData?.(data);
        } catch { /* invalid */ }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <>
      <div className="sec" style={{ textAlign: 'center', paddingTop: '18px' }}>
        <div className="av" style={{ width: '60px', height: '60px', fontSize: '22px', margin: '0 auto 8px' }}>
          {user?.email?.[0]?.toUpperCase() || 'M'}
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{user?.email?.split('@')[0] || 'mohusf'}</h2>
        <p style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '3px' }}>
          {user ? user.email : 'Complete Life Operating System'}
        </p>
      </div>

      <div className="sec">
        {/* Auth */}
        {!user ? (
          <div className="mei" onClick={onSignIn}>
            <div className="ic">🔐</div>
            <div className="info">
              <div className="nm">Sign In</div>
              <div className="desc">Sync across devices with Pro</div>
            </div>
          </div>
        ) : (
          <>
            {/* Subscription Status */}
            <div className="mei">
              <div className="ic">{subscription?.isPro ? '⭐' : '🆓'}</div>
              <div className="info">
                <div className="nm">{subscription?.isPro ? 'Pro' : 'Free'} Plan</div>
                <div className="desc" style={{ color: subscription?.isPro ? 'var(--g)' : 'var(--t3)' }}>
                  {subscription?.isPro
                    ? `${subscription.plan === 'pro_yearly' ? 'Yearly' : 'Monthly'}${subscription.willCancel ? ' (cancels at period end)' : ''}`
                    : 'Upgrade for cloud sync & export'}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Backup Reminder */}
        {daysSinceExport >= 30 && (
          <div className="alrt w" style={{ cursor: 'pointer' }} onClick={exportData}>
            <div className="ic">⚠️</div>
            <div className="tx">
              <strong>Backup reminder:</strong> {daysSinceExport < 999 ? daysSinceExport + ' days since last export' : 'Never exported'}. Tap to download a backup now.
            </div>
          </div>
        )}

        {/* Life Score */}
        <div className="mei">
          <div className="ic">📊</div>
          <div className="info">
            <div className="nm">Life Score</div>
            <div className="desc" style={{ color: sc.total >= 70 ? 'var(--g)' : sc.total >= 40 ? 'var(--am)' : 'var(--r)' }}>
              <strong>{sc.total}/100</strong>
            </div>
          </div>
        </div>

        <div className="mei" onClick={() => state.setCurDom('goals')}>
          <div className="ic">🎯</div>
          <div className="info"><div className="nm">Goals</div><div className="desc">{goals.length} active</div></div>
        </div>

        <div className="mei" onClick={exportData}>
          <div className="ic">💾</div>
          <div className="info"><div className="nm">Export Backup</div><div className="desc">Download data</div></div>
        </div>

        <div className="mei" onClick={importData}>
          <div className="ic">📂</div>
          <div className="info"><div className="nm">Restore Backup</div><div className="desc">Import data</div></div>
        </div>

        <div className="mei" onClick={loadDemo}>
          <div className="ic">📦</div>
          <div className="info"><div className="nm">Load Demo</div><div className="desc">Sample data</div></div>
        </div>

        <div className="mei" style={{ borderColor: 'rgba(248,113,113,.12)' }} onClick={resetAll}>
          <div className="ic" style={{ background: 'rgba(248,113,113,.08)' }}>🗑️</div>
          <div className="info"><div className="nm" style={{ color: 'var(--r)' }}>Reset</div><div className="desc">Start fresh</div></div>
        </div>

        {user && (
          <div className="mei" onClick={onSignOut} style={{ borderColor: 'rgba(248,113,113,.12)' }}>
            <div className="ic" style={{ background: 'rgba(248,113,113,.08)' }}>🚪</div>
            <div className="info"><div className="nm" style={{ color: 'var(--r)' }}>Sign Out</div><div className="desc">{user.email}</div></div>
          </div>
        )}

        <div style={{ textAlign: 'center', padding: '20px 0', fontSize: '11px', color: 'var(--t4)' }}>
          mohusf 360 · v13 · Complete Life OS
        </div>
      </div>
    </>
  );
}
