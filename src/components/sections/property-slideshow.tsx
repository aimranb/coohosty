'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, House } from 'lucide-react';
import styles from './property-slideshow.module.css';

type Photo = { src: string; alt: string };
type Labels = { label: string; title: string; caption: string; previous: string; next: string; disclosure: string };

export function PropertySlideshow({ photos, labels }: { photos: Photo[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const [requested, setRequested] = useState(0);
  const [loaded, setLoaded] = useState<number[]>([]);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const root = useRef<HTMLElement>(null);

  // Keep the current photo visible while a newly requested photo downloads.
  const displayed = loaded.includes(requested) ? requested : active;
  const next = (requested + 1) % photos.length;


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
    const timer = window.setInterval(() => {
      setActive(displayed);
      setRequested(index => (index + 1) % photos.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, reduced, visible, photos.length, displayed]);

  function select(index: number) { setActive(displayed); setRequested((index + photos.length) % photos.length); setPaused(true); }

  return <figure ref={root} className={`hero-photo hero-property ${styles.gallery}`} aria-label={labels.disclosure} aria-roledescription="carousel" data-motion={visible && !paused && !reduced}>
    {photos.map((photo, index) => <div key={photo.src} className={styles.slide} data-active={displayed === index} aria-hidden={displayed !== index}>
      {(index === 0 || loaded.includes(index) || index === requested || (visible && !paused && !reduced && index === next)) &&
        <Image src={photo.src} alt={photo.alt} fill preload={index === 0} loading={index === 0 ? undefined : 'eager'} sizes="(max-width: 760px) 90vw, 60vw" onLoad={() => {
          setLoaded(current => current.includes(index) ? current : [...current, index]);
          if (index === requested) setActive(index);
        }}/>}
    </div>)}
    <div className="hero-property-shade"/>
    <div className="hero-photo-label"><House size={15}/>{labels.label}</div>
    <figcaption className="hero-property-caption"><strong>{labels.title}</strong><span>{labels.caption}</span></figcaption>
    <div className={styles.controls}>
      <div className={styles.dots}>{photos.map((photo, index) => <button type="button" key={photo.src} aria-label={`${index + 1} — ${photo.alt}`} aria-pressed={displayed === index} onClick={() => select(index)}><span/></button>)}</div>
      <span className={styles.count} aria-live={paused ? 'polite' : 'off'}>{String(displayed + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
      <button type="button" aria-label={labels.previous} onClick={() => select(requested - 1)}><ArrowLeft size={16}/></button>
      <button type="button" aria-label={labels.next} onClick={() => select(requested + 1)}><ArrowRight size={16}/></button>
    </div>
  </figure>;
}
