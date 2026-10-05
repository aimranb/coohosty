import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, CalendarDays, ChartNoAxesColumnIncreasing, Menu, MessageCircle, Star } from 'lucide-react';

export async function IncomeIntro() {
  const t = await getTranslations('incomeIntro');
  return <section className="income-intro" aria-labelledby="income-intro-title">
    <div className="container income-intro-inner">
      <div className="income-intro-copy">
        <span className="eyebrow">{t('eyebrow')}</span>
        <h2 id="income-intro-title">{t('title')} <em>{t('accent')}</em></h2>
        <a className="income-intro-cta" href="#estimate">{t('cta')}<ArrowUpRight size={17}/></a>
      </div>
      <div className="income-devices" aria-label={t('previewLabel')}>
        <article className="income-phone income-phone-bookings">
          <div className="income-phone-notch"/><div className="income-phone-screen">
            <div className="income-phone-header"><div><Menu size={14}/><span>COOHOSTY</span><MessageCircle size={14}/></div><h3>{t('bookings')}</h3></div>
            <div className="income-phone-content">
              <div className="income-mini-card"><h4>{t('experience')}</h4>{['welcome','cleanliness','communication'].map(key => <div className="income-rating-row" key={key}><span>{t(key)}</span><span className="income-stars" aria-label={t('illustration')}>{[0,1,2,3,4].map(i => <Star size={9} key={i}/>)}</span></div>)}</div>
              <div className="income-mini-card"><h4>{t('nextStay')}</h4><div className="income-mini-guest"><span>YA</span><div><strong>Yasmine</strong><small>{t('arrivalReady')}</small></div><CalendarDays size={15}/></div></div>
              <div className="income-mini-task"><span className="income-status-dot"/>{t('housekeeping')}</div>
            </div>
          </div>
        </article>
        <article className="income-phone income-phone-performance">
          <div className="income-phone-notch"/><div className="income-phone-screen">
            <div className="income-phone-header"><div><Menu size={14}/><span>COOHOSTY</span><ChartNoAxesColumnIncreasing size={14}/></div><h3>{t('performance')}</h3></div>
            <div className="income-phone-content">
              <div className="income-mini-card"><h4>{t('revenue')}</h4><div className="income-chart" aria-hidden="true">{[32,44,40,57,70,62,87,76,63,72,59,80].map((height,i) => <span key={i} style={{ height: `${height}%`, animationDelay: `${i * 55}ms` }}/>)}</div><div className="income-chart-axis" aria-hidden="true"><span>01</span><span>06</span><span>12</span></div></div>
              <div className="income-mini-card"><h4>{t('occupancy')}</h4><div className="income-occupancy"><ul><li><i/>{t('reserved')}</li><li><i/>{t('available')}</li><li><i/>{t('blocked')}</li></ul><div className="income-donut" aria-hidden="true"><CalendarDays size={22}/></div></div></div>
            </div>
          </div>
        </article>
        <article className="income-phone income-phone-calendar">
          <div className="income-phone-notch"/><div className="income-phone-screen">
            <div className="income-phone-header"><div><Menu size={14}/><span>COOHOSTY</span><CalendarDays size={14}/></div><h3>{t('calendar')}</h3></div>
            <div className="income-phone-content">
              <div className="income-mini-card"><h4>{t('stayPlanning')}</h4><div className="income-mini-calendar" aria-hidden="true">{Array.from({length:28},(_,i) => <span key={i}>{i+1}</span>)}<i className="income-calendar-stay stay-one"/><i className="income-calendar-stay stay-two"/><i className="income-calendar-stay stay-three"/></div></div>
              <div className="income-mini-card"><h4>{t('betweenStays')}</h4><div className="income-cleaning"><span>✓</span><div><strong>{t('housekeeping')}</strong><small>{t('arrivalReady')}</small></div></div></div>
            </div>
          </div>
        </article>
      </div>
      <p className="income-preview-note">{t('illustration')}</p>
    </div>
  </section>;
}
