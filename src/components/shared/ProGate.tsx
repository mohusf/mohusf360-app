import type { ReactNode } from 'react';

interface Props {
  isPro: boolean;
  children: ReactNode;
  feature?: string;
  onUpgrade?: () => void;
}

export default function ProGate({ isPro, children, feature, onUpgrade }: Props) {
  if (isPro) return <>{children}</>;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ filter: 'blur(3px)', opacity: 0.4, pointerEvents: 'none' }}>
        {children}
      </div>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '8px',
      }}>
        <div style={{ fontSize: '24px' }}>🔒</div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t1)' }}>
          {feature || 'Pro Feature'}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--t3)', textAlign: 'center', maxWidth: '200px' }}>
          Upgrade to Pro for cloud sync, multi-device access, and data export.
        </div>
        {onUpgrade && (
          <button
            onClick={onUpgrade}
            style={{
              padding: '8px 20px', borderRadius: '10px', background: 'var(--ac)',
              color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', marginTop: '4px',
            }}
          >
            Upgrade to Pro
          </button>
        )}
      </div>
    </div>
  );
}
