interface ChipOption {
  label: string;
  value: string;
  style?: React.CSSProperties;
}

interface Props {
  options: ChipOption[];
  selected: string;
  onChange: (value: string) => void;
}

export default function ChipSelector({ options, selected, onChange }: Props) {
  return (
    <div className="chips">
      {options.map(o => (
        <button
          key={o.value}
          className={`chip ${selected === o.value ? 'on' : ''}`}
          style={o.style}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
