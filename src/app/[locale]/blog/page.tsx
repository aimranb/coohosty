import { blogUi } from '@/content/blog-ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { isLocale, site } from '@/config/site';
import { getBlogPosts } from '@/content/blog';
import { BlogCard } from '@/components/blog/blog-card';
import { BlogCta } from '@/components/blog/blog-cta';
import { blogMetadata } from '@/lib/blog-seo';
import { organizationStructuredData } from '@/lib/structured-data';
import articleStyles from '@/components/blog/blog.module.css';
import journalStyles from '@/components/blog/blog-journal.module.css';
const styles = { ...articleStyles, ...journalStyles };

async function resolveLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return locale;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  return blogMetadata(undefined, locale);
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = blogUi[locale];
  const blogPosts = getBlogPosts(locale);
  const blogUrl = `${site.url}/${locale}/blog`;
  const structuredData = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Blog', '@id': blogUrl, url: blogUrl, name: t.title, inLanguage: `${locale}-MA`, publisher: organizationStructuredData(), blogPost: blogPosts.map(post => ({ '@type': 'BlogPosting', headline: post.title, url: `${blogUrl}/${post.slug}`, datePublished: post.published })) },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.home, item: `${site.url}/${locale}` },
      { '@type': 'ListItem', position: 2, name: t.blog, item: blogUrl },
    ] },
  ] };
  return <main id="main-content" className={styles.journal}><div className={`container ${styles.journalInner}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}/>
    <nav className={styles.breadcrumbs} aria-label={t.breadcrumb}><Link href={`/${locale}`}>{t.home}</Link><span aria-hidden="true">/</span><span aria-current="page">{t.blog}</span></nav>
    <header className={styles.journalHeading}>
      <div><span className={styles.journalEyebrow}><i/>{t.journal}</span><h1>{t.recent}</h1></div>
      <span className={styles.entryCount}>{blogPosts.length} {t.guides}</span>
    </header>
    <div className={styles.grid}>{blogPosts.map((post, index) => <BlogCard key={post.slug} post={post} featured={index === 0} locale={locale}/>)}</div>
    <BlogCta locale={locale}/>
  </div></main>;
}
