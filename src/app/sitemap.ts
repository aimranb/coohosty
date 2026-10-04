import type { MetadataRoute } from 'next';
import { site, locales } from '@/config/site';
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap(locale => ['', '/legal', '/privacy'].map(page => ({ url: `${site.url}/${locale}${page}`, changeFrequency: 'monthly' as const, priority: page ? 0.3 : 1, alternates: { languages: Object.fromEntries(locales.map(language => [language, `${site.url}/${language}${page}`])) } })));
}
