// ═══ PROJECTIONS ═══

/** Months to reach a goal given current value and monthly contribution */
export function mos2goal(target: number, current: number, monthly: number): number {
  if (monthly <= 0) return Infinity;
  return Math.ceil((target - current) / monthly);
}

/** Future value with compound interest */
export function compound(monthly: number, rate: number, years: number): number {
  const r = rate / 100 / 12;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r);
}

/** Months to pay off a debt */
export function debtMos(balance: number, rate: number, payment: number): number {
  if (payment <= 0) return Infinity;
  const r = rate / 100 / 12;
  if (r === 0) return Math.ceil(balance / payment);
  if (balance * r >= payment) return Infinity;
  return Math.ceil(-Math.log(1 - balance * r / payment) / Math.log(1 + r));
}

/** Projected date string N months from now */
export function futDate(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/** Formatted date display from YYYY-MM-DD string */
export function fd(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
