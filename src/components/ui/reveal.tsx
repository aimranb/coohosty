'use client';
import { useEffect, useRef } from 'react';

export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    const entrance = element.animate([
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 650, delay: delay * 1000, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' });
    entrance.pause();
    let started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      entrance.play();
      observer.disconnect();
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });
    observer.observe(element);
    // Remove the animation's transform after arrival, so fixed/sticky descendants
    // and the tools' measured connection lines keep their normal coordinate system.
    const finish = () => entrance.cancel();
    entrance.addEventListener('finish', finish);
    const show = () => { observer.disconnect(); entrance.cancel(); };
    const reduce = () => { if (preference.matches) show(); };
    preference.addEventListener('change', reduce);
    element.addEventListener('focusin', show);
    return () => {
      observer.disconnect();
      entrance.removeEventListener('finish', finish);
      preference.removeEventListener('change', reduce);
      element.removeEventListener('focusin', show);
      entrance.cancel();
    };
  }, [delay]);
  return <div ref={root} className={className} data-reveal="entrance">{children}</div>;
}
