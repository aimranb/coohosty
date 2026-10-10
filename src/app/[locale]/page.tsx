import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { isLocale } from '@/config/site';
import { localizedMetadata } from '@/lib/metadata';
import { homeStructuredData } from '@/lib/structured-data';
import { Hero } from '@/components/sections/hero';
import { Destinations } from '@/components/sections/destinations';
import { ReservationCalendar } from '@/components/sections/reservation-calendar';
import { Workflow } from '@/components/sections/workflow';
import { Revenue } from '@/components/sections/revenue';
import { Plans } from '@/components/sections/plans';
import { Faq } from '@/components/sections/faq';
import { AboutCoohosty } from '@/components/sections/about-coohosty';
import { ServiceProof } from '@/components/sections/service-proof';
import { BlogPreview } from '@/components/blog/blog-preview';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return localizedMetadata(locale);
}
export default async function MarketingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('revenue');
  const structuredData = homeStructuredData(locale);
  return <main id="main-content"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}/><Hero/><Destinations/><Plans locale={locale}/><Workflow/><ReservationCalendar locale={locale}/><Revenue/><AboutCoohosty/><ServiceProof locale={locale}/><Faq/><BlogPreview locale={locale}/><p className="brand-disclaimer container">{t('disclaimer')}</p></main>;
}
