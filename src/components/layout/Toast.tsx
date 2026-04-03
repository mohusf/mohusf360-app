import { useEffect, useRef, useState, useCallback } from 'react';

let showToastGlobal: (msg: string) => void = () => {};

export function useToast() {
  return { toast: showToastGlobal };
}

export function setToastFn(fn: (msg: string) => void) {
  showToastGlobal = fn;
}

export function toast(msg: string) {
  showToastGlobal(msg);
}

export default function Toast() {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback((m: string) => {
    setMsg(m);
    setVisible(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 2000);
  }, []);

  useEffect(() => {
    setToastFn(show);
    return () => { clearTimeout(timer.current); };
  }, [show]);

  return (
    <div className={`toast ${visible ? 'on' : ''}`} role="alert" aria-live="assertive">
      {msg}
    </div>
  );
}
