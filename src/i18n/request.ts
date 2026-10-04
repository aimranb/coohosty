import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { isLocale, site } from '@/config/site';
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale || (await headers()).get('x-cohosty-locale');
  const locale = requested && isLocale(requested) ? requested : site.seo.defaultLocale;
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default };
});
