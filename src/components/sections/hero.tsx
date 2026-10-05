import { getLocale, getTranslations } from 'next-intl/server';
import { PropertySlideshow } from './property-slideshow';
import gallery from '@/config/property-gallery.json';
import { EstimateBar } from '@/components/forms/estimate-bar';
import { isLocale } from '@/config/site';

export async function Hero() {
  const t = await getTranslations('hero');
  const showcase = await getTranslations('showcase');
  const destinations = await getTranslations('destinations');
  const alts = showcase.raw('photoAlts') as string[];
  const indices = [1, 0, 2, 5, 7];
  const photos = indices.map(index => ({ src: index === 1 ? '/images/hero-airbnb.webp' : gallery.photos[index].src, alt: alts[index] }));
  const requestedLocale = await getLocale();
  const locale = isLocale(requestedLocale) ? requestedLocale : 'fr';
  return <div className="hero-surface">
    <section className="hero container">
      <h1 className="hero-headline">{t('title')}{' '}{t('title2')}{' '}<em>{t('title3')}</em></h1>
      <p className="hero-intro">{t('subtitle')}</p>
      <div className="hero-copy">
        <EstimateBar locale={locale} emailEnabled={Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)}/>
      </div>
      <PropertySlideshow photos={photos} labels={{ label: t('photoLabel'), title: t('photoTitle'), caption: t('caption'), disclosure: t('photoDisclosure'), pause: destinations('pause'), play: destinations('play'), previous: showcase('previousPhoto'), next: showcase('nextPhoto') }}/>
    </section>
  </div>;
}
