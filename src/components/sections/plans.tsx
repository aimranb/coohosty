import Link from 'next/link';
import { OfferTerms, OfferScope } from './offer-terms';
import { getTranslations } from 'next-intl/server';
import { Check, ArrowUpRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { site, type Locale } from '@/config/site';
import { PlanButton } from '@/components/forms/plan-button';
import { Reveal } from '@/components/ui/reveal';
import { MarrakechServiceLink } from '@/components/sections/marrakech-service-link';
import { marrakechServiceContent } from '@/content/marrakech-service';

export async function Plans({ locale, market }: { locale: Locale; market?: 'marrakech' }) {
  const t = await getTranslations('plans');
  const heading = await getTranslations('services');
  const seeMore = { en: 'See more', fr: 'Voir plus', ar: 'عرض المزيد' }[locale];
  return <section id="services" className="section plans-section"><div id="plans" className="container">
    <Reveal className="section-heading centered"><h2>{heading('title')}<br/><em>{heading('accent')}</em></h2><p className="packages-intro">{t('comparison')}</p></Reveal>
    <div className="plan-services-layout"><div className="plan-grid plan-services-track">{site.planInfo.map(plan => <div key={plan.id} className="plan-services-card" data-plan-card={plan.id}><Reveal className="package-reveal"><article className={`plan-card comparison-card ${plan.featured ? 'featured' : ''}`}>
      <div className="plan-label"><span className="package-number">{t('label')} {plan.number}</span></div><h3>{plan.id}</h3>
      {market === 'marrakech' && plan.id === 'COHOST' && <p className="packages-intro"><strong>{marrakechServiceContent[locale].commission}</strong></p>}
      <PlanButton plan={plan.id} className="button package-cta">{t(`${plan.id}.cta`)}<ArrowUpRight size={15}/></PlanButton>
      <OfferTerms plan={plan.id} compact/><ul className="plan-highlights">{plan.highlights.map(feature => <li key={feature}><Check size={14} aria-hidden="true"/><span>{t(`features.${feature}`)}</span></li>)}</ul>
      <Link href={`/${locale}/services/${plan.id.toLowerCase()}`} className="button plan-more-link">{seeMore}<ArrowUpRight size={16}/></Link><a className="plan-whatsapp" href={site.whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon width={17} height={17}/>{t('whatsapp')}</a>
    </article></Reveal></div>)}</div></div>
    <OfferScope/>
    {market !== 'marrakech' && <MarrakechServiceLink locale={locale}/>}
  </div></section>;
}
