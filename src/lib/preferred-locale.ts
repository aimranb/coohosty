import { isLocale, type Locale } from '@/config/site';

export function preferredLocale(acceptLanguage: string | null, saved?: string): Locale {
  if (isLocale(saved ?? '')) return saved as Locale;
  const choices = (acceptLanguage ?? '').split(',').map((entry, index) => {
    const [tag, ...parameters] = entry.trim().split(';');
    const quality = parameters.find(parameter => parameter.trim().startsWith('q='));
    const weight = quality ? Number(quality.trim().slice(2)) : 1;
    return { locale: tag.toLowerCase().split('-')[0], weight, index };
  }).filter(choice => Number.isFinite(choice.weight) && choice.weight > 0 && choice.weight <= 1)
    .sort((a, b) => b.weight - a.weight || a.index - b.index);
  return choices.find(choice => isLocale(choice.locale))?.locale as Locale ?? 'fr';
}
