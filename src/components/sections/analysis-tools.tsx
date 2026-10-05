import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import tools from '@/config/analysis-tools.json';

export async function AnalysisTools() {
  const t = await getTranslations('analysisTools');
  return <section className="analytics-bar" aria-labelledby="analytics-bar-title"><h2 id="analytics-bar-title">{t('title')}</h2><div className="analytics-bar-track">{tools.map(tool => <a className="analysis-tool" key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer"><div className="analysis-tool-brand"><Image className="analytics-tool-logo" src={tool.logo} alt={tool.name} width={170} height={48} unoptimized/><span aria-hidden="true">↗</span></div><span>{t(tool.role)}</span>{tool.complementary && <small>{t('complementary')}</small>}</a>)}</div></section>;
}
