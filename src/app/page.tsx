import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { preferredLocale } from '@/lib/preferred-locale';
export default async function Home() {
  const locale = preferredLocale((await headers()).get('accept-language'), (await cookies()).get('coohosty-locale')?.value);
  redirect(`/${locale}`);
}
