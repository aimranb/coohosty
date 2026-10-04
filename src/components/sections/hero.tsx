import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { House } from 'lucide-react';
import { Eyes } from '@/components/ui/logo';
export async function Hero() {
  const t = await getTranslations('hero');
  return <div className="hero-surface"><section className="hero container"><div className="hero-copy"><h1>{t('title')}<br/>{t('title2')}<br/><em>{t('title3')}</em></h1><p>{t('subtitle')}</p><div className="hero-buttons"><a className="button" href="#contact">{t('primary')}<ArrowUpRight size={18}/></a><a className="button button-outline" href="#plans">{t('secondary')}<ArrowUpRight size={18}/></a></div><div className="hero-note"><Eyes/><div><strong>{t('tag')}</strong><span>{t('location')}</span></div></div></div><figure className="hero-photo hero-property"><Image src="/images/hero-airbnb.webp" alt={t('imageAlt')} fill preload sizes="(max-width: 760px) 100vw, 50vw"/><div className="hero-property-shade"/><div className="hero-photo-label"><House size={15}/>{t('photoLabel')}</div><figcaption className="hero-property-caption"><strong>{t('photoTitle')}</strong><span>{t('caption')}</span><small>{t('photoDisclosure')}</small></figcaption></figure><a className="hero-scroll" href="#services"><ArrowDown size={14}/>{t('scroll')}</a></section></div>;
}
