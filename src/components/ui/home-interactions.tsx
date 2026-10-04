'use client';
import { useEffect } from 'react';
export function HomeInteractions() {
  useEffect(() => {
    const progress = document.querySelector<HTMLElement>('.reading-progress');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, pointerFrame = 0;
    function scroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const distance = document.documentElement.scrollHeight - window.innerHeight;
        if (progress) progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, window.scrollY / distance) : 0})`;
      });
    }
    function follow(event: PointerEvent) {
      if (preference.matches || event.pointerType !== 'mouse') return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        document.querySelectorAll<SVGElement>('.hero-note .pupil, .logo .pupil').forEach(pupil => {
          const svg = pupil.closest('svg'); if (!svg) return;
          const box = svg.getBoundingClientRect();
          if (pupil.closest('.logo') && Math.hypot(event.clientX - box.left - box.width / 2, event.clientY - box.top - box.height / 2) > 220) { pupil.style.transform = ''; return; }
          const x = Math.max(-2.5, Math.min(2.5, (event.clientX - box.left - box.width / 2) / 160));
          const y = Math.max(-2, Math.min(2, (event.clientY - box.top - box.height / 2) / 160));
          pupil.style.transform = `translate(${x}px, ${y}px)`;
        });
      });
    }
    function resetEyes() { document.querySelectorAll<SVGElement>('.hero-note .pupil, .logo .pupil').forEach(pupil => { pupil.style.transform = ''; }); }
    function motionChange() { if (preference.matches) resetEyes(); }
    scroll();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll, { passive: true });
    window.addEventListener('pointermove', follow, { passive: true });
    window.addEventListener('blur', resetEyes);
    preference.addEventListener('change', motionChange);
    return () => {
      cancelAnimationFrame(frame); cancelAnimationFrame(pointerFrame);
      window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll);
      window.removeEventListener('pointermove', follow); window.removeEventListener('blur', resetEyes);
      preference.removeEventListener('change', motionChange); resetEyes();
    };
  }, []);
  return <div className="reading-progress" aria-hidden="true"/>;
}
