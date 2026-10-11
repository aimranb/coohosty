import { ArrowRight, MapPin, House, ChartNoAxesCombined, KeyRound } from 'lucide-react';
import type { Locale } from '@/config/site';
import { Reveal } from '@/components/ui/reveal';
import styles from './landing-intro.module.css';

const content = {
  fr: { title: 'Votre logement.', accent: 'Notre attention.', intro: 'De l’analyse de votre annonce à la gestion de vos séjours, choisissez l’accompagnement adapté à votre bien au Maroc.', for: 'À vos côtés pour', services: ['Analyser', 'Optimiser', 'Gérer'], action: 'Parlons de votre logement', cities: ['Marrakech', 'Casablanca', 'Tanger'], note: 'Trois villes. La même exigence.' },
  en: { title: 'Your property.', accent: 'Our attention.', intro: 'From reviewing your listing to managing your stays, choose the support that suits your property in Morocco.', for: 'Here to help you', services: ['Review', 'Optimize', 'Manage'], action: 'Let’s talk about your property', cities: ['Marrakech', 'Casablanca', 'Tangier'], note: 'Three cities. The same care.' },
  ar: { title: 'عقارك.', accent: 'اهتمامنا.', intro: 'من تحليل إعلانك إلى إدارة الإقامات، اختر مستوى المرافقة المناسب لعقارك في المغرب.', for: 'إلى جانبك من أجل', services: ['التحليل', 'التحسين', 'الإدارة'], action: 'لنتحدث عن عقارك', cities: ['مراكش', 'الدار البيضاء', 'طنجة'], note: 'ثلاث مدن. نفس العناية.' },
};

export function LandingIntro({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const icons = [House, ChartNoAxesCombined, KeyRound];
  return (
    <section className={styles.intro} aria-labelledby="landing-title">
      <div className={styles.inner}>
        <Reveal><h1 id="landing-title">{copy.title} <span>{copy.accent}</span></h1></Reveal>
        <Reveal delay={0.1}><p className={styles.description}>{copy.intro}</p></Reveal>
        <Reveal delay={0.18} className={styles.services}>
          <span>{copy.for}</span>
          {icons.map((Icon, index) => <span key={index}><Icon size={22} aria-hidden="true"/>{copy.services[index]}</span>)}
        </Reveal>
        <Reveal delay={0.26}><a href="#estimate" className={styles.cta}>{copy.action}<ArrowRight size={23} aria-hidden="true"/></a></Reveal>
        <Reveal delay={0.34} className={styles.presence}>
          <div className={styles.cities}>{copy.cities.map(city => <span key={city}><MapPin size={15} aria-hidden="true"/>{city}</span>)}</div>
          <p>{copy.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
