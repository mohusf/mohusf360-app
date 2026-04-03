import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState, Task, Habit, IncomeStream, Expense, Asset, Debt,
  Skill, LearningItem, Goal, Note, Idea, Contact, Workout,
  WeeklyAction, WeeklySnapshot, HealthKey,
} from '../types';
import { FRESH } from '../lib/constants';
import { calcStreak } from '../lib/streaks';

// ═══ COMPUTED SELECTORS ═══
export const totInc = (s: AppState) => s.incomeStreams.reduce((a, x) => a + x.amount, 0);
export const totExp = (s: AppState) => s.expenses.reduce((a, x) => a + x.amount, 0);
export const totAssets = (s: AppState) => s.assets.reduce((a, x) => a + x.value, 0);
export const totDebts = (s: AppState) => s.debts.reduce((a, x) => a + x.balance, 0);
export const nw = (s: AppState) => totAssets(s) - totDebts(s);
export const sr = (s: AppState) => {
  const i = totInc(s);
  return i > 0 ? Math.round((i - totExp(s)) / i * 100) : 0;
};
export const saved = (s: AppState) => totInc(s) - totExp(s);

// ═══ STORE INTERFACE ═══
interface AppActions {
  // Navigation
  setCurDom: (dom: string | null) => void;
  setOnboarded: (v: boolean) => void;

  // Tasks
  addTask: (task: Task) => void;
  togTask: (id: number) => void;
  delTask: (id: number) => void;

  // Habits
  addHabit: (habit: Habit) => void;
  togHabit: (hi: number, di: number) => void;
  delHabit: (index: number) => void;

  // Health
  updateHealth: (key: HealthKey, value: number) => void;

  // Mood
  setMood: (v: number) => void;

  // Finance
  addIncome: (item: IncomeStream) => void;
  delIncome: (id: number) => void;
  addExpense: (item: Expense) => void;
  delExpense: (id: number) => void;
  addAsset: (item: Asset) => void;
  delAsset: (id: number) => void;
  addDebt: (item: Debt) => void;
  delDebt: (id: number) => void;

  // Skills & Learning
  addSkill: (item: Skill) => void;
  delSkill: (id: number) => void;
  addLearning: (item: LearningItem) => void;
  delLearning: (id: number) => void;
  updateLearningProgress: (id: number, progress: number) => void;

  // Goals
  addGoal: (item: Goal) => void;
  delGoal: (id: number) => void;
  updateGoalProgress: (id: number, current: number) => void;

  // Notes & Ideas
  addNote: (item: Note) => void;
  delNote: (id: number) => void;
  addIdea: (item: Idea) => void;
  delIdea: (id: number) => void;

  // Contacts
  addContact: (item: Contact) => void;
  delContact: (id: number) => void;
  touchContact: (id: number) => void;

  // Workouts
  addWorkout: (item: Workout) => void;
  delWorkout: (id: number) => void;

  // Time
  adjTime: (key: keyof AppState['timeLog'], delta: number) => void;

  // Weekly Actions
  setWeeklyActions: (actions: WeeklyAction[], week: string) => void;
  togAction: (index: number) => void;

  // Feed
  addFeed: (tx: string) => void;

  // Milestones
  addMilestone: (id: string) => void;

  // Snapshots
  pushSnapshot: (snap: WeeklySnapshot) => void;
  setLastSnapshotWeek: (week: string) => void;

  // Life Score History
  pushLifeScore: (score: number, date: string) => void;

  // Data management
  loadDemo: () => void;
  resetAll: () => void;
  exportData: () => void;
  importData: () => void;
}

type Store = AppState & AppActions;

const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // ═══ INITIAL STATE ═══
      ...JSON.parse(JSON.stringify(FRESH)),

      // ═══ NAVIGATION ═══
      setCurDom: (dom) => set({ curDom: dom }),
      setOnboarded: (v) => set({ onboarded: v }),

      // ═══ TASKS ═══
      addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
      togTask: (id) => set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === id
            ? { ...t, done: !t.done, doneDate: !t.done ? new Date().toISOString().slice(0, 10) : undefined }
            : t
        ),
      })),
      delTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      // ═══ HABITS ═══
      addHabit: (habit) => set((s) => ({ habits: [...s.habits, habit] })),
      togHabit: (hi, di) => set((s) => {
        const habits = s.habits.map((h, i) => {
          if (i !== hi) return h;
          const w = [...h.w];
          w[di] = w[di] ? 0 : 1;
          const streak = calcStreak(w);
          const best = Math.max(h.best || 0, streak);
          return { ...h, w, s: streak, best };
        });
        return { habits };
      }),
      delHabit: (index) => set((s) => ({
        habits: s.habits.filter((_, i) => i !== index),
      })),

      // ═══ HEALTH ═══
      updateHealth: (key, value) => set((s) => {
        const metric = s.health[key];
        const h = [...metric.h, value];
        if (h.length > 7) h.shift();
        return {
          health: {
            ...s.health,
            [key]: { ...metric, v: value, h },
          },
        };
      }),

      // ═══ MOOD ═══
      setMood: (v) => set((s) => ({
        moodLog: [...s.moodLog, { v, dt: new Date().toISOString() }],
      })),

      // ═══ FINANCE ═══
      addIncome: (item) => set((s) => ({ incomeStreams: [...s.incomeStreams, item] })),
      delIncome: (id) => set((s) => ({ incomeStreams: s.incomeStreams.filter((x) => x.id !== id) })),
      addExpense: (item) => set((s) => ({ expenses: [...s.expenses, item] })),
      delExpense: (id) => set((s) => ({ expenses: s.expenses.filter((x) => x.id !== id) })),
      addAsset: (item) => set((s) => ({ assets: [...s.assets, item] })),
      delAsset: (id) => set((s) => ({ assets: s.assets.filter((x) => x.id !== id) })),
      addDebt: (item) => set((s) => ({ debts: [...s.debts, item] })),
      delDebt: (id) => set((s) => ({ debts: s.debts.filter((x) => x.id !== id) })),

      // ═══ SKILLS & LEARNING ═══
      addSkill: (item) => set((s) => ({ skills: [...s.skills, item] })),
      delSkill: (id) => set((s) => ({ skills: s.skills.filter((x) => x.id !== id) })),
      addLearning: (item) => set((s) => ({ learning: [...s.learning, item] })),
      delLearning: (id) => set((s) => ({ learning: s.learning.filter((x) => x.id !== id) })),
      updateLearningProgress: (id, progress) => set((s) => ({
        learning: s.learning.map((l) =>
          l.id === id ? { ...l, progress: Math.min(100, Math.max(0, progress)) } : l
        ),
      })),

      // ═══ GOALS ═══
      addGoal: (item) => set((s) => ({ goals: [...s.goals, item] })),
      delGoal: (id) => set((s) => ({ goals: s.goals.filter((x) => x.id !== id) })),
      updateGoalProgress: (id, current) => set((s) => ({
        goals: s.goals.map((g) =>
          g.id === id ? { ...g, current } : g
        ),
      })),

      // ═══ NOTES & IDEAS ═══
      addNote: (item) => set((s) => ({ notes: [item, ...s.notes] })),
      delNote: (id) => set((s) => ({ notes: s.notes.filter((x) => x.id !== id) })),
      addIdea: (item) => set((s) => ({ ideas: [item, ...s.ideas] })),
      delIdea: (id) => set((s) => ({ ideas: s.ideas.filter((x) => x.id !== id) })),

      // ═══ CONTACTS ═══
      addContact: (item) => set((s) => ({ contacts: [item, ...s.contacts] })),
      delContact: (id) => set((s) => ({ contacts: s.contacts.filter((x) => x.id !== id) })),
      touchContact: (id) => set((s) => ({
        contacts: s.contacts.map((c) =>
          c.id === id ? { ...c, lc: new Date().toISOString().slice(0, 10) } : c
        ),
      })),

      // ═══ WORKOUTS ═══
      addWorkout: (item) => set((s) => ({ workouts: [item, ...s.workouts] })),
      delWorkout: (id) => set((s) => ({ workouts: s.workouts.filter((x) => x.id !== id) })),

      // ═══ TIME ═══
      adjTime: (key, delta) => set((s) => ({
        timeLog: { ...s.timeLog, [key]: Math.max(0, (s.timeLog[key] || 0) + delta) },
      })),

      // ═══ WEEKLY ACTIONS ═══
      setWeeklyActions: (actions, week) => set({ weeklyActions: actions, actionWeek: week }),
      togAction: (index) => set((s) => ({
        weeklyActions: s.weeklyActions.map((a, i) =>
          i === index ? { ...a, done: !a.done } : a
        ),
      })),

      // ═══ FEED ═══
      addFeed: (tx) => set((s) => {
        const feed = [
          { tx, dt: new Date().toISOString().slice(0, 10), ts: Date.now() },
          ...s.feed,
        ].slice(0, 50);
        return { feed };
      }),

      // ═══ MILESTONES ═══
      addMilestone: (id) => set((s) =>
        s.milestones.includes(id) ? {} : { milestones: [...s.milestones, id] }
      ),

      // ═══ SNAPSHOTS ═══
      pushSnapshot: (snap) => set((s) => {
        const snapshots = [...s.weeklySnapshots, snap];
        if (snapshots.length > 12) snapshots.shift();
        return { weeklySnapshots: snapshots };
      }),
      setLastSnapshotWeek: (week) => set({ lastSnapshotWeek: week }),

      // ═══ LIFE SCORE HISTORY ═══
      pushLifeScore: (score, date) => set((s) => {
        const history = [...s.lifeScoreHistory];
        if (!history.length || history[history.length - 1].date !== date) {
          history.push({ score, date });
          if (history.length > 30) history.shift();
        }
        return { lifeScoreHistory: history };
      }),

      // ═══ LOAD DEMO ═══
      loadDemo: () => set({
        onboarded: true,
        curDom: null,
        tasks: [
          { id: 1, t: 'Q1 self-review', pri: 'High', done: false, dt: '2026-03-25' },
          { id: 2, t: 'Submit branding invoice', pri: 'High', done: false, dt: '2026-03-25' },
          { id: 3, t: 'Record tutorial Ep.4', pri: 'Medium', done: false, dt: '2026-03-27' },
          { id: 4, t: 'Sprint demo slides', pri: 'High', done: true, doneDate: '2026-03-25', dt: '2026-03-24' },
          { id: 5, t: 'Update portfolio', pri: 'Medium', done: false, dt: '2026-03-29' },
        ],
        habits: [
          { n: 'Read 30 min', s: 5, best: 12, w: [1, 1, 1, 1, 1, 0, 0], c: '#38bdf8' },
          { n: 'Cold shower', s: 4, best: 8, w: [1, 1, 1, 1, 0, 0, 0], c: '#34d399' },
          { n: 'Write 500 words', s: 3, best: 4, w: [1, 0, 1, 1, 1, 0, 0], c: '#fbbf24' },
        ],
        health: {
          sleep: { v: 7.2, g: 8, u: 'hrs', h: [6.5, 7, 7.8, 6.2, 7.5, 8, 7.2] },
          steps: { v: 6840, g: 10000, u: 'steps', h: [8200, 5400, 9100, 7300, 6200, 10500, 6840] },
          water: { v: 1.5, g: 3, u: 'L', h: [2, 1.5, 2.5, 1.8, 2, 3, 1.5] },
          calories: { v: 1800, g: 2200, u: 'kcal', h: [2100, 1900, 2300, 2000, 1800, 2400, 1800] },
        },
        moodLog: [
          { v: 3, dt: '2026-03-25T08:00' },
          { v: 4, dt: '2026-03-24T19:00' },
          { v: 2, dt: '2026-03-23T20:00' },
          { v: 3, dt: '2026-03-22T10:00' },
          { v: 4, dt: '2026-03-21T09:00' },
        ],
        notes: [{ id: 1, t: 'Q2 Roadmap', b: 'Mobile UX, churn -15%, referral program', dt: '2026-03-24' }],
        ideas: [{ id: 1, t: 'AI personal trainer app', b: 'GPT workouts based on energy level', dt: '2026-03-23' }],
        contacts: [
          { id: 1, nm: 'Sarah Chen', rl: 'Manager', lc: '2026-03-20', freq: 'weekly' },
          { id: 2, nm: 'Marcus Williams', rl: 'Client', lc: '2026-02-15', freq: 'monthly' },
        ],
        workouts: [
          { id: 1, dt: '2026-03-25', tp: 'Run', de: '5K morning', mt: '24:32' },
          { id: 2, dt: '2026-03-24', tp: 'Lift', de: 'Chest & shoulders', mt: '45 min' },
        ],
        incomeStreams: [
          { id: 1, name: 'Day Job (Software)', type: 'salary', amount: 5200 },
          { id: 2, name: 'Freelance Design', type: 'freelance', amount: 800 },
          { id: 3, name: 'YouTube Channel', type: 'side_hustle', amount: 150 },
        ],
        expenses: [
          { id: 1, name: 'Rent', amount: 1400, category: 'Housing', date: '2026-03-01', recurring: true },
          { id: 2, name: 'Groceries', amount: 450, category: 'Food', date: '2026-03-15', recurring: true },
          { id: 3, name: 'Car payment', amount: 380, category: 'Transport', date: '2026-03-01', recurring: true },
          { id: 4, name: 'Adobe CC', amount: 55, category: 'Software', date: '2026-03-10', recurring: true },
          { id: 5, name: 'Gym', amount: 50, category: 'Health', date: '2026-03-01', recurring: true },
          { id: 6, name: 'Spotify+Netflix', amount: 28, category: 'Subs', date: '2026-03-01', recurring: true },
          { id: 7, name: 'Dining out', amount: 200, category: 'Fun', date: '2026-03-22', recurring: false },
          { id: 8, name: 'Phone bill', amount: 45, category: 'Subs', date: '2026-03-01', recurring: true },
          { id: 9, name: 'Cloud hosting', amount: 20, category: 'Business', date: '2026-03-01', recurring: true },
        ],
        assets: [
          { id: 1, name: 'Emergency Fund', value: 4200, type: 'savings' },
          { id: 2, name: 'S&P 500 (VOO)', value: 8500, type: 'investment' },
          { id: 3, name: 'Bitcoin', value: 2100, type: 'investment' },
        ],
        debts: [
          { id: 1, name: 'Student Loan', balance: 18500, original: 32000, rate: 4.5, monthlyPay: 380 },
          { id: 2, name: 'Car Loan', balance: 8200, original: 22000, rate: 3.9, monthlyPay: 420 },
        ],
        skills: [
          { id: 1, name: 'JavaScript/React', level: 4, category: 'Tech', potentialIncome: 75 },
          { id: 2, name: 'UI/UX Design', level: 3, category: 'Design', potentialIncome: 60 },
          { id: 3, name: 'Video Editing', level: 2, category: 'Content', potentialIncome: 40 },
          { id: 4, name: 'AWS/Cloud', level: 2, category: 'Tech', potentialIncome: 80 },
        ],
        learning: [
          { id: 1, name: 'AWS Solutions Architect', platform: 'Udemy', progress: 35 },
          { id: 2, name: 'Deep Work (book)', platform: 'Kindle', progress: 68 },
        ],
        timeLog: { work: 40, learn: 5, health: 4, personal: 10, waste: 12 },
        goals: [
          { id: 1, name: '$10K Emergency Fund', target: 10000, current: 4200, deadline: '2026-12-31' },
          { id: 2, name: 'AWS Certification', target: 100, current: 35, deadline: '2026-06-30' },
          { id: 3, name: 'Pay off car loan', target: 22000, current: 13800, deadline: '2027-06-30' },
        ],
        weeklyActions: [],
        actionWeek: '',
        milestones: ['first_inc', 'nwp', 'sr20', 'inv1', 'h7'],
        feed: [
          { tx: 'Slept 7.2 hours', dt: '2026-03-25', ts: Date.now() - 3600000 },
          { tx: 'Sprint demo slides done', dt: '2026-03-25', ts: Date.now() - 7200000 },
          { tx: 'Ran 5K morning', dt: '2026-03-25', ts: Date.now() - 14400000 },
        ],
        lifeScoreHistory: [],
        weeklySnapshots: [],
        lastSnapshotWeek: '',
      }),

      // ═══ RESET ALL ═══
      resetAll: () => set({
        ...JSON.parse(JSON.stringify(FRESH)),
        onboarded: true,
      }),

      // ═══ EXPORT DATA ═══
      exportData: () => {
        const s = get();
        const stateOnly: AppState = {
          onboarded: s.onboarded, curDom: s.curDom,
          tasks: s.tasks, habits: s.habits,
          health: s.health, moodLog: s.moodLog,
          notes: s.notes, ideas: s.ideas, contacts: s.contacts, workouts: s.workouts,
          incomeStreams: s.incomeStreams, expenses: s.expenses,
          assets: s.assets, debts: s.debts,
          skills: s.skills, learning: s.learning,
          timeLog: s.timeLog,
          goals: s.goals, weeklyActions: s.weeklyActions, actionWeek: s.actionWeek,
          milestones: s.milestones, feed: s.feed,
          lifeScoreHistory: s.lifeScoreHistory,
          weeklySnapshots: s.weeklySnapshots, lastSnapshotWeek: s.lastSnapshotWeek,
        };
        const blob = new Blob([JSON.stringify(stateOnly, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'mohusf360-v13-' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
      },

      // ═══ IMPORT DATA ═══
      importData: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            try {
              const data = JSON.parse(ev.target?.result as string) as Partial<AppState>;
              set({ ...JSON.parse(JSON.stringify(FRESH)), ...data });
            } catch {
              // invalid JSON — silently ignore
            }
          };
          reader.readAsText(file);
        };
        input.click();
      },
    }),
    { name: 'm360v12' }
  )
);

export { useStore };
export default useStore;
