import { NextResponse, type NextRequest } from 'next/server';
import { isLocale } from '@/config/site';
import { blogSlugs } from '@/config/blog';
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/') return NextResponse.redirect(new URL('/fr', request.url));
  const segment = request.nextUrl.pathname.split('/')[1];
  const headers = new Headers(request.headers);
  headers.set('x-cohosty-locale', isLocale(segment) ? segment : 'fr');
  const parts = request.nextUrl.pathname.split('/').filter(Boolean);
  const marrakech = isLocale(segment) && (parts.length === 3 && parts[1] === 'services' && parts[2] === 'conciergerie-marrakech'
    || parts.length === 2 && parts[1] === 'estimate' && request.nextUrl.searchParams.get('market') === 'marrakech');
  headers.set('x-cohosty-market', marrakech ? 'marrakech' : 'national');
  if (parts[1] === 'blog') {
    const valid = isLocale(segment) && parts.length <= 3 && (!parts[2] || blogSlugs.some(slug => slug === parts[2]));
    if (!valid) return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404, request: { headers }, headers: { 'X-Robots-Tag': 'noindex' } });
    if (segment !== 'fr') {
      const destination = request.nextUrl.clone();
      destination.pathname = `/fr/blog${parts[2] ? `/${parts[2]}` : ''}`;
      return NextResponse.redirect(destination, 308);
    }
  }
  const response = NextResponse.next({ request: { headers } });
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api')) response.headers.set('Cache-Control', 'no-store');
  return response;
}
export const config = { matcher: ['/((?!_next|favicon.ico|logo|images).*)'] };
