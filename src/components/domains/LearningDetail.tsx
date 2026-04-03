import { useState } from 'react';
import { useStore } from '../../store/appStore';
import Modal from '../layout/Modal';
import EmptyState from '../shared/EmptyState';

export default function LearningDetail() {
  const { learning, addLearning, updateLearningProgress, setCurDom } = useStore();

  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Add form
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('');
  const [progress, setProgress] = useState('');

  // Edit form
  const [editProgress, setEditProgress] = useState('');

  const editItem = learning.find(l => l.id === editId);

  const saveNew = () => {
    if (!name.trim()) return;
    addLearning({ id: Date.now(), name: name.trim(), platform, progress: parseInt(progress) || 0 });
    setName(''); setPlatform(''); setProgress('');
    setAddOpen(false);
  };

  const saveEdit = () => {
    if (editId === null) return;
    updateLearningProgress(editId, Math.min(100, Math.max(0, parseInt(editProgress) || 0)));
    setEditId(null);
    setEditProgress('');
  };

  const openEdit = (id: number) => {
    const l = learning.find(x => x.id === id);
    if (!l) return;
    setEditId(id);
    setEditProgress(String(l.progress));
  };

  return (
    <>
      <button className="lback" onClick={() => setCurDom(null)}>{'\u2190'} Track</button>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{'\u{1F4DA}'} Learning</h2>

      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button className="sl" onClick={() => setAddOpen(true)}>+ Add</button>
      </div>

      {learning.length === 0 ? (
        <EmptyState emoji="\u{1F4DA}" title="Nothing tracked" subtitle="Add a course." cta="Add" onAction={() => setAddOpen(true)} />
      ) : (
        <div className="cd">
          {learning.map(l => (
            <div key={l.id} className="lrow" onClick={() => openEdit(l.id)}>
              <div className="info">
                <div className="nm">{l.name}</div>
                <div className="pl">{l.platform || ''}</div>
              </div>
              <div className="lbar">
                <div className="fill" style={{ width: `${l.progress}%` }} />
              </div>
              <div className="pct">{l.progress}%</div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={addOpen} title="Add Learning" onClose={() => setAddOpen(false)} onSave={saveNew}>
        <div className="fg">
          <input className="fi" placeholder="Course/book" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </div>
        <div className="row2">
          <div className="fg">
            <label className="fl">Platform</label>
            <input className="fi" placeholder="Udemy..." value={platform} onChange={e => setPlatform(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Progress %</label>
            <input className="fi" type="number" placeholder="0" value={progress} onChange={e => setProgress(e.target.value)} />
          </div>
        </div>
      </Modal>

      {/* Edit Progress Modal */}
      <Modal
        open={editId !== null}
        title="Update Progress"
        subtitle={editItem?.name || ''}
        onClose={() => setEditId(null)}
        onSave={saveEdit}
      >
        <div className="fg">
          <label className="fl">Progress %</label>
          <input
            className="fi"
            type="number"
            min={0}
            max={100}
            value={editProgress}
            onChange={e => setEditProgress(e.target.value)}
            autoFocus
            style={{ fontSize: '24px', textAlign: 'center', fontWeight: 700, padding: '16px' }}
          />
        </div>
      </Modal>
    </>
  );
}
