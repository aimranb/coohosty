import type { Locale } from '@/config/site';
import { blogUi } from '@/content/blog-ui';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { blogReadingTime, type BlogPost } from '@/content/blog';
import styles from './blog-journal.module.css';
import { BlogCover } from './blog-cover';

export function BlogCard({ post, featured = false, locale = 'fr' }: { post: BlogPost; featured?: boolean; locale?: Locale }) {
  const t = blogUi[locale];
  return <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
    <Link className={styles.coverLink} href={`/${locale}/blog/${post.slug}`} tabIndex={-1} aria-hidden="true"><BlogCover post={post} locale={locale}/>{featured && <span className={styles.priorityBadge}>{t.priority}</span>}</Link>
    <div className={styles.cardContent}>
    <div className={styles.cardMeta}><span>{post.category}</span><span>{blogReadingTime(post)} {t.minutes}</span></div>
    <h2><Link href={`/${locale}/blog/${post.slug}`}>{post.title}</Link></h2>
    <p>{post.description}</p>
    <Link className={styles.cardLink} href={`/${locale}/blog/${post.slug}`}>{t.read} <ArrowUpRight size={18} aria-hidden="true"/><span className={styles.srOnly}> : {post.title}</span></Link>
    </div>
  </article>;
}
