import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import data from '@/config/destinations.json';
import { CityCarousel } from './city-carousel';
import { Eyes } from '@/components/ui/logo';
export async function Hero() {
  const t = await getTranslations('hero');
  const d = await getTranslations('destinations');
  const cities = data.cities.map(city => ({ ...city, name: d(`cities.${city.id}.name`), detail: d(`cities.${city.id}.detail`) }));
  return <section className="hero container"><div className="hero-copy"><h1>{t('title')}<br/>{t('title2')}<br/><em>{t('title3')}</em></h1><p>{t('subtitle')}</p><div className="hero-buttons"><a className="button" href="#contact">{t('primary')}<ArrowUpRight size={18}/></a><a className="button button-outline" href="#plans">{t('secondary')}<ArrowUpRight size={18}/></a></div><div className="hero-note"><Eyes/><div><strong>{t('tag')}</strong><span>{t('location')}</span></div></div></div><CityCarousel cities={cities} caption={d('caption')} label={d('label')} pause={d('pause')} play={d('play')}/><a className="hero-scroll" href="#services"><ArrowDown size={14}/>{t('scroll')}</a></section>;
}
