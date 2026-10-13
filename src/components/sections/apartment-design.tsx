import Image from 'next/image';
import { getLocale } from 'next-intl/server';
import { ArrowUpRight, Check } from 'lucide-react';
import { isLocale } from '@/config/site';
import { Reveal } from '@/components/ui/reveal';
import styles from './apartment-design.module.css';

const content = {
  fr: { eyebrow: 'DESIGN & AMÉNAGEMENT', title: 'On vous aide à créer un appartement accueillant.', intro: 'On vous aide à choisir les couleurs, les meubles et les détails qui rendent votre appartement agréable à vivre, en respectant votre budget.', points: ['Une décoration qui révèle le potentiel de votre appartement', 'Des meubles et des matières adaptés à votre budget', 'Un espace confortable, pensé pour vos voyageurs'], action: 'Parlons du design de votre appartement', bedroom: 'Chambre lumineuse, linge clair et plaid vert profond', living: 'Salon accueillant, bois naturel et textiles doux', caption: 'Des matières naturelles. Une ambiance qui fait la différence.', note: 'Inspirations d’aménagement', label: 'Notre accompagnement' },
  en: { eyebrow: 'DESIGN & INTERIORS', title: 'We help you create a welcoming apartment.', intro: 'We help you create a warm, harmonious interior suited to holiday rentals. From colours to finishing touches, every room finds its balance.', points: ['Décor that brings out your apartment’s potential', 'Furniture and materials suited to your budget', 'A comfortable space designed around your guests'], action: 'Let’s talk about your apartment design', bedroom: 'Bright bedroom with light linen and a deep green throw', living: 'Welcoming living room with natural wood and soft fabrics', caption: 'Natural materials. An atmosphere that makes a difference.', note: 'Interior design inspiration', label: 'How we help' },
  ar: { eyebrow: 'التصميم وتجهيز الشقق', title: 'نساعدك على تجهيز شقة ترحب بضيوفك.', intro: 'نساعدك على تصميم مساحة دافئة ومتناسقة ومناسبة للإيجار. من اختيار الألوان إلى التفاصيل الصغيرة، نمنح كل غرفة توازنها.', points: ['ديكور يبرز إمكانات شقتك', 'أثاث ومواد تناسب ميزانيتك', 'مساحة مريحة مصممة لتلبية احتياجات ضيوفك'], action: 'لنتحدث عن تصميم شقتك', bedroom: 'غرفة نوم مضيئة بمفروشات فاتحة وغطاء أخضر داكن', living: 'غرفة معيشة دافئة بخشب طبيعي ومنسوجات ناعمة', caption: 'مواد طبيعية وأجواء تصنع الفرق.', note: 'أفكار لتصميم الديكور', label: 'كيف نساعدك' },
};
export async function ApartmentDesign() {
  const requested = await getLocale();
  const locale = isLocale(requested) ? requested : 'fr';
  const t = content[locale];
  return <section id="about-coohosty" className={`container section ${styles.section}`} aria-labelledby="about-coohosty-title">
    <Reveal className={styles.copy}>
      <span className={styles.eyebrow} data-category-label>{t.eyebrow}</span><h2 id="about-coohosty-title">{t.title}</h2><p>{t.intro}</p>
      <ul>{t.points.map(point => <li key={point}><Check size={18} aria-hidden="true"/><span>{point}</span></li>)}</ul>
      <a href="#estimate" className={styles.cta}>{t.action}<ArrowUpRight size={19} aria-hidden="true"/></a>
    </Reveal>
    <Reveal className={styles.photos} delay={0.15}>
      <figure className={styles.bedroom}><Image src="/images/design/bedroom-natural-v1.webp" alt={t.bedroom} fill sizes="(max-width:760px) 70vw, 400px" quality={90}/></figure>
      <figure className={styles.living}><Image src="/images/design/living-natural-v1.webp" alt={t.living} fill sizes="(max-width:760px) 56vw, 330px" quality={90}/></figure>
    </Reveal>
  </section>;
}
