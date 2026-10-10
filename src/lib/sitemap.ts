import type { MetadataRoute } from 'next';
import type { BlogPost } from '@/content/blog';
import { locales, site } from '@/config/site';
import { sitemapOrigin } from '@/config/site-url';
import { cohostingCities, cityPageModified } from '@/config/cohosting-cities';

// Content revision dates; update with meaningful page edits, never on requests.
export const publicPages = [
  ...cohostingCities.map(city => ({ path: city.path, modified: cityPageModified, frequency: 'monthly' as const, priority: 0.9 })),
  { path: '', modified: '2026-10-08', frequency: 'monthly', priority: 1 },
  ...site.planInfo.map(plan => ({ path: `/services/${plan.id.toLowerCase()}`, modified: '2026-10-07', frequency: 'monthly' as const, priority: plan.id === 'COHOST' ? 0.9 : 0.8 })),
  { path: '/legal', modified: '2026-10-07', frequency: 'yearly', priority: 0.2 },
  { path: '/privacy', modified: '2026-10-07', frequency: 'yearly', priority: 0.2 },
] satisfies { path: string; modified: string; frequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>; priority: number }[];

export function isIndexablePost(post: BlogPost, now: Date): boolean {
  const published = Date.parse(post.published);
  return post.status !== 'draft' && !post.noindex && Number.isFinite(published) && published <= now.getTime();
}

export function buildSitemap(getPosts: (locale: typeof locales[number]) => BlogPost[], now = new Date()): MetadataRoute.Sitemap {
  const origin = sitemapOrigin(site.url);
  const url = (locale: string, path: string) => `${origin}/${locale}${path}`;
  const posts = Object.fromEntries(locales.map(locale => [locale, getPosts(locale).filter(post => isIndexablePost(post, now))])) as Record<typeof locales[number], BlogPost[]>;
  const alternates = (path: string, languages: readonly string[] = locales) => ({ languages: {
    ...Object.fromEntries(languages.map(locale => [locale, url(locale, path)])),
    ...(languages.includes(site.seo.defaultLocale) ? { 'x-default': url(site.seo.defaultLocale, path) } : {}),
  } });
  const entries = locales.flatMap(locale => {
    const latest = posts[locale].reduce((date, post) => post.modified > date ? post.modified : date, '');
    return [
      ...publicPages.map(page => ({ url: url(locale, page.path), lastModified: page.modified, changeFrequency: page.frequency, priority: page.priority, alternates: alternates(page.path) })),
      { url: url(locale, '/blog'), lastModified: latest || '2026-10-07', changeFrequency: 'weekly' as const, priority: 0.8, alternates: alternates('/blog') },
      ...posts[locale].map(post => {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) throw new Error(`Invalid blog sitemap slug: ${post.slug}`);
        if (!Number.isFinite(Date.parse(post.modified)) || Date.parse(post.modified) > now.getTime() || post.modified < post.published) throw new Error(`Invalid blog modification date: ${post.slug}`);
        const path = `/blog/${post.slug}`;
        return { url: url(locale, path), lastModified: post.modified, changeFrequency: 'monthly' as const, priority: 0.7, alternates: alternates(path, locales.filter(language => posts[language].some(item => item.slug === post.slug))) };
      }),
    ];
  });
  return [...new Map(entries.map(entry => [entry.url, entry])).values()];
}
