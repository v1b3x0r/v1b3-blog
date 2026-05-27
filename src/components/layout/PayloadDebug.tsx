import { useEffect, useState } from 'react';
import { usePayload } from './ContextResolver';

export function PayloadDebug() {
  const payload = usePayload();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVisible(params.get('debug') === 'payload');
  }, []);

  if (!visible || !payload) return null;

  return (
    <pre style={{
      position: 'fixed',
      bottom: 12,
      right: 12,
      maxWidth: 'min(90vw, 420px)',
      maxHeight: '70vh',
      overflow: 'auto',
      background: 'rgba(11, 10, 9, 0.92)',
      color: '#f0bd8e',
      fontFamily: 'ui-monospace, monospace',
      fontSize: 10,
      padding: 12,
      borderRadius: 6,
      border: '1px solid rgba(208, 138, 90, 0.3)',
      zIndex: 9999,
      lineHeight: 1.45,
    }}>
      {JSON.stringify(payload, null, 2)}
    </pre>
  );
}
