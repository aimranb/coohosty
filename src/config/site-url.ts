export const productionSiteUrl = 'https://www.coohosty.com';

export function resolveSiteUrl(value = productionSiteUrl): string {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without credentials, a path, query, or fragment.');
  }
  // Hosting redirects the apex domain to www. Align all SEO metadata.
  if (url.hostname === 'coohosty.com' || url.hostname === 'www.coohosty.com') return productionSiteUrl;
  return url.origin;
}

export function sitemapOrigin(value: string): string {
  const url = new URL(resolveSiteUrl(value));
  if (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) return productionSiteUrl;
  if (url.protocol !== 'https:') throw new Error('Public sitemap URLs require an HTTPS NEXT_PUBLIC_SITE_URL.');
  return url.origin;
}
