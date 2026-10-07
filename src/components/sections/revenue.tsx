import { AnalysisTools } from './analysis-tools';
import { AnalysisNetwork } from './analysis-network';
import { getLocale, getTranslations } from 'next-intl/server';
import { TrendingUp, Radar, ChartNoAxesCombined, CalendarCheck, Clock3, FileChartColumn } from 'lucide-react';
import { isLocale } from '@/config/site';
export async function Revenue() {
  const t = await getTranslations('revenue');
  const requested = await getLocale();
  const locale = isLocale(requested) ? requested : 'fr';
  const features = [{ id: 'dynamic', icon: TrendingUp }, { id: 'monitoring', icon: Radar }, { id: 'market', icon: ChartNoAxesCombined }, { id: 'calendar', icon: CalendarCheck }, { id: 'minimum', icon: Clock3 }, { id: 'report', icon: FileChartColumn }];
  return <section id="revenue" className="section container">
    <header className="analysis-heading"><h2>{t('title')}<br/><em>{t('accent')}</em></h2><p className="section-description">{t('sentence')}</p></header>
    <AnalysisNetwork locale={locale} tools={<AnalysisTools/>}>
      <div className="revenue-grid">{features.map(({ id, icon: Icon }, index) => <div className="revenue-feature" data-flow-target={id} key={id}><span className="revenue-feature-icon"><Icon size={25} strokeWidth={1.5} aria-hidden="true"/></span><h3>{t(id)}</h3><span className="revenue-feature-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div>)}</div>
    </AnalysisNetwork>
  </section>;
}
