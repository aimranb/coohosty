import { getTranslations } from 'next-intl/server';
import { Quote, ArrowUpRight } from 'lucide-react';
import config from '@/config/service-proof.json';
import { site, type Locale } from '@/config/site';

type ServiceReview = { name: string; city: string; plan: string; quote: Record<Locale,string>; sourceUrl: string | null };
type ProofData = { clientCount: number | null; countVerifiedOn: string | null; reviews: ServiceReview[] };
const data: ProofData = config;

export async function ServiceProof({ locale }: { locale: Locale }) {
  const t=await getTranslations('serviceProof');
  if (data.reviews.length === 0) return null;
  const count=data.clientCount;
  const hasCount=count !== null && Number.isSafeInteger(count) && count >= 0 && Boolean(data.countVerifiedOn);
  return <section id="service-proof" className="service-proof-section container" aria-labelledby="service-proof-title"><div className="service-proof-bar"><div className="service-proof-heading"><div><span className="eyebrow">{t('eyebrow')}</span><h2 id="service-proof-title">{t('title')}</h2><p>{t('subtitle')}</p></div>{hasCount && <div className="service-client-count"><strong>{new Intl.NumberFormat(locale).format(count!)}</strong><span>{t('clients')}</span></div>}</div>{data.reviews.length > 0 ? <div className="service-review-grid">{data.reviews.map((review,index) => <article className="service-review-card" key={`${review.name}-${index}`}><Quote size={21} aria-hidden="true"/><blockquote>{review.quote[locale]}</blockquote><div className="service-review-person"><span className="service-review-avatar" aria-hidden="true">{review.name.slice(0,1)}</span><div><strong>{review.name}</strong><span>{[review.city,review.plan].filter(Boolean).join(' · ')}</span></div></div>{review.sourceUrl && <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer">{t('source')}<ArrowUpRight size={12}/></a>}</article>)}</div> : <div className="service-proof-empty"><Quote size={25} aria-hidden="true"/><p>{t('pending')}</p><a href={site.whatsapp} target="_blank" rel="noopener noreferrer">{t('cta')}<ArrowUpRight size={15}/></a></div>}</div></section>;
}
