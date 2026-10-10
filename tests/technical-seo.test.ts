import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';
import { homeStructuredData, organizationStructuredData, serviceStructuredData } from '@/lib/structured-data';
import { blogMetadata, blogStructuredData } from '@/lib/blog-seo';
import { getBlogPosts } from '@/content/blog';
import { site, locales } from '@/config/site';

describe('technical SEO safeguards', () => {
  it('returns real 404 statuses before streaming unknown localized pages', () => {
    for (const path of ['/fr/nonexistent', '/en/services/nonexistent', '/ar/privacy/extra', '/fr/services/cohost/extra', '/fr/blog/nonexistent']) {
      const result = proxy(new NextRequest(`${site.url}${path}`));
      expect(result.status).toBe(404);
      expect(result.headers.get('X-Robots-Tag')).toBe('noindex');
    }
    for (const path of ['/fr', '/en/privacy', '/ar/legal', '/fr/estimate', '/fr/services/cohost', '/robots.txt', '/sitemap.xml', '/opengraph-image']) {
      expect(proxy(new NextRequest(`${site.url}${path}`)).status).toBe(200);
    }
  });

  it('permanently redirects the default homepage and prevents indexing private endpoints', () => {
    expect(proxy(new NextRequest(`${site.url}/`)).status).toBe(308);
    for (const path of ['/admin/login', '/admin/requests', '/api/auth/login']) {
      const result = proxy(new NextRequest(`${site.url}${path}`));
      expect(result.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
      expect(result.headers.get('Cache-Control')).toBe('no-store');
    }
  });

  it('describes the real organization without inventing a local business address', () => {
    const organization = organizationStructuredData();
    expect(organization).toMatchObject({ '@type': 'Organization', '@id': `${site.url}/#organization`, name: site.brand, email: site.email, telephone: site.tel });
    expect(organization).not.toHaveProperty('address');
    expect(organization).not.toHaveProperty('aggregateRating');
    const home = homeStructuredData('fr');
    expect(home['@graph'].map(node => node['@type'])).toEqual(['Organization', 'WebSite', 'WebPage']);
  });

  it('connects services, article publisher identities, canonicals, and localized breadcrumbs', () => {
    for (const locale of locales) {
      const service = serviceStructuredData(locale, 'cohost', 'COHOST', 'Property management');
      expect(service['@graph'][1]).toMatchObject({ '@type': 'Service', url: `${site.url}/${locale}/services/cohost`, provider: { '@id': `${site.url}/#organization` } });
      const breadcrumbs = service['@graph'][2];
      expect(breadcrumbs).toMatchObject({ '@type': 'BreadcrumbList', itemListElement: [{ position: 1 }, { position: 2 }] });
      const post = getBlogPosts(locale)[0];
      const article = blogStructuredData(post, locale)['@graph'][0];
      expect(article).toMatchObject({ '@type': 'BlogPosting', publisher: { '@id': `${site.url}/#organization` }, dateModified: post.modified });
      const metadata = blogMetadata(post, locale);
      expect(metadata.alternates?.languages).toHaveProperty('x-default', `${site.url}/fr/blog/${post.slug}`);
      expect(metadata.robots).toMatchObject({ index: true });
      expect(blogMetadata({ ...post, status: 'draft' }, locale).robots).toMatchObject({ index: false });
      expect(blogMetadata({ ...post, noindex: true }, locale).robots).toMatchObject({ index: false });
    }
    expect(blogMetadata(undefined, 'en').openGraph).toMatchObject({ locale: 'en_US' });
  });
});
