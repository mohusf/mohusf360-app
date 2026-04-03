// ═══ SMART NLP PARSER ═══

export interface NLPResult {
  type: 'health' | 'workout' | 'learning' | 'income' | 'expense' | 'mood' | 'task';
  key?: string;
  val?: number;
  tx: string;
  amount?: number;
  cat?: string;
}

/** Parse natural language input into a structured result */
export function parseNLP(text: string): NLPResult | null {
  const t = text.trim().toLowerCase();
  if (!t) return null;
  let m: RegExpMatchArray | null;

  // Sleep
  m = t.match(/(?:slept?|sleep)\s*[:=]?\s*(\d+\.?\d*)/i) || t.match(/(\d+\.?\d*)\s*h(?:ou?rs?)?\s*sleep/i);
  if (m) return { type: 'health', key: 'sleep', val: parseFloat(m[1]), tx: 'Slept ' + m[1] + ' hours' };

  // Steps
  m = t.match(/(\d+\.?\d*)\s*k?\s*steps/i);
  if (m) {
    let v = parseFloat(m[1]);
    if (v < 100) v *= 1000;
    return { type: 'health', key: 'steps', val: v, tx: Math.round(v).toLocaleString() + ' steps' };
  }

  // Water
  m = t.match(/(?:water|drank?)\s*[:=]?\s*(\d+\.?\d*)/i) || t.match(/(\d+\.?\d*)\s*l(?:iters?)?/i);
  if (m) return { type: 'health', key: 'water', val: parseFloat(m[1]), tx: 'Drank ' + m[1] + 'L water' };

  // Workout — running
  m = t.match(/(?:ran|run|jog)\s*(\d+\.?\d*)/i);
  if (m) return { type: 'workout', tx: 'Ran ' + m[1] + 'K' };

  // Workout — general
  if (/gym|lift|workout|exercise|push.?up|squat|swim|cycling|hiit|yoga/i.test(t)) {
    return { type: 'workout', tx: text.trim() };
  }

  // Learning
  m = t.match(/(?:read|study|studied|learn|course)\s*(?:for\s*)?(\d+)?/i);
  if (m) return { type: 'learning', tx: text.trim() };

  // Income
  m = t.match(/(?:earned?|income|salary|got paid)\s*\$?(\d+\.?\d*)/i);
  if (m) return { type: 'income', amount: parseFloat(m[1]), tx: 'Earned $' + parseFloat(m[1]).toLocaleString() };

  // Expense
  m = t.match(/(?:spent?|paid|bought)\s*\$?(\d+\.?\d*)\s*(.*)/i) || t.match(/\$(\d+\.?\d*)\s+(.*)/i);
  if (m) return { type: 'expense', amount: parseFloat(m[1]), cat: m[2]?.trim() || 'Other', tx: 'Spent $' + parseFloat(m[1]).toLocaleString() };

  // Mood
  if (/feeling\s*(great|amazing|peak)/i.test(t)) return { type: 'mood', val: 4, tx: 'Feeling peak' };
  if (/feeling\s*(good|happy)/i.test(t)) return { type: 'mood', val: 3, tx: 'Feeling good' };
  if (/feeling\s*(ok|fine|meh)/i.test(t)) return { type: 'mood', val: 2, tx: 'Feeling okay' };
  if (/feeling\s*(bad|low|sad)|stressed|anxious/i.test(t)) return { type: 'mood', val: 1, tx: 'Feeling low' };
  if (/meditat/i.test(t)) return { type: 'mood', val: 3, tx: 'Meditated' };

  // Fallback: task
  return { type: 'task', tx: text.trim() };
}
