import { AnalysisTools } from './analysis-tools';
import { getTranslations } from 'next-intl/server';
import { TrendingUp, Radar, ChartNoAxesCombined, CalendarCheck, Clock3, FileChartColumn } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
export async function Revenue() {
  const t = await getTranslations('revenue');
  const features = [{ id: 'dynamic', icon: TrendingUp }, { id: 'monitoring', icon: Radar }, { id: 'market', icon: ChartNoAxesCombined }, { id: 'calendar', icon: CalendarCheck }, { id: 'minimum', icon: Clock3 }, { id: 'report', icon: FileChartColumn }];
  return <section id="revenue" className="section container"><Reveal className="revenue-layout"><div><h2>{t('title')}<br/><em>{t('accent')}</em></h2><p className="section-description">{t('sentence')}</p></div><div className="revenue-grid">{features.map(({ id, icon: Icon }, index) => <Reveal className="revenue-feature" key={id}><span className="revenue-feature-icon"><Icon size={25} strokeWidth={1.5} aria-hidden="true"/></span><h3>{t(id)}</h3><span className="revenue-feature-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></Reveal>)}</div></Reveal><AnalysisTools/></section>;
}
