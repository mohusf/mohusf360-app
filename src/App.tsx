import { useState, useEffect } from 'react';
import { useStore, nw } from './store/appStore';
import { calcLifeScore } from './lib/lifeScore';
import Header from './components/layout/Header';
import BottomNav, { type ViewKey } from './components/layout/BottomNav';
import Toast from './components/layout/Toast';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import TodayView from './components/views/TodayView';
import TrackView from './components/views/TrackView';
import InsightsView from './components/views/InsightsView';
import WealthView from './components/views/WealthView';
import MeView from './components/views/MeView';

export default function App() {
  const [view, setView] = useState<ViewKey>('today');
  const store = useStore();
  const netWorth = nw(store);

  const handleOnboardFinish = (data: { income: number; sleepGoal: number; stepsGoal: number; waterGoal: number; caloriesGoal: number }) => {
    if (data.income > 0) {
      store.addIncome({ id: Date.now(), name: 'Primary Income', type: 'salary', amount: data.income });
    }
    store.updateHealth('sleep', 0); // just to init, goals set below
    // Update health goals via direct store mutation through updateHealth pattern
    useStore.setState(s => ({
      health: {
        ...s.health,
        sleep: { ...s.health.sleep, g: data.sleepGoal },
        steps: { ...s.health.steps, g: data.stepsGoal },
        water: { ...s.health.water, g: data.waterGoal },
        calories: { ...s.health.calories, g: data.caloriesGoal },
      }
    }));
    store.setOnboarded(true);
  };

  const handleSkip = () => {
    store.loadDemo();
    store.setOnboarded(true);
  };

  const changeView = (v: ViewKey) => {
    if (v === 'track') store.setCurDom(null);
    setView(v);
  };

  // Life score history tracking (once per day)
  useEffect(() => {
    const sc = calcLifeScore(store);
    const today = new Date().toISOString().slice(0, 10);
    const last = store.lifeScoreHistory[store.lifeScoreHistory.length - 1];
    if (!last || last.date !== today) {
      store.pushLifeScore(sc.total, today);
    }
  }, []);

  if (!store.onboarded) {
    return (
      <>
        <Toast />
        <OnboardingFlow onFinish={handleOnboardFinish} onSkip={handleSkip} />
      </>
    );
  }

  return (
    <>
      <Toast />
      <Header
        netWorth={netWorth}
        onNWClick={() => changeView('wealth')}
        onAvatarClick={() => changeView('me')}
      />
      <div className="main">
        {view === 'today' && <div className="vw"><TodayView /></div>}
        {view === 'track' && <div className="vw"><TrackView /></div>}
        {view === 'insights' && <div className="vw"><InsightsView /></div>}
        {view === 'wealth' && <div className="vw"><WealthView /></div>}
        {view === 'me' && <div className="vw"><MeView /></div>}
      </div>
      <BottomNav active={view} onChange={changeView} />
    </>
  );
}
