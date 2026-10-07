import type { Locale } from './site';

export const motionCopy: Record<Locale, {
  map: string; mapHint: string; localApproach: string; viewCity: string;
  pause: string; play: string; network: string; hub: string; insight: string;
  sources: string; decisions: string;
}> = {
  fr: {
    map: 'Nos villes, un même regard.', mapHint: 'Sélectionnez une ville pour la découvrir.',
    localApproach: 'Une approche locale. Une vision commune.', viewCity: 'Parlons de votre propriété',
    pause: 'Mettre l’animation en pause', play: 'Reprendre l’animation',
    network: 'Des données du marché aux décisions pour votre propriété',
    hub: 'Analyse croisée', insight: 'De la donnée à l’action',
    sources: 'Données & signaux', decisions: 'Les leviers de votre performance',
  },
  en: {
    map: 'Our cities. One perspective.', mapHint: 'Select a city to explore it.',
    localApproach: 'Local understanding. A shared vision.', viewCity: 'Let’s discuss your property',
    pause: 'Pause animation', play: 'Resume animation',
    network: 'From market data to decisions for your property',
    hub: 'Combined analysis', insight: 'From data to action',
    sources: 'Data & signals', decisions: 'Your performance levers',
  },
  ar: {
    map: 'مدننا، رؤية واحدة.', mapHint: 'اختر مدينة لاكتشافها.',
    localApproach: 'فهم محلي. رؤية مشتركة.', viewCity: 'لنتحدث عن عقارك',
    pause: 'إيقاف الحركة مؤقتاً', play: 'استئناف الحركة',
    network: 'من بيانات السوق إلى قرارات تخص عقارك',
    hub: 'تحليل متكامل', insight: 'من البيانات إلى العمل',
    sources: 'بيانات ومؤشرات', decisions: 'عوامل تحسين الأداء',
  },
};
