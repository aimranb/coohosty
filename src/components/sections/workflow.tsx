import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { PremiumIcon, type PremiumIconName } from '@/components/ui/premium-icon';
import { EyeSignature } from '@/components/ui/eye-signature';
import { Reveal } from '@/components/ui/reveal';
export async function Workflow() {
  const t = await getTranslations('workflow');
  const items = [{ id: 'listing', icon: 'house' }, { id: 'pricing', icon: 'coins' }, { id: 'guests', icon: 'guests' }, { id: 'calendar', icon: 'calendar' }, { id: 'revenue', icon: 'revenue' }] satisfies { id: string; icon: PremiumIconName }[];
  return <section id="workflow" className="workflow section"><Reveal className="container"><div className="section-heading centered"><div className="eyebrow">{t('eyebrow')}</div><h2>{t('title')}</h2></div><EyeSignature labels={{ watching: t('watching'), tagline: t('signatureTagline'), pause: t('pauseEyes'), resume: t('resumeEyes'), initialStep: t('listing') }}/><ol className="workflow-steps">{items.map(({ id, icon }, i) => <li key={id} data-signature-label={t(id)}><div className="workflow-icon"><PremiumIcon name={icon}/></div><span>{t(id)}</span>{i < 4 && <ArrowRight className="workflow-arrow" size={20} aria-hidden="true"/>}</li>)}</ol><p className="method">{t('method')}</p></Reveal></section>;
}
