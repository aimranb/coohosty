'use client';
import { Pause, Play, Star } from 'lucide-react';
import { useEffect } from 'react';
import type { Locale } from '@/config/site';
import { useVisibleMotion } from '@/components/ui/use-visible-motion';
import styles from './platform-background.module.css';
const labels = {
  fr: { pause: 'Mettre le décor animé en pause', play: 'Reprendre le décor animé' },
  en: { pause: 'Pause background animation', play: 'Resume background animation' },
  ar: { pause: 'إيقاف حركة الخلفية', play: 'استئناف حركة الخلفية' },
};
export function PlatformBackground({ locale }: { locale: Locale }) {
  const { root, running, reduced, ready, paused, setPaused } = useVisibleMotion();
  const copy = labels[locale];
  useEffect(() => {
    const element = root.current;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    if (!element || preference.matches) return;
    const marks = element.querySelectorAll(`.${styles.mark}`);
    const entrances = Array.from(marks, (mark, index) => {
      const left = mark.classList.contains(styles.airbnb) || mark.classList.contains(styles.vrbo);
      const entrance = mark.animate([
        { opacity: 0, transform: `translateX(${left ? -55 : 55}px) scale(.96)` },
        { opacity: 1, transform: 'translateX(0) scale(1)' },
      ], { duration: 1500, delay: 250 + index * 180, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' });
      entrance.addEventListener('finish', () => entrance.cancel(), { once: true });
      return entrance;
    });
    const reduce = () => { if (preference.matches) entrances.forEach(entrance => entrance.cancel()); };
    preference.addEventListener('change', reduce);
    return () => { entrances.forEach(entrance => entrance.cancel()); preference.removeEventListener('change', reduce); };
  }, [root]);
  return <>
    <div ref={root} className={styles.scene} data-running={running} aria-hidden="true">
      <div className={styles.glow}/><div className={styles.orbit}/>
      <div className={`${styles.mark} ${styles.airbnb}`}><svg viewBox="0 0 142 152" className={styles.airbnbIcon} focusable="false"><image href="/logos/airbnb.svg" width="142" height="152"/></svg><span>airbnb</span></div>
      <div className={`${styles.mark} ${styles.booking}`}><span>Booking<span className={styles.bookingDot}>.com</span></span></div>
      <div className={`${styles.mark} ${styles.vrbo}`}><svg viewBox="0 0 160 60" focusable="false"><image href="/logos/vrbo.svg" width="160" height="60"/></svg></div>
      <div className={styles.stars} data-social-proof-sticker>{[0,1,2,3,4].map(index => <Star key={index}/>)}</div>
      <span className={`${styles.spark} ${styles.sparkOne}`}>✦</span><span className={`${styles.spark} ${styles.sparkTwo}`}>✦</span>
    </div>
    {ready && !reduced && <button type="button" className={styles.pause} aria-label={paused ? copy.play : copy.pause} title={paused ? copy.play : copy.pause} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={14} aria-hidden="true"/> : <Pause size={14} aria-hidden="true"/>}</button>}
  </>;
}
