interface HeaderProps {
  netWorth: number;
  onNWClick: () => void;
  onAvatarClick: () => void;
}

export default function Header({ netWorth, onNWClick, onAvatarClick }: HeaderProps) {
  const n = netWorth;
  const nwStyle = {
    padding: '4px 12px', borderRadius: '18px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
    color: n >= 0 ? 'var(--g)' : 'var(--r)',
    background: n >= 0 ? 'rgba(52,211,153,.1)' : 'rgba(248,113,113,.1)',
    border: `1px solid ${n >= 0 ? 'rgba(52,211,153,.15)' : 'rgba(248,113,113,.15)'}`,
  };

  return (
    <div className="hdr">
      <div className="hdr-r">
        <h1><em>mohusf</em> 360</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={nwStyle} onClick={onNWClick}>
            {n >= 0 ? '$' : '-$'}{Math.abs(n).toLocaleString()}
          </div>
          <div className="av" onClick={onAvatarClick}>M</div>
        </div>
      </div>
    </div>
  );
}
