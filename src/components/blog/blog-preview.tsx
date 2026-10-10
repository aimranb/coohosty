import type { Locale } from '@/config/site';
import { blogUi } from '@/content/blog-ui';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getBlogPosts } from '@/content/blog';
import { BlogCard } from './blog-card';
import { Reveal } from '@/components/ui/reveal';
import styles from './blog-journal.module.css';

export function BlogPreview({ locale = 'fr' }: { locale?: Locale }) {
  const t = blogUi[locale];
  const blogPosts = getBlogPosts(locale);
  return <section className={styles.journal} aria-labelledby="blog-preview-title"><div className={`container ${styles.home}`}>
    <Reveal className={styles.journalHeading}><div><span className={styles.journalEyebrow}><i/>{t.journal}</span><h2 id="blog-preview-title">{t.recent}</h2></div><Link className={styles.journalAll} href={`/${locale}/blog`}>{t.all} <ArrowUpRight size={18} aria-hidden="true"/></Link></Reveal>
    <div className={styles.grid}>{blogPosts.slice(0, 3).map((post, index) => <Reveal key={post.slug} delay={0.1 + index * 0.1}><BlogCard post={post} locale={locale}/></Reveal>)}</div>
  </div></section>;
}
