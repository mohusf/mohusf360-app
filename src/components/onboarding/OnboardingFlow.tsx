import { useState } from 'react';

interface Props {
  onFinish: (data: { income: number; sleepGoal: number; stepsGoal: number; waterGoal: number; caloriesGoal: number }) => void;
  onSkip: () => void;
}

export default function OnboardingFlow({ onFinish, onSkip }: Props) {
  const [step, setStep] = useState(0);
  const [income, setIncome] = useState('');
  const [sleepGoal, setSleepGoal] = useState('8');
  const [stepsGoal, setStepsGoal] = useState('10000');
  const [waterGoal, setWaterGoal] = useState('2.5');
  const [caloriesGoal, setCaloriesGoal] = useState('2200');

  const dots = (
    <div className="onb-dots">
      {[0, 1, 2].map(i => <div key={i} className={`onb-dot ${i === step ? 'on' : ''}`} />)}
    </div>
  );

  const handleFinish = () => {
    onFinish({
      income: parseFloat(income) || 0,
      sleepGoal: parseFloat(sleepGoal) || 8,
      stepsGoal: parseInt(stepsGoal) || 10000,
      waterGoal: parseFloat(waterGoal) || 2.5,
      caloriesGoal: parseInt(caloriesGoal) || 2200,
    });
  };

  return (
    <div className="onb" style={{ display: 'flex' }}>
      <div className="cnt">
        {step === 0 && (
          <>
            <h1><em>mohusf</em> 360</h1>
            <p className="tag">Your complete life operating system.<br />Strategy. Actions. Results.</p>
            {dots}
            <div style={{ textAlign: 'left', fontSize: '11px', color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              What matters most right now?
            </div>
            <div className="chips" style={{ marginBottom: '20px' }}>
              {['💰 Grow income', '🏦 Save more', '💳 Pay off debt', '📈 Invest', '🧠 Build skills', '💪 Get healthy', '🚀 Side hustle', '📋 Get organized'].map(c => (
                <button key={c} className="chip" onClick={e => (e.target as HTMLElement).classList.toggle('on')}>{c}</button>
              ))}
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <h1>💸 Finances</h1>
            <p className="tag">Monthly income and main expense areas.</p>
            {dots}
            <div className="fg" style={{ textAlign: 'left' }}>
              <label className="fl">Monthly Income ($)</label>
              <input className="fi" type="number" placeholder="5000" value={income} onChange={e => setIncome(e.target.value)}
                style={{ textAlign: 'center', fontSize: '20px', fontWeight: 700 }} />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h1>💪 Health</h1>
            <p className="tag">Set your daily targets.</p>
            {dots}
            <div className="row2" style={{ textAlign: 'left', marginBottom: '12px' }}>
              <div className="fg">
                <label className="fl">Sleep (hrs)</label>
                <input className="fi" type="number" value={sleepGoal} onChange={e => setSleepGoal(e.target.value)} style={{ textAlign: 'center' }} />
              </div>
              <div className="fg">
                <label className="fl">Steps</label>
                <input className="fi" type="number" value={stepsGoal} onChange={e => setStepsGoal(e.target.value)} style={{ textAlign: 'center' }} />
              </div>
            </div>
            <div className="row2" style={{ textAlign: 'left' }}>
              <div className="fg">
                <label className="fl">Water (L)</label>
                <input className="fi" type="number" step="0.5" value={waterGoal} onChange={e => setWaterGoal(e.target.value)} style={{ textAlign: 'center' }} />
              </div>
              <div className="fg">
                <label className="fl">Calories</label>
                <input className="fi" type="number" value={caloriesGoal} onChange={e => setCaloriesGoal(e.target.value)} style={{ textAlign: 'center' }} />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="onb-b">
        {step < 2 ? (
          <>
            <button className="go" onClick={() => setStep(step + 1)}>Next</button>
            {step === 0 ? (
              <button className="skip" onClick={onSkip}>Load demo data</button>
            ) : (
              <button className="skip" onClick={() => setStep(step - 1)}>Back</button>
            )}
          </>
        ) : (
          <>
            <button className="go" onClick={handleFinish}>Start my 360</button>
            <button className="skip" onClick={() => setStep(step - 1)}>Back</button>
          </>
        )}
      </div>
    </div>
  );
}
