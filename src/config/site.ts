export const locales = ['fr', 'en', 'ar'] as const;
export type Locale = typeof locales[number];
export const plans = ['AUDIT', 'OPTIMIZE', 'COHOST', 'UNDECIDED'] as const;
export type Plan = typeof plans[number];
export const site = {
  brand: 'COOHOSTY', domain: 'coohosty.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://coohosty.com',
  phone: '+212 663 448 785', tel: '+212663448785',
  whatsapp: 'https://wa.me/212663448785', email: 'benaissiimran08@gmail.com',
  social: { instagram: '', linkedin: '' },
  company: { legalName: '', registrationNumber: '', taxIdentifier: '', dataProtectionRegistration: '', address: '', privacyRetentionDays: 365 },
  seo: { defaultLocale: 'fr', socialImage: '/opengraph-image', twitterCard: 'summary_large_image' } as const,
  navigation: ['services', 'revenue', 'plans', 'contact'] as const,
  images: { hero: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1800&q=85' },
  prices: { AUDIT: { fr: 'Sur devis', en: 'On request', ar: 'حسب الطلب' }, OPTIMIZE: { fr: 'Sur devis', en: 'On request', ar: 'حسب الطلب' }, COHOST: { fr: 'Sur devis', en: 'On request', ar: 'حسب الطلب' } },
  planInfo: [
    { id: 'AUDIT', highlights: ["listing", "competitors", "pricing", "action"], number: '01', featured: false, features: ['listing', 'title', 'photos', 'amenities', 'competitors', 'pricing', 'occupancy', 'opportunities', 'action'] },
    { id: 'OPTIMIZE', highlights: ["dynamic", "pricelabs", "calendar", "report"], number: '02', featured: false, features: ['dynamic', 'monitoring', 'market', 'pricelabs', 'calendar', 'minimum', 'weekday', 'seasonal', 'revenue', 'report'] },
    { id: 'COHOST', highlights: ["communication", "bookings", "checkin", "review"], number: '03', featured: true, features: ['communication', 'bookings', 'calendarManagement', 'pricingManagement', 'checkin', 'support', 'listingOptimization', 'performance', 'review'] }
  ] as const,
  upload: { maxFiles: 8, maxSize: 5 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/webp'] },
};
export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);
