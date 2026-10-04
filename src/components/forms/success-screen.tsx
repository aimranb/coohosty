'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Check, ArrowRight } from 'lucide-react';
import { site, type Locale } from '@/config/site';
export function SuccessScreen({ locale }: { locale: Locale }) {
  const t = useTranslations('form');
  return <div className="audit-shell success-screen" role="status">
    <div className="success-icon"><Check size={27}/></div>
    <h3>{t('success')}</h3><p>{t('successText')}</p>
    <div className="success-actions"><a href={site.whatsapp} className="button" target="_blank" rel="noopener noreferrer">{t('whatsapp')}<ArrowRight size={16}/></a><Link href={`/${locale}`}>{t('home')} ↑</Link></div>
  </div>;
}
