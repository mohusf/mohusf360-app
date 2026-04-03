import { useEffect, useRef, ReactNode } from 'react';

interface Props {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSave?: () => void;
  hideButtons?: boolean;
  children: ReactNode;
}

export default function Modal({ open, title, subtitle, onClose, onSave, hideButtons, children }: Props) {
  const prevFocus = useRef<Element | null>(null);
  const mdlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      prevFocus.current = document.activeElement;
      setTimeout(() => {
        const first = mdlRef.current?.querySelector<HTMLElement>('input,textarea,button');
        first?.focus();
      }, 150);
    } else if (prevFocus.current instanceof HTMLElement) {
      prevFocus.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
      if (e.key === 'Tab' && open && mdlRef.current) {
        const focusable = mdlRef.current.querySelectorAll<HTMLElement>('input,textarea,button,[tabindex="0"]');
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <>
      <div className={`ov ${open ? 'on' : ''}`} onClick={onClose} />
      <div ref={mdlRef} className={`mdl ${open ? 'on' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="bar" />
        <h3 id="modal-title">{title}</h3>
        {subtitle && <div className="sub">{subtitle}</div>}
        <div>{children}</div>
        {!hideButtons && (
          <div>
            <button className="btn btn-p" onClick={onSave}>Save</button>
            <button className="btn btn-g" onClick={onClose}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
}
