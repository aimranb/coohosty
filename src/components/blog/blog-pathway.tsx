import Link from 'next/link';
import type { BlogPost } from '@/content/blog';
import { getBlogPost } from '@/content/blog';
import { blogPathway } from '@/content/blog-pathways';
import type { Locale } from '@/config/site';
import styles from './blog-pathway.module.css';

export function BlogPathway({ post, locale }: { post: BlogPost; locale: Locale }) {
  if (locale !== 'fr') return null;
  const pathway = blogPathway(post);
  if (!pathway) return null;
  const candidates = [pathway.pillar, 'location-courte-duree-maroc', ...pathway.slugs];
  const guides = [...new Set(candidates)].filter(slug => slug !== post.slug).slice(0, 4).flatMap(slug => { const guide = getBlogPost(slug); return guide ? [guide] : []; });
  return <nav className={styles.pathway} aria-label="Continuez votre projet de location"><h2>Continuez votre projet de location</h2><p>{pathway.description}</p><ul>{guides.map(guide => <li key={guide.slug}><Link href={`/fr/blog/${guide.slug}`}>{guide.title}</Link></li>)}</ul><Link className={styles.all} href={`/fr/blog#${pathway.id}`}>Tous les guides sur ce sujet</Link></nav>;
}

export function BlogEstimatePrompt() {
  return <aside className={styles.estimate} aria-label="Analyser votre logement"><div><h2>Vous possédez un logement au Maroc ?</h2><p>Présentez-nous votre bien pour étudier sa gestion et les pistes d’amélioration.</p></div><Link href="/fr#estimate">Analyser mon bien <span aria-hidden="true">↗</span></Link></aside>;
}
