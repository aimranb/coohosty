'use client';
import { useEffect, useRef, useState } from 'react';
import { EyeArtwork } from './eye-artwork';
import { mountLogoGaze } from '../../../public/logo-gaze';
import Link from 'next/link';
import { site } from '@/config/site';

export function Eyes({ className = '' }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    function follow(event: PointerEvent) {
      if (preference.matches) { reset(); return; }
      if (event.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (preference.matches) { reset(); return; }
        const box = svg.current?.getBoundingClientRect();
        if (!box) return;
        setPosition({
          x: Math.max(-2.5, Math.min(2.5, (event.clientX - box.left - box.width / 2) / 160)),
          y: Math.max(-2, Math.min(2, (event.clientY - box.top - box.height / 2) / 160)),
        });
      });
    }
    function reset() {
      cancelAnimationFrame(frame);
      setPosition({ x: 0, y: 0 });
    }
    function motionChange() { if (preference.matches) reset(); }
    window.addEventListener('pointermove', follow, { passive: true });
    window.addEventListener('blur', reset);
    preference.addEventListener('change', motionChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', follow);
      window.removeEventListener('blur', reset);
      preference.removeEventListener('change', motionChange);
    };
  }, []);
  const pupilStyle = { transform: `translate(${position.x}px, ${position.y}px)` };
  return <svg ref={svg} className={className} viewBox="0 0 74 38" fill="none" aria-hidden="true">
    <ellipse cx="22" cy="19" rx="14" ry="17" stroke="currentColor" strokeWidth="2"/>
    <ellipse cx="52" cy="19" rx="14" ry="17" stroke="currentColor" strokeWidth="2"/>
    <circle className="pupil" style={pupilStyle} cx="24" cy="20" r="5" fill="currentColor"/>
    <circle className="pupil" style={pupilStyle} cx="54" cy="20" r="5" fill="currentColor"/>
    <path d="M28 34q9 5 18 0" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>;
}
export function Logo({ href = '/fr', light = false }: { href?: string; light?: boolean }) {
  const root = useRef<HTMLAnchorElement>(null);
  useEffect(() => { if (root.current) return mountLogoGaze(root.current); }, []);
  return <Link ref={root} data-logo-gaze href={href} className={`logo ${light ? 'logo-light' : ''}`} aria-label={site.domain}>
    <svg width="216" height="52" viewBox="0 0 230 56" fill="none" role="img" aria-label={site.brand}><text x="1" y="36" fill="currentColor" fontFamily="var(--font-poppins), Arial, sans-serif" fontSize="26" fontWeight="600">C</text><g className="logo-gaze-art" transform="translate(12 6) scale(.4)"><EyeArtwork/></g><text x="76" y="36" fill="currentColor" fontFamily="var(--font-poppins), Arial, sans-serif" fontSize="26" fontWeight="600" letterSpacing="-.8">HOSTY</text></svg>
  </Link>;
}
