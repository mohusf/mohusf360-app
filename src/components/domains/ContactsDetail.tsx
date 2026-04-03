import { useState } from 'react';
import { useStore } from '../../store/appStore';
import Modal from '../layout/Modal';
import EmptyState from '../shared/EmptyState';

export default function ContactsDetail() {
  const { contacts, addContact, touchContact, setCurDom } = useStore();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [lastContact, setLastContact] = useState('');
  const [freq, setFreq] = useState<'weekly' | 'monthly' | 'quarterly'>('monthly');

  const save = () => {
    if (!name.trim()) return;
    addContact({
      id: Date.now(),
      nm: name.trim(),
      rl: role,
      lc: lastContact || new Date().toISOString().slice(0, 10),
      freq,
    });
    setName(''); setRole(''); setLastContact(''); setFreq('monthly');
    setOpen(false);
  };

  const now = Date.now();

  return (
    <>
      <button className="lback" onClick={() => setCurDom(null)}>{'\u2190'} Track</button>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{'\u{1F465}'} Network</h2>

      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button className="sl" onClick={() => setOpen(true)}>+ Add</button>
      </div>

      {contacts.length === 0 ? (
        <EmptyState emoji="\u{1F465}" title="No contacts" subtitle="Add your people." cta="Add" onAction={() => setOpen(true)} />
      ) : (
        <div className="cd">
          {contacts.map(c => {
            let badge = null;
            if (c.freq && c.lc) {
              const thresh: Record<string, number> = { weekly: 7, monthly: 30, quarterly: 90 };
              const days = Math.floor((now - new Date(c.lc + 'T12:00:00').getTime()) / 864e5);
              const overdue = days > (thresh[c.freq] || 30);
              badge = (
                <span className="cbadge" style={{
                  background: overdue ? 'rgba(248,113,113,.15)' : 'rgba(52,211,153,.15)',
                  color: overdue ? 'var(--r)' : 'var(--g)',
                }}>
                  {overdue ? days + 'd overdue' : 'OK'}
                </span>
              );
            }

            const initials = c.nm.split(' ').map(w => w[0]).join('');

            return (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--ac)', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0 }}>
                  {initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>
                    {c.nm} {badge}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--t3)' }}>
                    {c.rl || ''}{c.freq ? ' \u00B7 ' + c.freq : ''}
                  </div>
                </div>
                <button
                  className="tbtn"
                  onClick={(e) => { e.stopPropagation(); touchContact(c.id); }}
                  title="Mark contacted"
                  style={{ fontSize: '12px' }}
                >
                  {'\u2713'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={open} title="Add Contact" onClose={() => setOpen(false)} onSave={save}>
        <div className="fg">
          <input className="fi" placeholder="Name" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </div>
        <div className="fg">
          <input className="fi" placeholder="Role / context" value={role} onChange={e => setRole(e.target.value)} />
        </div>
        <div className="fg">
          <label className="fl">Last Contacted</label>
          <input className="fi" type="date" value={lastContact} onChange={e => setLastContact(e.target.value)} />
        </div>
        <div className="fg">
          <label className="fl">Frequency</label>
          <div className="chips">
            <button className={`chip ${freq === 'weekly' ? 'on' : ''}`} onClick={() => setFreq('weekly')}>Weekly</button>
            <button className={`chip ${freq === 'monthly' ? 'on' : ''}`} onClick={() => setFreq('monthly')}>Monthly</button>
            <button className={`chip ${freq === 'quarterly' ? 'on' : ''}`} onClick={() => setFreq('quarterly')}>Quarterly</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
