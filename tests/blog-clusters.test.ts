import { describe, expect, it } from 'vitest';
import { blogPosts, getBlogPost, getBlogPosts } from '@/content/blog';
import { blogPathways, featuredBlogPosts } from '@/content/blog-pathways';
import { seoBlogSlugs } from '@/config/blog';
import { blogMetadata } from '@/lib/blog-seo';
import sitemap from '@/app/sitemap';
import { site } from '@/config/site';
import { sitemapOrigin } from '@/config/site-url';

describe('owner SEO pathways', () => {
  it('gives every article one discovery group and a route to a pillar', () => {
    const members = blogPathways.flatMap(pathway => [...pathway.slugs]);
    expect(new Set(members).size).toBe(members.length);
    expect([...members].sort()).toEqual(blogPosts.map(post => post.slug).sort());
    for (const pathway of blogPathways) expect(getBlogPost(pathway.pillar)).toBeDefined();
    for (const slug of seoBlogSlugs) {
      const post = getBlogPost(slug)!;
      expect(post).toBeDefined();
      expect(post.sections.length).toBeGreaterThanOrEqual(5);
      expect(post.faq.length).toBeGreaterThanOrEqual(3);
      expect(post.sections.flatMap(section => section.paragraphs).join(' ').split(/\s+/).length).toBeGreaterThan(350);
      expect(post.related.length).toBeGreaterThanOrEqual(3);
      expect(post.sections.some(section => ['top', 'main-content', 'contact', 'sources', 'frequent-questions'].includes(section.id))).toBe(false);
      expect(post.related.some(related => ['location-courte-duree-maroc', 'conciergerie-airbnb-maroc'].includes(related))).toBe(true);
    }
  });
  it('keeps original French content out of untranslated English and Arabic routes', () => {
    const urls = sitemap().map(entry => entry.url);
    for (const slug of seoBlogSlugs) {
      expect(urls).toContain(`${sitemapOrigin(site.url)}/fr/blog/${slug}`);
      for (const locale of ['en', 'ar'] as const) {
        expect(getBlogPost(slug, locale)).toBeUndefined();
        expect(getBlogPosts(locale).some(post => post.slug === slug)).toBe(false);
        expect(urls).not.toContain(`${sitemapOrigin(site.url)}/${locale}/blog/${slug}`);
      }
      expect(blogMetadata(getBlogPost(slug)).alternates?.languages).toEqual({fr:`${site.url}/fr/blog/${slug}`,'x-default':`${site.url}/fr/blog/${slug}`});
    }
  });
  it('makes key owner guides reachable from the French homepage', () => {
    expect(featuredBlogPosts('fr').map(post => post.slug)).toEqual(['location-courte-duree-maroc', 'gerer-location-courte-duree-distance-maroc', 'conciergerie-airbnb-meknes']);
  });
});
