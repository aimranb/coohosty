import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { notFound, permanentRedirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { isLocale, site } from '@/config/site';
import { blogPosts, blogSources, blogReadingTime, getBlogPost } from '@/content/blog';
import { blogMetadata, blogStructuredData } from '@/lib/blog-seo';
import { BlogCard } from '@/components/blog/blog-card';
import { BlogCta } from '@/components/blog/blog-cta';
import styles from '@/components/blog/blog.module.css';

type Props = { params: Promise<{ locale: string; slug: string }> };

async function resolvePost(params: Props['params']) {
  const { locale, slug } = await params;
  const post = getBlogPost(slug);
  if (!isLocale(locale) || !post) notFound();
  if (locale !== 'fr') permanentRedirect(`/fr/blog/${post.slug}`);
  setRequestLocale('fr');
  return post;
}

export function generateStaticParams() {
  return blogPosts.map(post => ({ locale: 'fr', slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  return blogMetadata(await resolvePost(params));
}

export default async function BlogArticlePage({ params }: Props) {
  const post = await resolvePost(params);
  const sourceIds = [...new Set(post.sections.flatMap(section => section.sources ?? []))];
  const date = new Intl.DateTimeFormat('fr-MA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(post.modified));
  return <main id="main-content" className={`container ${styles.page}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData(post)).replace(/</g, '\\u003c') }}/>
    <nav className={styles.breadcrumbs} aria-label="Fil d’Ariane"><Link href="/fr">Accueil</Link><span aria-hidden="true">/</span><Link href="/fr/blog">Blog</Link><span aria-hidden="true">/</span><span aria-current="page">{post.category}</span></nav>
    <article>
      <header className={styles.heading}>
        <span className={styles.eyebrow}>{post.category} · Guide propriétaire</span>
        <h1>{post.title}</h1>
        <p>{post.intro}</p>
        <div className={styles.meta}><span>Par l’équipe {site.brand}</span><span>Mis à jour le <time dateTime={post.modified}>{date}</time></span><span>{blogReadingTime(post)} min de lecture</span></div>
      </header>
      <div className={styles.articleLayout}>
        <nav className={styles.toc} aria-label="Sommaire de l’article"><h2>Dans ce guide</h2><ol>{post.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}<li><a href="#questions">Questions fréquentes</a></li><li><a href="#sources">Sources et références</a></li></ol></nav>
        <div className={styles.body}>
          <div className={styles.takeaway}><strong>À retenir</strong><p>{post.takeaway}</p></div>
          {post.note && <p className={styles.note}>{post.note}</p>}
          {post.sections.map(section => <section id={section.id} key={section.id}>
            <h2>{section.title}</h2>
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
            {section.table && <div className={styles.tableWrap} tabIndex={0} role="region" aria-label={section.table.caption}><table><caption>{section.table.caption}</caption><thead><tr>{section.table.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>}
            {section.sources && <div className={styles.sourceLinks}>{section.sources.map(id => <a key={id} href={blogSources[id].url}>Source : {blogSources[id].title}</a>)}</div>}
            {section.links && <div className={styles.inlineLinks}>{section.links.map(link => <Link key={link.href} href={link.href}>{link.label}<ArrowUpRight size={16} aria-hidden="true"/></Link>)}</div>}
          </section>)}
          <section id="questions" className={styles.faq}><h2>Questions fréquentes</h2>{post.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
          <section id="sources" className={styles.sources}><h2>Sources et références</h2><p>Références consultées le {date}. Les textes et les règles de plateforme peuvent évoluer ; consultez leur version actuelle avant d’effectuer vos démarches.</p><div className={styles.sourceLinks}>{sourceIds.map(id => <a key={id} href={blogSources[id].url}>{blogSources[id].title}</a>)}</div></section>
        </div>
      </div>
    </article>
    <BlogCta/>
    <section className={styles.related} aria-labelledby="related-title"><h2 id="related-title">Pour aller plus loin</h2><div className={styles.grid}>{post.related.map(slug => { const related = getBlogPost(slug); return related ? <BlogCard key={slug} post={related}/> : null; })}</div></section>
  </main>;
}
