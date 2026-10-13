import { ArrowRight, MapPin, House, ChartNoAxesCombined, KeyRound } from 'lucide-react';
import type { Locale } from '@/config/site';
import { Reveal } from '@/components/ui/reveal';
import styles from './landing-intro.module.css';
import { PlatformBackground } from './platform-background';
import { LandingReviews } from './landing-reviews';

const content = {
  fr: { title: 'Votre logement.', accent: 'Notre attention.', intro: "Retrouvez du temps pour vous. Nous gérons vos annonces, tarifs, réservations et messages partout au Maroc.", for: 'À vos côtés pour', services: ['Analyser', 'Optimiser', 'Gérer'], action: 'Parlons de votre logement', cities: ['Marrakech', 'Casablanca', 'Tanger'], note: "Gestion digitale au Maroc. Gestion physique à Meknès." },
  en: { title: 'Your property.', accent: 'Our attention.', intro: "Get your time back. We manage your listings, rates, bookings and messages across Morocco.", for: 'Here to help you', services: ['Review', 'Optimize', 'Manage'], action: 'Let’s talk about your property', cities: ['Marrakech', 'Casablanca', 'Tangier'], note: "Digital management across Morocco. On-site management in Meknes." },
  ar: { title: 'عقارك.', accent: 'اهتمامنا.', intro: "استرجع وقتك وراحة بالك. ندير إعلاناتك وأسعارك وحجوزاتك ورسائلك في جميع أنحاء المغرب.", for: 'إلى جانبك من أجل', services: ['التحليل', 'التحسين', 'الإدارة'], action: 'لنتحدث عن عقارك', cities: ['مراكش', 'الدار البيضاء', 'طنجة'], note: "إدارة رقمية في المغرب. إدارة ميدانية في مكناس." },
};

export function LandingIntro({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const title = { fr: 'Fatigué de gérer votre location vous-même ?', en: 'Tired of managing your property yourself?', ar: 'تعبت من تدبير كراء عقارك بنفسك؟' }[locale];
  const firstSpace = title.indexOf(' ');
  const icons = [House, ChartNoAxesCombined, KeyRound];
  return (
    <section className={styles.intro} aria-labelledby="landing-title">
      <PlatformBackground locale={locale}/>
      <div className={styles.inner}>
        <Reveal duration={1100}><h1 id="landing-title"><span className={styles.titleAccent}>{title.slice(0, firstSpace)}<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M4 13 Q95 2 196 10" /></svg></span>{title.slice(firstSpace)}</h1></Reveal>
        <Reveal delay={0.25} duration={1100}><p className={styles.description}>{locale === 'fr' ? <>On s’occupe de votre logement de <strong className={styles.rangeLetter}>A</strong> à <strong className={styles.rangeLetter}>Z</strong>.</> : locale === 'en' ? <>We manage your property from <strong className={styles.rangeLetter}>A</strong> to <strong className={styles.rangeLetter}>Z</strong>.</> : <>نتكفّل بتدبير عقارك من <strong className={styles.rangeLetter}>الألف</strong> إلى <strong className={styles.rangeLetter}>الياء</strong>.</>}</p></Reveal>
        <Reveal delay={0.5} duration={1100} className={styles.services}>
          <span>{copy.for}</span>
          {icons.map((Icon, index) => <span key={index}><Icon size={22} aria-hidden="true"/>{copy.services[index]}</span>)}
        </Reveal>
        <Reveal delay={0.75} duration={1100}><a href="#estimate" className={styles.cta}>{copy.action}<ArrowRight size={23} aria-hidden="true"/></a></Reveal>
        <Reveal delay={1.0} duration={1100} className={styles.presence}>
          <div className={styles.cities}>{copy.cities.map(city => <span key={city}><MapPin size={15} aria-hidden="true"/>{city}</span>)}</div>
          <p>{copy.note}</p>
        </Reveal>
        <Reveal delay={1.25} duration={1100}><LandingReviews locale={locale}/></Reveal>
      </div>
    </section>
  );
}
