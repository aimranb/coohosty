import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
export default async function NotFound() { const locale = await getLocale(); const t = await getTranslations('errors'); return <main id="main-content" className="error-page"><h1>404</h1><p>{t('notFound')}</p><Link className="button" href={`/${locale}`}>{t('home')}</Link></main>; }
