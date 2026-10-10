import { analysisToolMarks } from '@/config/analysis-tool-marks';
import { getTranslations } from 'next-intl/server';
import tools from '@/config/analysis-tools.json';

export async function AnalysisTools() {
  const t = await getTranslations('analysisTools');
  return <section className="analytics-bar" aria-labelledby="analytics-bar-title"><h2 id="analytics-bar-title">{t('title')}</h2><div className="analytics-bar-track">{tools.map(tool => <a className="analysis-tool" data-flow-source={tool.id} key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer"><div className="analysis-tool-brand"><div className="analytics-tool-logo" role="img" aria-label={tool.name} dangerouslySetInnerHTML={{ __html: analysisToolMarks[tool.id] }}/><span aria-hidden="true">↗</span></div><span>{t(tool.role)}</span>{tool.complementary && <small>{t('complementary')}</small>}</a>)}</div></section>;
}
