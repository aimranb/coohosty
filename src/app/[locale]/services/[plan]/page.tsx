import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale, site } from '@/config/site';
import comparison from '@/config/service-comparison.json';
import { MarrakechServiceLink } from '@/components/sections/marrakech-service-link';
import { serviceStructuredData } from '@/lib/structured-data';

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
  const title = `${plan.id} — ${t(`${plan.id}.subtitle`)} | ${site.brand}`;
  const description = t(`${plan.id}.outcome`);
  const path = `/services/${plan.id.toLowerCase()}`;
  const canonical = `${site.url}/${locale}${path}`;
  return { title, description, alternates: { canonical, languages: { ...Object.fromEntries(['fr', 'en', 'ar'].map(language => [language, `${site.url}/${language}${path}`])), 'x-default': `${site.url}/${site.seo.defaultLocale}${path}` } }, openGraph: { title, description, url: canonical, siteName: site.brand, type: 'website' as const, locale: { fr: 'fr_MA', en: 'en_US', ar: 'ar_MA' }[locale], images: [{ url: site.seo.socialImage, width: 1200, height: 630, alt: site.brand }] }, twitter: { card: site.seo.twitterCard, title, description, images: [site.seo.socialImage] } };
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
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData(locale, plan.id.toLowerCase(), plan.id, t(`${plan.id}.outcome`))).replace(/</g, '\\u003c') }}/>
    <Link className="service-detail-back" href={`/${locale}#services`}><ArrowLeft size={17}/>{labels.back}</Link>
    <header className="service-detail-heading">
      <span className="eyebrow">COOHOSTY · {plan.id}</span>
      <h1>{plan.id}</h1>
      <div className="service-detail-actions"><Link href={formUrl} className="button service-detail-form">{labels.form}<ArrowUpRight size={18}/></Link></div>
    </header>
    <section className="service-detail-included" aria-labelledby="included-title"><h2 id="included-title">{labels.included}</h2>
      <div className="service-detail-groups">{groups.map(group => <section key={group.id} className="service-detail-group"><h3>{t(`groups.${group.id}`)}</h3><ul>{group.features.map(feature => <li key={feature}><Check size={18} aria-hidden="true"/><span>{t(`features.${feature}`)}</span></li>)}</ul></section>)}</div>
    </section>
    <div className="service-detail-footer"><Link href={formUrl} className="button service-detail-form">{labels.form}<ArrowUpRight size={18}/></Link></div>
    <MarrakechServiceLink locale={locale}/>
  </main>;
}
