// ═══ STRATEGY ENGINE ═══
import type { AppState, WeeklyAction } from '../types';
import { futDate, debtMos } from './projections';

/** Generate personalized weekly actions from current state */
export function genActions(state: AppState): WeeklyAction[] {
  const A: Array<{ text: string; why: string; impact: string; pri: number }> = [];

  // ── Computed helpers ──
  const inc = state.incomeStreams.reduce((a, s) => a + s.amount, 0);
  const exp = state.expenses.reduce((a, e) => a + e.amount, 0);
  const savingsRate = inc > 0 ? Math.round((inc - exp) / inc * 100) : 0;
  const saved = inc - exp;
  const debts = state.debts;

  // Savings rate
  if (savingsRate < 20 && inc > 0) {
    const gap = Math.round(inc * 0.2 - saved);
    A.push({ text: 'Increase savings rate to 20%', why: `Currently ${savingsRate}%. Need $${gap} more/mo.`, impact: `+$${(gap * 12).toLocaleString()}/year`, pri: 1 });
  } else if (savingsRate >= 20 && inc > 0) {
    A.push({ text: 'Strong savings rate — invest surplus', why: `${savingsRate}% is excellent. Direct surplus to investments.`, impact: 'Wealth compounding', pri: 5 });
  }

  // Top spending category
  const cats: Record<string, number> = {};
  state.expenses.forEach(e => { cats[e.category] = (cats[e.category] || 0) + e.amount; });
  const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  if (sorted.length && sorted[0][1] > inc * 0.3) {
    A.push({ text: `Review ${sorted[0][0]} — $${sorted[0][1].toLocaleString()}/mo`, why: `${Math.round(sorted[0][1] / Math.max(inc, 1) * 100)}% of income. Reduce 10%?`, impact: `Save $${Math.round(sorted[0][1] * 0.1)}/mo`, pri: 2 });
  }

  // Subscription audit
  const rec = state.expenses.filter(e => e.recurring);
  if (rec.length >= 3) {
    A.push({ text: `Audit ${rec.length} subscriptions ($${rec.reduce((a, e) => a + e.amount, 0)}/mo)`, why: 'Cancel unused ones.', impact: 'Potential savings', pri: 3 });
  }

  // Debt payoff
  if (debts.length) {
    const hi = debts.reduce((a, d) => d.rate > a.rate ? d : a, debts[0]);
    A.push({ text: `Extra $100 on ${hi.name} (${hi.rate}% APR)`, why: `Highest interest. Payoff: ${futDate(debtMos(hi.balance, hi.rate, hi.monthlyPay))}.`, impact: 'Save months of interest', pri: 2 });
  }

  // Skill monetization
  if (state.skills.length) {
    const top = state.skills.reduce((a, s) => s.potentialIncome > a.potentialIncome ? s : a, state.skills[0]);
    if (top.potentialIncome > 0) {
      A.push({ text: `Monetize ${top.name} — $${top.potentialIncome}/hr`, why: 'Freelance, consulting, or content.', impact: `+$${(top.potentialIncome * 10 * 4).toLocaleString()}/mo`, pri: 2 });
    }
  }

  // Learning completion
  if (state.learning.length) {
    const st = state.learning.filter(l => l.progress > 20 && l.progress < 80);
    if (st.length) {
      A.push({ text: `Finish ${st[0].name} (${st[0].progress}%)`, why: 'Course completion compounds earning potential.', impact: 'Skill upgrade', pri: 3 });
    }
  }

  // Emergency fund
  const savBal = state.assets.filter(a => a.type === 'savings').reduce((a, s) => a + s.value, 0);
  const moExp = exp > 0 ? Math.round(savBal / exp * 10) / 10 : 0;
  if (moExp < 6 && exp > 0) {
    A.push({ text: `Build emergency fund — ${moExp} of 6 months`, why: `${moExp} months saved. Target: 6.`, impact: 'Financial safety net', pri: moExp < 1 ? 1 : 3 });
  }

  // Task clearing
  const openT = state.tasks.filter(t => !t.done);
  if (openT.length) {
    A.push({ text: `Clear ${Math.min(3, openT.length)} tasks today`, why: `${openT.length} tasks open. Focus on top priority.`, impact: 'Progress + momentum', pri: 2 });
  }

  // Contact reminders
  const now = Date.now();
  (state.contacts || []).forEach(c => {
    if (!c.freq || !c.lc) return;
    const thresh: Record<string, number> = { weekly: 7, monthly: 30, quarterly: 90 };
    const days = Math.floor((now - new Date(c.lc + 'T12:00:00').getTime()) / 864e5);
    if (days > (thresh[c.freq] || 30)) {
      A.push({ text: `Reach out to ${c.nm}`, why: `Last contacted ${days} days ago (${c.freq}).`, impact: 'Relationship maintenance', pri: 3 });
    }
  });

  // Onboarding prompts
  if (!state.incomeStreams.length) {
    A.push({ text: 'Log your income sources', why: 'Strategy starts with knowing what you earn.', impact: 'Unlock recommendations', pri: 1 });
  }
  if (!state.expenses.length) {
    A.push({ text: 'Log monthly expenses', why: "Can't optimize what you don't measure.", impact: 'Unlock spending insights', pri: 1 });
  }

  A.sort((a, b) => a.pri - b.pri);
  return A.slice(0, 5).map((a, i) => ({ ...a, id: i, done: false }));
}
