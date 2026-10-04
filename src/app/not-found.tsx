import Link from 'next/link';
import { headers } from 'next/headers';
import { isLocale } from '@/config/site';
export default async function NotFound() { const value = (await headers()).get('x-cohosty-locale') || 'fr'; const locale = isLocale(value) ? value : 'fr'; const messages = (await import(`../../messages/${locale}.json`)).default; return <main className="error-page"><h1>404</h1><p>{messages.errors.notFound}</p><Link className="button" href={`/${locale}`}>{messages.errors.home}</Link></main>; }
