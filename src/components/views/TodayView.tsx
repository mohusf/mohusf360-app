import { useStore } from '../../store/appStore';
import { calcLifeScore } from '../../lib/lifeScore';
import { getInsights } from '../../lib/insights';
import { fd, mos2goal, futDate } from '../../lib/projections';
import LifeScoreRing from '../shared/LifeScoreRing';
import InsightCard from '../shared/InsightCard';

export default function TodayView() {
  const state = useStore();
  const { tasks, goals, weeklyActions, incomeStreams, expenses, assets, debts, lifeScoreHistory } = state;

  const score = calcLifeScore(state);

  // Greeting
  const hr = new Date().getHours();
  const greeting = hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Cash flow
  const inc = incomeStreams.reduce((a, s) => a + s.amount, 0);
  const exp = expenses.reduce((a, e) => a + e.amount, 0);
  const sv = inc - exp;
  const tot = Math.max(inc, 1);
  const savingsRate = inc > 0 ? Math.round((inc - exp) / inc * 100) : 0;

  // Net worth
  const totalAssets = assets.reduce((a, s) => a + s.value, 0);
  const totalDebts = debts.reduce((a, d) => a + d.balance, 0);
  const netWorth = totalAssets - totalDebts;

  // Insights
  const insights = getInsights(state);

  return (
    <>
      {/* Greeting */}
      <div className="sec">
        <h2 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-.8px' }}>{greeting}</h2>
        <p style={{ fontSize: '13px', color: 'var(--t2)', marginTop: '3px' }}>{dateLabel}</p>
      </div>

      {/* Life Score Ring */}
      <div className="sec">
        <LifeScoreRing score={score} netWorth={netWorth} history={lifeScoreHistory} />
      </div>

      {/* Cash Flow Card */}
      <div className="sec">
        <div className="cd">
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>Monthly Cash Flow</div>
          <div className="cfb">
            <div style={{ width: `${inc / tot * 100}%`, background: 'var(--g)' }} />
            <div style={{ width: `${exp / tot * 100}%`, background: 'var(--r)' }} />
            {sv > 0 && <div style={{ width: `${sv / tot * 100}%`, background: 'var(--ac)' }} />}
          </div>
          <div className="cfl">
            <span><span className="dot" style={{ background: 'var(--g)' }} />${inc.toLocaleString()}</span>
            <span><span className="dot" style={{ background: 'var(--r)' }} />${exp.toLocaleString()}</span>
            <span><span className="dot" style={{ background: 'var(--ac)' }} />${sv.toLocaleString()}</span>
          </div>
          <div className="gauge" style={{ marginTop: '10px' }}>
            <div className="fill" style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%`, background: savingsRate >= 20 ? 'var(--g)' : savingsRate >= 10 ? 'var(--am)' : 'var(--r)' }} />
            <div className="mark" style={{ left: '20%' }} />
          </div>
          <div className="gauge-l">
            <span>0%</span>
            <span style={{ color: savingsRate >= 20 ? 'var(--g)' : 'var(--t2)' }}>Savings: {savingsRate}%</span>
            <span>20%</span>
          </div>
        </div>
      </div>

      {/* Weekly Actions */}
      <div className="sec">
        <div className="sh">
          <h2>This Week</h2>
          <button className="sl" onClick={() => state.regenActions?.()}>Refresh</button>
        </div>
        <div className="stg">
          {weeklyActions.length > 0 ? weeklyActions.map((a, i) => (
            <div key={a.id} className={`act ${a.done ? 'dn' : ''}`} onClick={() => state.toggleAction(a.id)}>
              <div className="anum">{i + 1}</div>
              <div className="abody">
                <div className="at">{a.text}</div>
                <div className="aw">{a.why}</div>
                {a.impact && <div className="ai">{'\u2191'} {a.impact}</div>}
              </div>
              <div className={`ack ${a.done ? 'on' : ''}`} />
            </div>
          )) : (
            <div className="empty">
              <div className="em">{'🎯'}</div>
              <div className="tt">Add data first</div>
              <div className="st">Log income & expenses to unlock personalized strategies.</div>
            </div>
          )}
        </div>
      </div>

      {/* Goals Preview */}
      <div className="sec">
        <div className="sh">
          <h2>Goals</h2>
          <button className="sl" onClick={() => state.setCurDom('goals')}>+ Add</button>
        </div>
        {goals.length > 0 ? goals.slice(0, 3).map(g => {
          const pct = g.target ? Math.min(100, Math.round(g.current / g.target * 100)) : 0;
          const mos = sv > 0 && g.target > g.current ? mos2goal(g.target, g.current, sv) : null;
          return (
            <div key={g.id} className="gc">
              <div className="top">
                <div className="nm">{g.name}</div>
                <div className="pct">{pct}%</div>
              </div>
              <div className="bar">
                <div className="fill" style={{ width: `${pct}%`, background: 'var(--ac)' }} />
              </div>
              <div className="proj">
                {g.deadline ? 'Deadline: ' + fd(g.deadline) : ''}
                {mos && mos < 999 ? ' \u00B7 Track: ' + futDate(mos) : ''}
              </div>
            </div>
          );
        }) : (
          <div style={{ textAlign: 'center', padding: '12px', color: 'var(--t3)', fontSize: '12px' }}>
            No goals. <button className="sl" onClick={() => state.setCurDom('goals')}>Add one</button>
          </div>
        )}
      </div>

      {/* Top Insight */}
      {insights.length > 0 && (
        <div className="sec">
          <InsightCard {...insights[0]} />
        </div>
      )}
    </>
  );
}
