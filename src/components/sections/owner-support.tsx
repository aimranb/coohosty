import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, CalendarCheck, MessageCircle, Phone, Mail, ShieldCheck, SprayCan } from 'lucide-react';
import { site } from '@/config/site';
import { Reveal } from '@/components/ui/reveal';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';

export async function OwnerSupport() {
  const t = await getTranslations('ownerSupport');
  const steps = [{ id: 'arrival', icon: CalendarCheck }, { id: 'cleaning', icon: SprayCan }, { id: 'updates', icon: MessageCircle }];
  return <section id="contact" className="section owner-support" aria-labelledby="owner-support-title"><div className="container">
    <Reveal className="owner-support-layout"><div className="owner-support-copy"><span className="eyebrow">{t('eyebrow')}</span><h2 id="owner-support-title">{t('title')}<br/><em>{t('accent')}</em></h2><p>{t('description')}</p><a className="button owner-support-cta" href="#estimate">{t('cta')}<ArrowUpRight size={16}/></a></div>
    <div className="owner-support-timeline">{steps.map(({id,icon:Icon},index) => <article className="owner-support-step" key={id}><span className="owner-support-icon"><Icon size={23} strokeWidth={1.5}/></span><div><span className="owner-support-moment">{t(`${id}.moment`)}</span><h3>{t(`${id}.title`)}</h3><p>{t(`${id}.description`)}</p></div><span className="owner-support-number">0{index+1}</span></article>)}</div></Reveal>
    <div className="owner-support-contact"><div><ShieldCheck size={24}/><p><strong>{t('contactTitle')}</strong><span>{t('contactDescription')}</span></p></div><div className="owner-support-links"><a href={`tel:${site.tel}`}><Phone size={15}/><bdi>{site.phone}</bdi></a><a href={`mailto:${site.email}`} aria-label={t('email')}><Mail size={16}/>{t('email')}</a><a href={site.whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon width={17} height={17}/>WhatsApp<ArrowUpRight size={13}/></a></div></div>
  </div></section>;
}
