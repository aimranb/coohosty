import type { Locale } from '@/config/site';

export const cohostingCities = [
  { id: 'marrakech', name: 'Marrakech', names: { fr: 'Marrakech', en: 'Marrakech', ar: 'مراكش' }, image: '/images/optimized/hero-interior-warm-98ad1d0a55.webp', path: '/services/conciergerie-marrakech', areas: ['Guéliz', 'Hivernage', 'Médina', 'Palmeraie'] },
  { id: 'casablanca', name: 'Casablanca', names: { fr: 'Casablanca', en: 'Casablanca', ar: 'الدار البيضاء' }, image: '/images/optimized/casablanca-original-0aadd1a16f.webp', path: '/services/conciergerie-casablanca', areas: ['Maârif', 'Gauthier', 'Racine', 'Aïn Diab'] },
  { id: 'tanger', name: 'Tanger', names: { fr: 'Tanger', en: 'Tangier', ar: 'طنجة' }, image: '/images/optimized/tanger-original-2a22a7ac35.webp', path: '/services/conciergerie-tanger', areas: ['Malabata', 'Iberia', 'Centre-ville', 'Marshan'] },
] as const;
export type CityMarket = typeof cohostingCities[number]['id'];
export type CohostingCity = typeof cohostingCities[number];
export const cityPageModified = '2026-10-10';
export function isCityMarket(value: unknown): value is CityMarket { return cohostingCities.some(city => city.id === value); }
export function getCohostingCity(market: CityMarket) { return cohostingCities.find(city => city.id === market)!; }
export function cityName(market: CityMarket, locale: Locale) { return getCohostingCity(market).names[locale]; }
