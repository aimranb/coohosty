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
  { name: 'Yasmine El Amrani', party: 2, initials: 'YE', start: 1, end: 5, channel: 'Airbnb' },
  { name: 'Thomas Laurent', party: 2, initials: 'TL', start: 5, end: 9, channel: 'Airbnb' },
  { name: 'Mehdi Bennani', party: 4, initials: 'MB', start: 10, end: 14, channel: 'Airbnb' },
  { name: 'Salma Idrissi', party: 3, initials: 'SI', start: 14, end: 18, channel: 'Airbnb' },
  { name: 'Sofia Martin', party: 2, initials: 'SM', start: 18, end: 22, channel: 'Airbnb' },
  { name: 'Amine Alaoui', party: 4, initials: 'AA', start: 23, end: 27, channel: 'Airbnb' },
  { name: 'Emma Wilson', party: 2, initials: 'EW', start: 27, end: 32, channel: 'Airbnb' },
];

export function ReservationCalendar({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const ui = {
    fr: { month: 'Mois', week: 'Semaine', view: 'Affichage du calendrier', reset: 'Revenir au mois du planning exemple', rates: 'Tarifs d’exemple en MAD' },
    en: { month: 'Month', week: 'Week', view: 'Calendar view', reset: 'Return to example schedule month', rates: 'Illustrative nightly rates in MAD' },
    ar: { month: 'شهر', week: 'أسبوع', view: 'عرض التقويم', reset: 'العودة إلى شهر المثال', rates: 'أسعار ليلية توضيحية بالدرهم' },
  }[locale];
  const [monthOffset, setMonthOffset] = useState(0);
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const target = section.current;
    if (!target) return;
    let inViewport = false;
    const update = () => setVisible(inViewport && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inViewport = entry.isIntersecting; update(); }, { threshold: 0.15 });
    observer.observe(target);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update(); preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (paused || !visible || reduced) return;
    const timer = window.setInterval(() => setSelected(value => (value + 1) % guests.length), 3000);
    return () => window.clearInterval(timer);
  }, [paused, visible, reduced]);
  const month = new Date(Date.UTC(2026, 9 + monthOffset, 1));
  const year = month.getUTCFullYear(), monthIndex = month.getUTCMonth();
  const offset = (month.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const weeks = Math.ceil((offset + days) / 7);
  const format = (day: number, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(new Date(Date.UTC(year, monthIndex, day)));
  const stays = guests.map(item => ({ ...item, end: Math.min(item.end, days + 1) }));
  const guest = stays[selected];
  const visibleWeeks = view === 'month' ? Array.from({ length: weeks }, (_, index) => index) : [Math.floor((guest.start + offset - 1) / 7)];
  const playing = visible && !paused && !reduced;
  return <section ref={section} id="reservations" className="reservation-section section" aria-labelledby="reservation-title">
    <div className="container">
      <div className="reservation-heading"><span className="eyebrow">{t.eyebrow}</span><h2 id="reservation-title">{t.title}</h2><p>{t.description}</p></div>
      <Reveal className="reservation-reveal"><div className="reservation-stage" data-playing={playing} data-visible={visible}>
        <div className="reservation-calendar" dir="ltr">
          <div className="reservation-reference-toolbar">
            <div className="reservation-reference-month">
              <select aria-label={t.calendar} value={monthOffset} onChange={event => setMonthOffset(Number(event.target.value))}>{Array.from({ length: 13 }, (_, index) => { const value = monthOffset - 6 + index; return <option key={value} value={value}>{new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 9 + value, 1)))}</option>; })}</select>
              <div className="reservation-reference-arrows"><button type="button" aria-label={t.previous} onClick={() => setMonthOffset(value => value - 1)}><ArrowLeft size={14}/></button><button type="button" aria-label={t.next} onClick={() => setMonthOffset(value => value + 1)}><ArrowRight size={14}/></button></div>
            </div>
            <div className="reservation-reference-actions">
              <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? t.play : t.pause} aria-pressed={paused}>{paused ? <Play size={14}/> : <Pause size={14}/>}</button>
              <select aria-label={ui.view} value={view} onChange={event => setView(event.target.value as 'month' | 'week')}><option value="month">{ui.month}</option><option value="week">{ui.week}</option></select>
              <button type="button" onClick={() => { setMonthOffset(0); setView('month'); }} aria-label={ui.reset}><CalendarDays size={14}/></button>
            </div>
          </div>
          <div className="reservation-weekdays">{Array.from({ length: 7 }, (_, index) => <span key={index}>{new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 9, 5 + index)))}</span>)}</div>
          <h3 className="reservation-reference-title">{format(1, { month: 'long' })}</h3>
          <div key={`${monthOffset}-${view}`} className="reservation-grid" style={{ gridTemplateRows: `repeat(${visibleWeeks.length}, minmax(var(--reservation-row-height, 88px), 1fr))` }}>
            {visibleWeeks.flatMap((week, row) => Array.from({ length: 7 }, (_, column) => {
              const day = week * 7 + column - offset + 1;
              if (day < 1 || day > days) return <div key={`${week}-${column}`} className="reservation-day-empty" aria-hidden="true" style={{ gridColumn: column + 1, gridRow: row + 1 }}/>;
              const booked = stays.some(item => day >= item.start && day < item.end);
              return <div className="reservation-day" key={`${week}-${column}`} data-day={day} data-booked={booked} style={{ gridColumn: column + 1, gridRow: row + 1 }}><span>{day}</span>{!booked && <small className="reservation-day-rate" title={ui.rates}>MAD{520 + ((day + monthIndex) % 7) * 31}</small>}{stays.some(item => item.end === day) && <span className={`reservation-clean-badge ${guest.end === day ? 'current' : ''}`} title={`${t.clean} · ${format(day, { day: 'numeric', month: 'short' })}`} role="img" aria-label={`${t.clean} · ${format(day, { day: 'numeric', month: 'short' })}`}><SprayCan size={15}/><Sparkles size={8}/></span>}</div>;
            }))}
            {stays.flatMap((stay, stayIndex) => visibleWeeks.map((week, row) => {
              const first = Math.max(stay.start + offset - 1, week * 7), last = Math.min(stay.end + offset - 2, week * 7 + 6);
              if (last < first) return null;
              const continuation = first > stay.start + offset - 1;
              return <button type="button" key={`${stay.name}-${week}-${monthOffset}`} data-tone={stayIndex % 2} className={`reservation-booking ${selected === stayIndex ? 'selected' : ''} ${continuation ? 'reservation-continuation' : ''}`} style={{ gridColumn: `${first % 7 + 1} / ${last % 7 + 2}`, gridRow: row + 1, animationDelay: `${stayIndex * 0.16 + (continuation ? 0.08 : 0)}s` }} aria-label={`${stay.name}, ${stay.channel}, ${format(stay.start, { month: 'short', day: 'numeric' })} – ${format(stay.end, { month: 'short', day: 'numeric' })}`} aria-pressed={selected === stayIndex} onClick={() => { setSelected(stayIndex); setPaused(true); }}>{!continuation && <><span className="reservation-avatar">{stay.initials}</span><span className="reservation-booking-name">{stay.name.split(' ')[0]} + {stay.party - 1}</span></>}</button>;
            }))}
          </div>
          <div className="reservation-reference-footer"><div className="reservation-legend"><span className="reservation-status-dot"/>{t.sync}<span><SprayCan size={14}/>{t.clean}</span></div><span className="reservation-currency-badge" title={ui.rates}>MAD</span></div>
        </div>
        <div className="reservation-aside">
          <div className="reservation-detail" key={`${selected}-${monthOffset}`}><span className="reservation-detail-avatar">{guest.initials}</span><span className="reservation-channel"><span className="platform-mark" aria-hidden="true">A</span>{guest.channel}</span><p className="reservation-detail-label">{t.detail}</p><h3>{guest.name}</h3><p className="reservation-nights">{guest.end - guest.start} {t.nights}</p><dl><div><dt>{t.arrival}</dt><dd>{format(guest.start, { weekday: 'short', day: 'numeric', month: 'short' })}</dd></div><div><dt>{t.departure}</dt><dd>{format(guest.end, { weekday: 'short', day: 'numeric', month: 'short' })}</dd></div></dl><div className="reservation-ready"><Check size={15}/>{t.welcome}</div><div className="reservation-progress" aria-hidden="true"><span/></div></div>
          <div className="reservation-housekeeping" key={`clean-${selected}-${monthOffset}`}><span className="reservation-housekeeping-icon"><SprayCan size={23}/><Sparkles size={12}/></span><div><strong>{t.cleaning}</strong><p>{t.after} · {format(guest.end, { day: 'numeric', month: 'short' })}</p><span>{t.checklist}</span></div></div>
          <div className="reservation-channel-note"><CalendarDays size={18}/><p>{t.channels}</p></div>
          <div className="reservation-dots">{guests.map((item, index) => <button type="button" key={item.name} aria-label={item.name} aria-pressed={selected === index} className={selected === index ? 'active' : ''} onClick={() => { setSelected(index); setPaused(true); }}/>)}</div>
        </div>
      </div></Reveal>
      <div className="reservation-process">{t.steps.map((step, index) => <span key={step}><b>0{index + 1}</b>{step}</span>)}</div><p className="reservation-demo">{t.demo} · {ui.rates}</p>
    </div>
  </section>;
}
