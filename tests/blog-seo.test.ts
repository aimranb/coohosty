import { describe, expect, it } from 'vitest';
import { blogPosts, blogSources, getBlogPost, getBlogPosts, getBlogSources } from '@/content/blog';
import { blogMetadata, blogStructuredData } from '@/lib/blog-seo';
import sitemap from '@/app/sitemap';
import { site } from '@/config/site';
import { sitemapOrigin } from '@/config/site-url';
import { blogSlugs, frenchOnlyBlogSlugs } from '@/config/blog';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';

describe('blog discovery and SEO', () => {
  it('publishes distinct complete editorial content and metadata in every language', () => {
    for (const locale of ['en', 'ar'] as const) {
      const posts = getBlogPosts(locale);
      expect(posts.map(post => post.slug)).toEqual(blogSlugs.filter(slug => !frenchOnlyBlogSlugs.includes(slug)));
      const sources = getBlogSources(locale);
      for (const post of posts) {
        expect(post.title).not.toBe(getBlogPost(post.slug)?.title);
        expect(post.sections.length).toBeGreaterThanOrEqual(4);
        expect(post.faq.length).toBeGreaterThanOrEqual(3);
        expect(post.sections.every(section => section.paragraphs.length >= 2)).toBe(true);
        for (const id of post.sections.flatMap(section => section.sources ?? [])) {
          expect(sources[id]?.url).toBe(blogSources[id]?.url);
          expect(sources[id]?.title).not.toBe(blogSources[id]?.title);
        }
        for (const slug of post.related) expect(getBlogPost(slug, locale)).toBeDefined();
        const url = `${site.url}/${locale}/blog/${post.slug}`;
        expect(blogMetadata(post, locale).alternates?.canonical).toBe(url);
        expect(blogMetadata(post, locale).openGraph?.url).toBe(url);
        expect(blogStructuredData(post, locale)['@graph'][0]).toMatchObject({ url, inLanguage: `${locale}-MA` });
        if (locale === 'ar') expect(post.intro).toMatch(/[\u0600-\u06ff]/);
      }
    }
  });
  it('publishes the six priority subjects first, followed by complementary guides', () => {
    expect(blogPosts.map(post => post.slug)).toEqual([...blogSlugs]);
    expect(blogPosts.slice(0, 6).map(post => post.slug)).toEqual(['fiche-de-police-airbnb-maroc', 'fiscalite-taxes-airbnb-maroc', 'commission-airbnb-maroc', 'sous-location-airbnb-maroc', 'airbnb-maroc-definition', 'conciergerie-airbnb-marrakech']);
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
      const languages = metadata.alternates?.languages;
      if (frenchOnlyBlogSlugs.includes(post.slug)) {
        expect(languages).toEqual({ fr: url, 'x-default': url });
      } else {
        expect(languages).toMatchObject({ fr: url, en: url.replace('/fr/', '/en/'), ar: url.replace('/fr/', '/ar/') });
      }
      expect(metadata.openGraph?.url).toBe(url);
      const data = blogStructuredData(post);
      expect(data['@graph'][0]).toMatchObject({ '@type': 'BlogPosting', url, inLanguage: 'fr-MA', dateModified: post.modified });
      expect(data['@graph'][1].itemListElement?.at(-1)?.item).toBe(url);
    }
  });

  it('includes real blog and service pages and translated blog pages', () => {
    const entries = sitemap();
    const urls = entries.map(entry => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const post of blogPosts) expect(urls).toContain(`${sitemapOrigin(site.url)}/fr/blog/${post.slug}`);
    for (const locale of ['fr', 'en', 'ar']) {
      for (const plan of ['audit', 'optimize', 'cohost']) expect(urls).toContain(`${sitemapOrigin(site.url)}/${locale}/services/${plan}`);
    }
    for (const locale of ['en', 'ar'] as const) {
      expect(urls).toContain(`${sitemapOrigin(site.url)}/${locale}/blog`);
      for (const post of getBlogPosts(locale)) expect(urls).toContain(`${sitemapOrigin(site.url)}/${locale}/blog/${post.slug}`);
      for (const slug of frenchOnlyBlogSlugs) expect(urls).not.toContain(`${sitemapOrigin(site.url)}/${locale}/blog/${slug}`);
    }
  });

  it('rejects unknown blog URLs before streaming and serves translated routes', () => {
    for (const path of ['/fr/blog/missing', '/xx/blog', '/fr/blog/commission-airbnb-maroc/extra']) {
      const result = proxy(new NextRequest(`https://coohosty.com${path}`));
      expect(result.status).toBe(404);
      expect(result.headers.get('X-Robots-Tag')).toBe('noindex');
    }
    const redirected = proxy(new NextRequest('https://coohosty.com/en/blog/commission-airbnb-maroc?ref=guide'));
    expect(redirected.status).toBe(200);
    expect(redirected.headers.get('location')).toBeNull();
    expect(proxy(new NextRequest('https://coohosty.com/ar/blog/commission-airbnb-maroc')).status).toBe(200);
    expect(proxy(new NextRequest('https://coohosty.com/fr/blog/commission-airbnb-maroc')).status).toBe(200);
    for (const locale of ['en', 'ar']) {
      for (const slug of frenchOnlyBlogSlugs) {
        const response = proxy(new NextRequest(`https://coohosty.com/${locale}/blog/${slug}?ref=guide`));
        expect(response.status).toBe(308);
        expect(response.headers.get('location')).toBe(`https://coohosty.com/fr/blog/${slug}?ref=guide`);
      }
    }
  });
});
