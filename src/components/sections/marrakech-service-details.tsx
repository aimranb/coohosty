import { Check } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { site, type Locale } from '@/config/site';
import comparison from '@/config/service-comparison.json';
import { marrakechServiceContent } from '@/content/marrakech-service';
import { Reveal } from '@/components/ui/reveal';

export async function MarrakechServiceDetails({ locale }: { locale: Locale }) {
  const t = await getTranslations('plans');
  const copy = marrakechServiceContent[locale];
  const cohost = [
    { id: 'listingManagement', features: ['airbnbListings', 'professionalPhotography', 'listingCreation', 'pricingManagement'] },
    { id: 'guestManagement', features: ['guestVetting', 'checkin', 'linenToiletries', 'communication'] },
    { id: 'propertyManagement', features: ['housekeeping', 'maintenance', 'insuranceSupport', 'managementSoftware'] },
  ];
  const order: readonly string[] = site.planInfo.map(plan => plan.id);
  return <section id="marrakech-services" className="section container faq-section" aria-labelledby="marrakech-services-title"><Reveal className="faq-intro">
    <h2 id="marrakech-services-title">{copy.servicesTitle}</h2>
    </Reveal><Reveal className="faq-list" delay={0.16}>{site.planInfo.map(plan => {
      const groups = plan.id === 'COHOST' ? cohost : comparison.filter(group => order.indexOf(plan.id) >= order.indexOf(group.availableFrom));
      return <details className="faq-item" key={plan.id} open={plan.id === 'COHOST'}><summary><h3>{plan.id} · {t(`${plan.id}.subtitle`)}</h3><span className="faq-plus" aria-hidden="true">+</span></summary><div className="faq-answer"><p>{t(`${plan.id}.outcome`)}</p><div className="service-detail-groups">{groups.map(group => <section key={group.id} className="service-detail-group"><h4>{t(`groups.${group.id}`)}</h4><ul>{group.features.map(feature => <li key={feature}><Check size={18} aria-hidden="true"/><span>{t(`features.${feature}`)}</span></li>)}</ul></section>)}</div></div></details>;
    })}<p className="brand-disclaimer">{t('scopeNote')}</p>
  </Reveal></section>;
}
