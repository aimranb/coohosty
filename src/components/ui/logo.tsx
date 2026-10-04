'use client';
import { useEffect, useRef } from 'react';
import { EyeArtwork } from './eye-artwork';
import { mountLogoGaze } from '../../../public/logo-gaze';
import Link from 'next/link';
import { site } from '@/config/site';

export function Eyes({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 74 38" fill="none" aria-hidden="true">
    <ellipse cx="22" cy="19" rx="14" ry="17" stroke="currentColor" strokeWidth="2"/>
    <ellipse cx="52" cy="19" rx="14" ry="17" stroke="currentColor" strokeWidth="2"/>
    <circle className="pupil" cx="24" cy="20" r="5" fill="currentColor"/>
    <circle className="pupil" cx="54" cy="20" r="5" fill="currentColor"/>
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
