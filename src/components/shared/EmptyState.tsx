interface Props {
  emoji: string;
  title: string;
  subtitle: string;
  cta?: string;
  onAction?: () => void;
}

export default function EmptyState({ emoji, title, subtitle, cta, onAction }: Props) {
  return (
    <div className="empty">
      <div className="em">{emoji}</div>
      <div className="tt">{title}</div>
      <div className="st">{subtitle}</div>
      {cta && onAction && <button className="cta" onClick={onAction}>{cta}</button>}
    </div>
  );
}
