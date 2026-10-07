import type { Metadata } from 'next';
import { site } from '@/config/site';
import type { BlogPost } from '@/content/blog';

export const blogPath = '/fr/blog';
export const blogUrl = `${site.url}${blogPath}`;

export function blogMetadata(post?: BlogPost): Metadata {
  const title = `${post?.seoTitle ?? 'Blog Airbnb Maroc : guides pour propriétaires'} | ${site.brand}`;
  const description = post?.description ?? 'Guides pour propriétaires au Maroc : fiche de police Airbnb, fiscalité, commissions, sous-location et conciergerie à Marrakech.';
  const url = post ? `${blogUrl}/${post.slug}` : blogUrl;
  return {
    title, description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title, description, url, siteName: site.brand, locale: 'fr_MA',
      images: [{ url: site.seo.socialImage, width: 1200, height: 630, alt: site.brand }],
      ...(post ? { type: 'article' as const, publishedTime: post.published, modifiedTime: post.modified, authors: [site.brand], section: post.category } : { type: 'website' as const }),
    },
    twitter: { card: site.seo.twitterCard, title, description, images: [site.seo.socialImage] },
  };
}

export function blogStructuredData(post: BlogPost) {
  const url = `${blogUrl}/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting', '@id': `${url}#article`,
        headline: post.title, description: post.description, url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        datePublished: post.published, dateModified: post.modified, inLanguage: 'fr-MA',
        author: { '@type': 'Organization', name: site.brand, url: site.url },
        publisher: { '@type': 'Organization', name: site.brand, url: site.url, logo: { '@type': 'ImageObject', url: `${site.url}/logo/icon.svg` } },
        image: new URL(site.seo.socialImage, site.url).href,
        articleSection: post.category,
        isPartOf: { '@type': 'Blog', '@id': blogUrl, name: 'Guides propriétaires Airbnb au Maroc' },
      },
      {
        '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${site.url}/fr` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: blogUrl },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}
