import { useState } from 'react';
import { useStore } from '../../store/appStore';
import { fd } from '../../lib/projections';
import Modal from '../layout/Modal';
import EmptyState from '../shared/EmptyState';

const WORKOUT_TYPES = [
  { label: '\u{1F3C3} Run', value: 'Run' },
  { label: '\u{1F3CB}\uFE0F Lift', value: 'Lift' },
  { label: '\u{1F9D8} Yoga', value: 'Yoga' },
  { label: '\u26A1 HIIT', value: 'HIIT' },
  { label: '\u{1F3CA} Swim', value: 'Swim' },
];

export default function WorkoutsDetail() {
  const { workouts, addWorkout, setCurDom } = useStore();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState('Run');
  const [details, setDetails] = useState('');
  const [duration, setDuration] = useState('');

  const save = () => {
    addWorkout({
      id: Date.now(),
      dt: new Date().toISOString().slice(0, 10),
      tp: type,
      de: details,
      mt: duration,
    });
    setType('Run'); setDetails(''); setDuration('');
    setOpen(false);
  };

  return (
    <>
      <button className="lback" onClick={() => setCurDom(null)}>{'\u2190'} Track</button>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{'\u{1F3CB}\uFE0F'} Workouts</h2>

      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button className="sl" onClick={() => setOpen(true)}>+ Log</button>
      </div>

      {workouts.length === 0 ? (
        <EmptyState emoji="\u{1F3CB}\uFE0F" title="No workouts" subtitle="Log your first." cta="Log" onAction={() => setOpen(true)} />
      ) : (
        <div className="cd">
          {workouts.map(w => (
            <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(52,211,153,.1)', display: 'grid', placeItems: 'center', fontSize: '14px' }}>
                {'\u{1F4AA}'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>
                  {w.tp}{w.de ? ' \u2014 ' + w.de : ''}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--t3)' }}>
                  {w.mt || ''} {'\u00B7'} {fd(w.dt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} title="Log Workout" onClose={() => setOpen(false)} onSave={save}>
        <div className="fg">
          <label className="fl">Type</label>
          <div className="chips">
            {WORKOUT_TYPES.map(t => (
              <button key={t.value} className={`chip ${type === t.value ? 'on' : ''}`} onClick={() => setType(t.value)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="fg">
          <input className="fi" placeholder="Details" value={details} onChange={e => setDetails(e.target.value)} autoFocus />
        </div>
        <div className="fg">
          <input className="fi" placeholder="Duration" value={duration} onChange={e => setDuration(e.target.value)} />
        </div>
      </Modal>
    </>
  );
}
