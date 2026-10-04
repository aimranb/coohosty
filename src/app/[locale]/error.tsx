'use client';
import { useTranslations } from 'next-intl';
export default function ErrorPage({ reset }: { reset: () => void }) { const t = useTranslations('errors'); return <main className="error-page" id="main-content"><h1>{t('title')}</h1><p>{t('description')}</p><button className="button" onClick={reset}>{t('retry')}</button></main>; }
