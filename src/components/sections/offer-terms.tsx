import { getTranslations } from 'next-intl/server';
export async function OfferTerms({ plan, compact = false }: { plan: 'AUDIT' | 'OPTIMIZE' | 'COHOST'; compact?: boolean }) {
  const t = await getTranslations('offerPolicy');
  const cohost = plan === 'COHOST';
  return <div className={`offer-terms ${compact ? 'compact' : ''}`} data-offer-terms={plan}><strong>{t(cohost ? 'cohostLabel' : 'quoteLabel')}</strong><p>{t(cohost ? 'cohostDetail' : 'quoteDetail')}</p>{!compact && cohost && <p className="offer-scope-detail">{t('scopeDetail')}</p>}</div>;
}
export async function OfferScope() {
  const t = await getTranslations('offerPolicy');
  return <aside className="offer-scope" aria-labelledby="offer-scope-title"><h3 id="offer-scope-title">{t('scopeTitle')}</h3><p>{t('initialEstimate')}</p><p>{t('scopeDetail')}</p></aside>;
}
