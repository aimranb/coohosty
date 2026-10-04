import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import fr from '../../../messages/fr.json';
export const metadata: Metadata = { title: 'COOHOSTY — Administration', robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <NextIntlClientProvider locale="fr" messages={fr}>{children}</NextIntlClientProvider>; }
