import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { isLocale, site } from '@/config/site';
import { localizedMetadata } from '@/lib/metadata';
import { Hero } from '@/components/sections/hero';
import { Destinations } from '@/components/sections/destinations';
import { Services } from '@/components/sections/services';
import { ReservationCalendar } from '@/components/sections/reservation-calendar';
import { Workflow } from '@/components/sections/workflow';
import { Revenue } from '@/components/sections/revenue';
import { Plans } from '@/components/sections/plans';
import { AuditSection } from '@/components/sections/audit';
import { Showcase } from '@/components/sections/showcase';
import { ServiceProof } from '@/components/sections/service-proof';
import { Faq } from '@/components/sections/faq';
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
  const structuredData = { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: site.brand, url: site.url, telephone: site.tel, email: site.email, areaServed: { '@type': 'Country', name: 'Morocco' } };
  return <main id="main-content"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}/><Hero/><Destinations/><Services/><Workflow/><ReservationCalendar locale={locale}/><Revenue/><Showcase/><Plans locale={locale}/><AuditSection locale={locale}/><ServiceProof locale={locale}/><Faq/><p className="brand-disclaimer container">{t('disclaimer')}</p></main>;
}
