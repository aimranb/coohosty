'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/config/site';
import { cohostingCopy } from '@/content/city-cohosting';
import { PlanButton } from '@/components/forms/plan-button';
import styles from './city-cohosting.module.css';

export function CohostingCommission({ locale }: { locale: Locale }) {
  const copy = cohostingCopy[locale];
  const root = useRef<HTMLElement>(null);
  const [amount, setAmount] = useState(10000);
  const [mode, setMode] = useState<'reservation' | 'month'>('reservation');
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { element.dataset.visible = "true"; observer.disconnect(); } }, { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const money = (value: number) => new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : `${locale}-MA`, { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(value);
  const commission = Math.round(amount * 0.2);
  return <section ref={root} id="commission" className={styles.commission} aria-labelledby="commission-title" data-commission>
    <div className={styles.commissionHeading}><span className={styles.kicker}>{copy.commissionEyebrow}</span><h2 id="commission-title">{copy.commissionTitle}<br/><span>{copy.commissionAccent}</span></h2></div>
    <div className={styles.commissionGrid}>
      <div className={styles.ratePanel}>
        <svg className={styles.rateHalo} viewBox="0 0 240 240" aria-hidden="true"><circle className={styles.ringTrack} cx="120" cy="120" r="116"/><circle className={styles.ringDraw} cx="120" cy="120" r="116" pathLength="100"/></svg>
        <div className={styles.rateDisplay}><strong dir="ltr">20<span>%</span></strong><p>{copy.rateLabel}</p></div>
        <div className={styles.rateFooter}><span className={styles.liveDot} aria-hidden="true"/><span>{copy.rateNote}</span></div>
      </div>
      <div className={styles.calculator}>
        <h3>{copy.example}</h3>
        <div className={styles.modeSwitch} role="group" aria-label={copy.example}>{(['reservation', 'month'] as const).map(value => <button type="button" key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{copy[value]}</button>)}</div>
        <label className={styles.amountLabel} htmlFor="commission-amount">{copy.base}<output htmlFor="commission-amount" dir="ltr">{money(amount)}</output></label>
        <input id="commission-amount" type="range" min="1000" max="50000" step="500" value={amount} onChange={event => setAmount(Number(event.target.value))} aria-valuetext={money(amount)}/>
        <div className={styles.calculationRows} aria-live="polite" aria-atomic="true"><div><span>{copy.management}<small>20 %</small></span><strong data-commission-value dir="ltr">{money(commission)}</strong></div><div><span>{copy.balance}<small>80 %</small></span><strong data-balance-value dir="ltr">{money(amount - commission)}</strong></div></div>
        <div className={styles.shareBar} aria-hidden="true"><span/><span/></div>
        <p className={styles.explanation}>{copy.explanation}</p>
        <PlanButton plan="COHOST" className={`button ${styles.commissionCta}`}>{copy.start}<ArrowUpRight size={17}/></PlanButton>
      </div>
    </div>
    <p className={styles.terms}>{copy.terms}</p>
  </section>;
}
