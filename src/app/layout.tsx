import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import { isLocale, site } from '@/config/site';
import './globals.css';
import './home-polish.css';
import './destinations.css';
import './monochrome.css';
import './compact.css';
import './premium-details.css';
import './elegant-accents.css';
import './city-media.css';
import './gallery-refresh.css';
import './workflow-icons.css';
import './eye-signature.css';
import './header-clarity.css';
import './navigation-listing.css';
import './city-transitions.css';
import './analysis-tools.css';
import './phone-cinema.css';
import './logo-city-refinement.css';
import './editor-contact.css';
import './gallery-arrows.css';
import './service-proof.css';
import './reference-theme.css';
import './reference-essentials.css';
import './reservation-calendar.css';
import './brand-palette.css';
import './frontend-refinement.css';
import './simple-landing.css';
import './hero-faq-balance.css';
import './estimate-page.css';
import './site-typography.css';
import './plan-services-panel.css';
import './analysis-emphasis.css';
import './service-detail.css';
import './market-network.css';
import './maintenance.css';
import './site-background.css';
import './booking-identity.css';
import './warm-identity.css';
import './arabic-refinement.css';
import './white-background.css';
const inter = localFont({ src: './fonts/inter-latin-variable.woff2', weight: '100 900', variable: '--font-latin', display: 'swap' });
const arabic = localFont({src:[
  {path:'./fonts/noto-sans-arabic-arabic-400-normal.woff2',weight:'400',style:'normal'},
  {path:'./fonts/noto-sans-arabic-arabic-500-normal.woff2',weight:'500',style:'normal'},
  {path:'./fonts/noto-sans-arabic-arabic-600-normal.woff2',weight:'600',style:'normal'},
  {path:'./fonts/noto-sans-arabic-arabic-700-normal.woff2',weight:'700',style:'normal'},
],variable:'--font-arabic',display:'swap',preload:false});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  icons: { icon: '/logo/favicon.svg', apple: '/logo/icon.svg' },
  verification: { google: '_RUv7GKowIl-T2NEj8gQa_V2hB0nnK8EYROh6VyPFpQ' },
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const requested = (await headers()).get('x-cohosty-locale') || 'fr';
  const locale = isLocale(requested) ? requested : 'fr';
  return <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}><body className={locale==='ar'?`${inter.variable} ${arabic.variable}`:inter.variable}>{children}</body></html>;
}
