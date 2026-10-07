import { describe, it, expect, vi, afterEach } from 'vitest';
import { estimateSchema } from '@/validations/estimate';
import { parseRevenueBenchmark, revenueBenchmark } from '@/server/revenue-benchmark';

export const validEstimate = { type: 'apartment', bedrooms: '2', city: 'Sidi Ifni', address: '12 Rue du Port', objective: 'revenue', duration: 'yearplus', ready: 'month', fullName: 'Test Owner', email: 'OWNER@example.com', phone: '+212600000000', channel: 'email', consent: true, locale: 'en', submissionKey: '123e4567-e89b-42d3-a456-426614174000', honeypot: '' } as const;
const sample = { KPIsByBedroomCategory: { '2': { Revenue25PercentileSum: 24000, Revenue75PercentileSum: 36000, NoOfListings: 25, bedrooms_considered: ['2'] } } };
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe('estimate request validation', () => {
  it('preserves supported selected plans and defaults older requests to AUDIT', () => {
    expect(estimateSchema.parse(validEstimate).plan).toBe('AUDIT');
    for (const plan of ['AUDIT', 'OPTIMIZE', 'COHOST']) expect(estimateSchema.parse({ ...validEstimate, plan }).plan).toBe(plan);
    expect(estimateSchema.safeParse({ ...validEstimate, plan: 'OTHER' }).success).toBe(false);
  });
  it('accepts cities outside a fixed list and normalizes contact and address fields', () => { const result = estimateSchema.parse({ ...validEstimate, city: ' Sidi Ifni ', address: ' 12 Rue du Port ' }); expect(result.city).toBe('Sidi Ifni'); expect(result.address).toBe('12 Rue du Port'); expect(result.email).toBe('owner@example.com'); });
  it.each([{ consent: false }, { email: 'bad' }, { bedrooms: '20' }, { address: '' }, { city: '' }, { honeypot: 'bot' }, { phone: 'abc' }])('rejects invalid or non-consensual requests %j', change => { expect(estimateSchema.safeParse({ ...validEstimate, ...change }).success).toBe(false); });
  it('accepts optional phone and ten bedrooms', () => { expect(estimateSchema.safeParse({ ...validEstimate, bedrooms: '10', phone: '' }).success).toBe(true); });
});
describe('sourced revenue ranges', () => {
  it('uses provider annual quartiles divided by twelve without an invented management uplift', () => { expect(parseRevenueBenchmark(sample, 2)).toMatchObject({ lower: 2000, upper: 3000, currency: 'EUR', listings: 25, provider: 'PriceLabs', bedrooms: 2 }); });
  it('rejects sparse data, unrelated bedrooms, invalid values and reversed ranges', () => {
    for (const change of [{ NoOfListings: 4 }, { bedrooms_considered: ['2', '3'] }, { Revenue25PercentileSum: 40000 }, { Revenue75PercentileSum: NaN }]) expect(parseRevenueBenchmark({ KPIsByBedroomCategory: { '2': { ...sample.KPIsByBedroomCategory['2'], ...change } } }, 2)).toBeNull();
    expect(parseRevenueBenchmark(sample, 3)).toBeNull(); expect(parseRevenueBenchmark({}, 2)).toBeNull();
  });
  it('returns no fabricated range when the data service is not configured', async () => { vi.stubEnv('PRICELABS_REVENUE_API_KEY', ''); const fetch = vi.fn(); vi.stubGlobal('fetch', fetch); expect(await revenueBenchmark(estimateSchema.parse(validEstimate))).toBeNull(); expect(fetch).not.toHaveBeenCalled(); });
  it('sends only property location and bedrooms to the configured provider, not contact details', async () => { vi.stubEnv('PRICELABS_REVENUE_API_KEY', 'test-key'); const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => sample }); vi.stubGlobal('fetch', fetch); await revenueBenchmark(estimateSchema.parse(validEstimate)); const url = new URL(fetch.mock.calls[0][0]); expect(url.searchParams.get('address')).toBe('12 Rue du Port, Sidi Ifni, Morocco'); expect(url.searchParams.get('currency')).toBe('EUR'); expect(url.searchParams.get('bedroom_category')).toBe('2'); expect(url.href).not.toContain('OWNER'); expect(url.href).not.toContain('600000000'); });
});
