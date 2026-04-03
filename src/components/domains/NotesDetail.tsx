import { useState } from 'react';
import { useStore } from '../../store/appStore';
import { fd } from '../../lib/projections';
import Modal from '../layout/Modal';
import EmptyState from '../shared/EmptyState';

export default function NotesDetail() {
  const { notes, addNote, setCurDom } = useStore();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const save = () => {
    if (!title.trim()) return;
    addNote({ id: Date.now(), t: title.trim(), b: body, dt: new Date().toISOString().slice(0, 10) });
    setTitle(''); setBody('');
    setOpen(false);
  };

  return (
    <>
      <button className="lback" onClick={() => setCurDom(null)}>{'\u2190'} Track</button>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{'\u{1F4DD}'} Notes</h2>

      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button className="sl" onClick={() => setOpen(true)}>+ Write</button>
      </div>

      {notes.length === 0 ? (
        <EmptyState emoji="\u{1F4DD}" title="No notes" subtitle="Capture a thought." cta="Write" onAction={() => setOpen(true)} />
      ) : (
        notes.map(n => (
          <div key={n.id} className="ncard">
            <div className="nm">{n.t}</div>
            <div className="bd">{n.b || ''}</div>
            <div className="dt">{fd(n.dt)}</div>
          </div>
        ))
      )}

      <Modal open={open} title="New Note" onClose={() => setOpen(false)} onSave={save}>
        <div className="fg">
          <input className="fi" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
        </div>
        <div className="fg">
          <textarea className="fi" placeholder="Write freely..." value={body} onChange={e => setBody(e.target.value)} />
        </div>
      </Modal>
    </>
  );
}
