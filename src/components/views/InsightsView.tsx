import { useStore } from '../../store/appStore';
import { calcLifeScore } from '../../lib/lifeScore';
import { getInsights } from '../../lib/insights';
import { QUOTES } from '../../lib/constants';
import { fd } from '../../lib/projections';
import InsightCard from '../shared/InsightCard';

export default function InsightsView() {
  const state = useStore();
  const { tasks, habits, health, moodLog, incomeStreams, expenses, assets, debts, workouts, weeklySnapshots, feed } = state;

  const sc = calcLifeScore(state);
  const insights = getInsights(state);

  // Weekly review metrics
  const tDone = tasks.filter(t => t.done).length;
  const tAll = tasks.length;
  const hc = habits.reduce((a, h) => (h.w || []).reduce((s, d) => s + d, 0) + a, 0);
  const hm = habits.length * 7;
  const avgSl = (health?.sleep?.h || []).filter(v => v > 0);
  const sa = avgSl.length ? (avgSl.reduce((a, v) => a + v, 0) / avgSl.length).toFixed(1) : '\u2014';
  const inc = incomeStreams.reduce((a, s) => a + s.amount, 0);
  const exp = expenses.reduce((a, e) => a + e.amount, 0);
  const saved = inc - exp;
  const savingsRate = inc > 0 ? Math.round((inc - exp) / inc * 100) : 0;
  const totalAssets = assets.reduce((a, s) => a + s.value, 0);
  const totalDebts = debts.reduce((a, d) => a + d.balance, 0);
  const netWorthVal = totalAssets - totalDebts;

  // Week-over-week deltas
  const prev = weeklySnapshots.length >= 2 ? weeklySnapshots[weeklySnapshots.length - 2] : null;
  const cur = weeklySnapshots.length >= 1 ? weeklySnapshots[weeklySnapshots.length - 1] : null;

  let snapGap = 0;
  if (prev && cur) {
    const pw = prev.week.split('-W');
    const cw = cur.week.split('-W');
    snapGap = ((parseInt(cw[0]) - parseInt(pw[0])) * 52) + (parseInt(cw[1]) - parseInt(pw[1])) - 1;
  }

  const dlt = (c: number | undefined, p: number | undefined) => {
    if (c == null || p == null) return null;
    const d = c - p;
    if (d === 0) return null;
    return <span className={`delta ${d > 0 ? 'up' : 'dn'}`}>{d > 0 ? '\u25B2' : '\u25BC'} {Math.abs(d)}</span>;
  };

  // Workouts this week
  const now = Date.now();
  const thisWeekWorkouts = workouts.filter(w => {
    const d = new Date(w.dt + 'T12:00:00');
    return (now - d.getTime()) / 864e5 <= 7;
  }).length;

  // Mood average
  const moodAvg = moodLog.length ? moodLog.reduce((a, m) => a + m.v, 0) / moodLog.length : 0;
  const MOOD_FACES = ['\u{1F624}', '\u{1F610}', '\u{1F642}', '\u{1F60A}', '\u{1F525}'];

  // 50/30/20 budget
  const needs = expenses.filter(e => ['Housing', 'Transport', 'Food', 'Health'].includes(e.category)).reduce((a, e) => a + e.amount, 0);
  const needsPct = inc > 0 ? Math.round(needs / inc * 100) : 0;

  // Coaching quote (daily rotation)
  const q = QUOTES[new Date().getDate() % QUOTES.length];

  return (
    <>
      <div className="sec">
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Insights</h2>
        <p style={{ fontSize: '12px', color: 'var(--t2)', marginTop: '3px' }}>AI analysis & weekly review</p>
      </div>

      <div className="sec stg">
        {/* Weekly Review Card */}
        <div className="wcard">
          <h3>{'\u{1F4CA}'} Weekly Review</h3>
          {prev && snapGap > 0 && (
            <div style={{ fontSize: '10px', color: 'var(--t3)', marginBottom: '8px' }}>
              Comparing vs. {snapGap + 1} weeks ago
            </div>
          )}
          {tAll > 0 && (
            <div className="wrow">
              <span className="lb">Tasks</span>
              <span className="vl">{tDone}/{tAll} done{prev ? dlt(cur?.tasksDone, prev.tasksDone) : ''}</span>
            </div>
          )}
          {habits.length > 0 && (
            <div className="wrow">
              <span className="lb">Habits</span>
              <span className="vl">{hc}/{hm} ({hm ? Math.round(hc / hm * 100) : 0}%){prev ? dlt(cur?.habitPct, prev.habitPct) : ''}</span>
            </div>
          )}
          {avgSl.length > 0 && (
            <div className="wrow">
              <span className="lb">Avg Sleep</span>
              <span className="vl">{sa}h</span>
            </div>
          )}
          {workouts.length > 0 && (
            <div className="wrow">
              <span className="lb">Workouts (WHO: 3-5/wk)</span>
              <span className="vl" style={{ color: thisWeekWorkouts >= 3 ? 'var(--g)' : 'var(--am)' }}>
                {thisWeekWorkouts}/week
              </span>
            </div>
          )}
          {moodLog.length > 0 && (
            <div className="wrow">
              <span className="lb">Avg Mood</span>
              <span className="vl">{MOOD_FACES[Math.round(moodAvg)] || '\u2014'}</span>
            </div>
          )}
          {(inc > 0 || exp > 0) && (
            <>
              <div className="wrow">
                <span className="lb">Income</span>
                <span className="vl" style={{ color: 'var(--g)' }}>${inc.toLocaleString()}</span>
              </div>
              <div className="wrow">
                <span className="lb">Expenses</span>
                <span className="vl" style={{ color: 'var(--r)' }}>${exp.toLocaleString()}</span>
              </div>
              <div className="wrow">
                <span className="lb">Saved</span>
                <span className="vl" style={{ color: saved >= 0 ? 'var(--sk)' : 'var(--r)' }}>
                  ${saved.toLocaleString()}{prev ? dlt(cur?.saved, prev.saved) : ''}
                </span>
              </div>
              <div className="wrow">
                <span className="lb">50/30/20 Budget</span>
                <span className="vl">{needsPct}% / {Math.max(0, 100 - needsPct - savingsRate)}% / {savingsRate}%</span>
              </div>
            </>
          )}
          <div className="wrow">
            <span className="lb">Life Score</span>
            <span className="vl" style={{ color: sc.total >= 70 ? 'var(--g)' : sc.total >= 40 ? 'var(--am)' : 'var(--r)' }}>
              {sc.total}/100{prev ? dlt(cur?.score, prev.score) : ''}
            </span>
          </div>
          <div className="wrow">
            <span className="lb">Net Worth</span>
            <span className="vl" style={{ color: netWorthVal >= 0 ? 'var(--g)' : 'var(--r)' }}>
              ${netWorthVal.toLocaleString()}{prev ? dlt(cur?.nw, prev.nw) : ''}
            </span>
          </div>
        </div>

        {/* Mood Trend Placeholder */}
        {moodLog.length > 1 && (
          <div className="cw">
            <h3>Mood Trend</h3>
            <div className="csub">Last {Math.min(10, moodLog.length)} entries</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px', padding: '8px 0' }}>
              {moodLog.slice(-10).map((m, i) => (
                <div key={i} style={{
                  flex: 1,
                  height: `${(m.v + 1) / 5 * 100}%`,
                  background: 'var(--ac)',
                  borderRadius: '3px',
                  minHeight: '4px',
                  opacity: 0.6 + (m.v / 5) * 0.4,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* AI Insights */}
        {insights.length > 0 && (
          <>
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
              {'\u{1F916}'} AI Analysis
            </div>
            {insights.map((ins, i) => (
              <InsightCard key={i} {...ins} />
            ))}
          </>
        )}

        {/* Coaching Quote */}
        <div className="coach">
          <div className="q" dangerouslySetInnerHTML={{ __html: '"' + q.q + '"' }} />
          <div className="src">{'\u2014'} {q.s}</div>
        </div>

        {/* Recent Activity Feed */}
        {feed.length > 0 && (
          <>
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', marginTop: '8px' }}>
              Recent Activity
            </div>
            <div className="cd">
              {feed.slice(0, 8).map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
                  <div className="dot" style={{ background: 'var(--ac)' }} />
                  <div style={{ flex: 1, fontSize: '12px', color: 'var(--t2)' }}>{f.tx}</div>
                  <div style={{ fontSize: '10px', color: 'var(--t3)' }}>{fd(f.dt)}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
