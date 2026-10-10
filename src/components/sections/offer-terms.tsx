import { getTranslations } from 'next-intl/server';
export async function OfferTerms({ plan, compact = false }: { plan: 'AUDIT' | 'OPTIMIZE' | 'COHOST'; compact?: boolean }) {
  const t = await getTranslations('offerPolicy');
  const cohost = plan === 'COHOST';
  return <div className={`offer-terms ${compact ? 'compact' : ''}`} data-offer-terms={plan}><strong>{t(cohost ? 'cohostLabel' : 'quoteLabel')}</strong><p>{t(cohost ? 'cohostDetail' : 'quoteDetail')}</p></div>;
}
