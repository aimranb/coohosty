import type { Locale } from '@/config/site';
import { serviceArea } from '@/content/service-area';
export function ServiceAreaNote({ locale }: { locale: Locale }) {
  const copy = serviceArea[locale];
  return <aside className="service-area-note" aria-label={copy.title}><strong>{copy.title}</strong><p>{copy.description}</p></aside>;
}
