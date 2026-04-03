import { useState } from 'react';
import { useStore } from '../../store/appStore';
import Modal from '../layout/Modal';
import EmptyState from '../shared/EmptyState';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#f87171'];

export default function HabitsDetail() {
  const { habits, addHabit, toggleHabitDay, setCurDom } = useStore();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  const di = (new Date().getDay() + 6) % 7; // Monday-indexed

  const save = () => {
    if (!name.trim()) return;
    addHabit({ n: name.trim(), s: 0, best: 0, w: [0, 0, 0, 0, 0, 0, 0], c: color });
    setName('');
    setColor(COLORS[0]);
    setOpen(false);
  };

  return (
    <>
      <button className="lback" onClick={() => setCurDom(null)}>{'\u2190'} Track</button>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{'\u{1F525}'} Habits</h2>

      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button className="sl" onClick={() => setOpen(true)}>+ New</button>
      </div>

      {habits.length === 0 ? (
        <EmptyState emoji="\u{1F525}" title="No habits" subtitle="Start with one." cta="Add Habit" onAction={() => setOpen(true)} />
      ) : (
        <div className="cd">
          {habits.map((hab, hi) => (
            <div key={hi} className="hrow">
              <div
                className={`hck ${hab.w[di] ? 'on' : ''}`}
                style={hab.w[di] ? { background: hab.c } : {}}
                onClick={() => toggleHabitDay(hi, di)}
                role="checkbox"
                aria-checked={!!hab.w[di]}
                tabIndex={0}
              />
              <div className="hinfo">
                <div className="n">{hab.n}</div>
                <div className="s">
                  {hab.s > 0 ? '\u{1F525} ' + hab.s + ' days' : 'No streak'}
                  {hab.best > 0 ? ' \u00B7 Best: ' + hab.best : ''}
                </div>
              </div>
              <div className="hdots">
                {hab.w.map((d, di2) => (
                  <div
                    key={di2}
                    className={`hd ${d ? 'on' : ''}`}
                    style={d ? { background: hab.c } : {}}
                    onClick={() => toggleHabitDay(hi, di2)}
                    role="checkbox"
                    aria-checked={!!d}
                    tabIndex={0}
                  >
                    {d ? '\u2713' : DAYS[di2]}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} title="New Habit" onClose={() => setOpen(false)} onSave={save}>
        <div className="fg">
          <input className="fi" placeholder="Habit name" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </div>
        <div className="fg">
          <label className="fl">Color</label>
          <div className="chips">
            {COLORS.map(c => (
              <button
                key={c}
                className={`chip ${color === c ? 'on' : ''}`}
                onClick={() => setColor(c)}
                style={{ background: c + '20', borderColor: c, color: c }}
              >
                {'\u25CF'}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
