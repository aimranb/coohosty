import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale, site } from '@/config/site';
import comparison from '@/config/service-comparison.json';

type PageProps = { params: Promise<{ locale: string; plan: string }> };

async function resolvePlan(params: PageProps['params']) {
  const { locale, plan: slug } = await params;
  const plan = site.planInfo.find(item => item.id.toLowerCase() === slug);
  if (!isLocale(locale) || !plan) notFound();
  return { locale, plan };
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, plan } = await resolvePlan(params);
  const t = await getTranslations({ locale, namespace: 'plans' });
  return { title: `${plan.id} | COOHOSTY`, description: t(`${plan.id}.outcome`) };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { locale, plan } = await resolvePlan(params);
  setRequestLocale(locale);
  const t = await getTranslations('plans');
  const labels = {
    en: { back: 'Back to services', included: 'All included services', form: 'Go to the enquiry form' },
    fr: { back: 'Retour aux services', included: 'Tous les services inclus', form: 'Accéder au formulaire' },
    ar: { back: 'العودة إلى الخدمات', included: 'جميع الخدمات المشمولة', form: 'الانتقال إلى الاستمارة' },
  }[locale];
  const cohostGroups = [
    { id: 'listingManagement', features: ['airbnbListings', 'professionalPhotography', 'listingCreation', 'pricingManagement'] },
    { id: 'guestManagement', features: ['guestVetting', 'checkin', 'linenToiletries', 'communication'] },
    { id: 'propertyManagement', features: ['housekeeping', 'maintenance', 'insuranceSupport', 'managementSoftware'] },
  ];
  const order: readonly string[] = site.planInfo.map(item => item.id);
  const groups = plan.id === 'COHOST' ? cohostGroups : comparison.filter(group => order.indexOf(plan.id) >= order.indexOf(group.availableFrom));
  const formUrl = `/${locale}?plan=${plan.id}#estimate`;
  return <main id="main-content" className="container service-detail-page">
    <Link className="service-detail-back" href={`/${locale}#services`}><ArrowLeft size={17}/>{labels.back}</Link>
    <header className="service-detail-heading">
      <span className="eyebrow">COOHOSTY · {plan.id}</span>
      <h1>{plan.id}</h1><p className="service-detail-subtitle">{t(`${plan.id}.subtitle`)}</p>
      <p className="service-detail-outcome">{t(`${plan.id}.outcome`)}</p>
      <div className="service-detail-actions"><span className="service-detail-price">{site.prices[plan.id][locale]} <small>{t(`${plan.id}.cadence`)}</small></span><Link href={formUrl} className="button service-detail-form">{labels.form}<ArrowUpRight size={18}/></Link></div>
    </header>
    <section className="service-detail-included" aria-labelledby="included-title"><h2 id="included-title">{labels.included}</h2>
      <div className="service-detail-groups">{groups.map(group => <section key={group.id} className="service-detail-group"><h3>{t(`groups.${group.id}`)}</h3><ul>{group.features.map(feature => <li key={feature}><Check size={18} aria-hidden="true"/><span>{t(`features.${feature}`)}</span></li>)}</ul></section>)}</div>
    </section>
    <div className="service-detail-footer"><p>{t('scopeNote')}</p><Link href={formUrl} className="button service-detail-form">{labels.form}<ArrowUpRight size={18}/></Link></div>
  </main>;
}
