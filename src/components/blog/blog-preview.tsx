import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { blogPosts } from '@/content/blog';
import { BlogCard } from './blog-card';
import { Reveal } from '@/components/ui/reveal';
import styles from './blog-journal.module.css';

export function BlogPreview() {
  return <section className={styles.journal} aria-labelledby="blog-preview-title"><div className={`container ${styles.home}`}>
    <Reveal className={styles.journalHeading}><div><span className={styles.journalEyebrow}><i/>LE JOURNAL DE COOHOSTY</span><h2 id="blog-preview-title">Articles récents</h2></div><Link className={styles.journalAll} href="/fr/blog">Tous les guides <ArrowUpRight size={18} aria-hidden="true"/></Link></Reveal>
    <div className={styles.grid}>{blogPosts.slice(0, 3).map((post, index) => <Reveal key={post.slug} delay={0.1 + index * 0.1}><BlogCard post={post}/></Reveal>)}</div>
  </div></section>;
}
