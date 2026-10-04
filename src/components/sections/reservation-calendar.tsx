'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, Pause, Play, Sparkles, SprayCan } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import type { Locale } from '@/config/site';

const copy = {
  fr: { eyebrow: 'VOS RÉSERVATIONS, EN HARMONIE', title: 'Chaque séjour. Chaque détail. Un seul calendrier.', description: 'Nous coordonnons les réservations, les arrivées et le ménage pour que chaque séjour s’enchaîne en toute sérénité.', calendar: 'Calendrier des séjours', sync: 'Réservations coordonnées', detail: 'Prochaine réservation :', nights: 'nuits', arrival: 'Arrivée', departure: 'Départ', clean: 'Ménage entre les séjours', cleaning: 'Ménage coordonné', after: 'Après le départ', checklist: 'Nettoyage · linge · contrôle du logement', welcome: 'Accueil des voyageurs préparé', channels: 'Vos réservations Airbnb et le ménage, coordonnés au même endroit', demo: 'Exemple de planning · voyageurs fictifs', previous: 'Mois précédent', next: 'Mois suivant', pause: 'Mettre l’animation en pause', play: 'Reprendre l’animation', steps: ['Réservations centralisées', 'Arrivées anticipées', 'Ménage organisé'] },
  en: { eyebrow: 'YOUR BOOKINGS, IN HARMONY', title: 'Every stay. Every detail. One calendar.', description: 'We coordinate reservations, arrivals and cleaning so every stay flows smoothly into the next.', calendar: 'Stay calendar', sync: 'Coordinated reservations', detail: 'Upcoming booking:', nights: 'nights', arrival: 'Check-in', departure: 'Check-out', clean: 'Cleaning between stays', cleaning: 'Cleaning coordinated', after: 'After check-out', checklist: 'Cleaning · fresh linen · property check', welcome: 'Guest welcome prepared', channels: 'Your Airbnb stays and cleaning, coordinated in one place', demo: 'Example schedule · fictional guests', previous: 'Previous month', next: 'Next month', pause: 'Pause animation', play: 'Resume animation', steps: ['Bookings brought together', 'Arrivals planned ahead', 'Cleaning coordinated'] },
  ar: { eyebrow: 'حجوزاتكم بكل انسجام', title: 'كل إقامة. كل التفاصيل. تقويم واحد.', description: 'ننسق الحجوزات والوصول والتنظيف لضمان انتقال سلس بين كل إقامة وأخرى.', calendar: 'تقويم الإقامات', sync: 'حجوزات منسقة', detail: 'الحجز القادم:', nights: 'ليالٍ', arrival: 'الوصول', departure: 'المغادرة', clean: 'تنظيف بين الإقامات', cleaning: 'تنظيف منسق', after: 'بعد المغادرة', checklist: 'تنظيف · تغيير المفروشات · فحص السكن', welcome: 'استقبال الضيوف جاهز', channels: 'حجوزات Airbnb والتنظيف، منسقة في مكان واحد', demo: 'جدول توضيحي · أسماء ضيوف خيالية', previous: 'الشهر السابق', next: 'الشهر التالي', pause: 'إيقاف الحركة', play: 'استئناف الحركة', steps: ['تجميع الحجوزات', 'تجهيز الوصول', 'تنسيق التنظيف'] },
};
const guests = [
  { name: 'Yasmine El Amrani', initials: 'YE', start: 3, end: 7, channel: 'Airbnb', color: 'airbnb' },
  { name: 'Thomas Laurent', initials: 'TL', start: 9, end: 14, channel: 'Airbnb', color: 'airbnb' },
  { name: 'Mehdi Bennani', initials: 'MB', start: 16, end: 20, channel: 'Airbnb', color: 'airbnb' },
  { name: 'Salma Idrissi', initials: 'SI', start: 23, end: 28, channel: 'Airbnb', color: 'airbnb' },
];

export function ReservationCalendar({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState(0);
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
      if (!document.hidden && !motion.matches) setSelected(value => (value + 1) % guests.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [paused, visible]);
  const month = new Date(Date.UTC(2026, 9 + monthOffset, 1));
  const year = month.getUTCFullYear();
  const monthIndex = month.getUTCMonth();
  const offset = (month.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const weeks = Math.ceil((offset + days) / 7);
  const format = (day: number, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(new Date(Date.UTC(year, monthIndex, day)));
  const guest = guests[selected];
  const playing = visible && !paused;
  return <section ref={section} id="reservations" className="reservation-section section" aria-labelledby="reservation-title">
    <div className="container">
      <div className="reservation-heading"><span className="eyebrow">{t.eyebrow}</span><h2 id="reservation-title">{t.title}</h2><p>{t.description}</p></div>
      <Reveal className="reservation-reveal"><div className="reservation-stage" data-playing={playing} data-visible={visible}>
        <div className="reservation-calendar" dir="ltr">
          <div className="reservation-toolbar"><div><CalendarDays size={18}/><span>{t.calendar}</span></div><button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? t.play : t.pause} aria-pressed={paused}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button></div>
          <div className="reservation-month"><select aria-label={t.calendar} value={monthOffset} onChange={event => setMonthOffset(Number(event.target.value))}>{Array.from({ length: 13 }, (_, index) => { const value = monthOffset - 6 + index; return <option key={value} value={value}>{new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 9 + value, 1)))}</option>; })}</select><div><button type="button" aria-label={t.previous} onClick={() => setMonthOffset(value => value - 1)}><ArrowLeft size={16}/></button><button type="button" aria-label={t.next} onClick={() => setMonthOffset(value => value + 1)}><ArrowRight size={16}/></button></div></div>
          <div className="reservation-airbnb-badge"><span aria-hidden="true">A</span>Airbnb</div>
          <div className="reservation-weekdays">{Array.from({ length: 7 }, (_, index) => <span key={index}>{new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 9, 5 + index)))}</span>)}</div>
          <div key={monthOffset} className="reservation-grid" style={{ gridTemplateRows: `repeat(${weeks}, minmax(var(--reservation-row-height, 64px), 1fr))` }}>
            {Array.from({ length: weeks * 7 }, (_, index) => { const day = index - offset + 1; return <div className="reservation-day" key={index} style={{ gridColumn: index % 7 + 1, gridRow: Math.floor(index / 7) + 1 }}><span>{day > 0 && day <= days ? day : ''}</span>{guest.end === day && <span className={`reservation-clean-badge ${guest.end === day ? 'current' : ''}`} title={`${t.clean} · ${format(day, { day: 'numeric', month: 'short' })}`} role="img" aria-label={`${t.clean} · ${format(day, { day: 'numeric', month: 'short' })}`}><SprayCan size={16}/><Sparkles size={9}/></span>}</div>; })}
            {guests.flatMap((item, index) => index !== selected ? [] : Array.from({ length: weeks }, (_, week) => { const first = Math.max(item.start + offset - 1, week * 7); const last = Math.min(item.end + offset - 2, week * 7 + 6); if (last < first) return null; return <button type="button" key={`${item.name}-${week}-${monthOffset}`} className={`reservation-booking ${item.color} ${selected === index ? 'selected' : ''}`} style={{ gridColumn: `${first % 7 + 1} / ${last % 7 + 2}`, gridRow: week + 1, animationDelay: `${first > item.start + offset - 1 ? 0.1 : 0}s` }} aria-label={`${item.name}, ${item.channel}, ${format(item.start, { month: 'short', day: 'numeric' })} – ${format(item.end, { month: 'short', day: 'numeric' })}`} aria-pressed={selected === index} onClick={() => { setSelected(index); setPaused(true); }}><span className="reservation-avatar">{item.initials}</span><span className="reservation-booking-copy"><span className="reservation-booking-name">{item.name}</span><span className="reservation-booking-platform">{item.channel}</span></span><span className="reservation-platform-initial" aria-hidden="true">A</span></button>; }))}
          </div>
          <div className="reservation-legend"><span className="reservation-status-dot"/>{t.sync}<span><SprayCan size={14}/>{t.clean}</span></div>
        </div>
        <div className="reservation-aside">
          <div className="reservation-detail" key={`${selected}-${monthOffset}`}><span className={`reservation-detail-avatar ${guest.color}`}>{guest.initials}</span><span className={`reservation-channel ${guest.color}`}><span className="platform-mark" aria-hidden="true">A</span>{guest.channel}</span><p className="reservation-detail-label">{t.detail}</p><h3>{guest.name}</h3><p className="reservation-nights">{guest.end - guest.start} {t.nights}</p><dl><div><dt>{t.arrival}</dt><dd>{format(guest.start, { weekday: 'short', day: 'numeric', month: 'short' })}</dd></div><div><dt>{t.departure}</dt><dd>{format(guest.end, { weekday: 'short', day: 'numeric', month: 'short' })}</dd></div></dl><div className="reservation-ready"><Check size={15}/>{t.welcome}</div><div className="reservation-progress" aria-hidden="true"><span/></div></div>
          <div className="reservation-housekeeping" key={`clean-${selected}-${monthOffset}`}><span className="reservation-housekeeping-icon"><SprayCan size={23}/><Sparkles size={12}/></span><div><strong>{t.cleaning}</strong><p>{t.after} · {format(guest.end, { day: 'numeric', month: 'short' })}</p><span>{t.checklist}</span></div></div>
          <div className="reservation-channel-note"><CalendarDays size={18}/><p>{t.channels}</p></div>
          <div className="reservation-dots">{guests.map((item, index) => <button type="button" key={item.name} aria-label={item.name} aria-pressed={selected === index} className={selected === index ? 'active' : ''} onClick={() => { setSelected(index); setPaused(true); }}/>)}</div>
        </div>
      </div></Reveal>
      <div className="reservation-process">{t.steps.map((step, index) => <span key={step}><b>0{index + 1}</b>{step}</span>)}</div><p className="reservation-demo">{t.demo}</p>
    </div>
  </section>;
}
