'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import type { Locale } from '@/config/site';
import { marrakechNeighborhoods, marrakechServiceContent } from '@/content/marrakech-service';
import styles from './city-network.module.css';

export function MarrakechMap({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const area = marrakechNeighborhoods[active];
  const copy = marrakechServiceContent[locale];
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=-8.055%2C31.585%2C-7.925%2C31.715&layer=mapnik&marker=${area.lat}%2C${area.lon}`;
  return <div className={styles.scene} data-marrakech-map aria-label={copy.mapLabel}>
    <div className={styles.mapPanel}>
      <div className={styles.mapTop}><span><span className={styles.statusDot}/>MARRAKECH · {area.names[locale]}</span></div>
      <div className={styles.mapCanvas}><iframe title={`${copy.mapLabel} — ${area.names[locale]}`} src={map} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}/></div>
      <div className={styles.mapBottom}><MapPin size={14} aria-hidden="true"/><span>{copy.mapHint}</span><span className={styles.mapCount}>{active + 1} / {marrakechNeighborhoods.length}</span></div>
    </div>
    <div className={styles.cityPanel}>
      <div className={styles.photo}>
        <div className={`${styles.photoLayer} ${styles.activePhoto}`}><Image key={area.id} src={area.image} alt={copy.illustration} fill sizes="(max-width: 760px) 90vw, 40vw"/></div>
        <div className={styles.photoShade}/><span className={styles.photoTag}><MapPin size={14} aria-hidden="true"/>{copy.illustration}</span>
        <div className={styles.photoCaption}><h3>{area.names[locale]}</h3><p>{area.details[locale]}</p></div>
      </div>
      <div className={styles.cityChoices} role="group" aria-label={copy.mapLabel}>{marrakechNeighborhoods.map((item, index) => <button key={item.id} type="button" className={index === active ? styles.selectedCity : undefined} aria-pressed={index === active} onClick={() => setActive(index)}><MapPin size={15} aria-hidden="true"/>{item.names[locale]}<ArrowUpRight size={16} aria-hidden="true"/></button>)}</div>
      <Link className={styles.cityCta} href={`/fr/blog/${area.slug}`}>{copy.readGuide}<ArrowUpRight size={18} aria-hidden="true"/></Link>
    </div>
  </div>;
}
