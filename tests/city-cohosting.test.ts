import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';
import { cohostingCities, cityPageModified } from '@/config/cohosting-cities';
import { getCityMessages, cityDescription } from '@/content/city-cohosting';
import { mergeMarketMessages } from '@/lib/market-messages';
import sitemap from '@/app/sitemap';
import { site } from '@/config/site';
import { sitemapOrigin } from '@/config/site-url';
import fr from '../messages/fr.json';

describe('city cohosting', () => {
  it('uses each city context for its landing and continuation without accepting spoofed headers', () => {
    for (const city of cohostingCities) {
      for (const locale of ['fr', 'en', 'ar']) {
        for (const path of [`/${locale}${city.path}`, `/${locale}/estimate?market=${city.id}`]) {
          const result = proxy(new NextRequest(`https://www.coohosty.com${path}`, { headers: { 'x-cohosty-market': 'spoofed' } }));
          expect(result.status).toBe(200);
          expect(result.headers.get('x-middleware-request-x-cohosty-market')).toBe(city.id);
        }
      }
    }
    expect(proxy(new NextRequest('https://www.coohosty.com/fr/estimate?market=invalid')).headers.get('x-middleware-request-x-cohosty-market')).toBe('national');
    expect(proxy(new NextRequest('https://www.coohosty.com/fr/services/conciergerie-unknown')).status).toBe(404);
  });
  it('keeps the same services and form validation labels while providing distinct local content', () => {
    for (const city of cohostingCities) {
      const messages = mergeMarketMessages(fr, getCityMessages(city.id, 'fr'));
      expect(messages.plans.features).toEqual(fr.plans.features);
      expect(messages.estimate.fields.email).toBe(fr.estimate.fields.email);
      expect(messages.estimate.placeholders.city).toBe(city.name);
      expect(messages.faq.items.onSite.answer).toBe(cityDescription(city.id, 'fr'));
    }
    expect(new Set(cohostingCities.map(city => cityDescription(city.id, 'fr'))).size).toBe(3);
  });
  it('publishes all nine city routes with stable revision dates and reciprocal language alternatives', () => {
    for (const city of cohostingCities) {
      for (const locale of ['fr', 'en', 'ar']) {
        const entry = sitemap().find(entry => entry.url === `${sitemapOrigin(site.url)}/${locale}${city.path}`);
        expect(entry?.lastModified).toBe(cityPageModified);
        expect(entry?.alternates?.languages).toMatchObject(Object.fromEntries(['fr', 'en', 'ar'].map(language => [language, `${sitemapOrigin(site.url)}/${language}${city.path}`])));
      }
    }
  });
});
