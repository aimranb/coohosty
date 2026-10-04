import { getLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/config/site';
import { Reveal } from '@/components/ui/reveal';
import { ListingDemo, type ListingLabels } from './listing-demo';

export async function Showcase() {
  const t = await getTranslations('showcase');
  const locale = await getLocale() as Locale;
  const keys = ['galleryLabel', 'previousPhoto', 'nextPhoto', 'selectPhoto', 'photoCredit', 'disclosure', 'listingCategory', 'villaTitle', 'apartmentTitle', 'listingDescription', 'photoTag', 'infoTag', 'welcomeTag', 'reviewIllustration', 'reviewPlaceholder', 'reviewSource'] as const;
  const labels = { ...Object.fromEntries(keys.map(key => [key, t(key)])), photoAlts: t.raw('photoAlts') as string[], phone: t.raw('phone') as ListingLabels['phone'] } as ListingLabels;
  return <section id="showcase" className="showcase-section section"><div className="container">
    <Reveal className="showcase-heading"><div className="eyebrow">{t('eyebrow')}</div><h2>{t('title')}<br/><em>{t('accent')}</em></h2><p>{t('description')}</p></Reveal>
    <Reveal><ListingDemo labels={labels} locale={locale}/></Reveal>
  </div></section>;
}
