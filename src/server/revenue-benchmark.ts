import 'server-only';
import { z } from 'zod';
import type { EstimateData } from '@/validations/estimate';

const metrics = z.object({
  Revenue25PercentileSum: z.number().finite().positive(),
  Revenue75PercentileSum: z.number().finite().positive(),
  NoOfListings: z.number().int().min(10),
  bedrooms_considered: z.array(z.string()).optional(),
});
export type RevenueBenchmark = { lower: number; upper: number; currency: 'EUR'; listings: number; retrievedAt: string; provider: 'PriceLabs'; bedrooms: number };

export function parseRevenueBenchmark(raw: unknown, bedrooms: number): RevenueBenchmark | null {
  const envelope = z.object({ KPIsByBedroomCategory: z.record(z.string(), z.unknown()) }).safeParse(raw);
  if (!envelope.success) return null;
  const result = metrics.safeParse(envelope.data.KPIsByBedroomCategory[String(bedrooms)]);
  if (!result.success) return null;
  const data = result.data;
  if (data.Revenue25PercentileSum > data.Revenue75PercentileSum || data.bedrooms_considered?.some(value => value !== String(bedrooms))) return null;
  return { lower: Math.round(data.Revenue25PercentileSum / 12), upper: Math.round(data.Revenue75PercentileSum / 12), currency: 'EUR', listings: data.NoOfListings, retrievedAt: new Date().toISOString(), provider: 'PriceLabs', bedrooms };
}

export async function revenueBenchmark(data: EstimateData): Promise<RevenueBenchmark | null> {
  const key = process.env.PRICELABS_REVENUE_API_KEY;
  if (!key) return null;
  const url = new URL('https://api.pricelabs.co/v2/revenue/estimator');
  url.search = new URLSearchParams({ address: `${data.address}, ${data.city}, Morocco`, currency: 'EUR', bedroom_category: data.bedrooms }).toString();
  try {
    const response = await fetch(url, { headers: { 'X-API-Key': key }, cache: 'no-store', signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    return parseRevenueBenchmark(await response.json(), Number(data.bedrooms));
  } catch { return null; }
}
