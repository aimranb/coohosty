import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale } from '@/config/site';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HomeInteractions } from '@/components/ui/home-interactions';
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations('nav');
  return <NextIntlClientProvider locale={locale} messages={{ nav: messages.nav, form: messages.form, estimate: messages.estimate }}><HomeInteractions/><a className="skip-link" href="#main-content">{t('skip')}</a><div id="top"/><Header locale={locale}/>{children}<Footer locale={locale}/></NextIntlClientProvider>;
}
