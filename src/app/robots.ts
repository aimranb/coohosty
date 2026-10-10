import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { sitemapOrigin } from '@/config/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${sitemapOrigin(site.url)}/sitemap.xml`,
  };
}
