import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';
import { mergeMarketMessages } from '@/lib/market-messages';
import { marrakechMessages } from '@/content/marrakech-messages';
import { marrakechNeighborhoods, marrakechServicePath } from '@/content/marrakech-service';
import { blogPosts } from '@/content/blog';
import sitemap from '@/app/sitemap';
import { site } from '@/config/site';
import fr from '../messages/fr.json';

describe('Marrakech market isolation and discovery', () => {
  it('changes the Marrakech offer without changing national content or nested form labels', () => {
    const original = JSON.stringify(fr);
    const local = mergeMarketMessages(fr, marrakechMessages.fr);
    expect(local.faq.items.price.answer).toContain('20 %');
    expect(local.estimate.fields.email).toBe(fr.estimate.fields.email);
    expect(local.plans.features).toEqual(fr.plans.features);
    expect(local.estimate.title).toContain('Marrakech');
    expect(JSON.stringify(fr)).toBe(original);
    expect(fr.faq.items.price.answer).not.toContain('20 %');
  });
  it('sets market context from the actual route and overwrites spoofed incoming context', () => {
    for (const locale of ['fr', 'en', 'ar']) {
      const local = proxy(new NextRequest(`https://www.coohosty.com/${locale}${marrakechServicePath}`));
      expect(local.headers.get('x-middleware-request-x-cohosty-market')).toBe('marrakech');
    }
    for (const path of ['/fr', '/fr/services/cohost', '/fr/blog/location-courte-duree-gueliz-marrakech']) {
      const national = proxy(new NextRequest(`https://www.coohosty.com${path}`, { headers: { 'x-cohosty-market': 'marrakech' } }));
      expect(national.headers.get('x-middleware-request-x-cohosty-market')).toBe('national');
    }
    expect(proxy(new NextRequest('https://www.coohosty.com/fr/estimate?market=marrakech')).headers.get('x-middleware-request-x-cohosty-market')).toBe('marrakech');
  });
  it('publishes a distinct complete guide for every map neighbourhood and includes it in the sitemap', () => {
    const urls = sitemap().map(entry => entry.url);
    expect(new Set(marrakechNeighborhoods.map(area => area.image)).size).toBe(marrakechNeighborhoods.length);
    for (const area of marrakechNeighborhoods) {
      const article = blogPosts.find(post => post.slug === area.slug);
      expect(article?.sections.length).toBeGreaterThanOrEqual(5);
      expect(article?.faq.length).toBe(4);
      expect(article?.sections.flatMap(section => section.links ?? []).some(link => link.href === `/fr${marrakechServicePath}`)).toBe(true);
      expect(urls).toContain(`${site.url}/fr/blog/${area.slug}`);
      expect(area.lat).toBeGreaterThan(31.585);
      expect(area.lat).toBeLessThan(31.715);
      expect(area.lon).toBeGreaterThan(-8.055);
      expect(area.lon).toBeLessThan(-7.925);
    }
  });
});
