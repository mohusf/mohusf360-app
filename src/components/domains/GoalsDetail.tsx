import { useState } from 'react';
import { useStore } from '../../store/appStore';
import { fd } from '../../lib/projections';
import Modal from '../layout/Modal';
import EmptyState from '../shared/EmptyState';

export default function GoalsDetail() {
  const { goals, addGoal, updateGoalProgress, setCurDom } = useStore();

  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Add form
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [deadline, setDeadline] = useState('');

  // Edit form
  const [editProgress, setEditProgress] = useState('');

  const editGoal = goals.find(g => g.id === editId);

  const saveNew = () => {
    if (!name.trim()) return;
    addGoal({ id: Date.now(), name: name.trim(), target: parseFloat(target) || 0, current: parseFloat(current) || 0, deadline });
    setName(''); setTarget(''); setCurrent(''); setDeadline('');
    setAddOpen(false);
  };

  const saveEdit = () => {
    if (editId === null) return;
    updateGoalProgress(editId, parseFloat(editProgress) || 0);
    setEditId(null);
    setEditProgress('');
  };

  const openEdit = (id: number) => {
    const g = goals.find(x => x.id === id);
    if (!g) return;
    setEditId(id);
    setEditProgress(String(g.current));
  };

  return (
    <>
      <button className="lback" onClick={() => setCurDom(null)}>{'\u2190'} Track</button>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{'\u{1F3AF}'} Goals</h2>

      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button className="sl" onClick={() => setAddOpen(true)}>+ Add</button>
      </div>

      {goals.length === 0 ? (
        <EmptyState emoji="\u{1F3AF}" title="No goals" subtitle="Set a target." cta="Add Goal" onAction={() => setAddOpen(true)} />
      ) : (
        goals.map(g => {
          const pct = g.target ? Math.min(100, Math.round(g.current / g.target * 100)) : 0;
          return (
            <div key={g.id} className="gc" onClick={() => openEdit(g.id)}>
              <div className="top">
                <div className="nm">{g.name}</div>
                <div className="pct">{pct}%</div>
              </div>
              <div className="bar">
                <div className="fill" style={{ width: `${pct}%`, background: 'var(--ac)' }} />
              </div>
              <div className="proj">
                {g.current} / {g.target}{g.deadline ? ' \u00B7 ' + fd(g.deadline) : ''}
              </div>
            </div>
          );
        })
      )}

      {/* Add Modal */}
      <Modal open={addOpen} title="New Goal" onClose={() => setAddOpen(false)} onSave={saveNew}>
        <div className="fg">
          <input className="fi" placeholder="Goal name" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </div>
        <div className="row2">
          <div className="fg">
            <label className="fl">Target</label>
            <input className="fi" placeholder="10000" value={target} onChange={e => setTarget(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Current</label>
            <input className="fi" placeholder="0" value={current} onChange={e => setCurrent(e.target.value)} />
          </div>
        </div>
        <div className="fg">
          <label className="fl">Deadline</label>
          <input className="fi" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
        </div>
      </Modal>

      {/* Edit Progress Modal */}
      <Modal
        open={editId !== null}
        title="Update Goal"
        subtitle={editGoal?.name || ''}
        onClose={() => setEditId(null)}
        onSave={saveEdit}
      >
        <div className="fg">
          <label className="fl">Current Progress</label>
          <input
            className="fi"
            type="number"
            value={editProgress}
            onChange={e => setEditProgress(e.target.value)}
            autoFocus
            style={{ fontSize: '24px', textAlign: 'center', fontWeight: 700, padding: '16px' }}
          />
        </div>
        {editGoal && (
          <div style={{ fontSize: '12px', color: 'var(--t3)', textAlign: 'center' }}>
            Target: {editGoal.target.toLocaleString()}
          </div>
        )}
      </Modal>
    </>
  );
}
