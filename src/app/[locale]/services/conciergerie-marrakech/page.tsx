import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale, locales, site } from '@/config/site';
import { marrakechServiceContent, marrakechServicePath, marrakechServiceModified } from '@/content/marrakech-service';
import { marrakechMessages } from '@/content/marrakech-messages';
import { Hero } from '@/components/sections/hero';
import { IncomeIntro } from '@/components/sections/income-intro';
import { MarrakechMap } from '@/components/sections/marrakech-map';
import { MarrakechServiceDetails } from '@/components/sections/marrakech-service-details';
import { MarrakechBlogPreview } from '@/components/blog/marrakech-blog-preview';
import { Plans } from '@/components/sections/plans';
import { Workflow } from '@/components/sections/workflow';
import { ReservationCalendar } from '@/components/sections/reservation-calendar';
import { Revenue } from '@/components/sections/revenue';
import { Faq } from '@/components/sections/faq';
import { Reveal } from '@/components/ui/reveal';

type Props = { params: Promise<{ locale: string }> };
async function resolveLocale(params: Props['params']) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const copy = marrakechServiceContent[locale];
  const url = `${site.url}/${locale}${marrakechServicePath}`;
  return {
    title: { absolute: copy.seoTitle }, description: copy.description, robots: { index: true, follow: true },
    alternates: { canonical: url, languages: { ...Object.fromEntries(locales.map(language => [language, `${site.url}/${language}${marrakechServicePath}`])), 'x-default': `${site.url}/fr${marrakechServicePath}` } },
    openGraph: { title: copy.seoTitle, description: copy.description, url, siteName: site.brand, type: 'website', locale: { fr: 'fr_MA', en: 'en_US', ar: 'ar_MA' }[locale], images: [{ url: site.seo.socialImage, width: 1200, height: 630, alt: site.brand }] },
    twitter: { card: site.seo.twitterCard, title: copy.seoTitle, description: copy.description, images: [site.seo.socialImage] },
  };
}

export default async function MarrakechServicePage({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const copy = marrakechServiceContent[locale];
  const t = await getTranslations('revenue');
  const url = `${site.url}/${locale}${marrakechServicePath}`;
  const data = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': `${site.url}/#organization`, name: site.brand, url: site.url, telephone: site.tel, email: site.email },
    { '@type': 'Service', '@id': `${url}#service`, name: copy.title, description: `${copy.description} ${copy.commission}`, url, serviceType: 'Short-term rental property management', areaServed: { '@type': 'City', name: 'Marrakech', containedInPlace: { '@type': 'Country', name: 'Morocco' } }, provider: { '@id': `${site.url}/#organization` } },
    { '@type': 'WebPage', '@id': url, url, name: copy.title, inLanguage: locale, dateModified: marrakechServiceModified, mainEntity: { '@id': `${url}#service` } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: copy.home, item: `${site.url}/${locale}` }, { '@type': 'ListItem', position: 2, name: copy.title, item: url }] },
    { '@type': 'FAQPage', mainEntity: Object.values(marrakechMessages[locale].faq.items).map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
  ] };
  return <main id="main-content" data-market="marrakech">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}/>
    <Hero market="marrakech"/><IncomeIntro/>
    <section className="section container destinations-section" id="destinations"><Reveal className="destination-heading"><div><div className="eyebrow">MARRAKECH</div><h2>{copy.mapTitle}</h2></div><p>{copy.mapIntro}</p></Reveal><Reveal delay={0.16}><MarrakechMap locale={locale}/></Reveal></section>
    <Plans locale={locale} market="marrakech"/>
    <section id="commission" className="section container"><Reveal className="section-heading centered"><h2>{copy.commissionTitle}</h2><p>{copy.commissionBody}</p><p className="brand-disclaimer">{copy.scope}</p></Reveal></section>
    <MarrakechServiceDetails locale={locale}/><Workflow/><ReservationCalendar locale={locale}/><Revenue/><Faq/><MarrakechBlogPreview locale={locale}/>
    <p className="brand-disclaimer container">{t('disclaimer')}</p>
  </main>;
}
