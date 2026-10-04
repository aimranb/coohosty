import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import tools from '@/config/analysis-tools.json';

export async function AnalysisTools() {
  const t = await getTranslations('analysisTools');
  return <div className="analysis-tools"><h3>{t('title')}</h3><div className="analysis-tools-grid">{tools.map(tool => <a className="analysis-tool" key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer"><div className="analysis-tool-brand"><Image src={tool.logo} width={28} height={28} alt="" unoptimized/><strong>{tool.name}</strong><span aria-hidden="true">↗</span></div><span>{t(tool.role)}</span>{tool.complementary && <small>{t('complementary')}</small>}</a>)}</div><p>{t('disclaimer')}</p></div>;
}
