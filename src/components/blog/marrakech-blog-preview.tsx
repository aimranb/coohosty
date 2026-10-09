import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/config/site';
import { getBlogPost } from '@/content/blog';
import { marrakechNeighborhoods, marrakechServiceContent } from '@/content/marrakech-service';
import { BlogCard } from './blog-card';
import { Reveal } from '@/components/ui/reveal';
import styles from './blog-journal.module.css';

export function MarrakechBlogPreview({ locale }: { locale: Locale }) {
  const copy = marrakechServiceContent[locale];
  return <section id="marrakech-blog" className={styles.journal} aria-labelledby="marrakech-blog-title"><div className={`container ${styles.home}`}>
    <Reveal className={styles.journalHeading}><div><span className={styles.journalEyebrow}><i/>COOHOSTY · MARRAKECH</span><h2 id="marrakech-blog-title">{copy.journalTitle}</h2></div><Link className={styles.journalAll} href="/fr/blog">{copy.journalAll}<ArrowUpRight size={18} aria-hidden="true"/></Link></Reveal>
    <div className={styles.grid}>{marrakechNeighborhoods.map((area, index) => {
      const post = getBlogPost(area.slug);
      return post ? <Reveal key={area.id} delay={0.1 + index * 0.1}><BlogCard post={post}/></Reveal> : null;
    })}</div>
  </div></section>;
}
