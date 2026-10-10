import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { buildSitemap } from '@/lib/sitemap';
import { getBlogPosts } from '@/content/blog';
import { productionSiteUrl, resolveSiteUrl, sitemapOrigin } from '@/config/site-url';

describe('production sitemap', () => {
  it('includes all available indexable pages with canonical, unique HTTPS URLs and stable dates', () => {
    const entries = sitemap();
    expect(entries).toHaveLength(55);
    expect(new Set(entries.map(entry => entry.url)).size).toBe(entries.length);
    for (const entry of entries) {
      const url = new URL(entry.url);
      expect(url.protocol).toBe('https:');
      expect(url.search + url.hash).toBe('');
      expect(url.pathname).not.toMatch(/\/$|admin|api|estimate|preview|login/);
      expect(Number.isFinite(Date.parse(String(entry.lastModified)))).toBe(true);
      expect(entry.priority).toBeGreaterThanOrEqual(0.2);
      expect(entry.alternates?.languages).toHaveProperty('x-default');
    }
    expect(sitemap()).toEqual(entries);
  });

  it('filters drafts, noindex posts, future publications, and invalid publication dates', () => {
    const post = getBlogPosts()[0];
    const entries = buildSitemap(() => [post,
      { ...post, slug: 'draft', status: 'draft' },
      { ...post, slug: 'private', noindex: true },
      { ...post, slug: 'future', published: '2099-01-01' },
      { ...post, slug: 'invalid', published: 'invalid' },
    ], new Date('2026-10-09'));
    expect(entries.filter(entry => entry.url.includes('/blog/'))).toHaveLength(3);
    expect(buildSitemap(() => [], new Date('2026-10-09'))).toHaveLength(24);
  });

  it('rejects invalid slugs and modification dates and deduplicates content', () => {
    const post = getBlogPosts()[0];
    expect(() => buildSitemap(() => [{ ...post, slug: 'article?draft=1' }])).toThrow('slug');
    expect(() => buildSitemap(() => [{ ...post, modified: 'invalid' }])).toThrow('date');
    expect(buildSitemap(() => [post, post]).filter(entry => entry.url.includes('/blog/'))).toHaveLength(3);
  });

  it('normalizes hosting redirects and prevents local origins in public discovery files', () => {
    expect(resolveSiteUrl('http://coohosty.com/')).toBe(productionSiteUrl);
    expect(resolveSiteUrl('https://www.coohosty.com/')).toBe(productionSiteUrl);
    expect(sitemapOrigin('http://localhost:3000')).toBe(productionSiteUrl);
    expect(() => resolveSiteUrl('https://coohosty.com/path?test=1')).toThrow();
    expect(() => sitemapOrigin('http://example.com')).toThrow();
    expect(robots().sitemap).toBe(`${sitemapOrigin(resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL))}/sitemap.xml`);
    expect(robots().rules).toMatchObject({ allow: '/', disallow: ['/admin', '/api'] });
  });
});
