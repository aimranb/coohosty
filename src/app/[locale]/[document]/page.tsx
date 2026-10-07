import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { isLocale, site } from '@/config/site';
import { localizedMetadata } from '@/lib/metadata';
import { CityImageLicense } from '@/components/sections/city-image-license';
export async function generateMetadata({ params }: { params: Promise<{ locale: string; document: string }> }) {
  const { locale, document } = await params;
  if (!isLocale(locale) || !['legal', 'privacy'].includes(document)) notFound();
  return localizedMetadata(locale, document as 'legal' | 'privacy');
}
export default async function DocumentPage({ params }: { params: Promise<{ locale: string; document: string }> }) {
  const { locale, document } = await params;
  if (!isLocale(locale) || !['legal', 'privacy'].includes(document)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations(document);
  const sections = document === 'legal' ? ['publisher', 'company', 'hosting', 'content', 'brands'] : ['controller', 'data', 'purpose', 'providers', 'retention', 'storage'];
  const values = { email: site.email, phone: site.phone, retentionDays: site.company.privacyRetentionDays };
  return <main id="main-content" className="container legal-page"><h1>{t('title')}</h1><p>{t('intro')}</p>{sections.map(id => <section key={id}><h2>{t(`${id}Title`)}</h2>{document === 'legal' && id === 'company' && site.company.legalName ? <dl className="detail-list">{(['legalName', 'address', 'registrationNumber', 'taxIdentifier', 'dataProtectionRegistration'] as const).filter(key => site.company[key]).map(key => <div key={key} style={{ display: 'contents' }}><dt>{t(`companyFields.${key}`)}</dt><dd>{site.company[key]}</dd></div>)}</dl> : <p>{t(id, values)}</p>}</section>)}{document === 'legal' && <CityImageLicense locale={locale}/>}</main>;
}
