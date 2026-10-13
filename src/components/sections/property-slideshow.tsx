'use client';
import { imagePlaceholders } from '@/config/image-placeholders';

import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowLeft, ArrowRight, House } from 'lucide-react';
import styles from './property-slideshow.module.css';
import type { Locale } from '@/config/site';

const subscribeHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

type Photo = { src: string; alt: string; city: string; nightlyRate: number; bookedNights: number };
const metricsCopy = {
  fr: { apartment: 'Appartement', revenue: 'Revenu brut mensuel simulé', occupancy: 'Occupation mensuelle simulée', note: 'Simulation favorable sur 30 nuits disponibles, avant frais et charges. Photos illustratives ; résultats non constatés.', night: 'MAD / nuit', nights: 'nuits réservées', cities: { Marrakech: 'Marrakech', Casablanca: 'Casablanca', Tanger: 'Tanger' } },
  en: { apartment: 'Apartment', revenue: 'Simulated monthly gross revenue', occupancy: 'Simulated monthly occupancy', note: 'Favourable scenario over 30 available nights, before fees and expenses. Illustrative photos; not recorded results.', night: 'MAD / night', nights: 'booked nights', cities: { Marrakech: 'Marrakech', Casablanca: 'Casablanca', Tanger: 'Tangier' } },
  ar: { apartment: 'شقة', revenue: 'الإيراد الشهري الإجمالي في المحاكاة', occupancy: 'الإشغال الشهري في المحاكاة', note: 'سيناريو متفائل على أساس 30 ليلة متاحة، قبل الرسوم والمصاريف. صور توضيحية؛ ليست نتائج فعلية.', night: 'درهم / ليلة', nights: 'ليلة محجوزة', cities: { Marrakech: 'مراكش', Casablanca: 'الدار البيضاء', Tanger: 'طنجة' } },
};
type Labels = { label: string; title: string; caption: string; previous: string; next: string; disclosure: string };

export function PropertySlideshow({ photos, labels, locale }: { photos: Photo[]; labels: Labels; locale: Locale }) {
  const ready = useSyncExternalStore(subscribeHydration, clientReady, serverReady);
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
  const photo = photos[displayed];
  const copy = metricsCopy[locale];
  const city = copy.cities[photo.city as keyof typeof copy.cities];
  const money = new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-MA' : 'en-GB', { numberingSystem:'latn',  maximumFractionDigits: 0 }).format(photo.nightlyRate * photo.bookedNights);


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
        <Image unoptimized placeholder="blur" blurDataURL={imagePlaceholders[photo.src]} src={photo.src} alt={photo.alt} fill preload={index === 0} loading={index === 0 ? undefined : 'eager'} sizes="(max-width: 760px) 90vw, (max-width: 1200px) 45vw, 560px" onLoad={() => {
          setLoaded(current => current.includes(index) ? current : [...current, index]);
          if (index === requested) setActive(index);
        }}/>}
    </div>)}
    <div className="hero-property-shade"/>
    <div className="hero-photo-label"><House size={20} aria-hidden="true"/><div className={styles.location}><span>{copy.apartment} {String(displayed + 1).padStart(2, '0')}</span><strong>{city}</strong></div></div>
    <figcaption className="hero-property-caption">
      <strong>{labels.title}</strong>
      <dl className={styles.metrics}>
        <div><dt>{copy.revenue}</dt><dd dir="ltr">{money} <small>MAD</small></dd></div>
        <div><dt>{copy.occupancy}</dt><dd dir="ltr">{Math.round(photo.bookedNights / 30 * 100)} %</dd></div>
      </dl>
      <span className={styles.assumptions}>{photo.bookedNights} {copy.nights} × {photo.nightlyRate} {copy.night}</span>
    </figcaption>
    <div className={styles.controls}>
      <div className={styles.dots}>{photos.map((photo, index) => <button type="button" disabled={!ready} key={photo.src} aria-label={`${index + 1} — ${photo.alt}`} aria-pressed={displayed === index} onClick={() => select(index)}><span/></button>)}</div>
      <span className={styles.count} aria-live={paused ? 'polite' : 'off'}>{String(displayed + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
      <button type="button" disabled={!ready} aria-label={labels.previous} onClick={() => select(requested - 1)}><ArrowLeft size={16}/></button>
      <button type="button" disabled={!ready} aria-label={labels.next} onClick={() => select(requested + 1)}><ArrowRight size={16}/></button>
    </div>
  </figure>;
}
