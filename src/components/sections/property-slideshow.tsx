'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, House } from 'lucide-react';
import styles from './property-slideshow.module.css';

type Photo = { src: string; alt: string };
type Labels = { label: string; title: string; caption: string; previous: string; next: string; disclosure: string };

export function PropertySlideshow({ photos, labels }: { photos: Photo[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    let inView = false;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(preference.matches);
    const updateVisibility = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; updateVisibility(); }, { threshold: .1 });
    if (root.current) observer.observe(root.current);
    updateMotion();
    preference.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => { observer.disconnect(); preference.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);

  useEffect(() => {
    if (paused || reduced || !visible) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % photos.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused, reduced, visible, photos.length]);

  function select(index: number) { setActive((index + photos.length) % photos.length); setPaused(true); }

  return <figure ref={root} className={`hero-photo hero-property ${styles.gallery}`} aria-label={labels.disclosure} aria-roledescription="carousel" data-motion={visible && !paused && !reduced}>
    {photos.map((photo, index) => <div key={photo.src} className={styles.slide} data-active={active === index} aria-hidden={active !== index}>
      <Image src={photo.src} alt={photo.alt} fill preload={index === 0} loading={index === 0 ? undefined : 'eager'} sizes="(max-width: 760px) 100vw, 60vw"/>
    </div>)}
    <div className="hero-property-shade"/>
    <div className="hero-photo-label"><House size={15}/>{labels.label}</div>
    <figcaption className="hero-property-caption"><strong>{labels.title}</strong><span>{labels.caption}</span></figcaption>
    <div className={styles.controls}>
      <div className={styles.dots}>{photos.map((photo, index) => <button type="button" key={photo.src} aria-label={`${index + 1} — ${photo.alt}`} aria-pressed={active === index} onClick={() => select(index)}><span/></button>)}</div>
      <span className={styles.count} aria-live={paused ? 'polite' : 'off'}>{String(active + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
      <button type="button" aria-label={labels.previous} onClick={() => select(active - 1)}><ArrowLeft size={16}/></button>
      <button type="button" aria-label={labels.next} onClick={() => select(active + 1)}><ArrowRight size={16}/></button>
    </div>
  </figure>;
}
