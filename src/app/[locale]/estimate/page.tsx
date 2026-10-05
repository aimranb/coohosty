import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale } from '@/config/site';
import { EstimateContinuation } from '@/components/forms/estimate-continuation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'estimate' });
  return { title: t('title'), robots: { index: false, follow: true } };
}

export default async function EstimatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('estimate');
  return <main id="main-content" className="estimate-completion-page container"><Link className="estimate-home-link" href={`/${locale}#estimate`}><ArrowLeft size={16}/>{t('edit')}</Link><div className="estimate-completion-card"><EstimateContinuation locale={locale} emailEnabled={Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)}/></div></main>;
}
