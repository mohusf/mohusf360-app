// ═══ SCIENCE-BACKED INSIGHT GENERATOR ═══
import type { AppState, Insight } from '../types';

/** Generate insights with CDC/JAMA/WHO/UCL citations */
export function getInsights(state: AppState): Insight[] {
  const I: Insight[] = [];

  // ── Computed helpers ──
  const inc = state.incomeStreams.reduce((a, s) => a + s.amount, 0);
  const exp = state.expenses.reduce((a, e) => a + e.amount, 0);
  const savingsRate = inc > 0 ? Math.round((inc - exp) / inc * 100) : 0;

  // ── 50/30/20 rule ──
  if (inc > 0) {
    const needs = state.expenses
      .filter(e => ['Housing', 'Transport', 'Food', 'Health'].includes(e.category))
      .reduce((a, e) => a + e.amount, 0);
    const needsPct = Math.round(needs / inc * 100);
    if (needsPct > 50) {
      I.push({ ic: '\u{1F3E0}', title: `Needs: ${needsPct}% (target \u226450%)`, body: `The 50/30/20 rule recommends \u226450% on needs. You're <strong>${needsPct - 50}% over</strong>. Review housing & transport costs.`, color: 'var(--am)' });
    } else {
      I.push({ ic: '\u2705', title: `Needs: ${needsPct}% \u2014 within 50% target`, body: 'Healthy allocation per the 50/30/20 budgeting framework.', color: 'var(--g)' });
    }
  }

  // ── Savings rate ──
  if (savingsRate >= 20) {
    I.push({ ic: '\u{1F4AA}', title: 'Strong saver', body: `<strong>${savingsRate}%</strong> savings rate exceeds the recommended 20% benchmark. Direct surplus to index funds for long-term compounding.`, color: 'var(--g)' });
  } else if (savingsRate > 0 && savingsRate < 20) {
    I.push({ ic: '\u{1F4CA}', title: `Savings gap: ${20 - savingsRate}%`, body: `At <strong>${savingsRate}%</strong>, you're $${Math.round(inc * 0.2 - inc * savingsRate / 100)} short of the 20% target. Automate transfers on payday.`, color: 'var(--am)' });
  }

  // ── Emergency fund ──
  const sav = state.assets.filter(a => a.type === 'savings').reduce((a, s) => a + s.value, 0);
  const moExp = exp > 0 ? Math.round(sav / exp * 10) / 10 : 0;
  if (moExp < 3 && exp > 0) {
    I.push({ ic: '\u{1F6A8}', title: `Emergency fund: ${moExp} months`, body: 'Financial experts recommend <strong>3-6 months</strong> of expenses. Prioritize this.', color: 'var(--r)' });
  } else if (moExp >= 3 && moExp < 6 && exp > 0) {
    I.push({ ic: '\u{1F6E1}\uFE0F', title: `Emergency fund: ${moExp} months`, body: `Good progress. Target <strong>6 months</strong> ($${Math.round(exp * 6).toLocaleString()}) for full financial resilience.`, color: 'var(--am)' });
  }

  // ── Debt avalanche ──
  if (state.debts.length) {
    const hi = state.debts.reduce((a, d) => d.rate > a.rate ? d : a, state.debts[0]);
    I.push({ ic: '\u{1F3E6}', title: `Highest rate: ${hi.name} ${hi.rate}%`, body: 'The <strong>avalanche method</strong> (highest rate first) saves the most interest mathematically.', color: 'var(--r)' });
  }

  // ── Skill monetization ──
  if (state.skills.length && !state.incomeStreams.some(s => s.type === 'freelance')) {
    I.push({ ic: '\u{1F4A1}', title: 'Untapped skill value', body: `<strong>${state.skills.length} skills</strong> but no freelance income. 5 hrs/week could add <strong>$${Math.round(state.skills.reduce((a, s) => Math.max(a, s.potentialIncome), 0) * 5 * 4).toLocaleString()}/mo</strong>.`, color: 'var(--ac)' });
  }

  // ── Sleep — CDC ──
  const avgSl = (state.health?.sleep?.h || []).filter(v => v > 0);
  if (avgSl.length >= 3) {
    const avg = (avgSl.reduce((a, v) => a + v, 0) / avgSl.length).toFixed(1);
    if (parseFloat(avg) < 7) {
      I.push({ ic: '\u{1F319}', title: `Sleep avg: ${avg}h \u2014 below CDC minimum`, body: 'CDC recommends <strong>\u22657 hours</strong> for adults. Chronic short sleep increases health risks.', color: 'var(--r)' });
    } else if (parseFloat(avg) >= 7 && parseFloat(avg) <= 9) {
      I.push({ ic: '\u{1F319}', title: `Sleep avg: ${avg}h \u2014 optimal range`, body: 'Within the CDC recommended <strong>7-9 hour</strong> range.', color: 'var(--g)' });
    }
  }

  // ── Steps — JAMA 2021 ──
  const avgSt = (state.health?.steps?.h || []).filter(v => v > 0);
  if (avgSt.length >= 3) {
    const avg = Math.round(avgSt.reduce((a, v) => a + v, 0) / avgSt.length);
    if (avg < 7000) {
      I.push({ ic: '\u{1F45F}', title: `Steps avg: ${avg.toLocaleString()} \u2014 below 7K`, body: `JAMA 2021: <strong>7,000+ steps/day</strong> reduces mortality risk by 50-70%. Need ~${(7000 - avg).toLocaleString()} more.`, color: 'var(--am)' });
    } else {
      I.push({ ic: '\u{1F45F}', title: `Steps avg: ${avg.toLocaleString()} \u2014 great`, body: 'Above the 7,000-step threshold linked to lower mortality risk.', color: 'var(--g)' });
    }
  }

  // ── Workouts — WHO Guidelines (2020) ──
  if (state.workouts.length) {
    const now = Date.now();
    const thisWeek = state.workouts.filter(w => {
      const d = new Date(w.dt + 'T12:00:00');
      return (now - d.getTime()) / 864e5 <= 7;
    }).length;
    if (thisWeek < 3) {
      I.push({ ic: '\u{1F3CB}\uFE0F', title: `${thisWeek} workouts this week`, body: 'WHO recommends <strong>150-300 min</strong> of moderate exercise per week (3-5 sessions).', color: 'var(--am)' });
    } else {
      I.push({ ic: '\u{1F3CB}\uFE0F', title: `${thisWeek} workouts this week \u2014 solid`, body: 'Meeting WHO physical activity guidelines.', color: 'var(--g)' });
    }
  }

  // ── Time waste ──
  if (state.timeLog.waste > 10) {
    I.push({ ic: '\u23F0', title: `${state.timeLog.waste}h/week unproductive`, body: 'Redirect 5 hrs to learning = <strong>260 hrs/year</strong> of skill building.', color: 'var(--am)' });
  }

  // ── Habit consistency — UCL (Phillippa Lally, 2009) ──
  const habC = state.habits.length
    ? (state.habits.reduce((a, h) => (h.w || []).filter(d => d).length + a, 0) / (state.habits.length * 7) * 100)
    : 0;
  if (habC > 0 && habC < 70) {
    I.push({ ic: '\u{1F525}', title: `Habit consistency: ${Math.round(habC)}%`, body: 'UCL research shows habits take ~66 days on average to form (not 21). Keep going.', color: habC > 50 ? 'var(--g)' : 'var(--am)' });
  } else if (habC >= 70) {
    I.push({ ic: '\u{1F525}', title: `Habit consistency: ${Math.round(habC)}% \u2014 excellent`, body: "Strong adherence. Missing one day doesn't reset habit formation.", color: 'var(--g)' });
  }

  return I;
}
