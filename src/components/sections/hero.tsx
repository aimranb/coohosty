import { getLocale, getTranslations } from 'next-intl/server';
import { House } from 'lucide-react';
import Image from 'next/image';
import { EstimateBar } from '@/components/forms/estimate-bar';
import { isLocale } from '@/config/site';

export async function Hero() {
  const t = await getTranslations('hero');
  const requestedLocale = await getLocale();
  const locale = isLocale(requestedLocale) ? requestedLocale : 'fr';
  return <div className="hero-surface">
    <section className="hero container">
      <h1 className="hero-headline">{t('title')}{' '}{t('title2')}{' '}<em>{t('title3')}</em></h1>
      <p className="hero-intro">{t('subtitle')}</p>
      <div className="hero-copy">
        <EstimateBar locale={locale} emailEnabled={Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)}/>
      </div>
      <figure className="hero-photo hero-property">
        <Image src="/images/hero-airbnb.webp" alt={t('imageAlt')} fill preload sizes="(max-width: 760px) 100vw, 50vw"/>
        <div className="hero-property-shade"/>
        <div className="hero-photo-label"><House size={15}/>{t('photoLabel')}</div>
        <figcaption className="hero-property-caption"><strong>{t('photoTitle')}</strong><span>{t('caption')}</span></figcaption>
      </figure>
    </section>
  </div>;
}
