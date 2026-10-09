import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale, locales, site } from '@/config/site';
import { marrakechServiceContent, marrakechServicePath, marrakechServiceModified } from '@/content/marrakech-service';

type Props = { params: Promise<{ locale: string }> };
async function resolveLocale(params: Props['params']) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = marrakechServiceContent[locale];
  const canonical = `${site.url}/${locale}${marrakechServicePath}`;
  return {
    title: { absolute: content.seoTitle }, description: content.description,
    alternates: { canonical, languages: { ...Object.fromEntries(locales.map(language => [language, `${site.url}/${language}${marrakechServicePath}`])), 'x-default': `${site.url}/fr${marrakechServicePath}` } },
    robots: { index: true, follow: true },
    openGraph: { title: content.seoTitle, description: content.description, url: canonical, siteName: site.brand, type: 'website', locale: { fr: 'fr_MA', en: 'en_US', ar: 'ar_MA' }[locale], images: [{ url: site.seo.socialImage, width: 1200, height: 630, alt: site.brand }] },
    twitter: { card: site.seo.twitterCard, title: content.seoTitle, description: content.description, images: [site.seo.socialImage] },
  };
}

export default async function MarrakechServicePage({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const content = marrakechServiceContent[locale];
  const t = await getTranslations({ locale, namespace: 'plans' });
  const canonical = `${site.url}/${locale}${marrakechServicePath}`;
  const formUrl = `/${locale}?plan=COHOST#estimate`;
  const groups = [
    { id: 'listingManagement', features: ['airbnbListings', 'professionalPhotography', 'listingCreation', 'pricingManagement'] },
    { id: 'guestManagement', features: ['guestVetting', 'checkin', 'linenToiletries', 'communication'] },
    { id: 'propertyManagement', features: ['housekeeping', 'maintenance', 'insuranceSupport', 'managementSoftware'] },
  ];
  const guides = ['conciergerie-airbnb-marrakech', 'choisir-societe-conciergerie-maroc', 'fiche-de-police-airbnb-maroc'];
  const data = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': `${site.url}/#organization`, name: site.brand, url: site.url, telephone: site.tel, email: site.email },
    { '@type': 'Service', '@id': `${canonical}#service`, name: content.title, description: content.description, url: canonical, serviceType: 'Short-term rental property management', areaServed: { '@type': 'City', name: 'Marrakech', containedInPlace: { '@type': 'Country', name: 'Morocco' } }, provider: { '@id': `${site.url}/#organization` } },
    { '@type': 'WebPage', '@id': canonical, url: canonical, name: content.title, inLanguage: locale, dateModified: marrakechServiceModified, mainEntity: { '@id': `${canonical}#service` } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: content.home, item: `${site.url}/${locale}` },
      { '@type': 'ListItem', position: 2, name: content.services, item: `${site.url}/${locale}#services` },
      { '@type': 'ListItem', position: 3, name: content.title, item: canonical },
    ] },
    { '@type': 'FAQPage', '@id': `${canonical}#questions`, mainEntity: content.faq.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
  ] };
  return <main id="main-content" className="container service-detail-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}/>
    <Link className="service-detail-back" href={`/${locale}#services`}><ArrowLeft size={17} aria-hidden="true"/>{content.back}</Link>
    <header className="service-detail-heading">
      <span className="eyebrow">COOHOSTY · MARRAKECH</span><h1>{content.title}</h1>
      <p className="service-detail-subtitle">{content.intro}</p>
      <div className="service-detail-actions"><span className="service-detail-price">{site.prices.COHOST[locale]}</span><Link href={formUrl} className="button service-detail-form">{content.cta}<ArrowUpRight size={18} aria-hidden="true"/></Link></div>
    </header>
    <section className="service-detail-included" aria-labelledby="included-title"><h2 id="included-title">{content.included}</h2>
      <div className="service-detail-groups">{groups.map(group => <section key={group.id} className="service-detail-group"><h3>{t(`groups.${group.id}`)}</h3><ul>{group.features.map(feature => <li key={feature}><Check size={18} aria-hidden="true"/><span>{t(`features.${feature}`)}</span></li>)}</ul></section>)}</div>
    </section>
    <section className="service-detail-footer service-detail-included" aria-labelledby="offers-title"><h2 id="offers-title">{content.offersTitle}</h2><p>{content.offersIntro}</p>
      <div className="service-detail-groups">{site.planInfo.map(plan => <section key={plan.id} className="service-detail-group"><h3>{plan.id}</h3><p className="service-detail-outcome">{t(`${plan.id}.outcome`)}</p><Link className="service-detail-back" href={`/${locale}/services/${plan.id.toLowerCase()}`}>{plan.id}<ArrowUpRight size={17} aria-hidden="true"/></Link></section>)}</div>
    </section>
    <section className="service-detail-footer service-detail-included" aria-labelledby="local-title"><h2 id="local-title">{content.localTitle}</h2>
      {content.sections.map(section => <section key={section.title}><h3>{section.title}</h3>{section.paragraphs.map(paragraph => <p key={paragraph} className="service-detail-outcome">{paragraph}</p>)}</section>)}
    </section>
    <section id="questions" className="service-detail-footer service-detail-included" aria-labelledby="faq-title"><h2 id="faq-title">{content.faqTitle}</h2>{content.faq.map(item => <section key={item.question}><h3>{item.question}</h3><p className="service-detail-outcome">{item.answer}</p></section>)}</section>
    <section className="service-detail-footer service-detail-included" aria-labelledby="guides-title"><h2 id="guides-title">{content.guidesTitle}</h2>{guides.map((slug, index) => <p key={slug}><Link className="service-detail-back" href={`/fr/blog/${slug}`}>{content.guideLabels[index]}<ArrowUpRight size={17} aria-hidden="true"/></Link></p>)}</section>
    <div className="service-detail-footer"><Link href={formUrl} className="button service-detail-form">{content.cta}<ArrowUpRight size={18} aria-hidden="true"/></Link></div>
  </main>;
}
