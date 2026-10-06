'use client';

import { useEffect, useRef } from 'react';
import { mountEyeSignature } from '../../../public/eye-signature';
import { EyeArtwork } from './eye-artwork';
import { site } from '@/config/site';

type SignatureLabels = { watching: string; tagline: string; pause: string; resume: string; initialStep: string };

export function EyeSignature({ labels }: { labels: SignatureLabels }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    return mountEyeSignature(root.current);
  }, []);

  return <div ref={root} className="eye-signature" data-eye-signature data-motion-state="idle">
    <div className="signature-art" aria-hidden="true"><div className="signature-orbit"/>
      <svg className="signature-eyes" width="190" height="112" viewBox="0 0 164 92" fill="none" focusable="false">
        <EyeArtwork/>
      </svg><span className="signature-wordmark">{site.brand}</span>
    </div>
    <div className="signature-copy"><h3>{labels.watching}</h3><p>{labels.tagline}</p><div className="signature-focus"><span className="signature-focus-dot" aria-hidden="true"/><span className="signature-focus-label">{labels.initialStep}</span></div></div>
  </div>;
}
