import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { isLocale, site } from '@/config/site';
import { blogPosts } from '@/content/blog';
import { BlogCard } from '@/components/blog/blog-card';
import { BlogCta } from '@/components/blog/blog-cta';
import { blogMetadata, blogUrl } from '@/lib/blog-seo';
import articleStyles from '@/components/blog/blog.module.css';
import journalStyles from '@/components/blog/blog-journal.module.css';
const styles = { ...articleStyles, ...journalStyles };

async function resolveLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale !== 'fr') permanentRedirect('/fr/blog');
  setRequestLocale('fr');
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  await resolveLocale(params);
  return blogMetadata();
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  await resolveLocale(params);
  const structuredData = { '@context': 'https://schema.org', '@type': 'Blog', '@id': blogUrl, url: blogUrl, name: 'Guides propriétaires Airbnb au Maroc', inLanguage: 'fr-MA', publisher: { '@type': 'Organization', name: site.brand, url: site.url }, blogPost: blogPosts.map(post => ({ '@type': 'BlogPosting', headline: post.title, url: `${blogUrl}/${post.slug}`, datePublished: post.published })) };
  return <main id="main-content" className={styles.journal}><div className={`container ${styles.journalInner}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}/>
    <nav className={styles.breadcrumbs} aria-label="Fil d’Ariane"><Link href="/fr">Accueil</Link><span aria-hidden="true">/</span><span aria-current="page">Blog</span></nav>
    <header className={styles.journalHeading}>
      <div><span className={styles.journalEyebrow}><i/>LE JOURNAL DE COOHOSTY</span><h1>Articles récents</h1></div>
      <span className={styles.entryCount}>{blogPosts.length} guides</span>
    </header>
    <div className={styles.grid}>{blogPosts.map((post, index) => <BlogCard key={post.slug} post={post} featured={index === 0}/>)}</div>
    <BlogCta/>
  </div></main>;
}
