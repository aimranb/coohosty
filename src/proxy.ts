import { NextResponse, type NextRequest } from 'next/server';
import { preferredLocale } from '@/lib/preferred-locale';
import { isLocale, site } from '@/config/site';
import { blogSlugs, frenchOnlyBlogSlugs } from '@/config/blog';
import { cohostingCities, isCityMarket } from '@/config/cohosting-cities';
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    const locale = preferredLocale(request.headers.get('accept-language'), request.cookies.get('coohosty-locale')?.value);
    const destination = request.nextUrl.clone();
    destination.pathname = `/${locale}`;
    const response = NextResponse.redirect(destination, 307);
    response.headers.set('Vary', 'Accept-Language, Cookie');
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }
  const segment = request.nextUrl.pathname.split('/')[1];
  const headers = new Headers(request.headers);
  headers.set('x-cohosty-locale', isLocale(segment) ? segment : 'fr');
  const parts = request.nextUrl.pathname.split('/').filter(Boolean);
  const city = isLocale(segment) ? cohostingCities.find(city => `/${parts.slice(1).join('/')}` === city.path) : undefined;
  const requestedMarket = request.nextUrl.searchParams.get('market');
  const market = city?.id ?? (isLocale(segment) && parts.length === 2 && parts[1] === 'estimate' && isCityMarket(requestedMarket) ? requestedMarket : 'national');
  headers.set('x-cohosty-market', market);
  if (isLocale(segment) && parts[1] !== 'blog') {
    const valid = parts.length === 1
      || (parts.length === 2 && ['legal', 'privacy', 'estimate'].includes(parts[1]))
      || (parts.length === 3 && parts[1] === 'services' && (site.planInfo.some(plan => plan.id.toLowerCase() === parts[2]) || cohostingCities.some(city => `/${parts.slice(1).join('/')}` === city.path)));
    if (!valid) return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404, request: { headers }, headers: { 'X-Robots-Tag': 'noindex' } });
  }
  if (parts[1] === 'blog') {
    const valid = isLocale(segment) && parts.length <= 3 && (!parts[2] || blogSlugs.some(slug => slug === parts[2]));
    if (!valid) return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404, request: { headers }, headers: { 'X-Robots-Tag': 'noindex' } });
    if (segment !== 'fr' && frenchOnlyBlogSlugs.includes(parts[2])) {
      const destination = request.nextUrl.clone();
      destination.pathname = `/fr/blog/${parts[2]}`;
      return NextResponse.redirect(destination, 308);
    }
  }
  const response = NextResponse.next({ request: { headers } });
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}
export const config = { matcher: ['/((?!_next|favicon.ico|logo|images).*)'] };
