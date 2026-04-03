import type { AppState, DomainKey } from '../types';

export const DOMS: Record<DomainKey, { nm: string; ic: string; desc: string }> = {
  tasks: { nm: 'Tasks', ic: '✅', desc: 'Get things done' },
  habits: { nm: 'Habits', ic: '🔥', desc: 'Build consistency' },
  health: { nm: 'Health', ic: '💪', desc: 'Track vitals' },
  finance: { nm: 'Finance', ic: '💸', desc: 'Cash flow' },
  mood: { nm: 'Mood', ic: '😊', desc: 'How you feel' },
  goals: { nm: 'Goals', ic: '🎯', desc: 'Chase targets' },
  time: { nm: 'Time', ic: '⏰', desc: 'Where hours go' },
  notes: { nm: 'Notes', ic: '📝', desc: 'Write it down' },
  ideas: { nm: 'Ideas', ic: '💡', desc: 'Capture sparks' },
  skills: { nm: 'Skills', ic: '🧠', desc: 'Grow abilities' },
  learning: { nm: 'Learning', ic: '📚', desc: 'Never stop' },
  contacts: { nm: 'Network', ic: '👥', desc: 'Your people' },
  workouts: { nm: 'Workouts', ic: '🏋️', desc: 'Log effort' },
};

export const FRESH: AppState = {
  onboarded: false, curDom: null,
  tasks: [],
  habits: [
    { n: 'Read 30 min', s: 0, best: 0, w: [0, 0, 0, 0, 0, 0, 0], c: '#38bdf8' },
    { n: 'Exercise', s: 0, best: 0, w: [0, 0, 0, 0, 0, 0, 0], c: '#34d399' },
    { n: 'No phone first hour', s: 0, best: 0, w: [0, 0, 0, 0, 0, 0, 0], c: '#a78bfa' },
  ],
  health: {
    sleep: { v: 0, g: 8, u: 'hrs', h: [] },
    steps: { v: 0, g: 10000, u: 'steps', h: [] },
    water: { v: 0, g: 2.5, u: 'L', h: [] },
    calories: { v: 0, g: 2200, u: 'kcal', h: [] },
  },
  moodLog: [], notes: [], ideas: [], contacts: [], workouts: [],
  incomeStreams: [], expenses: [],
  assets: [], debts: [],
  skills: [], learning: [],
  timeLog: { work: 0, learn: 0, health: 0, personal: 0, waste: 0 },
  goals: [], weeklyActions: [], actionWeek: '',
  milestones: [], feed: [],
  lifeScoreHistory: [], weeklySnapshots: [], lastSnapshotWeek: '',
};

export const MOODS = ['Stressed', 'Low', 'OK', 'Good', 'Peak'] as const;
export const MOOD_EMOJIS = ['😤', '😐', '🙂', '😊', '🔥'] as const;

export const MILESTONES = [
  { id: 'first_inc', em: '💰', nm: 'First Income', desc: 'Log income source' },
  { id: 's1k', em: '🏦', nm: '$1K Saved', desc: 'Savings reach $1K' },
  { id: 'sr20', em: '📊', nm: '20% Saver', desc: 'Savings rate hits 20%' },
  { id: 'inv1', em: '📈', nm: 'First Investment', desc: 'Make first investment' },
  { id: 'nwp', em: '✨', nm: 'Positive Net Worth', desc: 'Assets > debts' },
  { id: 'nw10', em: '🚀', nm: '$10K Net Worth', desc: 'Net worth $10K+' },
  { id: 'df', em: '🎉', nm: 'Debt Free', desc: 'All debts paid' },
  { id: 't10', em: '⚡', nm: '10 Tasks Done', desc: 'Complete 10 tasks' },
  { id: 'h7', em: '🔥', nm: '7-Day Streak', desc: '7-day habit streak' },
  { id: 'ms', em: '🌊', nm: 'Multi-Stream', desc: '3+ income sources' },
];

export const QUOTES = [
  { q: 'You do not rise to the level of your <strong>goals</strong>. You fall to the level of your <strong>systems</strong>.', s: 'James Clear, Atomic Habits' },
  { q: 'What gets <strong>measured</strong> gets managed. Tracking alone puts you ahead of 90%.', s: 'Peter Drucker' },
  { q: 'The <strong>Rule of 72</strong>: divide 72 by your return rate to see how many years to double your money.', s: 'Financial mathematics' },
  { q: 'Adults who sleep <strong>&lt;7 hours</strong> have higher rates of obesity, heart disease & diabetes.', s: 'CDC & NIH' },
  { q: '<strong>7,000+ steps/day</strong> is associated with 50-70% lower risk of premature mortality.', s: 'JAMA 2021' },
  { q: 'It takes on average <strong>66 days</strong> to form a new habit — not 21.', s: 'Phillippa Lally, UCL (2009)' },
  { q: 'The <strong>50/30/20 rule</strong>: 50% needs, 30% wants, 20% savings.', s: 'Elizabeth Warren' },
  { q: '<strong>150-300 minutes</strong> of moderate aerobic activity per week significantly reduces chronic disease risk.', s: 'WHO Guidelines (2020)' },
];
