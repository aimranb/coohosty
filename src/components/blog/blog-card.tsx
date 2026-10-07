import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { blogReadingTime, type BlogPost } from '@/content/blog';
import styles from './blog-journal.module.css';
import { BlogCover } from './blog-cover';

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
    <Link className={styles.coverLink} href={`/fr/blog/${post.slug}`} tabIndex={-1} aria-hidden="true"><BlogCover post={post}/>{featured && <span className={styles.priorityBadge}>Guide prioritaire</span>}</Link>
    <div className={styles.cardContent}>
    <div className={styles.cardMeta}><span>{post.category}</span><span>{blogReadingTime(post)} min de lecture</span></div>
    <h2><Link href={`/fr/blog/${post.slug}`}>{post.title}</Link></h2>
    <p>{post.description}</p>
    <Link className={styles.cardLink} href={`/fr/blog/${post.slug}`}>Lire le guide <ArrowUpRight size={18} aria-hidden="true"/><span className={styles.srOnly}> : {post.title}</span></Link>
    </div>
  </article>;
}
