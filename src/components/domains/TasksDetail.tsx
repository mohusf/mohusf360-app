import { useState } from 'react';
import { useStore } from '../../store/appStore';
import { fd } from '../../lib/projections';
import Modal from '../layout/Modal';
import EmptyState from '../shared/EmptyState';

export default function TasksDetail() {
  const { tasks, addTask, toggleTask, deleteTask, setCurDom } = useStore();

  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [pri, setPri] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const save = () => {
    if (!text.trim()) return;
    addTask({ id: Date.now(), t: text.trim(), pri, done: false, dt: new Date().toISOString().slice(0, 10) });
    setText('');
    setPri('Medium');
    setOpen(false);
  };

  const PRIS: Array<{ label: string; value: 'High' | 'Medium' | 'Low'; color: string }> = [
    { label: '\u{1F534} High', value: 'High', color: '#f87171' },
    { label: '\u{1F7E1} Medium', value: 'Medium', color: '#fbbf24' },
    { label: '\u{1F7E2} Low', value: 'Low', color: '#34d399' },
  ];

  const priColor: Record<string, string> = { High: '#f87171', Medium: '#fbbf24', Low: '#34d399' };

  return (
    <>
      <button className="lback" onClick={() => setCurDom(null)}>{'\u2190'} Track</button>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{'\u2705'} Tasks</h2>

      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button className="sl" onClick={() => setOpen(true)}>+ New</button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState emoji="\u2705" title="No tasks" subtitle="Add your first task." cta="Add Task" onAction={() => setOpen(true)} />
      ) : (
        <div className="cd">
          {tasks.map(t => (
            <div key={t.id} className="trow">
              <div className="tpri" style={{ background: priColor[t.pri] || 'var(--t3)' }} />
              <div
                className={`tck ${t.done ? 'on' : ''}`}
                onClick={() => toggleTask(t.id)}
                role="checkbox"
                aria-checked={t.done}
                tabIndex={0}
              />
              <div className="tbd">
                <div className={`t ${t.done ? 'x' : ''}`}>{t.t}</div>
                <div className="m">
                  <span>{t.pri}</span>
                  {t.dt && <span>{fd(t.dt)}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} title="New Task" onClose={() => setOpen(false)} onSave={save}>
        <div className="fg">
          <input className="fi" placeholder="What needs doing?" value={text} onChange={e => setText(e.target.value)} autoFocus />
        </div>
        <div className="fg">
          <label className="fl">Priority</label>
          <div className="chips">
            {PRIS.map(p => (
              <button key={p.value} className={`chip ${pri === p.value ? 'on' : ''}`} onClick={() => setPri(p.value)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
