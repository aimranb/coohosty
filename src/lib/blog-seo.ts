import { locales, type Locale } from '@/config/site';
import { blogUi } from '@/content/blog-ui';
import type { Metadata } from 'next';
import { frenchOnlyBlogSlugs } from '@/config/blog';
import { site } from '@/config/site';
import type { BlogPost } from '@/content/blog';
import { isIndexablePost } from '@/lib/sitemap';
import { organizationStructuredData } from '@/lib/structured-data';

export const blogPath = '/fr/blog';
export const blogUrl = `${site.url}${blogPath}`;

export function blogMetadata(post?: BlogPost, locale: Locale = 'fr'): Metadata {
  const title = `${post?.seoTitle ?? blogUi[locale].title} | ${site.brand}`;
  const description = post?.description ?? blogUi[locale].description;
  const blogUrl = `${site.url}/${locale}/blog`;
  const url = post ? `${blogUrl}/${post.slug}` : blogUrl;
  const availableLocales = post && frenchOnlyBlogSlugs.includes(post.slug) ? ['fr'] : locales;
  return {
    title, description,
    alternates: { canonical: url, languages: { ...Object.fromEntries(availableLocales.map(language => [language, `${site.url}/${language}/blog${post ? `/${post.slug}` : ''}`])), 'x-default': `${site.url}/${site.seo.defaultLocale}/blog${post ? `/${post.slug}` : ''}` } },
    robots: { index: post ? isIndexablePost(post, new Date()) : true, follow: true },
    openGraph: {
      title, description, url, siteName: site.brand, locale: { fr: 'fr_MA', en: 'en_US', ar: 'ar_MA' }[locale],
      images: [{ url: site.seo.socialImage, width: 1200, height: 630, alt: site.brand }],
      ...(post ? { type: 'article' as const, publishedTime: post.published, modifiedTime: post.modified, authors: [site.brand], section: post.category } : { type: 'website' as const }),
    },
    twitter: { card: site.seo.twitterCard, title, description, images: [site.seo.socialImage] },
  };
}

export function blogStructuredData(post: BlogPost, locale: Locale = 'fr') {
  const blogUrl = `${site.url}/${locale}/blog`;
  const url = `${blogUrl}/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting', '@id': `${url}#article`,
        headline: post.title, description: post.description, url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        datePublished: post.published, dateModified: post.modified, inLanguage: `${locale}-MA`,
        author: organizationStructuredData(),
        publisher: organizationStructuredData(),
        image: new URL(site.seo.socialImage, site.url).href,
        articleSection: post.category,
        isPartOf: { '@type': 'Blog', '@id': blogUrl, name: blogUi[locale].title },
      },
      {
        '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: blogUi[locale].home, item: `${site.url}/${locale}` },
          { '@type': 'ListItem', position: 2, name: blogUi[locale].blog, item: blogUrl },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}
