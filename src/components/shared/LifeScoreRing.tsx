import type { LifeScore } from '../../types';

interface Props {
  score: LifeScore;
  netWorth: number;
  history: { score: number; date: string }[];
}

export default function LifeScoreRing({ score, netWorth, history }: Props) {
  const r = 54, c = 2 * Math.PI * r;
  const off = c - (score.total / 100) * c;
  const col = score.total < 40 ? 'var(--r)' : score.total < 70 ? 'var(--am)' : 'var(--g)';
  const bars = [
    { l: '💰 Finance', v: score.finance, mx: 25 },
    { l: '💪 Health', v: score.health, mx: 25 },
    { l: '⚡ Productivity', v: score.productivity, mx: 25 },
    { l: '🧠 Wellbeing', v: score.wellbeing, mx: 25 },
  ];
  const spark = history.slice(-7);
  const maxS = Math.max(...spark.map(s => s.score), 1);
  const n = netWorth;

  return (
    <div className="ls-ring">
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--s3)" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={col} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset .8s var(--ios)' }} />
        <text x="60" y="56" textAnchor="middle" fill="var(--t1)" fontSize="44" fontWeight="900" fontFamily="Inter">{score.total}</text>
        <text x="60" y="72" textAnchor="middle" fill="var(--t3)" fontSize="10" fontWeight="600">LIFE SCORE</text>
      </svg>
      <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '2px' }}>
        {n >= 0 ? '$' : '-$'}{Math.abs(n).toLocaleString()} net worth
      </div>
      <div className="ls-bars">
        {bars.map(b => (
          <div className="ls-bar" key={b.l}>
            <div className="lb">{b.l}</div>
            <div className="bg"><div className="fill" style={{ width: `${(b.v / b.mx) * 100}%`, background: col }} /></div>
            <div className="sv">{b.v}/{b.mx}</div>
          </div>
        ))}
      </div>
      {spark.length > 1 && (
        <div className="sparkline">
          {spark.map((s, i) => (
            <div key={i} className="sb" style={{ height: `${Math.max(8, (s.score / maxS) * 100)}%` }} />
          ))}
        </div>
      )}
    </div>
  );
}
