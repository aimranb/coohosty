import { NextResponse, type NextRequest } from 'next/server';
import { isLocale } from '@/config/site';
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/') return NextResponse.redirect(new URL('/fr', request.url));
  const segment = request.nextUrl.pathname.split('/')[1];
  const headers = new Headers(request.headers);
  headers.set('x-cohosty-locale', isLocale(segment) ? segment : 'fr');
  const response = NextResponse.next({ request: { headers } });
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api')) response.headers.set('Cache-Control', 'no-store');
  return response;
}
export const config = { matcher: ['/((?!_next|favicon.ico|logo|images).*)'] };
