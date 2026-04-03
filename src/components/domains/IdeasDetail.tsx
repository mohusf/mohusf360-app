import { useState } from 'react';
import { useStore } from '../../store/appStore';
import { fd } from '../../lib/projections';
import Modal from '../layout/Modal';
import EmptyState from '../shared/EmptyState';

export default function IdeasDetail() {
  const { ideas, addIdea, setCurDom } = useStore();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const save = () => {
    if (!title.trim()) return;
    addIdea({ id: Date.now(), t: title.trim(), b: body, dt: new Date().toISOString().slice(0, 10) });
    setTitle(''); setBody('');
    setOpen(false);
  };

  return (
    <>
      <button className="lback" onClick={() => setCurDom(null)}>{'\u2190'} Track</button>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{'\u{1F4A1}'} Ideas</h2>

      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button className="sl" onClick={() => setOpen(true)}>+ Capture</button>
      </div>

      {ideas.length === 0 ? (
        <EmptyState emoji="\u{1F4A1}" title="No ideas" subtitle="Capture a spark." cta="Add Idea" onAction={() => setOpen(true)} />
      ) : (
        ideas.map(i => (
          <div key={i.id} className="ncard">
            <div className="nm">{i.t}</div>
            <div className="bd">{i.b || ''}</div>
            <div className="dt">{fd(i.dt)}</div>
          </div>
        ))
      )}

      <Modal open={open} title="New Idea" onClose={() => setOpen(false)} onSave={save}>
        <div className="fg">
          <input className="fi" placeholder="The idea" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
        </div>
        <div className="fg">
          <textarea className="fi" placeholder="Why it matters..." value={body} onChange={e => setBody(e.target.value)} />
        </div>
      </Modal>
    </>
  );
}
