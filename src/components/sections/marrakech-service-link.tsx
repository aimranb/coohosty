import { CityCohostingLinks } from './city-cohosting-links';
import type { Locale } from '@/config/site';

export function MarrakechServiceLink({ locale }: { locale: Locale }) {
  return <CityCohostingLinks locale={locale}/>;
}
