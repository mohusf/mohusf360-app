import { useState, useRef } from 'react';

interface Props {
  onCapture: (text: string) => void;
}

export default function QuickCapture({ onCapture }: Props) {
  const [val, setVal] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (!val.trim()) return;
    onCapture(val.trim());
    setVal('');
    ref.current?.focus();
  };

  return (
    <div className="qc">
      <input
        ref={ref}
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit(); }}
        placeholder="Quick capture — type anything..."
      />
      <button className="send" onClick={submit} style={{ opacity: val.trim() ? 1 : 0.3 }}>↑</button>
    </div>
  );
}
