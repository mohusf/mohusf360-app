import { useStore } from '../../store/appStore';
import { DOMS } from '../../lib/constants';
import QuickCapture from '../shared/QuickCapture';
import type { DomainKey } from '../../types';
import TasksDetail from '../domains/TasksDetail';
import HabitsDetail from '../domains/HabitsDetail';
import HealthDetail from '../domains/HealthDetail';
import FinanceDetail from '../domains/FinanceDetail';
import MoodDetail from '../domains/MoodDetail';
import GoalsDetail from '../domains/GoalsDetail';
import TimeDetail from '../domains/TimeDetail';
import NotesDetail from '../domains/NotesDetail';
import IdeasDetail from '../domains/IdeasDetail';
import SkillsDetail from '../domains/SkillsDetail';
import LearningDetail from '../domains/LearningDetail';
import ContactsDetail from '../domains/ContactsDetail';
import WorkoutsDetail from '../domains/WorkoutsDetail';

const DETAIL_MAP: Record<DomainKey, React.ComponentType> = {
  tasks: TasksDetail,
  habits: HabitsDetail,
  health: HealthDetail,
  finance: FinanceDetail,
  mood: MoodDetail,
  goals: GoalsDetail,
  time: TimeDetail,
  notes: NotesDetail,
  ideas: IdeasDetail,
  skills: SkillsDetail,
  learning: LearningDetail,
  contacts: ContactsDetail,
  workouts: WorkoutsDetail,
};

export default function TrackView() {
  const state = useStore();
  const { curDom, setCurDom, tasks, habits, expenses, moodLog, goals, timeLog, notes, ideas, skills, learning, contacts, workouts } = state;

  // Quick capture handler — parse NLP and dispatch
  const handleCapture = (text: string) => {
    // Delegate to store's quick capture action if available
    state.quickCapture?.(text);
  };

  if (curDom) {
    const Detail = DETAIL_MAP[curDom as DomainKey];
    return Detail ? <div className="sec"><Detail /></div> : null;
  }

  // Domain counts
  const counts: Record<string, string | number> = {
    tasks: tasks.filter(t => !t.done).length + ' open',
    habits: habits.length + ' tracked',
    health: '4 metrics',
    finance: expenses.length + ' items',
    mood: moodLog.length + ' entries',
    goals: goals.length + ' active',
    time: Object.values(timeLog).reduce((a, v) => a + v, 0) + 'h',
    notes: notes.length,
    ideas: ideas.length,
    skills: skills.length,
    learning: learning.length,
    contacts: contacts.length,
    workouts: workouts.length,
  };

  return (
    <>
      <div className="sec">
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Track</h2>
        <p style={{ fontSize: '12px', color: 'var(--t2)', marginTop: '3px' }}>All your life domains</p>
      </div>

      <div className="sec">
        <QuickCapture onCapture={handleCapture} />
        <div style={{ fontSize: '10px', color: 'var(--t3)', padding: '0 4px' }}>
          Type naturally: "ran 5k", "slept 7h", "$50 food", "buy groceries"
        </div>
      </div>

      <div className="sec">
        <div className="dgrid">
          {(Object.entries(DOMS) as [DomainKey, { nm: string; ic: string; desc: string }][]).map(([k, d]) => (
            <div key={k} className="dcard" onClick={() => setCurDom(k)}>
              <div className="ic">{d.ic}</div>
              <div className="nm">{d.nm}</div>
              <div className="ct">{counts[k] || 0}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
