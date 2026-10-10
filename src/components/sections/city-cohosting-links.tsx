import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/config/site';
import { cohostingCities, type CityMarket } from '@/config/cohosting-cities';
import { cohostingCopy } from '@/content/city-cohosting';
import styles from './city-cohosting.module.css';

export function CityCohostingLinks({ locale, active }: { locale: Locale; active?: CityMarket }) {
  const copy = cohostingCopy[locale];
  return <section id="cohosting" className={styles.cityLinks} aria-label={copy.citiesTitle}><div className={styles.cityLinksHeading}><h2>{copy.citiesTitle}</h2><span>COHOST · 20 %</span></div><div className={styles.cityLinksGrid}>{cohostingCities.map(city => <Link key={city.id} href={`/${locale}${city.path}`} aria-current={active === city.id ? 'page' : undefined}><span><small>{copy.cityLink}</small><strong>{city.names[locale]}</strong></span><ArrowUpRight size={24}/></Link>)}</div></section>;
}
