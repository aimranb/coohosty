import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check, MapPin, KeyRound, MessagesSquare, House } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale, locales, site, type Locale } from '@/config/site';
import { getCohostingCity, cityPageModified, type CityMarket } from '@/config/cohosting-cities';
import { cohostingCopy, cityDescription, citySeoTitle, citySeoDescription } from '@/content/city-cohosting';
import { EstimateBar } from '@/components/forms/estimate-bar';
import { PlanButton } from '@/components/forms/plan-button';
import { Reveal } from '@/components/ui/reveal';
import { CohostingCommission } from './cohosting-commission';
import { CityCohostingLinks } from './city-cohosting-links';
import { MarrakechMap } from './marrakech-map';
import { MarrakechBlogPreview } from '@/components/blog/marrakech-blog-preview';
import { Workflow } from './workflow';
import { ReservationCalendar } from './reservation-calendar';
import { Revenue } from './revenue';
import styles from './city-cohosting.module.css';

const groups = [
  { id: 'listingManagement', icon: KeyRound, features: ['airbnbListings', 'professionalPhotography', 'listingCreation', 'pricingManagement'] },
  { id: 'guestManagement', icon: MessagesSquare, features: ['guestVetting', 'checkin', 'linenToiletries', 'communication'] },
  { id: 'propertyManagement', icon: House, features: ['housekeeping', 'maintenance', 'insuranceSupport', 'managementSoftware'] },
] as const;
export type CityPageProps = { params: Promise<{ locale: string }> };
async function resolveLocale(params: CityPageProps['params']): Promise<Locale> { const { locale } = await params; if (!isLocale(locale)) notFound(); return locale; }
export async function cityMetadata(market: CityMarket, params: CityPageProps['params']): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const city = getCohostingCity(market);
  const title = citySeoTitle(market, locale), description = citySeoDescription(market, locale);
  const url = `${site.url}/${locale}${city.path}`;
  return { title: { absolute: title }, description, robots: { index: true, follow: true }, alternates: { canonical: url, languages: { ...Object.fromEntries(locales.map(language => [language, `${site.url}/${language}${city.path}`])), 'x-default': `${site.url}/fr${city.path}` } }, openGraph: { title, description, url, siteName: site.brand, type: 'website', locale: { fr: 'fr_MA', en: 'en_US', ar: 'ar_MA' }[locale], images: [{ url: site.seo.socialImage, width: 1200, height: 630, alt: site.brand }] }, twitter: { card: site.seo.twitterCard, title, description, images: [site.seo.socialImage] } };
}
export async function CityCohostingPage({ market, params }: CityPageProps & { market: CityMarket }) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const city = getCohostingCity(market), name = city.names[locale], copy = cohostingCopy[locale];
  const t = await getTranslations('plans');
  const url = `${site.url}/${locale}${city.path}`;
  const faq = [{ question: copy.faqRate, answer: `${copy.explanation} ${copy.terms}` }, { question: copy.faqServices, answer: `${copy.servicesIntro} ${groups.flatMap(group => group.features.map(feature => t(`features.${feature}`))).join(', ')}. ${copy.serviceScope}` }, { question: copy.faqExpenses, answer: copy.expenses }, { question: copy.faqStart, answer: copy.startAnswer }];
  const data = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': `${site.url}/#organization`, name: site.brand, url: site.url, telephone: site.tel, email: site.email },
    { '@type': 'Service', '@id': `${url}#service`, name: citySeoTitle(market, locale), description: citySeoDescription(market, locale), url, serviceType: 'Short-term rental cohosting', areaServed: { '@type': 'City', name: city.name, containedInPlace: { '@type': 'Country', name: 'Morocco' } }, provider: { '@id': `${site.url}/#organization` } },
    { '@type': 'WebPage', '@id': url, url, name: citySeoTitle(market, locale), inLanguage: locale, dateModified: cityPageModified, mainEntity: { '@id': `${url}#service` } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: copy.home, item: `${site.url}/${locale}` }, { '@type': 'ListItem', position: 2, name: `${copy.breadcrumb} ${name}`, item: url }] },
    { '@type': 'FAQPage', mainEntity: faq.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
  ] };
  return <main id="main-content" className={styles.page} data-market={market}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}/>
    <section className={`container ${styles.hero}`}>
      <div className={styles.heroCopy}><span className={styles.kicker}>{copy.eyebrow} · {name}</span><h1>{copy.title}<br/><span>{copy.accent}</span><span className={styles.heroCity}>{name}.</span></h1><p>{copy.intro}</p><div className={styles.heroActions}><PlanButton plan="COHOST" className="button">{copy.start}<ArrowUpRight size={17}/></PlanButton><a href="#services" className={styles.textLink}>{copy.discover}<ArrowUpRight size={16}/></a></div><a href="#commission" className={styles.heroRate}><strong>20 %</strong><span>{copy.rateLabel}</span><ArrowUpRight size={20}/></a></div>
      <div className={styles.heroVisual}><Image src={city.image} alt={market === 'marrakech' ? copy.photo : name} fill preload sizes="(max-width: 760px) 89vw, 45vw" className={styles.heroImage}/><div className={styles.heroShade}/><span className={styles.photoLabel}><MapPin size={14}/>{name}</span><div className={styles.photoCaption}><span>COOHOSTY</span><p>{copy.localAccent}</p></div></div>
    </section>
    <div className="container"><CohostingCommission locale={locale}/></div>
    <section id="services" className={`container section ${styles.services}`}><Reveal className={styles.sectionHeading}><span className={styles.kicker}>COHOST · {name}</span><h2>{copy.services}</h2><p>{copy.servicesIntro}</p></Reveal><div className={styles.serviceGrid}>{groups.map((group, index) => <Reveal key={group.id} delay={index * 0.08} className={styles.serviceCard}><div className={styles.serviceTop}><group.icon size={24}/><span>0{index + 1}</span></div><h3>{t(`groups.${group.id}`)}</h3><ul>{group.features.map(feature => <li key={feature}><Check size={15}/><span>{t(`features.${feature}`)}</span></li>)}</ul></Reveal>)}</div><p className={styles.terms}>{copy.serviceScope}</p></section>
    <section id="destinations" className={`container section ${styles.local}`}><Reveal className={styles.sectionHeading}><span className={styles.kicker}>{name}</span><h2>{copy.localTitle}<br/><span>{copy.localAccent}</span></h2><p>{cityDescription(market, locale)}</p></Reveal><div className={styles.areaChips} aria-label={copy.areaLabel}>{city.areas.map(area => <span key={area}><MapPin size={14}/>{area}</span>)}</div><p className={styles.terms}>{copy.localNote}</p>{market === 'marrakech' && <MarrakechMap locale={locale}/>}<div className={styles.localLinks}>{market !== 'tanger' && <Link className={styles.textLink} href={`/${locale}/blog/conciergerie-airbnb-${market}`}>{copy.guide}<ArrowUpRight size={16}/></Link>}</div></section>
    <Workflow/><ReservationCalendar locale={locale}/><Revenue/>
    <section id="faq" className={`container section ${styles.faq}`}><Reveal className={styles.sectionHeading}><h2>{copy.faqTitle}</h2></Reveal><div>{faq.map(item => <details className="faq-item" key={item.question}><summary><h3>{item.question}</h3><span className="faq-plus" aria-hidden="true">+</span></summary><div className="faq-answer"><p>{item.answer}</p></div></details>)}</div></section>
    <section className={`container section ${styles.enquiry}`}><div className={styles.sectionHeading}><span className={styles.kicker}>COHOST · {name}</span><h2>{copy.formTitle}</h2><p>{copy.startAnswer}</p></div><div className="hero-surface"><div className="hero-copy"><EstimateBar locale={locale} emailEnabled={Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)} fixedCity={city.name}/></div></div></section>
    <div className="container"><CityCohostingLinks locale={locale} active={market}/></div>
    {market === 'marrakech' && <MarrakechBlogPreview locale={locale}/>}
  </main>;
}
