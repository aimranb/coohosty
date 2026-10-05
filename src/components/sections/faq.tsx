import { getTranslations } from 'next-intl/server';
import { faqIds } from '@/config/faq';

export async function Faq() {
  const t = await getTranslations('faq');
  return <section id="faq" className="section container faq-section" aria-labelledby="faq-title"><div className="faq-intro"><h2 id="faq-title">{t('title')}</h2></div><div className="faq-list">{faqIds.map(id => <details className="faq-item" name="coohosty-faq" key={id}><summary><h3>{t(`items.${id}.question`)}</h3><span className="faq-plus" aria-hidden="true">+</span></summary><div className="faq-answer"><p>{t(`items.${id}.answer`)}</p></div></details>)}</div></section>;
}
