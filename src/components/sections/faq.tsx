import { getTranslations } from 'next-intl/server';
import { faqIds } from '@/config/faq';
import { site } from '@/config/site';
import { Reveal } from '@/components/ui/reveal';
export async function Faq() {
  const t = await getTranslations('faq');
  return <section id="faq" className="section container faq-section"><Reveal className="faq-intro"><div className="eyebrow">{t('eyebrow')}</div><h2>{t('title')}</h2><p>{t('description')}</p><a href={site.whatsapp} target="_blank" rel="noreferrer">{t('contact')}<span aria-hidden="true">↗</span></a></Reveal><div className="faq-list">{faqIds.map((id,index) => <details className="faq-item" name="coohosty-faq" key={id}><summary><span className="faq-number">0{index+1}</span><h3>{t(`items.${id}.question`)}</h3><span className="faq-plus" aria-hidden="true">+</span></summary><div className="faq-answer"><p>{t(`items.${id}.answer`)}</p></div></details>)}</div></section>;
}
