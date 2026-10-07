'use client';

import Image from 'next/image';
import { useEffect, useId, useState, type CSSProperties } from 'react';
import { ArrowUpRight, MapPin, Pause, Play } from 'lucide-react';
import { useVisibleMotion } from '@/components/ui/use-visible-motion';
import { motionCopy } from '@/config/motion-copy';
import type { Locale } from '@/config/site';
import type { CitySlide } from './city-carousel';
import styles from './city-network.module.css';

// Stylized coastal silhouette, focused on the six existing destination cities.
// Positions follow longitude/latitude in a common SVG coordinate space.
const positions: Record<string, { x: number; y: number; lx: number; ly: number }> = {
  casablanca: { x: 286, y: 247, lx: 160, ly: 271 },
  fes: { x: 447, y: 218, lx: 517, ly: 196 },
  meknes: { x: 408, y: 228, lx: 448, ly: 276 },
  agadir: { x: 153, y: 452, lx: 206, ly: 489 },
  tanger: { x: 391, y: 104, lx: 460, ly: 77 },
  rabat: { x: 335, y: 217, lx: 248, ly: 184 },
};
const silhouette = 'M391 96 C383 108 378 125 369 142 L360 174 L335 209 L304 231 L286 247 L251 272 L226 301 L216 330 L198 350 L177 371 L166 399 L153 438 L154 458 L134 482 L121 510 L100 535 L104 558 L152 578 L209 561 L268 505 L328 475 L351 424 L409 389 L461 349 L488 303 L537 269 L566 224 L561 192 L555 161 L522 163 L497 153 L479 156 L455 145 L436 140 L421 117 L411 102 Z';

export function CityNetwork({ cities, locale }: { cities: CitySlide[]; locale: Locale }) {
  const { root, running, reduced, paused, setPaused } = useVisibleMotion();
  const [active, setActive] = useState(0);
  const id = useId().replace(/:/g, '');
  const copy = motionCopy[locale];
  const city = cities[active];

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % cities.length), 4400);
    return () => window.clearInterval(timer);
  }, [running, cities.length]);

  function select(index: number) {
    setActive(index);
    setPaused(true);
  }

  return <div ref={root} className={styles.scene} data-running={running} data-reduced={reduced} aria-label={copy.map}>
    <div className={styles.mapPanel}>
      <div className={styles.mapTop}><span><span className={styles.statusDot}/>{copy.localApproach}</span><button type="button" className={styles.motionButton} aria-label={paused ? copy.play : copy.pause} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button></div>
      <div className={styles.mapCanvas}>
        <svg viewBox="0 0 640 620" className={styles.mapSvg} aria-hidden="true">
          <defs>
            <linearGradient id={`${id}-land`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff8f2"/><stop offset="1" stopColor="#f3e5da"/></linearGradient>
            <pattern id={`${id}-grid`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0 H0 V32" fill="none" stroke="#111" strokeOpacity=".035"/></pattern>
            <clipPath id={`${id}-clip`}><path d={silhouette}/></clipPath>
          </defs>
          <rect width="640" height="620" fill={`url(#${id}-grid)`}/>
          <path d={silhouette} fill={`url(#${id}-land)`} stroke="#cfb7a4" strokeWidth="1.4"/>
          <g clipPath={`url(#${id}-clip)`}>
            <path d="M128 482 Q298 308 548 203 M144 535 Q299 366 527 280 M212 538 Q320 429 449 357" fill="none" stroke="#bfa58f" strokeOpacity=".25" strokeWidth="1"/>
            <circle className={styles.radar} cx="286" cy="247" r="210" fill="none" stroke="#ff7415" strokeWidth="1"/>
            <circle className={styles.radarInner} cx="286" cy="247" r="135" fill="none" stroke="#ff7415" strokeWidth="1"/>
          </g>
          {cities.map((item, index) => {
            const point = positions[item.id];
            const path = `M286 247 Q${(286 + point.x) / 2 + 55} ${(247 + point.y) / 2 - 35} ${point.x} ${point.y}`;
            return <g key={item.id} className={index === active ? styles.activeRoute : styles.route}>
              {item.id !== 'casablanca' && <><path d={path} fill="none" strokeWidth="1.5"/><path className={styles.routeSignal} d={path} fill="none" strokeWidth="3" pathLength="100"/></>}
              <path d={`M${point.x} ${point.y} L${point.lx} ${point.ly}`} fill="none" stroke="#b5a293" strokeWidth="1"/>
              <circle className={styles.pinRing} cx={point.x} cy={point.y} r="17"/>
              <circle cx={point.x} cy={point.y} r="6" fill={index === active ? '#ff7415' : '#111'} stroke="white" strokeWidth="3"/>
            </g>;
          })}
          <text x="87" y="354" transform="rotate(-54 87 354)" className={styles.ocean}>ATLANTIQUE</text>
          <g transform="translate(590 500)" className={styles.compass}><path d="M0 -18 L5 0 L0 -4 L-5 0 Z" fill="#bc5200"/><path d="M0 18 L5 0 L0 4 L-5 0 Z" fill="#d5c5b8"/><text x="0" y="-25" textAnchor="middle">N</text></g>
        </svg>
        {cities.map((item, index) => {
          const point = positions[item.id];
          return <button key={item.id} type="button" className={`${styles.mapLabel} ${index === active ? styles.selectedLabel : ''}`} style={{ '--x': `${point.lx / 640 * 100}%`, '--y': `${point.ly / 620 * 100}%` } as CSSProperties} aria-pressed={index === active} onClick={() => select(index)}>{item.name}<span className={styles.labelDot}/></button>;
        })}
      </div>
      <div className={styles.mapBottom}><MapPin size={14}/><span>{copy.mapHint}</span><span className={styles.mapCount}>{String(active + 1).padStart(2, '0')} / {String(cities.length).padStart(2, '0')}</span></div>
    </div>
    <div className={styles.cityPanel}>
      <div className={styles.photo}>
        {cities.map((item, index) => <div key={item.id} className={`${styles.photoLayer} ${index === active ? styles.activePhoto : ''}`} aria-hidden={index !== active}><Image src={item.image} alt={index === active ? `${item.name} — ${item.detail}` : ''} fill style={{objectPosition:item.position}} sizes="(max-width: 760px) 90vw, 40vw" loading="lazy"/></div>)}
        <div className={styles.photoShade}/>
        <span className={styles.photoTag}><MapPin size={14}/>{city.name}</span>
        <div className={styles.photoCaption}><h3>{city.name}</h3><p>{city.detail}</p></div>
        <span key={active} className={styles.photoProgress} aria-hidden="true"/>
      </div>
      <a className={styles.cityCta} href="#estimate">{copy.viewCity}<ArrowUpRight size={18}/></a>
    </div>
  </div>;
}
