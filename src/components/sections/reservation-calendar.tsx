'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, Pause, Play, Sparkles, SprayCan } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import type { Locale } from '@/config/site';

const copy = {
  fr: { eyebrow: 'VOS RÉSERVATIONS, EN HARMONIE', title: 'Chaque séjour. Chaque détail. Un seul calendrier.', description: 'Nous coordonnons les réservations, les arrivées et le ménage pour que chaque séjour s’enchaîne en toute sérénité.', calendar: 'Calendrier des séjours', sync: 'Réservations coordonnées', detail: 'Le prochain séjour', nights: 'nuits', arrival: 'Arrivée', departure: 'Départ', clean: 'Ménage entre les séjours', all: 'Toutes les plateformes', filter: 'Filtrer par plateforme', cleaning: 'Ménage coordonné', after: 'Après le départ', checklist: 'Nettoyage · linge · contrôle du logement', welcome: 'Accueil des voyageurs préparé', channels: 'Un planning clair pour toutes vos plateformes', demo: 'Exemple de planning · voyageurs fictifs', previous: 'Mois précédent', next: 'Mois suivant', pause: 'Mettre l’animation en pause', play: 'Reprendre l’animation', steps: ['Réservations centralisées', 'Arrivées anticipées', 'Ménage organisé'] },
  en: { eyebrow: 'YOUR BOOKINGS, IN HARMONY', title: 'Every stay. Every detail. One calendar.', description: 'We coordinate reservations, arrivals and cleaning so every stay flows smoothly into the next.', calendar: 'Stay calendar', sync: 'Coordinated reservations', detail: 'The next stay', nights: 'nights', arrival: 'Check-in', departure: 'Check-out', clean: 'Cleaning between stays', all: 'All platforms', filter: 'Filter by platform', cleaning: 'Cleaning coordinated', after: 'After check-out', checklist: 'Cleaning · fresh linen · property check', welcome: 'Guest welcome prepared', channels: 'One clear schedule for all your platforms', demo: 'Example schedule · fictional guests', previous: 'Previous month', next: 'Next month', pause: 'Pause animation', play: 'Resume animation', steps: ['Bookings brought together', 'Arrivals planned ahead', 'Cleaning coordinated'] },
  ar: { eyebrow: 'حجوزاتكم بكل انسجام', title: 'كل إقامة. كل التفاصيل. تقويم واحد.', description: 'ننسق الحجوزات والوصول والتنظيف لضمان انتقال سلس بين كل إقامة وأخرى.', calendar: 'تقويم الإقامات', sync: 'حجوزات منسقة', detail: 'الإقامة التالية', nights: 'ليالٍ', arrival: 'الوصول', departure: 'المغادرة', clean: 'تنظيف بين الإقامات', all: 'جميع المنصات', filter: 'تصفية حسب المنصة', cleaning: 'تنظيف منسق', after: 'بعد المغادرة', checklist: 'تنظيف · تغيير المفروشات · فحص السكن', welcome: 'استقبال الضيوف جاهز', channels: 'جدول واضح لجميع منصاتكم', demo: 'جدول توضيحي · أسماء ضيوف خيالية', previous: 'الشهر السابق', next: 'الشهر التالي', pause: 'إيقاف الحركة', play: 'استئناف الحركة', steps: ['تجميع الحجوزات', 'تجهيز الوصول', 'تنسيق التنظيف'] },
};
const guests = [
  { name: 'Yasmine El Amrani', initials: 'YE', start: 3, end: 7, channel: 'Airbnb', color: 'coral' },
  { name: 'Thomas Laurent', initials: 'TL', start: 9, end: 14, channel: 'Booking.com', color: 'blue' },
  { name: 'Mehdi Bennani', initials: 'MB', start: 16, end: 20, channel: 'Vrbo', color: 'gold' },
  { name: 'Salma Idrissi', initials: 'SI', start: 23, end: 28, channel: 'Airbnb', color: 'coral' },
];

const platforms = [
  { name: 'Airbnb', color: 'coral', mark: 'A' },
  { name: 'Booking.com', color: 'blue', mark: 'B' },
  { name: 'Vrbo', color: 'gold', mark: 'V' },
] as const;

export function ReservationCalendar({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState(0);
  const [platform, setPlatform] = useState('all');
  const filteredGuests = guests.filter(item => platform === 'all' || item.channel === platform);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const target = section.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (paused || !visible || motion.matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden && !motion.matches) setSelected(value => {
        const matching = guests.map((item, index) => ({ item, index })).filter(({ item }) => platform === 'all' || item.channel === platform);
        const current = matching.findIndex(entry => entry.index === value);
        return matching[(current + 1) % matching.length].index;
      });
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused, visible, platform]);
  const month = new Date(Date.UTC(2026, 9 + monthOffset, 1));
  const year = month.getUTCFullYear();
  const monthIndex = month.getUTCMonth();
  const offset = (month.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const weeks = Math.ceil((offset + days) / 7);
  const format = (day: number, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(new Date(Date.UTC(year, monthIndex, day)));
  const guest = guests[selected];
  const playing = visible && !paused;
  const selectPlatform = (name: string) => {
    setPlatform(name);
    setSelected(name === 'all' ? 0 : guests.findIndex(item => item.channel === name));
    setPaused(true);
  };
  return <section ref={section} id="reservations" className="reservation-section section" aria-labelledby="reservation-title">
    <div className="container">
      <div className="reservation-heading"><span className="eyebrow">{t.eyebrow}</span><h2 id="reservation-title">{t.title}</h2><p>{t.description}</p></div>
      <Reveal className="reservation-reveal"><div className="reservation-stage" data-playing={playing} data-visible={visible}>
        <div className="reservation-calendar" dir="ltr">
          <div className="reservation-toolbar"><div><CalendarDays size={18}/><span>{t.calendar}</span></div><button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? t.play : t.pause} aria-pressed={paused}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button></div>
          <div className="reservation-month"><strong>{format(1, { month: 'long', year: 'numeric' })}</strong><div><button type="button" aria-label={t.previous} onClick={() => setMonthOffset(value => value - 1)}><ArrowLeft size={16}/></button><button type="button" aria-label={t.next} onClick={() => setMonthOffset(value => value + 1)}><ArrowRight size={16}/></button></div></div>
          <div className="reservation-platforms" role="group" aria-label={t.filter}>
            <button type="button" aria-pressed={platform === 'all'} onClick={() => selectPlatform('all')}>{t.all}</button>
            {platforms.map(item => <button type="button" key={item.name} className={`platform-filter ${item.color}`} aria-pressed={platform === item.name} onClick={() => selectPlatform(item.name)}><span aria-hidden="true" className="platform-mark">{item.mark}</span>{item.name}</button>)}
          </div>
          <div className="reservation-weekdays">{Array.from({ length: 7 }, (_, index) => <span key={index}>{new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 9, 5 + index)))}</span>)}</div>
          <div key={monthOffset} className="reservation-grid" style={{ gridTemplateRows: `repeat(${weeks}, minmax(var(--reservation-row-height, 94px), 1fr))` }}>
            {Array.from({ length: weeks * 7 }, (_, index) => { const day = index - offset + 1; return <div className="reservation-day" key={index} style={{ gridColumn: index % 7 + 1, gridRow: Math.floor(index / 7) + 1 }}><span>{day > 0 && day <= days ? day : ''}</span>{filteredGuests.some(item => item.end === day) && <span className={`reservation-clean-badge ${guest.end === day ? 'current' : ''}`} title={`${t.clean} · ${format(day, { day: 'numeric', month: 'short' })}`} role="img" aria-label={`${t.clean} · ${format(day, { day: 'numeric', month: 'short' })}`}><SprayCan size={16}/><Sparkles size={9}/></span>}</div>; })}
            {guests.flatMap((item, index) => (platform !== 'all' && item.channel !== platform) ? [] : Array.from({ length: weeks }, (_, week) => { const first = Math.max(item.start + offset - 1, week * 7); const last = Math.min(item.end + offset - 2, week * 7 + 6); if (last < first) return null; return <button type="button" key={`${item.name}-${week}`} className={`reservation-booking ${item.color} ${selected === index ? 'selected' : ''}`} style={{ gridColumn: `${first % 7 + 1} / ${last % 7 + 2}`, gridRow: week + 1, animationDelay: `${index * 0.16 + (first > item.start + offset - 1 ? 0.12 : 0)}s` }} aria-label={`${item.name}, ${item.channel}, ${format(item.start, { month: 'short', day: 'numeric' })} – ${format(item.end, { month: 'short', day: 'numeric' })}`} aria-pressed={selected === index} onClick={() => { setSelected(index); setPaused(true); }}><span className="reservation-avatar">{item.initials}</span><span className="reservation-booking-copy"><span className="reservation-booking-name">{item.name}</span><span className="reservation-booking-platform">{item.channel}</span></span><span className="reservation-platform-initial" aria-hidden="true">{platforms.find(entry => entry.name === item.channel)?.mark}</span></button>; }))}
          </div>
          <div className="reservation-legend"><span className="reservation-status-dot"/>{t.sync}<span><SprayCan size={14}/>{t.clean}</span></div>
        </div>
        <div className="reservation-aside">
          <div className="reservation-detail" key={`${selected}-${platform}-${monthOffset}`}><span className={`reservation-detail-avatar ${guest.color}`}>{guest.initials}</span><span className={`reservation-channel ${guest.color}`}><span className="platform-mark" aria-hidden="true">{platforms.find(item => item.name === guest.channel)?.mark}</span>{guest.channel}</span><p className="reservation-detail-label">{t.detail}</p><h3>{guest.name}</h3><p className="reservation-nights">{guest.end - guest.start} {t.nights}</p><dl><div><dt>{t.arrival}</dt><dd>{format(guest.start, { weekday: 'short', day: 'numeric', month: 'short' })}</dd></div><div><dt>{t.departure}</dt><dd>{format(guest.end, { weekday: 'short', day: 'numeric', month: 'short' })}</dd></div></dl><div className="reservation-ready"><Check size={15}/>{t.welcome}</div><div className="reservation-progress" aria-hidden="true"><span/></div></div>
          <div className="reservation-housekeeping" key={`clean-${selected}-${monthOffset}`}><span className="reservation-housekeeping-icon"><SprayCan size={23}/><Sparkles size={12}/></span><div><strong>{t.cleaning}</strong><p>{t.after} · {format(guest.end, { day: 'numeric', month: 'short' })}</p><span>{t.checklist}</span></div></div>
          <div className="reservation-channel-note"><CalendarDays size={18}/><p>{t.channels}</p></div>
          <div className="reservation-dots">{guests.map((item, index) => (platform !== 'all' && item.channel !== platform) ? null : <button type="button" key={item.name} aria-label={item.name} aria-pressed={selected === index} className={selected === index ? 'active' : ''} onClick={() => { setSelected(index); setPaused(true); }}/>)}</div>
        </div>
      </div></Reveal>
      <div className="reservation-process">{t.steps.map((step, index) => <span key={step}><b>0{index + 1}</b>{step}</span>)}</div><p className="reservation-demo">{t.demo}</p>
    </div>
  </section>;
}
