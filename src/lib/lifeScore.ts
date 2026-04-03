// ═══ LIFE SCORE ENGINE ═══
import type { AppState, LifeScore } from '../types';

/** Pure function: compute life score from AppState. Cold start: 12.5/25 per domain (neutral). */
export function calcLifeScore(state: AppState): LifeScore {
  const sc = { finance: 12.5, health: 12.5, productivity: 12.5, wellbeing: 12.5, total: 50 };

  // ── Computed helpers (inline, no global state) ──
  const totInc = state.incomeStreams.reduce((a, s) => a + s.amount, 0);
  const totExp = state.expenses.reduce((a, e) => a + e.amount, 0);
  const savingsRate = totInc > 0 ? Math.round((totInc - totExp) / totInc * 100) : 0;
  const savBal = state.assets.filter(a => a.type === 'savings').reduce((a, s) => a + s.value, 0);
  const moExp = totExp > 0 ? savBal / totExp : 0;
  const debtPaid = state.debts.length
    ? state.debts.reduce((a, d) => a + (d.original > 0 ? (d.original - d.balance) / d.original : 0), 0) / state.debts.length
    : 0.5;

  // ── Finance (0-25) ──
  if (totInc > 0 || state.assets.length || state.debts.length) {
    const srScore = Math.min(1, Math.max(0, savingsRate / 20)) * 10;
    const efScore = Math.min(1, moExp / 6) * 8;
    const dpScore = debtPaid * 7;
    sc.finance = Math.round(srScore + efScore + dpScore);
  }

  // ── Health (0-25) ──
  const hKeys: Array<'sleep' | 'steps' | 'water' | 'calories'> = ['sleep', 'steps', 'water', 'calories'];
  const hVals = hKeys.map(k =>
    state.health[k]?.v && state.health[k]?.g
      ? Math.min(1, state.health[k].v / state.health[k].g)
      : 0
  );
  const hasH = hVals.some(v => v > 0);
  const now = Date.now();
  const wkWk = state.workouts.filter(w => {
    const d = new Date(w.dt + 'T12:00:00');
    return (now - d.getTime()) / 864e5 <= 7;
  }).length;
  if (hasH || wkWk > 0) {
    const hAvg = hVals.reduce((a, v) => a + v, 0) / 4;
    const wkScore = Math.min(1, wkWk / 4);
    sc.health = Math.round(hAvg * 18 + wkScore * 7);
  }

  // ── Productivity (0-25) ──
  const tDone = state.tasks.filter(t => t.done).length;
  const tAll = state.tasks.length;
  const tPct = tAll > 0 ? tDone / tAll : 0.5;
  const habC = state.habits.length
    ? state.habits.reduce((a, h) => (h.w || []).filter(d => d).length + a, 0) / (state.habits.length * 7)
    : 0.5;
  const lrnAvg = state.learning.length
    ? state.learning.reduce((a, l) => a + l.progress, 0) / (state.learning.length * 100)
    : 0.5;
  if (tAll > 0 || state.habits.length || state.learning.length) {
    sc.productivity = Math.round(tPct * 10 + habC * 10 + lrnAvg * 5);
  }

  // ── Wellbeing (0-25) ──
  const moods = state.moodLog.slice(-10);
  const moodAvg = moods.length ? moods.reduce((a, m) => a + m.v, 0) / moods.length / 4 : 0.5;
  const twInv = state.timeLog.waste > 0 ? Math.max(0, 1 - state.timeLog.waste / 30) : 0.5;
  const goalPct = state.goals.length
    ? state.goals.reduce((a, g) => a + (g.target ? Math.min(1, g.current / g.target) : 0), 0) / state.goals.length
    : 0.5;
  if (moods.length || state.goals.length || state.timeLog.waste > 0) {
    sc.wellbeing = Math.round(moodAvg * 10 + twInv * 8 + goalPct * 7);
  }

  // ── Clamp all domains ──
  sc.finance = Math.max(0, Math.min(25, sc.finance));
  sc.health = Math.max(0, Math.min(25, sc.health));
  sc.productivity = Math.max(0, Math.min(25, sc.productivity));
  sc.wellbeing = Math.max(0, Math.min(25, sc.wellbeing));
  sc.total = sc.finance + sc.health + sc.productivity + sc.wellbeing;

  return sc;
}
