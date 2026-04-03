import { useState } from 'react';
import { useStore } from '../../store/appStore';
import Modal from '../layout/Modal';
import type { HealthKey } from '../../types';

const HEALTH_META: Record<HealthKey, { emoji: string; label: string }> = {
  sleep: { emoji: '\u{1F319}', label: 'Sleep' },
  steps: { emoji: '\u{1F45F}', label: 'Steps' },
  water: { emoji: '\u{1F4A7}', label: 'Water' },
  calories: { emoji: '\u{1F525}', label: 'Calories' },
};

const KEYS: HealthKey[] = ['sleep', 'steps', 'water', 'calories'];

export default function HealthDetail() {
  const { health, updateHealth, setCurDom } = useStore();

  const [editing, setEditing] = useState<HealthKey | null>(null);
  const [value, setValue] = useState('');

  const openEdit = (key: HealthKey) => {
    setEditing(key);
    setValue('');
  };

  const save = () => {
    if (editing === null) return;
    const v = parseFloat(value);
    if (isNaN(v)) return;
    updateHealth(editing, v);
    setEditing(null);
    setValue('');
  };

  return (
    <>
      <button className="lback" onClick={() => setCurDom(null)}>{'\u2190'} Track</button>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{'\u{1F4AA}'} Health</h2>

      <div className="hgrid">
        {KEYS.map(key => {
          const m = health[key];
          const meta = HEALTH_META[key];
          const pct = m.g && m.v ? Math.min(100, Math.round(m.v / m.g * 100)) : 0;
          return (
            <div key={key} className="hcard" onClick={() => openEdit(key)}>
              <div className="em">{meta.emoji}</div>
              <div className="v">
                {m.v >= 1000 ? m.v.toLocaleString() : m.v || '\u2014'}{' '}
                <span className="u">{m.u}</span>
              </div>
              <div className="l">
                {meta.label}{m.g && m.v ? ' \u00B7 ' + pct + '%' : ''}
              </div>
              {m.g && (
                <div className="hbar">
                  <div className="fill" style={{ width: `${pct}%`, background: 'var(--g)' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 7-day trends (simple bar representation) */}
      {KEYS.some(k => health[k].h.length > 1) && (
        <div className="cd" style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>7-Day Trends</div>
          {KEYS.map(key => {
            const data = health[key].h.slice(-7);
            if (data.length < 2) return null;
            const max = Math.max(...data, 1);
            return (
              <div key={key} style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '4px' }}>
                  {HEALTH_META[key].emoji} {HEALTH_META[key].label}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '40px' }}>
                  {data.map((v, i) => (
                    <div key={i} style={{
                      flex: 1,
                      height: `${Math.max(8, (v / max) * 100)}%`,
                      background: 'var(--ac)',
                      borderRadius: '3px',
                      opacity: 0.7,
                    }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={editing !== null}
        title="Update"
        subtitle={editing ? HEALTH_META[editing].label : ''}
        onClose={() => setEditing(null)}
        onSave={save}
      >
        {editing && (
          <>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ fontSize: '36px', marginBottom: '4px' }}>{HEALTH_META[editing].emoji}</div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>{HEALTH_META[editing].label}</div>
              <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '3px' }}>
                Current: {health[editing]?.v || 0} {health[editing]?.u || ''}
              </div>
            </div>
            <div className="fg">
              <input
                className="fi"
                type="number"
                step={0.1}
                placeholder="New value"
                value={value}
                onChange={e => setValue(e.target.value)}
                autoFocus
                style={{ fontSize: '24px', textAlign: 'center', fontWeight: 700, padding: '16px' }}
              />
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
