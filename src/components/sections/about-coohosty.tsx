import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, MessagesSquare, FileCheck2, ChartNoAxesCombined } from 'lucide-react';
import { site } from '@/config/site';
export async function AboutCoohosty() {
  const t = await getTranslations('offerPolicy');
  const icons = [MessagesSquare, FileCheck2, ChartNoAxesCombined];
  return <section id="about-coohosty" className="container section about-coohosty" aria-labelledby="about-coohosty-title"><div className="about-coohosty-intro"><span className="eyebrow">{t('teamEyebrow')}</span><h2 id="about-coohosty-title">{t('teamTitle')}</h2><p>{t('teamIntro')}</p><a href={site.whatsapp} target="_blank" rel="noopener noreferrer">{t('contact')}<ArrowUpRight size={17}/></a></div><div className="about-coohosty-points">{icons.map((Icon,index) => <article key={index}><Icon size={22} aria-hidden="true"/><div><h3>{t(`commitment${index+1}`)}</h3><p>{t(`detail${index+1}`)}</p></div></article>)}</div></section>;
}
