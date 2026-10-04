import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales, site, type Locale } from '@/config/site';
export async function localizedMetadata(locale: Locale, page: 'home' | 'legal' | 'privacy' = 'home'): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: page === 'home' ? 'meta' : page });
  const suffix = page === 'home' ? '' : `/${page}`;
  const title = t('title');
  const description = t(page === 'home' ? 'description' : 'intro');
  const canonical = `${site.url}/${locale}${suffix}`;
  return { title, description, alternates: { canonical, languages: { ...Object.fromEntries(locales.map(language => [language, `${site.url}/${language}${suffix}`])), 'x-default': `${site.url}/${site.seo.defaultLocale}${suffix}` } }, openGraph: { title, description, url: canonical, siteName: site.brand, type: 'website', locale: { fr: 'fr_MA', en: 'en_US', ar: 'ar_MA' }[locale], images: [{ url: site.seo.socialImage, width: 1200, height: 630, alt: site.brand }] }, twitter: { card: site.seo.twitterCard, title, description, images: [site.seo.socialImage] } };
}
