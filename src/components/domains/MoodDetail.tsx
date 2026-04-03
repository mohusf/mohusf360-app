import { useStore } from '../../store/appStore';
import { MOODS, MOOD_EMOJIS } from '../../lib/constants';

export default function MoodDetail() {
  const { moodLog, addMood, setCurDom } = useStore();

  const handleMood = (v: number) => {
    addMood({ v, dt: new Date().toISOString() });
  };

  return (
    <>
      <button className="lback" onClick={() => setCurDom(null)}>{'\u2190'} Track</button>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{'\u{1F60A}'} Mood</h2>

      {/* 5-emoji selector */}
      <div className="moodg">
        {MOODS.map((label, i) => (
          <button key={i} className="moodo" onClick={() => handleMood(i)}>
            <span className="e">{MOOD_EMOJIS[i]}</span>
            <span className="l">{label}</span>
          </button>
        ))}
      </div>

      {/* Mood trend (simple bar chart placeholder) */}
      {moodLog.length > 1 && (
        <div className="cw">
          <h3>Mood Trend</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px', padding: '8px 0' }}>
            {moodLog.slice(-10).map((m, i) => (
              <div key={i} style={{
                flex: 1,
                height: `${(m.v + 1) / 5 * 100}%`,
                background: 'var(--ac)',
                borderRadius: '3px',
                minHeight: '4px',
                opacity: 0.6 + (m.v / 5) * 0.4,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Mood history */}
      {moodLog.length > 0 && (
        <div className="cd">
          {moodLog.slice(-10).reverse().map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
              <span>{MOOD_EMOJIS[m.v]} {MOODS[m.v]}</span>
              <span style={{ fontSize: '11px', color: 'var(--t3)' }}>
                {m.dt ? new Date(m.dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
