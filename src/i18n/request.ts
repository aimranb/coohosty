import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { isLocale, site } from '@/config/site';
import { marrakechMessages } from '@/content/marrakech-messages';
import { mergeMarketMessages } from '@/lib/market-messages';
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale || (await headers()).get('x-cohosty-locale');
  const locale = requested && isLocale(requested) ? requested : site.seo.defaultLocale;
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const market = (await headers()).get('x-cohosty-market');
  return { locale, messages: market === 'marrakech' ? mergeMarketMessages(messages, marrakechMessages[locale]) : messages };
});
