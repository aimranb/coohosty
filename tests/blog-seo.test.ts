import { describe, expect, it } from 'vitest';
import { blogPosts, blogSources, getBlogPost } from '@/content/blog';
import { blogMetadata, blogStructuredData } from '@/lib/blog-seo';
import sitemap from '@/app/sitemap';
import { site } from '@/config/site';
import { blogSlugs } from '@/config/blog';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';

describe('blog discovery and SEO', () => {
  it('publishes the six requested subjects with police formalities first', () => {
    expect(blogPosts.map(post => post.slug)).toEqual([...blogSlugs]);
    expect(blogPosts.map(post => post.slug)).toEqual(['fiche-de-police-airbnb-maroc', 'fiscalite-taxes-airbnb-maroc', 'commission-airbnb-maroc', 'sous-location-airbnb-maroc', 'airbnb-maroc-definition', 'conciergerie-airbnb-marrakech']);
  });

  it('uses valid internal article links, section anchors and source references', () => {
    for (const post of blogPosts) {
      expect(new Set(post.sections.map(section => section.id)).size).toBe(post.sections.length);
      for (const slug of post.related) expect(getBlogPost(slug)).toBeDefined();
      for (const section of post.sections) {
        for (const id of section.sources ?? []) expect(blogSources[id]?.url).toMatch(/^https:\/\//);
        for (const link of section.links ?? []) {
          if (link.href.startsWith('/fr/blog/')) expect(getBlogPost(link.href.split('/').pop()!)).toBeDefined();
        }
      }
    }
    expect(getBlogPost('unknown')).toBeUndefined();
  });

  it('gives every article a matching canonical, social URL and structured data URL', () => {
    for (const post of blogPosts) {
      const url = `${site.url}/fr/blog/${post.slug}`;
      const metadata = blogMetadata(post);
      expect(metadata.alternates?.canonical).toBe(url);
      expect(metadata.alternates?.languages).toBeUndefined();
      expect(metadata.openGraph?.url).toBe(url);
      const data = blogStructuredData(post);
      expect(data['@graph'][0]).toMatchObject({ '@type': 'BlogPosting', url, inLanguage: 'fr-MA', dateModified: post.modified });
      expect(data['@graph'][1].itemListElement?.at(-1)?.item).toBe(url);
    }
  });

  it('includes real blog and service pages without nonexistent blog translations', () => {
    const entries = sitemap();
    const urls = entries.map(entry => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const post of blogPosts) expect(urls).toContain(`${site.url}/fr/blog/${post.slug}`);
    for (const locale of ['fr', 'en', 'ar']) {
      for (const plan of ['audit', 'optimize', 'cohost']) expect(urls).toContain(`${site.url}/${locale}/services/${plan}`);
    }
    expect(urls.some(url => /\/(en|ar)\/blog/.test(url))).toBe(false);
  });

  it('rejects unknown blog URLs before streaming and redirects untranslated routes', () => {
    for (const path of ['/fr/blog/missing', '/xx/blog', '/fr/blog/commission-airbnb-maroc/extra']) {
      const result = proxy(new NextRequest(`https://coohosty.com${path}`));
      expect(result.status).toBe(404);
      expect(result.headers.get('X-Robots-Tag')).toBe('noindex');
    }
    const redirected = proxy(new NextRequest('https://coohosty.com/en/blog/commission-airbnb-maroc?ref=guide'));
    expect(redirected.status).toBe(308);
    expect(redirected.headers.get('location')).toBe('https://coohosty.com/fr/blog/commission-airbnb-maroc?ref=guide');
    expect(proxy(new NextRequest('https://coohosty.com/fr/blog/commission-airbnb-maroc')).status).toBe(200);
  });
});
