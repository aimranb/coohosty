import { blogUi } from '@/content/blog-ui';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { isLocale, site, locales } from '@/config/site';
import { blogPosts, getBlogSources, blogReadingTime, getBlogPost } from '@/content/blog';
import { blogMetadata, blogStructuredData } from '@/lib/blog-seo';
import { BlogCard } from '@/components/blog/blog-card';
import { BlogCta } from '@/components/blog/blog-cta';
import styles from '@/components/blog/blog.module.css';

type Props = { params: Promise<{ locale: string; slug: string }> };

async function resolvePost(params: Props['params']) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = getBlogPost(slug, locale);
  if (!post) notFound();
  setRequestLocale(locale);
  return { post, locale };
}

export function generateStaticParams() {
  return locales.flatMap(locale => blogPosts.map(post => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: Props) {
  const { post, locale } = await resolvePost(params);
  return blogMetadata(post, locale);
}

export default async function BlogArticlePage({ params }: Props) {
  const { post, locale } = await resolvePost(params);
  const t = blogUi[locale];
  const blogSources = getBlogSources(locale);
  const sourceIds = [...new Set(post.sections.flatMap(section => section.sources ?? []))];
  const date = new Intl.DateTimeFormat(`${locale}-MA`, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(post.modified));
  return <main id="main-content" className={`container ${styles.page}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData(post, locale)).replace(/</g, '\\u003c') }}/>
    <nav className={styles.breadcrumbs} aria-label={t.breadcrumb}><Link href={`/${locale}`}>{t.home}</Link><span aria-hidden="true">/</span><Link href={`/${locale}/blog`}>{t.blog}</Link><span aria-hidden="true">/</span><span aria-current="page">{post.category}</span></nav>
    <article>
      <header className={styles.heading}>
        <span className={styles.eyebrow}>{post.category} · {t.owner}</span>
        <h1>{post.title}</h1>
        <p>{post.intro}</p>
        <div className={styles.meta}><span>{t.by} {site.brand}</span><span>{t.updated} <time dateTime={post.modified}>{date}</time></span><span>{blogReadingTime(post)} {t.minutes}</span></div>
      </header>
      <div className={styles.articleLayout}>
        <nav className={styles.toc} aria-label={t.toc}><h2>{t.toc}</h2><ol>{post.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}<li><a href="#questions">{t.faq}</a></li><li><a href="#sources">{t.sources}</a></li></ol></nav>
        <div className={styles.body}>
          <div className={styles.takeaway}><strong>{t.takeaway}</strong><p>{post.takeaway}</p></div>
          {post.note && <p className={styles.note}>{post.note}</p>}
          {post.sections.map(section => <section id={section.id} key={section.id}>
            <h2>{section.title}</h2>
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
            {section.table && <div className={styles.tableWrap} tabIndex={0} role="region" aria-label={section.table.caption}><table><caption>{section.table.caption}</caption><thead><tr>{section.table.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>}
            {section.sources && <div className={styles.sourceLinks}>{section.sources.map(id => <a key={id} href={blogSources[id].url}>{t.source} : {blogSources[id].title}</a>)}</div>}
            {section.links && <div className={styles.inlineLinks}>{section.links.map(link => <Link key={link.href} href={link.href}>{link.label}<ArrowUpRight size={16} aria-hidden="true"/></Link>)}</div>}
          </section>)}
          <section id="questions" className={styles.faq}><h2>{t.faq}</h2>{post.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
          <section id="sources" className={styles.sources}><h2>{t.sources}</h2><p>{t.consulted} {date}. {t.sourceNote}</p><div className={styles.sourceLinks}>{sourceIds.map(id => <a key={id} href={blogSources[id].url}>{blogSources[id].title}</a>)}</div></section>
        </div>
      </div>
    </article>
    <BlogCta locale={locale}/>
    <section className={styles.related} aria-labelledby="related-title"><h2 id="related-title">{t.related}</h2><div className={styles.grid}>{post.related.map(slug => { const related = getBlogPost(slug, locale); return related ? <BlogCard key={slug} post={related} locale={locale}/> : null; })}</div></section>
  </main>;
}
