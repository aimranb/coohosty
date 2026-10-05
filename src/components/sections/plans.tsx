import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Check, ArrowUpRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { site, type Locale } from '@/config/site';
import { PlanButton } from '@/components/forms/plan-button';
import { Reveal } from '@/components/ui/reveal';

export async function Plans({ locale }: { locale: Locale }) {
  const t = await getTranslations('plans');
  const heading = await getTranslations('services');
  const seeMore = { en: 'See more', fr: 'Voir plus', ar: 'عرض المزيد' }[locale];
  return <section id="services" className="section plans-section"><div id="plans" className="container">
    <Reveal className="section-heading centered"><div className="eyebrow">{heading('eyebrow')}</div><h2>{heading('title')}<br/><em>{heading('accent')}</em></h2><p className="packages-intro">{t('comparison')}</p></Reveal>
    <div className="plan-services-layout"><div className="plan-grid plan-services-track">{site.planInfo.map(plan => <div key={plan.id} className="plan-services-card" data-plan-card={plan.id}><Reveal className="package-reveal"><article className={`plan-card comparison-card ${plan.featured ? 'featured' : ''}`}>
      <div className="plan-label"><span className="package-number">{t('label')} {plan.number}</span></div><h3>{plan.id}</h3><p className="plan-subtitle">{t(`${plan.id}.subtitle`)}</p><p className="package-outcome">{t(`${plan.id}.outcome`)}</p>
      <div className="package-price-row"><div className="plan-price">{site.prices[plan.id][locale]}</div><span className="package-cadence">{t(`${plan.id}.cadence`)}</span></div><PlanButton plan={plan.id} className="button package-cta">{t(`${plan.id}.cta`)}<ArrowUpRight size={15}/></PlanButton>
      <ul className="plan-highlights">{plan.highlights.map(feature => <li key={feature}><Check size={14} aria-hidden="true"/><span>{t(`features.${feature}`)}</span></li>)}</ul>
      <Link href={`/${locale}/services/${plan.id.toLowerCase()}`} className="button plan-more-link">{seeMore}<ArrowUpRight size={16}/></Link><a className="plan-whatsapp" href={site.whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon width={17} height={17}/>{t('whatsapp')}</a>
    </article></Reveal></div>)}</div></div><p className="packages-note">{t('scopeNote')}</p><a className="package-help" href="#contact">{t('help')}<ArrowUpRight size={15}/></a>
  </div></section>;
}
