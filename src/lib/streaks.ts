// ═══ STREAK CALC ═══

/** Calculate consecutive days from today backward in a 7-element week array (Mon=0..Sun=6) */
export function calcStreak(w: number[]): number {
  const di = (new Date().getDay() + 6) % 7; // Monday-indexed day of week
  let s = 0;
  for (let i = di; i >= 0; i--) {
    if (w[i]) s++;
    else break;
  }
  if (di === 6 && s === 7) return 7;
  return s;
}
