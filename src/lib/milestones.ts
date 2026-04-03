// ═══ MILESTONE CHECKER ═══
import type { AppState } from '../types';
import { MILESTONES } from './constants';

/** Check milestones and return array of newly achieved milestone IDs */
export function checkMilestones(state: AppState): string[] {
  const newly: string[] = [];

  // ── Computed helpers ──
  const totInc = state.incomeStreams.reduce((a, s) => a + s.amount, 0);
  const totExp = state.expenses.reduce((a, e) => a + e.amount, 0);
  const totAssets = state.assets.reduce((a, s) => a + s.value, 0);
  const totDebts = state.debts.reduce((a, d) => a + d.balance, 0);
  const netWorth = totAssets - totDebts;
  const savingsRate = totInc > 0 ? Math.round((totInc - totExp) / totInc * 100) : 0;

  // Milestone check functions keyed by ID
  const checks: Record<string, () => boolean> = {
    first_inc: () => state.incomeStreams.length > 0,
    s1k: () => state.assets.filter(a => a.type === 'savings').reduce((a, s) => a + s.value, 0) >= 1000,
    sr20: () => savingsRate >= 20,
    inv1: () => state.assets.some(a => a.type === 'investment'),
    nwp: () => netWorth > 0 && (state.assets.length > 0 || state.debts.length > 0),
    nw10: () => netWorth >= 10000,
    df: () => state.debts.length > 0 && state.debts.every(d => d.balance <= 0),
    t10: () => state.tasks.filter(t => t.done).length >= 10,
    h7: () => state.habits.some(h => (h.best || h.s) >= 7),
    ms: () => state.incomeStreams.length >= 3,
  };

  for (const m of MILESTONES) {
    if (state.milestones.includes(m.id)) continue;
    const ck = checks[m.id];
    if (ck && ck()) {
      newly.push(m.id);
    }
  }

  return newly;
}
