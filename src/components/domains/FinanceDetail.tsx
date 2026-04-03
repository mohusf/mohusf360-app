import { useState } from 'react';
import { useStore } from '../../store/appStore';
import Modal from '../layout/Modal';
import EmptyState from '../shared/EmptyState';

const INCOME_TYPES = [
  { label: '\u{1F4BC} Salary', value: 'salary' },
  { label: '\u{1F4F8} Freelance', value: 'freelance' },
  { label: '\u{1F4F1} Side Hustle', value: 'side_hustle' },
  { label: '\u{1F4B0} Other', value: 'other' },
];

const EXPENSE_CATS = [
  '\u{1F3E0} Housing', '\u{1F6D2} Food', '\u{1F697} Transport', '\u{1F4BB} Software',
  '\u{1F4DA} Learning', '\u{1F3CB}\uFE0F Health', '\u{1F3AD} Fun', '\u{1F4F1} Subs',
  '\u{1F4BC} Business', '\u2753 Other',
];

export default function FinanceDetail() {
  const { incomeStreams, expenses, addIncome, addExpense, setCurDom } = useStore();

  const [modal, setModal] = useState<'income' | 'expense' | null>(null);

  // Income form
  const [incName, setIncName] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incType, setIncType] = useState('salary');

  // Expense form
  const [expName, setExpName] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCat, setExpCat] = useState('Housing');
  const [expRecurring, setExpRecurring] = useState(true);

  const inc = incomeStreams.reduce((a, s) => a + s.amount, 0);
  const exp = expenses.reduce((a, e) => a + e.amount, 0);

  const saveIncome = () => {
    if (!incName.trim()) return;
    addIncome({ id: Date.now(), name: incName.trim(), type: incType, amount: parseFloat(incAmount) || 0 });
    setIncName(''); setIncAmount(''); setIncType('salary');
    setModal(null);
  };

  const saveExpense = () => {
    if (!expName.trim()) return;
    addExpense({ id: Date.now(), name: expName.trim(), amount: parseFloat(expAmount) || 0, category: expCat, date: new Date().toISOString().slice(0, 10), recurring: expRecurring });
    setExpName(''); setExpAmount(''); setExpCat('Housing'); setExpRecurring(true);
    setModal(null);
  };

  // Expense breakdown
  const cats: Record<string, number> = {};
  expenses.forEach(e => { cats[e.category] = (cats[e.category] || 0) + e.amount; });

  return (
    <>
      <button className="lback" onClick={() => setCurDom(null)}>{'\u2190'} Track</button>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{'\u{1F4B8}'} Finance</h2>

      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button className="sl" onClick={() => setModal('income')}>+ Income</button>
        {' '}
        <button className="sl" onClick={() => setModal('expense')}>+ Expense</button>
      </div>

      {!incomeStreams.length && !expenses.length ? (
        <EmptyState emoji="\u{1F4B0}" title="No data" subtitle="Log income and expenses." cta="Add Income" onAction={() => setModal('income')} />
      ) : (
        <>
          {/* Summary boxes */}
          <div className="fsum">
            <div className="fbox">
              <div className="v" style={{ color: 'var(--g)' }}>${inc.toLocaleString()}</div>
              <div className="l">Income</div>
            </div>
            <div className="fbox">
              <div className="v" style={{ color: 'var(--r)' }}>${exp.toLocaleString()}</div>
              <div className="l">Spent</div>
            </div>
            <div className="fbox">
              <div className="v" style={{ color: inc - exp >= 0 ? 'var(--sk)' : 'var(--r)' }}>${(inc - exp).toLocaleString()}</div>
              <div className="l">Saved</div>
            </div>
          </div>

          {/* Breakdown */}
          {Object.keys(cats).length > 0 && (
            <div className="cd" style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Breakdown</div>
              {Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([cat, val]) => {
                const pct = exp > 0 ? Math.round(val / exp * 100) : 0;
                return (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.03)', fontSize: '12px' }}>
                    <span>{cat}</span>
                    <span style={{ fontWeight: 700 }}>${val.toLocaleString()} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Income + Expense List */}
          <div className="cd">
            {incomeStreams.map(s => (
              <div key={s.id} className="frow">
                <div className="ic" style={{ background: 'rgba(52,211,153,.08)' }}>{'\u{1F4B0}'}</div>
                <div className="info">
                  <div className="nm">{s.name}</div>
                  <div className="cat">{s.type}</div>
                </div>
                <div className="amt" style={{ color: 'var(--g)' }}>+${s.amount.toLocaleString()}</div>
              </div>
            ))}
            {expenses.map(e => (
              <div key={e.id} className="frow">
                <div className="ic" style={{ background: 'rgba(248,113,113,.08)' }}>{'\u{1F4B8}'}</div>
                <div className="info">
                  <div className="nm">{e.name}</div>
                  <div className="cat">{e.category}{e.recurring ? ' \u00B7 recurring' : ''}</div>
                </div>
                <div className="amt" style={{ color: 'var(--r)' }}>-${e.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Income Modal */}
      <Modal open={modal === 'income'} title="Add Income" onClose={() => setModal(null)} onSave={saveIncome}>
        <div className="fg">
          <input className="fi" placeholder="Source name" value={incName} onChange={e => setIncName(e.target.value)} autoFocus />
        </div>
        <div className="row2">
          <div className="fg">
            <label className="fl">Amount/mo</label>
            <input className="fi" type="number" placeholder="0" value={incAmount} onChange={e => setIncAmount(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Type</label>
            <div className="chips">
              {INCOME_TYPES.map(t => (
                <button key={t.value} className={`chip ${incType === t.value ? 'on' : ''}`} onClick={() => setIncType(t.value)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Expense Modal */}
      <Modal open={modal === 'expense'} title="Add Expense" onClose={() => setModal(null)} onSave={saveExpense}>
        <div className="fg">
          <input className="fi" placeholder="What for?" value={expName} onChange={e => setExpName(e.target.value)} autoFocus />
        </div>
        <div className="row2">
          <div className="fg">
            <label className="fl">Amount/mo</label>
            <input className="fi" type="number" placeholder="0" value={expAmount} onChange={e => setExpAmount(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Recurring?</label>
            <div className="chips">
              <button className={`chip ${expRecurring ? 'on' : ''}`} onClick={() => setExpRecurring(true)}>Yes</button>
              <button className={`chip ${!expRecurring ? 'on' : ''}`} onClick={() => setExpRecurring(false)}>No</button>
            </div>
          </div>
        </div>
        <div className="fg">
          <label className="fl">Category</label>
          <div className="chips">
            {EXPENSE_CATS.map(c => {
              const val = c.split(' ').slice(1).join(' ');
              return (
                <button key={val} className={`chip ${expCat === val ? 'on' : ''}`} onClick={() => setExpCat(val)}>
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}
