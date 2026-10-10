import type { MetadataRoute } from 'next';
import { getBlogPosts } from '@/content/blog';
import { buildSitemap } from '@/lib/sitemap';

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(getBlogPosts);
}
