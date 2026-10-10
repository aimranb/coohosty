'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { EstimateBar } from './estimate-bar';
import { estimateSchema } from '@/validations/estimate';
import type { Locale } from '@/config/site';
import { getCohostingCity, type CityMarket } from '@/config/cohosting-cities';

const propertySchema = estimateSchema.pick({ type: true, bedrooms: true, city: true, address: true, plan: true });
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function EstimateContinuation({ locale, emailEnabled, market }: { locale: Locale; emailEnabled: boolean; market?: CityMarket }) {
  const t = useTranslations('estimate');
  const raw = useSyncExternalStore(subscribe, () => {
    try { return sessionStorage.getItem(`coohosty-estimate-property-${locale}${market ? `-${market}` : ""}`); } catch { return null; }
  }, () => undefined);
  const property = useMemo(() => {
    if (!raw) return undefined;
    try {
      const parsed = propertySchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : undefined;
    } catch { return undefined; }
  }, [raw]);

  if (raw === undefined) return <div className="estimate-completion-loading" role="status">{t('title')}</div>;
  return <EstimateBar key={market ?? "national"} locale={locale} emailEnabled={emailEnabled} completion initialProperty={property} fixedCity={market ? getCohostingCity(market).name : undefined}/>;
}
