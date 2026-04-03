import { useState } from 'react';
import { useStore } from '../../store/appStore';
import Modal from '../layout/Modal';
import EmptyState from '../shared/EmptyState';

export default function SkillsDetail() {
  const { skills, addSkill, setCurDom } = useStore();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('1');
  const [earn, setEarn] = useState('');

  const save = () => {
    if (!name.trim()) return;
    addSkill({ id: Date.now(), name: name.trim(), level: parseInt(level) || 1, category: '', potentialIncome: parseFloat(earn) || 0 });
    setName(''); setLevel('1'); setEarn('');
    setOpen(false);
  };

  const topIncome = skills.length ? skills.reduce((a, s) => Math.max(a, s.potentialIncome), 0) : 0;

  return (
    <>
      <button className="lback" onClick={() => setCurDom(null)}>{'\u2190'} Track</button>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{'\u{1F9E0}'} Skills</h2>

      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button className="sl" onClick={() => setOpen(true)}>+ Add</button>
      </div>

      {skills.length === 0 ? (
        <EmptyState emoji="\u{1F9E0}" title="No skills" subtitle="Add your abilities." cta="Add Skill" onAction={() => setOpen(true)} />
      ) : (
        <>
          <div className="cd">
            {skills.map(s => (
              <div key={s.id} className="skrow">
                <div className="nm">{s.name}</div>
                <div className="skdots">
                  {[1, 2, 3, 4, 5].map(l => (
                    <div key={l} className={`skd ${l <= s.level ? 'on' : ''}`} />
                  ))}
                </div>
                <div className="earn">{s.potentialIncome ? '$' + s.potentialIncome + '/hr' : ''}</div>
              </div>
            ))}
          </div>
          {topIncome > 0 && (
            <div className="ins" style={{ borderLeftColor: 'var(--g)' }}>
              <div className="hd">{'\u{1F4A1}'} Income potential</div>
              <div className="bd">
                Top skill: <strong>${topIncome}/hr</strong>. 10 hrs/week = <strong>${(topIncome * 10 * 4).toLocaleString()}/mo</strong>.
              </div>
            </div>
          )}
        </>
      )}

      <Modal open={open} title="Add Skill" onClose={() => setOpen(false)} onSave={save}>
        <div className="fg">
          <input className="fi" placeholder="Skill name" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </div>
        <div className="row2">
          <div className="fg">
            <label className="fl">Level (1-5)</label>
            <input className="fi" type="number" min={1} max={5} placeholder="1" value={level} onChange={e => setLevel(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Earning $/hr</label>
            <input className="fi" type="number" placeholder="0" value={earn} onChange={e => setEarn(e.target.value)} />
          </div>
        </div>
      </Modal>
    </>
  );
}
