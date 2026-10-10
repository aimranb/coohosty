import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';
import { preferredLocale } from '@/lib/preferred-locale';

describe('browser language selection', () => {
  it.each([
    ['en-US,en;q=0.9,fr;q=0.8', undefined, 'en'],
    ['ar-MA,fr;q=0.8', undefined, 'ar'],
    ['de-DE,en;q=0.8', undefined, 'en'],
    ['fr;q=0.2,en;q=0.9', undefined, 'en'],
    ['ar;q=0,en;q=0.8', undefined, 'en'],
    ['de-DE', undefined, 'fr'],
    [null, undefined, 'fr'],
    ['en-US', 'ar', 'ar'],
    ['ar-MA', 'invalid', 'ar'],
  ])('resolves %s with saved %s to %s', (header, saved, expected) => {
    expect(preferredLocale(header, saved)).toBe(expected);
  });
  it('preserves query parameters and avoids caching a personal redirect', () => {
    const response = proxy(new NextRequest('https://www.coohosty.com/?ref=campaign', { headers: { 'accept-language': 'en-GB' } }));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://www.coohosty.com/en?ref=campaign');
    expect(response.headers.get('vary')).toBe('Accept-Language, Cookie');
    expect(response.headers.get('cache-control')).toBe('private, no-store');
  });
  it('prioritizes the saved manual choice while respecting explicit page links', () => {
    const headers = { 'accept-language': 'en-US', cookie: 'coohosty-locale=ar' };
    expect(proxy(new NextRequest('https://www.coohosty.com/', { headers })).headers.get('location')).toBe('https://www.coohosty.com/ar');
    expect(proxy(new NextRequest('https://www.coohosty.com/fr/services/conciergerie-tanger', { headers })).status).toBe(200);
  });
});
