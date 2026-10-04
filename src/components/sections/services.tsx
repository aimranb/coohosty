import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/ui/reveal';
export async function Services() {
  const t = await getTranslations('services');
  return <section id="services" className="section container"><Reveal><div className="section-heading"><div className="eyebrow">{t('eyebrow')}</div><h2>{t('title')}<br/><em>{t('accent')}</em></h2></div><div className="service-grid">{(['AUDIT', 'OPTIMIZE', 'COHOST'] as const).map((id, i) => <article className="service-card" key={id}><div className="service-top"><span>0{i + 1}</span></div><h3>{id}</h3><p>{t(id)}</p><a className="service-link" href={`?plan=${id}#contact`} aria-label={`${t('cta')} — ${id}`}>{t('cta')}</a></article>)}</div></Reveal></section>;
}
