import { useStore } from '../../store/appStore';

const TIME_CATS: Record<string, { nm: string; c: string }> = {
  work: { nm: '\u{1F4BC} Work', c: '#6366f1' },
  learn: { nm: '\u{1F4DA} Learn', c: '#38bdf8' },
  health: { nm: '\u{1F4AA} Health', c: '#34d399' },
  personal: { nm: '\u{1F3AD} Personal', c: '#fbbf24' },
  waste: { nm: '\u{1F4F1} Waste', c: '#f87171' },
};

export default function TimeDetail() {
  const { timeLog, adjustTime, setCurDom } = useStore();
  const tot = Object.values(timeLog).reduce((a, v) => a + v, 0);

  return (
    <>
      <button className="lback" onClick={() => setCurDom(null)}>{'\u2190'} Track</button>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{'\u23F0'} Time</h2>

      <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>
        {tot}h / 168h weekly
      </div>

      {/* Simple allocation bar */}
      {tot > 0 && (
        <div className="cd" style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
            {Object.entries(TIME_CATS).map(([k, cat]) => {
              const val = timeLog[k as keyof typeof timeLog] || 0;
              const pct = tot > 0 ? (val / tot * 100) : 0;
              if (pct === 0) return null;
              return <div key={k} style={{ width: `${pct}%`, background: cat.c, transition: 'width .3s' }} />;
            })}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px', fontSize: '10px' }}>
            {Object.entries(TIME_CATS).map(([k, cat]) => {
              const val = timeLog[k as keyof typeof timeLog] || 0;
              if (val === 0) return null;
              return (
                <span key={k} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span className="dot" style={{ background: cat.c }} />
                  {cat.nm.split(' ')[1]} {val}h
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Adjustment rows */}
      <div className="cd">
        {Object.entries(TIME_CATS).map(([k, cat]) => (
          <div key={k} className="trow2">
            <div className="tnm">{cat.nm}</div>
            <button className="tbtn" onClick={() => adjustTime(k as keyof typeof timeLog, -1)}>-</button>
            <div className="tv">{timeLog[k as keyof typeof timeLog] || 0}h</div>
            <button className="tbtn" onClick={() => adjustTime(k as keyof typeof timeLog, 1)}>+</button>
          </div>
        ))}
      </div>

      {tot > 168 && (
        <div className="alrt w">
          <div className="ic">{'\u26A0\uFE0F'}</div>
          <div className="tx"><strong>Warning:</strong> Total exceeds 168h (physical week max).</div>
        </div>
      )}
    </>
  );
}
