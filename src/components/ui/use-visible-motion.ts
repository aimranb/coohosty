'use client';

import { useEffect, useRef, useState } from 'react';

// One visibility and motion preference subscription per animated scene.
export function useVisibleMotion() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let intersects = false;
    const sync = () => {
      setReduced(preference.matches);
      setVisible(intersects && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      intersects = entry.isIntersecting;
      sync();
    }, { threshold: 0.12 });
    if (root.current) observer.observe(root.current);
    sync();
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return { root, running: visible && !reduced && !paused, reduced, paused, setPaused };
}
