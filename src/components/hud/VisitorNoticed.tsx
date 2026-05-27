import { useEffect, useState } from 'react';
import { usePayload } from '../layout/ContextResolver';

const STORAGE_KEY = 'v1b3topia.noticed';

export function VisitorNoticed() {
  const payload = usePayload();
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!payload) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    if (payload.atmosphere.reduceMotion) return;
    if (payload.state.saveData) return;

    const visitorTz = payload.timeSpace.tz.split('/').pop()?.replace(/_/g, ' ') ?? 'somewhere';
    const visitorHour = Math.floor(payload.timeSpace.localHourFloat);
    const visitorMin = Math.floor((payload.timeSpace.localHourFloat % 1) * 60);
    const timeStr = `${String(visitorHour).padStart(2, '0')}:${String(visitorMin).padStart(2, '0')}`;
    setText(payload.timeSpace.isThaiSpeaker
      ? 'เธอแวะมาดู? นั่งก่อนได้'
      : `✓ visitor noticed · ${timeStr} · ${visitorTz}`
    );

    const onInteract = () => {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setVisible(true);
      setTimeout(() => setVisible(false), 5200);
    };

    window.addEventListener('mousemove', onInteract, { once: true });
    window.addEventListener('touchstart', onInteract, { once: true });

    return () => {
      window.removeEventListener('mousemove', onInteract);
      window.removeEventListener('touchstart', onInteract);
    };
  }, [payload]);

  if (!visible) return null;

  return <div className="visitor-noticed" aria-live="polite">{text}</div>;
}
