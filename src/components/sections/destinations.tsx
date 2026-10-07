import { IncomeIntro } from './income-intro';
import { getLocale, getTranslations } from 'next-intl/server';
import data from '@/config/destinations.json';
import { isLocale } from '@/config/site';
import { CityNetwork } from './city-network';
import { Reveal } from '@/components/ui/reveal';
export async function Destinations() {
  const t = await getTranslations('destinations');
  const requested = await getLocale();
  const locale = isLocale(requested) ? requested : 'fr';
  const cities = data.cities.map(city => ({ ...city, name: t(`cities.${city.id}.name`), detail: t(`cities.${city.id}.detail`) }));
  return <>
    <IncomeIntro/>
    <section className="section container destinations-section" id="destinations"><Reveal className="destination-heading"><div><div className="eyebrow">{t('eyebrow')}</div><h2><span>{t('title')}</span> <em>{t('accent')}</em></h2></div><p>{t('subtitle')}</p></Reveal><Reveal delay={0.16}><CityNetwork cities={cities} locale={locale}/></Reveal></section>
  </>;
}
