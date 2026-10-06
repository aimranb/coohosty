import { IncomeIntro } from './income-intro';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import data from '@/config/destinations.json';
import { Reveal } from '@/components/ui/reveal';
export async function Destinations() {
  const t = await getTranslations('destinations');
  return <>
    <IncomeIntro/>
    <section className="section container destinations-section" id="destinations"><div className="destination-heading"><div><div className="eyebrow">{t('eyebrow')}</div><h2><span>{t('title')}</span> <em>{t('accent')}</em></h2></div><p>{t('subtitle')}</p></div><div className="destination-grid">{data.cities.map((city,index) => <Reveal key={city.id}><a className="destination-card" href="#contact"><Image src={city.image} alt={`${t(`cities.${city.id}.name`)} — ${t(`cities.${city.id}.detail`)}`} fill sizes="(max-width: 540px) 90vw, (max-width: 900px) 45vw, 30vw"/><div className="destination-shade"/><span className="destination-index">0{index + 1}</span><div className="destination-label"><div><h3>{t(`cities.${city.id}.name`)}</h3><p>{t(`cities.${city.id}.detail`)}</p></div><span aria-hidden="true">↗</span></div></a></Reveal>)}</div></section>
  </>;
}
