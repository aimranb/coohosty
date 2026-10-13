import Image from 'next/image';
import { KeyRound, SprayCan, Wrench } from 'lucide-react';
import type { Locale } from '@/config/site';
import { Reveal } from '@/components/ui/reveal';
import styles from './apartment-care.module.css';
import { serviceArea } from '@/content/service-area';

const content = {
  fr: { title: 'Votre appartement, on s’occupe du quotidien.', intro: 'Votre appartement est prêt et vos tarifs sont ajustés. On s’occupe maintenant des séjours, pour vous et vos voyageurs.', services: [
    { title: 'On s’occupe de votre ménage.', description: 'On organise le ménage entre les séjours, le linge frais et la vérification du logement. Votre appartement est prêt pour les prochains voyageurs.', alt: 'Chambre accueillante préparée avec du linge frais et un plaid vert', tag: 'Ménage & linge' },
    { title: 'On coordonne votre maintenance.', description: 'Un petit problème dans votre appartement ? On suit la situation, on coordonne les interventions et on vous tient au courant.', alt: 'Intervention de maintenance dans un appartement lumineux et bien aménagé', tag: 'Maintenance' },
    { title: 'On gère vos check-in et check-out.', description: 'On prépare l’arrivée de vos voyageurs, on organise la remise des clés et on suit les départs. Vous avez un interlocuteur pour chaque séjour.', alt: 'Entrée d’appartement prête pour accueillir les voyageurs avec clés et linge frais', tag: 'Arrivées & départs' },
  ] },
  en: { title: 'Your apartment. We take care of the everyday details.', intro: 'Your apartment is ready and your rates are set. We now take care of the stays, for you and your guests.', services: [
    { title: 'We take care of your cleaning.', description: 'We arrange cleaning between stays, fresh linen and property checks. Your apartment is ready for the next guests.', alt: 'Welcoming bedroom prepared with fresh linen and a green throw', tag: 'Cleaning & linen' },
    { title: 'We coordinate your maintenance.', description: 'A small problem in your apartment? We follow it up, coordinate the work and keep you informed.', alt: 'Maintenance work in a bright, carefully furnished apartment', tag: 'Maintenance' },
    { title: 'We manage your check-ins and check-outs.', description: 'We prepare for your guests’ arrival, arrange key handover and follow up departures. You have someone to contact for every stay.', alt: 'Welcoming apartment entrance ready for guests with keys and fresh towels', tag: 'Arrivals & departures' },
  ] },
  ar: { title: 'شقتك، نهتم بتفاصيلها اليومية.', intro: 'شقتك جاهزة وأسعارك محددة. نهتم الآن بالإقامات من أجلك ومن أجل ضيوفك.', services: [
    { title: 'نهتم بتنظيف شقتك.', description: 'ننسق التنظيف بين الإقامات، وتجهيز المفروشات النظيفة وفحص السكن ليكون جاهزًا للضيوف القادمين.', alt: 'غرفة نوم مجهزة بمفروشات نظيفة وغطاء أخضر', tag: 'التنظيف والمفروشات' },
    { title: 'ننسق صيانة شقتك.', description: 'هناك عطل بسيط في شقتك؟ نتابع الوضع وننسق التدخلات ونطلعك على المستجدات.', alt: 'صيانة داخل شقة مضيئة ومجهزة بعناية', tag: 'الصيانة' },
    { title: 'ندير وصول ضيوفك ومغادرتهم.', description: 'نجهز وصول الضيوف وننسق تسليم المفاتيح ونتابع المغادرة. لديك جهة تواصل لكل إقامة.', alt: 'مدخل شقة جاهز لاستقبال الضيوف مع مفاتيح ومناشف نظيفة', tag: 'الوصول والمغادرة' },
  ] },
};
const photos = ['cleaning-professional-v2', 'maintenance-natural-v1', 'arrival-keys-v2'];
const icons = [SprayCan, Wrench, KeyRound];

export function ApartmentCare({ locale }: { locale: Locale }) {
  const t = content[locale];
  return <section className={`container section ${styles.care}`} id="apartment-care">
    <Reveal className={styles.heading}><span className="eyebrow">{locale === 'fr' ? 'À MEKNÈS' : locale === 'en' ? 'IN MEKNES' : 'في مكناس'}</span><h2>{t.title}</h2><p>{t.intro} {serviceArea[locale].local}</p></Reveal>
    <div className={styles.grid}>{t.services.map((service, index) => {
      const Icon = icons[index];
      return <article key={photos[index]} className={styles.card}>
        <Reveal className={styles.photo} delay={index * 0.12}><Image src={`/images/design/${photos[index]}.webp`} alt={service.alt} fill sizes="(max-width:760px) 90vw, (max-width:1100px) 45vw, 380px" unoptimized/><span className={styles.tag}><Icon size={15} aria-hidden="true"/>{service.tag}</span></Reveal>
        <div className={styles.copy}><Reveal delay={index * 0.12 + 0.1}><h3>{service.title}</h3></Reveal><Reveal delay={index * 0.12 + 0.23}><p>{service.description}</p></Reveal></div>
      </article>;
    })}</div>
  </section>;
}
