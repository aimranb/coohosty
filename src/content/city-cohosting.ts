import { serviceArea } from './service-area';
import type { Locale } from '@/config/site';
import { type CityMarket, cityName, getCohostingCity } from '@/config/cohosting-cities';
import { marrakechMessages } from './marrakech-messages';

export const cohostingCopy = {
  fr: { eyebrow: 'COHOSTING · GESTION COMPLÈTE', title: 'Votre bien.', accent: 'Notre attention.', intro: 'Vous nous confiez les clés. Nous prenons soin de votre annonce, de vos voyageurs et de votre logement.', discover: 'Découvrir les services', start: 'Parlons de votre bien', commissionEyebrow: 'UNE COMMISSION. UN ACCOMPAGNEMENT COMPLET.', commissionTitle: 'Le service est complet.', commissionAccent: 'La commission, simplement 20 %.', rateLabel: 'de commission par réservation', rateNote: 'Le même taux à Marrakech, Casablanca et Tanger.', example: 'Votre commission, en clair', base: 'Montant retenu pour le calcul', reservation: 'Une réservation', month: 'Le total du mois', management: 'Commission COOHOSTY', balance: 'Solde avant autres frais', explanation: '20 % sur chaque réservation ou 20 % sur leur total : à base identique, le résultat est le même.', terms: 'Exemple indicatif. Le devis précise la base de calcul, le traitement des frais de plateforme, du ménage et des taxes, ainsi que les dépenses complémentaires.', services: 'Tout ce qui fait un séjour réussi.', servicesIntro: 'Les mêmes services COHOST dans les trois villes. Une organisation adaptée à votre logement.', localTitle: 'Le même soin.', localAccent: 'Une attention locale.', areaLabel: 'Votre quartier, votre logement', localNote: 'Le périmètre et les modalités d’intervention sont définis avec vous avant le démarrage.', citiesTitle: 'Trois villes. La même exigence.', cityLink: 'Découvrir le cohosting', faqTitle: 'Les réponses, simplement.', faqRate: 'Comment se calcule la commission de 20 % ?', faqServices: 'Quels services sont compris ?', faqExpenses: 'Qu’en est-il du ménage et des autres frais ?', expenses: 'La gestion des prestations fait partie de notre accompagnement. Le devis distingue la commission, les frais de plateforme, le ménage, les taxes et les dépenses d’entretien éventuelles. Leur traitement est précisé avant tout engagement.', faqStart: 'Comment confier mon logement ?', startAnswer: 'Présentez votre logement dans le formulaire. Nous étudions ses caractéristiques et son emplacement, puis vous proposons un périmètre de gestion et un devis adapté.', formTitle: 'Votre prochain séjour commence ici.', photo: 'Illustration de logement', home: 'Accueil', breadcrumb: 'Cohosting', guide: 'Le guide pour propriétaires', serviceScope: 'Les modalités et le périmètre des prestations sont précisés dans votre devis.' },
  en: { eyebrow: 'COHOSTING · COMPLETE MANAGEMENT', title: 'Your property.', accent: 'Our attention.', intro: 'You hand us the keys. We care for your listing, your guests and your home.', discover: 'Explore the services', start: 'Let’s discuss your property', commissionEyebrow: 'ONE COMMISSION. COMPLETE SUPPORT.', commissionTitle: 'A complete service.', commissionAccent: 'Simply 20% commission.', rateLabel: 'commission per booking', rateNote: 'The same rate in Marrakech, Casablanca and Tangier.', example: 'Your commission, clearly', base: 'Amount used for calculation', reservation: 'One booking', month: 'Monthly total', management: 'COOHOSTY commission', balance: 'Balance before other costs', explanation: '20% on each booking or 20% on their total: with the same calculation basis, the result is identical.', terms: 'Illustrative calculation. Your quote specifies the calculation basis, platform fees, cleaning, taxes and additional expenses.', services: 'Everything behind a great stay.', servicesIntro: 'The same COHOST services in all three cities, organised around your property.', localTitle: 'The same care.', localAccent: 'Local attention.', areaLabel: 'Your neighbourhood, your property', localNote: 'Service coverage and arrangements are agreed with you before management begins.', citiesTitle: 'Three cities. The same care.', cityLink: 'Explore cohosting', faqTitle: 'Clear answers.', faqRate: 'How is the 20% commission calculated?', faqServices: 'Which services are included?', faqExpenses: 'What about cleaning and other costs?', expenses: 'Coordinating services is part of our support. Your quote distinguishes management commission, platform fees, cleaning, taxes and any maintenance costs. Their treatment is specified before you commit.', faqStart: 'How do I get started?', startAnswer: 'Describe your property in the form. We review its features and location, then propose a suitable management scope and quote.', formTitle: 'Your next stay starts here.', photo: 'Property illustration', home: 'Home', breadcrumb: 'Cohosting', guide: 'The owner’s guide', serviceScope: 'Service terms and scope are specified in your quote.' },
  ar: { eyebrow: 'COHOSTING · إدارة متكاملة', title: 'عقارك.', accent: 'اهتمامنا.', intro: 'تسلّمنا المفاتيح، ونهتم بإعلانك وضيوفك وعقارك.', discover: 'اكتشف الخدمات', start: 'لنتحدث عن عقارك', commissionEyebrow: 'عمولة واحدة. عناية متكاملة.', commissionTitle: 'الخدمة متكاملة.', commissionAccent: 'والعمولة ببساطة 20%.', rateLabel: 'عمولة عن كل حجز', rateNote: 'النسبة نفسها في مراكش والدار البيضاء وطنجة.', example: 'عمولتك بوضوح', base: 'المبلغ المعتمد للحساب', reservation: 'حجز واحد', month: 'مجموع الشهر', management: 'عمولة COOHOSTY', balance: 'الرصيد قبل المصاريف الأخرى', explanation: '20% من كل حجز أو 20% من مجموع الحجوزات: النتيجة نفسها عند اعتماد أساس الحساب نفسه.', terms: 'حساب توضيحي. يحدد عرض السعر أساس الحساب ورسوم المنصة والتنظيف والضرائب والمصاريف الإضافية.', services: 'كل ما يجعل الإقامة ناجحة.', servicesIntro: 'خدمات COHOST نفسها في المدن الثلاث، بتنظيم يناسب عقارك.', localTitle: 'العناية نفسها.', localAccent: 'باهتمام محلي.', areaLabel: 'حيّك وعقارك', localNote: 'يتم الاتفاق معك على نطاق الخدمة وكيفية التدخل قبل بدء الإدارة.', citiesTitle: 'ثلاث مدن. العناية نفسها.', cityLink: 'اكتشف إدارة العقار', faqTitle: 'إجابات واضحة.', faqRate: 'كيف تُحسب عمولة 20%؟', faqServices: 'ما الخدمات المشمولة؟', faqExpenses: 'ماذا عن التنظيف والمصاريف الأخرى؟', expenses: 'تنسيق الخدمات جزء من مرافقتنا. يوضح عرض السعر عمولة الإدارة ورسوم المنصة والتنظيف والضرائب ومصاريف الصيانة المحتملة قبل أي التزام.', faqStart: 'كيف أبدأ؟', startAnswer: 'قدّم تفاصيل عقارك في الاستمارة. ندرس خصائصه وموقعه، ثم نقترح نطاق إدارة وعرض سعر مناسبين.', formTitle: 'إقامتك القادمة تبدأ هنا.', photo: 'صورة توضيحية للعقار', home: 'الرئيسية', breadcrumb: 'إدارة العقارات', guide: 'دليل المالك', serviceScope: 'تُحدد شروط الخدمات ونطاقها في عرض السعر.' },
} satisfies Record<Locale, Record<string, string>>;

for (const locale of ['fr', 'en', 'ar'] as const) {
  Object.assign(cohostingCopy[locale], {intro:serviceArea[locale].description, servicesIntro:serviceArea[locale].description, serviceScope:serviceArea[locale].description, localNote:serviceArea[locale].local, expenses:serviceArea[locale].description,
    eyebrow:locale==='fr'?'COHOSTING · GESTION DIGITALE':locale==='en'?'COHOSTING · DIGITAL MANAGEMENT':'إدارة رقمية',
    localAccent:locale==='fr'?'Votre organisation locale.':locale==='en'?'Your local arrangements.':'ترتيباتك المحلية.',
    commissionTitle:locale==='fr'?'Votre gestion digitale.':locale==='en'?'Your digital management.':'إدارتك الرقمية.'});
}

const cityDescriptions = {
  "marrakech": {
    "fr": "Pour votre logement à Marrakech, nous proposons la gestion digitale des annonces, des tarifs, des réservations et des messages. Les clés, le ménage et les interventions nécessitent des prestataires locaux organisés séparément.",
    "en": "For your property in Marrakech, we offer digital management of listings, rates, bookings and messages. Keys, cleaning and physical work require separately arranged local providers.",
    "ar": "نقدم إدارة رقمية للإعلانات والأسعار والحجوزات والرسائل لعقارك في مراكش. يتطلب تسليم المفاتيح والتنظيف والتدخلات ترتيبات محلية منفصلة."
  },
  "casablanca": {
    "fr": "Pour votre logement à Casablanca, nous proposons la gestion digitale des annonces, des tarifs, des réservations et des messages. Les clés, le ménage et les interventions nécessitent des prestataires locaux organisés séparément.",
    "en": "For your property in Casablanca, we offer digital management of listings, rates, bookings and messages. Keys, cleaning and physical work require separately arranged local providers.",
    "ar": "نقدم إدارة رقمية للإعلانات والأسعار والحجوزات والرسائل لعقارك في الدار البيضاء. يتطلب تسليم المفاتيح والتنظيف والتدخلات ترتيبات محلية منفصلة."
  },
  "tanger": {
    "fr": "Pour votre logement à Tanger, nous proposons la gestion digitale des annonces, des tarifs, des réservations et des messages. Les clés, le ménage et les interventions nécessitent des prestataires locaux organisés séparément.",
    "en": "For your property in Tanger, we offer digital management of listings, rates, bookings and messages. Keys, cleaning and physical work require separately arranged local providers.",
    "ar": "نقدم إدارة رقمية للإعلانات والأسعار والحجوزات والرسائل لعقارك في طنجة. يتطلب تسليم المفاتيح والتنظيف والتدخلات ترتيبات محلية منفصلة."
  }
};
export function cityDescription(market: CityMarket, locale: Locale) { return cityDescriptions[market][locale]; }
export function citySeoTitle(market: CityMarket, locale: Locale) {
  const name = cityName(market, locale);
  return locale === 'fr' ? `Co-hosting digital à ${name} | COOHOSTY` : locale === 'en' ? `Digital co-hosting in ${name} | COOHOSTY` : `إدارة رقمية لعقارك في ${name} | COOHOSTY`;
}
export function citySeoDescription(market: CityMarket, locale: Locale) {
  const name = cityName(market, locale);
  return `${name} : ${serviceArea[locale].description}`;
}
export function getCityMessages(market: CityMarket, locale: Locale) {
  const name = cityName(market, locale);
  const originalName = locale === 'ar' ? 'مراكش' : 'Marrakech';
  const base = JSON.parse(JSON.stringify(marrakechMessages[locale]).replaceAll(originalName, name)) as typeof marrakechMessages[typeof locale];
  // Local content must describe this city, not inherit Marrakech neighbourhoods.
  base.faq.items.onSite.answer = cityDescription(market, locale);
  base.estimate.placeholders.city = getCohostingCity(market).name;
  base.faq.items.price.answer = `${cohostingCopy[locale].explanation} ${cohostingCopy[locale].terms}`;
  return base;
}
