import { getLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { isLocale } from '@/config/site';
import { Reveal } from '@/components/ui/reveal';
import styles from './pricing-support.module.css';
import { PricingGraphs } from './pricing-graphs';

const content = {
  fr: { title: 'Le bon tarif, au bon moment.', intro: 'Votre marché est étudié. On ajuste maintenant vos tarifs à la demande, tout en vous laissant la main.', action: 'Parlons de vos tarifs', steps: [
    { title: 'Votre marché, bien compris.', text: 'On compare les logements similaires et on regarde la demande dans votre ville.' },
    { title: 'Vos prix, ajustés au fil des jours.', text: 'On adapte vos tarifs à la saison, aux événements et aux dates encore disponibles.' },
    { title: 'Vos résultats, faciles à suivre.', text: 'On vous partage un bilan clair des réservations, de l’occupation et des revenus.' },
  ] },
  en: { title: 'The right price, at the right time.', intro: 'With your market understood, we adjust your rates to demand while you stay in control.', action: 'Let’s talk about your rates', steps: [
    { title: 'Your market, understood.', text: 'We compare similar properties and look at demand in your city.' },
    { title: 'Your rates, adjusted as demand changes.', text: 'We adapt your prices to the season, local events and available dates.' },
    { title: 'Your results, easy to follow.', text: 'We share a clear report of your bookings, occupancy and revenue.' },
  ] },
  ar: { title: 'السعر المناسب، في الوقت المناسب.', intro: 'بعد دراسة سوقك، نعدل أسعارك حسب الطلب، وتبقى أنت صاحب القرار.', action: 'لنتحدث عن أسعارك', steps: [
    { title: 'نفهم سوق عقارك.', text: 'نقارن العقارات المشابهة وندرس الطلب في مدينتك.' },
    { title: 'نعدل أسعارك حسب الطلب.', text: 'نراعي الموسم والأحداث المحلية والتواريخ المتاحة في التقويم.' },
    { title: 'نتائج واضحة يسهل متابعتها.', text: 'نشاركك تقريرًا واضحًا عن الحجوزات والإشغال والإيرادات.' },
  ] },
};
export async function PricingSupport() {
  const requested = await getLocale();const locale=isLocale(requested)?requested:'fr';const t=content[locale];
  return <section id="revenue" className={`section container ${styles.section}`}>
    <Reveal className={styles.heading}><div><span className="eyebrow">{locale==='fr'?'TARIFS & PERFORMANCE':locale==='en'?'RATES & PERFORMANCE':'الأسعار والأداء'}</span><h2>{t.title}</h2><p>{t.intro}</p></div><a href="#estimate" className={styles.action}>{t.action}<ArrowUpRight size={18} aria-hidden="true"/></a></Reveal>
    <Reveal><PricingGraphs locale={locale}/></Reveal>
  </section>;
}
