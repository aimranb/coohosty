import type { Locale } from '@/config/site';
import { blogUi } from '@/content/blog-ui';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import styles from './blog.module.css';

export function BlogCta({ locale = 'fr' }: { locale?: Locale }) {
  const t = blogUi[locale];
  return <aside className={styles.cta} aria-label={t.ctaLabel}>
    <h2>{t.ctaTitle}</h2>
    <p>{t.ctaText}</p>
    <div className={styles.ctaActions}>
      <Link href={`/${locale}#estimate`}>{t.ctaProperty} <ArrowUpRight size={18} aria-hidden="true"/></Link>
      <Link href={`/${locale}/services/cohost`}>{t.ctaService} <ArrowUpRight size={18} aria-hidden="true"/></Link>
    </div>
  </aside>;
}
