import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, Phone, Mail } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { Logo } from '@/components/ui/logo';
import { site, type Locale } from '@/config/site';
export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations('footer');
  return <><footer id="contact" className="footer container"><div className="footer-main"><div><Logo href={`/${locale}`}/><p>{t('description')}</p></div><div className="footer-contact"><h3>{t('contact')}</h3><a href={`tel:${site.tel}`}><Phone size={15}/><bdi>{site.phone}</bdi></a><a href={`mailto:${site.email}`}><Mail size={15}/>{site.email}</a><a href={site.whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon width={16} height={16}/>WhatsApp <ArrowUpRight size={15}/></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} COOHOSTY. {t('rights')}</span><div><Link href={`/${locale}/legal`}>{t('legal')}</Link><Link href={`/${locale}/privacy`}>{t('privacy')}</Link></div><a href="#top">{t('back')} ↑</a></div></footer><a className="floating-whatsapp" href={site.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppIcon width={24} height={24}/></a></>;
}
