import { IncomeIntro } from './income-intro';
import { getLocale, getTranslations } from 'next-intl/server';
import data from '@/config/destinations.json';
import { isLocale } from '@/config/site';
import { CityNetwork } from './city-network';
import styles from './city-network.module.css';
export async function Destinations() {
  const t = await getTranslations('destinations');
  const requested = await getLocale();
  const locale = isLocale(requested) ? requested : 'fr';
  const cities = data.cities.map(city => ({ ...city, name: t(`cities.${city.id}.name`), detail: t(`cities.${city.id}.detail`) }));
  return <>
    <IncomeIntro/>
    <section className="section container destinations-section" id="destinations"><div className="destination-heading"><div><div className="eyebrow">{t('eyebrow')}</div><h2><span>{t('title')}</span> <em>{t('accent')}</em></h2></div><p>{t('subtitle')}</p></div><CityNetwork cities={cities} locale={locale}/><details className={styles.credits}><summary>{t('credits')}</summary><p>{t('crop')}</p>{cities.map(city => <p key={city.id}>{city.name} · <a href={city.source} target="_blank" rel="noopener noreferrer">{city.author}</a> · <a href={city.licenseUrl} target="_blank" rel="noopener noreferrer">{city.licenseName}</a></p>)}</details></section>
  </>;
}
