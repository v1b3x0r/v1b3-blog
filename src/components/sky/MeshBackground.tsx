import { MeshGradient } from '@paper-design/shaders-react';
import { usePayload } from '../layout/ContextResolver';

export function MeshBackground() {
  const payload = usePayload();

  if (!payload) return null;
  if (payload.state.saveData) return null;
  if (payload.atmosphere.reduceMotion) return null;
  if (payload.state.networkTier === 'slow-2g' || payload.state.networkTier === '2g') return null;
  if (!payload.software.hasWebGL) return null;

  return (
    <div className="mesh-bg" aria-hidden="true">
      <MeshGradient
        colors={['#0a0c1c', '#2a1d24', '#4a2f3a', '#1a1525', '#1a0c1a']}
        speed={0.15}
        distortion={0.6}
        swirl={0.3}
      />
    </div>
  );
}
