import { useState } from 'react';
import { useStore } from '../../store/appStore';
import { compound, debtMos, futDate } from '../../lib/projections';
import { MILESTONES } from '../../lib/constants';
import Modal from '../layout/Modal';

export default function WealthView() {
  const state = useStore();
  const { assets, debts, milestones } = state;

  // Modal state
  const [modal, setModal] = useState<'asset' | 'debt' | null>(null);
  const [assetName, setAssetName] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [assetType, setAssetType] = useState<'savings' | 'investment'>('savings');
  const [debtName, setDebtName] = useState('');
  const [debtBalance, setDebtBalance] = useState('');
  const [debtOriginal, setDebtOriginal] = useState('');
  const [debtRate, setDebtRate] = useState('');
  const [debtMonthly, setDebtMonthly] = useState('');

  // Compound calculator state
  const [calcMo, setCalcMo] = useState(200);
  const [calcRt, setCalcRt] = useState(8);
  const [calcYr, setCalcYr] = useState(10);

  const totalAssets = assets.reduce((a, s) => a + s.value, 0);
  const totalDebts = debts.reduce((a, d) => a + d.balance, 0);
  const nw = totalAssets - totalDebts;

  // Compound calc
  const fv = compound(calcMo, calcRt, calcYr);
  const invested = calcMo * calcYr * 12;
  const dblYears = calcRt > 0 ? Math.round(72 / calcRt) : 0;

  // Asset allocation
  const assetTypes: Record<string, number> = {};
  assets.forEach(a => { assetTypes[a.type] = (assetTypes[a.type] || 0) + a.value; });

  // Debts sorted by rate (avalanche)
  const sortedDebts = [...debts].sort((a, b) => b.rate - a.rate);

  const resetAssetForm = () => { setAssetName(''); setAssetValue(''); setAssetType('savings'); };
  const resetDebtForm = () => { setDebtName(''); setDebtBalance(''); setDebtOriginal(''); setDebtRate(''); setDebtMonthly(''); };

  const saveAsset = () => {
    if (!assetName.trim()) return;
    state.addAsset({ id: Date.now(), name: assetName.trim(), value: parseFloat(assetValue) || 0, type: assetType });
    resetAssetForm();
    setModal(null);
  };

  const saveDebt = () => {
    if (!debtName.trim()) return;
    state.addDebt({ id: Date.now(), name: debtName.trim(), balance: parseFloat(debtBalance) || 0, original: parseFloat(debtOriginal) || 0, rate: parseFloat(debtRate) || 0, monthlyPay: parseFloat(debtMonthly) || 0 });
    resetDebtForm();
    setModal(null);
  };

  return (
    <>
      <div className="sec">
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Wealth</h2>
        <p style={{ fontSize: '12px', color: 'var(--t2)', marginTop: '3px' }}>Net worth, investments & debt</p>
      </div>

      {/* Net Worth Metric */}
      <div className="sec">
        <div className="met">
          <div className="v" style={{ color: nw >= 0 ? 'var(--g)' : 'var(--r)' }}>
            {nw >= 0 ? '$' : '-$'}{Math.abs(nw).toLocaleString()}
          </div>
          <div className="l">Net Worth</div>
        </div>
        <div className="nwb">
          <div className="nwbox as">
            <div className="v" style={{ color: 'var(--g)' }}>${totalAssets.toLocaleString()}</div>
            <div className="l">Assets</div>
          </div>
          <div className="nwbox db">
            <div className="v" style={{ color: 'var(--r)' }}>${totalDebts.toLocaleString()}</div>
            <div className="l">Debts</div>
          </div>
        </div>
      </div>

      {/* Assets */}
      <div className="sec">
        <div className="sh">
          <h2>Assets</h2>
          <button className="sl" onClick={() => { resetAssetForm(); setModal('asset'); }}>+ Add</button>
        </div>
        {assets.length > 0 ? (
          <>
            <div className="cd">
              {assets.map(a => (
                <div key={a.id} className="frow">
                  <div className="ic" style={{ background: 'rgba(52,211,153,.08)' }}>{a.type === 'savings' ? '\u{1F3E6}' : '\u{1F4C8}'}</div>
                  <div className="info">
                    <div className="nm">{a.name}</div>
                    <div className="cat">{a.type}</div>
                  </div>
                  <div className="amt" style={{ color: 'var(--g)' }}>${a.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
            {/* Asset Allocation (simple text fallback — no Chart.js) */}
            {Object.keys(assetTypes).length > 1 && (
              <div className="cd" style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Asset Allocation</div>
                {Object.entries(assetTypes).map(([type, val]) => {
                  const pct = totalAssets > 0 ? Math.round(val / totalAssets * 100) : 0;
                  return (
                    <div key={type} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.03)', fontSize: '12px' }}>
                      <span style={{ textTransform: 'capitalize' }}>{type}</span>
                      <span style={{ fontWeight: 700 }}>{pct}% (${val.toLocaleString()})</span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div style={{ fontSize: '12px', color: 'var(--t3)', padding: '4px 0' }}>
            No assets. <button className="sl" onClick={() => { resetAssetForm(); setModal('asset'); }}>Add one</button>
          </div>
        )}
      </div>

      {/* Debt Destroyer */}
      <div className="sec">
        <div className="sh">
          <h2>Debt Destroyer</h2>
          <button className="sl" onClick={() => { resetDebtForm(); setModal('debt'); }}>+ Add</button>
        </div>
        {debts.length > 0 ? (
          <>
            {sortedDebts.map((d, i) => {
              const paid = d.original - d.balance;
              const pct = d.original ? Math.round(paid / d.original * 100) : 0;
              const mos = debtMos(d.balance, d.rate, d.monthlyPay);
              const mosA = debtMos(d.balance, d.rate, d.monthlyPay + 100);
              return (
                <div key={d.id} className="dcard2">
                  <div className="top">
                    <div className="nm">{i === 0 ? '\u{1F3AF} ' : ''}{d.name}</div>
                    <div className="bal">${d.balance.toLocaleString()}</div>
                  </div>
                  <div className="meta">
                    <span>{d.rate}% APR</span>
                    <span>${d.monthlyPay}/mo</span>
                    <span>{pct}% paid</span>
                  </div>
                  <div className="bar">
                    <div className="fill" style={{ width: `${pct}%`, background: i === 0 ? 'var(--r)' : 'var(--am)' }} />
                  </div>
                  <div className="proj">
                    Payoff: {mos < 999 ? futDate(mos) : '\u221E'}
                    {mosA < mos ? ' \u00B7 +$100/mo: ' + futDate(mosA) : ''}
                  </div>
                </div>
              );
            })}
            {sortedDebts.length > 1 && (
              <div className="alrt w">
                <div className="ic">{'\u26A1'}</div>
                <div className="tx"><strong>Avalanche:</strong> Focus on <strong>{sortedDebts[0].name}</strong> ({sortedDebts[0].rate}%) to minimize interest.</div>
              </div>
            )}
          </>
        ) : (
          <div style={{ fontSize: '12px', color: 'var(--t3)', padding: '4px 0' }}>No debts. Excellent.</div>
        )}
      </div>

      {/* Compound Growth Calculator */}
      <div className="sec">
        <div className="calc">
          <h3>{'\u{1F4C8}'} Compound Growth</h3>
          <div className="calc-r">
            <div className="calc-f">
              <label>$/mo</label>
              <input type="number" value={calcMo} onChange={e => setCalcMo(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="calc-f">
              <label>Return %</label>
              <input type="number" value={calcRt} step={0.5} onChange={e => setCalcRt(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="calc-f">
              <label>Years</label>
              <input type="number" value={calcYr} onChange={e => setCalcYr(parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          <div className="calc-res">
            <div className="v">${Math.round(fv).toLocaleString()}</div>
            <div className="l">Future Value</div>
            <div className="d">
              Invest ${invested.toLocaleString()} {'\u2192'} earn <strong style={{ color: 'var(--g)' }}>${Math.round(fv - invested).toLocaleString()}</strong> returns
              {dblYears > 0 && <><br /><span style={{ fontSize: '11px', color: 'var(--t3)' }}>Rule of 72: money doubles every ~{dblYears} years at {calcRt}%</span></>}
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="sec">
        <div className="sh"><h2>Milestones</h2></div>
        <div className="cd">
          {MILESTONES.map(m => {
            const done = milestones.includes(m.id);
            return (
              <div key={m.id} className="ms">
                <div className={`ic ${done ? 'done' : 'lk'}`}>{m.em}</div>
                <div className="info">
                  <div className="nm" style={done ? {} : { opacity: 0.5 }}>{m.nm}</div>
                  <div className="desc">{m.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Asset Modal */}
      <Modal open={modal === 'asset'} title="Add Asset" onClose={() => setModal(null)} onSave={saveAsset}>
        <div className="fg">
          <input className="fi" placeholder="Name" value={assetName} onChange={e => setAssetName(e.target.value)} autoFocus />
        </div>
        <div className="row2">
          <div className="fg">
            <label className="fl">Value</label>
            <input className="fi" type="number" placeholder="0" value={assetValue} onChange={e => setAssetValue(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Type</label>
            <div className="chips">
              <button className={`chip ${assetType === 'savings' ? 'on' : ''}`} onClick={() => setAssetType('savings')}>{'\u{1F3E6}'} Savings</button>
              <button className={`chip ${assetType === 'investment' ? 'on' : ''}`} onClick={() => setAssetType('investment')}>{'\u{1F4C8}'} Investment</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Debt Modal */}
      <Modal open={modal === 'debt'} title="Add Debt" onClose={() => setModal(null)} onSave={saveDebt}>
        <div className="fg">
          <input className="fi" placeholder="Loan name" value={debtName} onChange={e => setDebtName(e.target.value)} autoFocus />
        </div>
        <div className="row2">
          <div className="fg">
            <label className="fl">Balance</label>
            <input className="fi" type="number" placeholder="0" value={debtBalance} onChange={e => setDebtBalance(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Original</label>
            <input className="fi" type="number" placeholder="0" value={debtOriginal} onChange={e => setDebtOriginal(e.target.value)} />
          </div>
        </div>
        <div className="row2">
          <div className="fg">
            <label className="fl">APR %</label>
            <input className="fi" type="number" step={0.1} placeholder="4.5" value={debtRate} onChange={e => setDebtRate(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Monthly $</label>
            <input className="fi" type="number" placeholder="0" value={debtMonthly} onChange={e => setDebtMonthly(e.target.value)} />
          </div>
        </div>
      </Modal>
    </>
  );
}
