import { getLocale, getTranslations } from 'next-intl/server';
import { PropertySlideshow } from './property-slideshow';
import { EstimateBar } from '@/components/forms/estimate-bar';
import { isLocale } from '@/config/site';

export async function Hero() {
  const t = await getTranslations('hero');
  const showcase = await getTranslations('showcase');
  const destinations = await getTranslations('destinations');
  const alts = showcase.raw('photoAlts') as string[];
  const photos = [
    { src: '/images/hero-airbnb.webp', alt: alts[1] },
    { src: '/images/hero-interior-6.webp', alt: alts[6] },
    { src: '/images/hero-interior-warm.webp', alt: alts[1] },
    { src: '/images/hero-interior-3.webp', alt: alts[3] },
    { src: '/images/hero-interior-4.webp', alt: alts[4] },
  ];
  const requestedLocale = await getLocale();
  const locale = isLocale(requestedLocale) ? requestedLocale : 'fr';
  return <div className="hero-surface">
    <section className="hero container">
      <div className="hero-copy">
        <EstimateBar locale={locale} emailEnabled={Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)}/>
      </div>
      <PropertySlideshow photos={photos} labels={{ label: t('photoLabel'), title: t('photoTitle'), caption: t('caption'), disclosure: t('photoDisclosure'), pause: destinations('pause'), play: destinations('play'), previous: showcase('previousPhoto'), next: showcase('nextPhoto') }}/>
    </section>
  </div>;
}
