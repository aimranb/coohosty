import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/config/site';
import { marrakechServiceContent, marrakechServicePath } from '@/content/marrakech-service';

export function MarrakechServiceLink({ locale }: { locale: Locale }) {
  return <Link className="service-detail-back" href={`/${locale}${marrakechServicePath}`}>
    {marrakechServiceContent[locale].linkLabel}<ArrowUpRight size={17} aria-hidden="true"/>
  </Link>;
}
