'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { MapPin, Pause, Play } from 'lucide-react';

export type CitySlide = { id: string; image: string; name: string; detail: string; position?: string };
export function CityCarousel({ cities, caption, label, pause, play }: { cities: CitySlide[]; caption: string; label: string; pause: string; play: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const inViewport = useRef(true);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReduced(preference.matches);
    const visibility = () => setVisible(inViewport.current && !document.hidden);
    motion(); preference.addEventListener('change', motion);
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(([entry]) => { inViewport.current = entry.isIntersecting; visibility(); }, { threshold: 0.15 });
    if (root.current) observer.observe(root.current);
    return () => { preference.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); observer.disconnect(); };
  }, []);
  useEffect(() => {
    if (paused || interacting || reduced || !visible) return;
    const timer = setInterval(() => setActive(current => (current + 1) % cities.length), 3000);
    return () => clearInterval(timer);
  }, [paused, interacting, reduced, visible, cities.length]);
  return <div ref={root} className="hero-photo city-carousel" data-paused={paused || interacting || reduced || !visible} data-motion-paused={paused || reduced || !visible} role="region" aria-roledescription="carousel" aria-label={label} onMouseEnter={() => setInteracting(true)} onMouseLeave={event => setInteracting(event.currentTarget.contains(document.activeElement))} onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(event.currentTarget.matches(':hover')); }}>
    {cities.map((city, index) => <div key={city.id} className={`city-slide ${index === active ? 'is-active' : ''}`} aria-hidden={index !== active}><Image src={city.image} alt={`${city.name} — ${city.detail}`} fill priority={index === 0} sizes="(max-width: 760px) 90vw, 50vw"/></div>)}
    <div className="city-shade"/><div className="hero-photo-label"><MapPin size={14}/>{caption}</div>
    <button className="city-pause" type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? play : pause} aria-pressed={paused}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button>
    <div className="city-overlay"><span className="city-kicker">{label}</span><div className="city-caption-stack">{cities.map((city,index) => <div className={`city-caption ${index === active ? 'is-active' : ''}`} key={city.id} aria-hidden={index !== active}><h2>{city.name}</h2><p>{city.detail}</p></div>)}</div><div className="city-selectors">{cities.map((city,index) => <button key={city.id} className={index === active ? 'is-active' : ''} type="button" aria-label={city.name} aria-pressed={index === active} onClick={() => { setActive(index); }}><span className="sr-only">{city.name}</span></button>)}</div></div>
    <span className="city-count" aria-hidden="true">0{active + 1} / 0{cities.length}</span>
  </div>;
}
