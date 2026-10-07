import type { Locale } from '@/config/site';

const copy = {
  fr: { title: 'Images', image: 'Meknès : Bab el-Mansur', adaptation: 'Image redimensionnée et recadrée pour son affichage.' },
  en: { title: 'Images', image: 'Meknes: Bab el-Mansur', adaptation: 'Image resized and cropped for display.' },
  ar: { title: 'الصور', image: 'مكناس: باب المنصور', adaptation: 'تم تغيير حجم الصورة واقتصاصها للعرض.' },
};

export function CityImageLicense({ locale }: { locale: Locale }) {
  const text = copy[locale];
  return <section><h2>{text.title}</h2><p>{text.image} · <a href="https://commons.wikimedia.org/wiki/File:Bab_mansour_DSCF5776.jpg">Robert Prazeres / Wikimedia Commons</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. {text.adaptation}</p></section>;
}
