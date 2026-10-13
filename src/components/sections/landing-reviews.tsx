import { Quote, Star } from 'lucide-react';
import config from '@/config/service-proof.json';
import type { Locale } from '@/config/site';
import styles from './landing-reviews.module.css';

type Review = { name: string; city: string; quote: Record<Locale, string>; sourceUrl: string | null; rating?: number };
const headings = { fr: 'Ce que nos clients disent', en: 'What our clients say', ar: 'ماذا يقول عملاؤنا' };

export function LandingReviews({ locale }: { locale: Locale }) {
  const reviews: Review[] = config.reviews;
  if (!reviews.length) return null;
  return <aside className={styles.reviews} aria-label={headings[locale]}>
    <p className={styles.heading}>{headings[locale]}</p>
    <div className={styles.cards}>{reviews.slice(0, 2).map((review, index) => <figure className={styles.card} key={`${review.name}-${index}`}>
      <div className={styles.top}><Quote size={19} aria-hidden="true"/>{review.rating !== undefined && Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5 && <span className={styles.stars} aria-label={`${review.rating}/5`}>{Array.from({ length: review.rating }, (_, star) => <Star size={15} key={star} aria-hidden="true"/>)}</span>}</div>
      <blockquote>{review.quote[locale]}</blockquote>
      <figcaption><span className={styles.avatar} aria-hidden="true">{review.name.slice(0, 1)}</span><span><strong>{review.name}</strong>{review.city && <small>{review.city}</small>}</span>{review.sourceUrl && <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer">↗</a>}</figcaption>
    </figure>)}</div>
  </aside>;
}
