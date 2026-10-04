import { getTranslations } from 'next-intl/server';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { Mail, Phone } from 'lucide-react';
import { AuditForm } from '@/components/forms/audit-form';
import { Eyes } from '@/components/ui/logo';
import { site, type Locale } from '@/config/site';
export async function AuditSection({ locale }: { locale: Locale }) {
  const t = await getTranslations('form');
  return <section id="contact" className="audit-section"><div className="container audit-layout"><div className="audit-intro"><div className="eyebrow">{t('eyebrow')}</div><h2>{t('title')}</h2><p>{t('subtitle')}</p><ul className="audit-comfort">{['simple','tailored','direct'].map(key => <li key={key}>{t(`comfort.${key}`)}</li>)}</ul><div className="audit-contacts"><a href={`tel:${site.tel}`}><Phone size={14}/><bdi>{site.phone}</bdi></a><a href={`mailto:${site.email}`}><Mail size={14}/>{site.email}</a><a href={site.whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon width={18} height={18}/>{t('comfort.whatsapp')}</a></div><Eyes className="audit-eyes"/></div><AuditForm locale={locale}/></div></section>;
}
