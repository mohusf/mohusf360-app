// ═══ TYPES ═══
export interface Task {
  id: number; t: string; pri: 'High' | 'Medium' | 'Low'; done: boolean; dt: string; doneDate?: string;
}
export interface Habit {
  n: string; s: number; best: number; w: number[]; c: string;
}
export interface HealthMetric {
  v: number; g: number; u: string; h: number[];
}
export interface HealthData {
  sleep: HealthMetric; steps: HealthMetric; water: HealthMetric; calories: HealthMetric;
}
export interface MoodEntry { v: number; dt: string; }
export interface Note { id: number; t: string; b: string; dt: string; }
export interface Idea { id: number; t: string; b: string; dt: string; }
export interface Contact { id: number; nm: string; rl: string; lc: string; freq: 'weekly' | 'monthly' | 'quarterly'; }
export interface Workout { id: number; dt: string; tp: string; de: string; mt: string; }
export interface IncomeStream { id: number; name: string; type: string; amount: number; }
export interface Expense { id: number; name: string; amount: number; category: string; date: string; recurring: boolean; }
export interface Asset { id: number; name: string; value: number; type: 'savings' | 'investment'; }
export interface Debt { id: number; name: string; balance: number; original: number; rate: number; monthlyPay: number; }
export interface Skill { id: number; name: string; level: number; category: string; potentialIncome: number; }
export interface LearningItem { id: number; name: string; platform: string; progress: number; }
export interface Goal { id: number; name: string; target: number; current: number; deadline: string; }
export interface TimeLog { work: number; learn: number; health: number; personal: number; waste: number; }
export interface WeeklyAction { id: number; text: string; why: string; impact: string; pri: number; done: boolean; }
export interface FeedItem { tx: string; dt: string; ts: number; }
export interface WeeklySnapshot {
  week: string; score: number; tasksDone: number; tasksTotal: number;
  habitPct: number; avgSleep: number; avgMood: number; saved: number; nw: number;
}
export interface LifeScore { finance: number; health: number; productivity: number; wellbeing: number; total: number; }
export interface Insight { ic: string; title: string; body: string; color: string; }

export interface AppState {
  onboarded: boolean; curDom: string | null;
  tasks: Task[]; habits: Habit[];
  health: HealthData; moodLog: MoodEntry[];
  notes: Note[]; ideas: Idea[]; contacts: Contact[]; workouts: Workout[];
  incomeStreams: IncomeStream[]; expenses: Expense[];
  assets: Asset[]; debts: Debt[];
  skills: Skill[]; learning: LearningItem[];
  timeLog: TimeLog;
  goals: Goal[]; weeklyActions: WeeklyAction[]; actionWeek: string;
  milestones: string[]; feed: FeedItem[];
  lifeScoreHistory: { score: number; date: string }[];
  weeklySnapshots: WeeklySnapshot[]; lastSnapshotWeek: string;
}

export type HealthKey = 'sleep' | 'steps' | 'water' | 'calories';
export type DomainKey = 'tasks' | 'habits' | 'health' | 'finance' | 'mood' | 'goals' | 'time' | 'notes' | 'ideas' | 'skills' | 'learning' | 'contacts' | 'workouts';
