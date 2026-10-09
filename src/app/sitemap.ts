import type { MetadataRoute } from 'next';
import { site, locales } from '@/config/site';
import { blogPosts } from '@/content/blog';
import { marrakechServicePath, marrakechServiceModified } from '@/content/marrakech-service';
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/legal', '/privacy', ...site.planInfo.map(plan => `/services/${plan.id.toLowerCase()}`)];
  return [
    ...locales.map(locale => ({ url: `${site.url}/${locale}${marrakechServicePath}`, lastModified: marrakechServiceModified, changeFrequency: 'monthly' as const, priority: 0.9, alternates: { languages: { ...Object.fromEntries(locales.map(language => [language, `${site.url}/${language}${marrakechServicePath}`])), 'x-default': `${site.url}/fr${marrakechServicePath}` } } })),
    ...locales.flatMap(locale => pages.map(page => ({ url: `${site.url}/${locale}${page}`, changeFrequency: 'monthly' as const, priority: page.startsWith('/services') ? 0.8 : page ? 0.3 : 1, alternates: { languages: Object.fromEntries(locales.map(language => [language, `${site.url}/${language}${page}`])) } }))),
    { url: `${site.url}/fr/blog`, lastModified: blogPosts.reduce((latest, post) => post.modified > latest ? post.modified : latest, blogPosts[0].modified), changeFrequency: 'monthly', priority: 0.7 },
    ...blogPosts.map(post => ({ url: `${site.url}/fr/blog/${post.slug}`, lastModified: post.modified, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
