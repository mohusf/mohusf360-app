import type { Insight } from '../../types';

export default function InsightCard({ ic, title, body, color }: Insight) {
  return (
    <div className="ins" style={{ borderLeftColor: color }}>
      <div className="hd">{ic} {title}</div>
      <div className="bd" dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
