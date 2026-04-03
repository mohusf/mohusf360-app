export type ViewKey = 'today' | 'track' | 'insights' | 'wealth' | 'me';

interface Props {
  active: ViewKey;
  onChange: (v: ViewKey) => void;
}

const tabs: { key: ViewKey; label: string; icon: JSX.Element }[] = [
  { key: 'today', label: 'Today', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg> },
  { key: 'track', label: 'Track', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14"/></svg> },
  { key: 'insights', label: 'Insights', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg> },
  { key: 'wealth', label: 'Wealth', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg> },
  { key: 'me', label: 'Me', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      {tabs.map(t => (
        <button key={t.key} className={`ni ${active === t.key ? 'on' : ''}`} onClick={() => onChange(t.key)}>
          {t.icon}
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
