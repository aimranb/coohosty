import { AnalysisTools } from './analysis-tools';
import { getTranslations } from 'next-intl/server';
import { TrendingUp, Radar, ChartNoAxesCombined, CalendarCheck, Clock3, FileChartColumn } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
export async function Revenue() {
  const t = await getTranslations('revenue');
  const features = [{ id: 'dynamic', icon: TrendingUp }, { id: 'monitoring', icon: Radar }, { id: 'market', icon: ChartNoAxesCombined }, { id: 'calendar', icon: CalendarCheck }, { id: 'minimum', icon: Clock3 }, { id: 'report', icon: FileChartColumn }];
  return <section id="revenue" className="section container"><Reveal className="revenue-layout"><div><div className="eyebrow">{t('eyebrow')}</div><h2>{t('title')}<br/><em>{t('accent')}</em></h2><p className="section-description">{t('sentence')}</p><AnalysisTools/></div><div className="revenue-grid">{features.map(({ id, icon: Icon }) => <div className="revenue-feature" key={id}><Icon size={25} strokeWidth={1.5}/><h3>{t(id)}</h3></div>)}</div></Reveal></section>;
}
