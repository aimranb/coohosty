import { getTranslations } from 'next-intl/server';
import tools from '@/config/analysis-tools.json';

export async function AnalysisTools() {
  const t = await getTranslations('analysisTools');
  return <div className="analytics-bar" aria-labelledby="analytics-bar-title"><h3 id="analytics-bar-title">{t('title')}</h3><div className="analytics-bar-track">{tools.map(tool => <a className="analysis-tool" key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer"><div className="analysis-tool-brand"><span className="analytics-tool-mark" aria-hidden="true">{tool.id === 'pricelabs' ? 'PL' : tool.id === 'airdna' ? 'AD' : 'B'}</span><strong>{tool.name}</strong><span aria-hidden="true">↗</span></div><span>{t(tool.role)}</span>{tool.complementary && <small>{t('complementary')}</small>}</a>)}</div><p>{t('disclaimer')}</p></div>;
}
