import { describe, it, expect, vi, beforeEach } from 'vitest';
const mocks = vi.hoisted(() => ({ find: vi.fn(), create: vi.fn() }));
vi.mock('@/lib/db', () => ({ db: { auditRequest: { findUnique: mocks.find, create: mocks.create } } }));
vi.mock('@/server/audit-service', () => ({ SubmissionConflict: class extends Error {} }));
import { storeEstimate } from '@/server/estimate-service';
import { estimateSchema } from '@/validations/estimate';
import { internalEmail, customerEmail } from '@/emails/templates';
import type { FullRequest } from '@/lib/request-data';
const data = estimateSchema.parse({ type: 'villa', bedrooms: '3', city: 'Sidi Ifni', address: '12 Rue du Port', objective: 'time', duration: '6to12', ready: 'now', fullName: '<script>Owner</script>', email: 'owner@example.com', phone: '+212600000000', channel: 'email', consent: true, locale: 'en', submissionKey: '123e4567-e89b-42d3-a456-426614174000', honeypot: '' });
beforeEach(() => { vi.clearAllMocks(); mocks.find.mockResolvedValue(null); mocks.create.mockResolvedValue({ id: 'saved-estimate' }); });
describe('durable estimate enquiries', () => {
  it('stores all supplied property details and both notifications without inventing uncollected property metrics', async () => {
    await storeEstimate(data);
    const saved = mocks.create.mock.calls[0][0].data;
    expect(saved).toMatchObject({ fullName: data.fullName, email: data.email, phone: data.phone, source: 'hero-estimate', consent: true, country: 'Morocco', objective: 'time', emails: { create: [{ kind: 'internal' }, { kind: 'customer' }] } });
    for (const text of ['Villa', 'Bedrooms: 3', 'Sidi Ifni', '12 Rue du Port', 'Save time', '6–12 months', 'As soon as possible']) expect(saved.comments).toContain(text);
    expect(saved.property).toBeUndefined();
  });
  it('deduplicates retries and rejects changed data with the same submission key', async () => {
    await storeEstimate(data);
    const saved = mocks.create.mock.calls[0][0].data;
    mocks.find.mockResolvedValue({ id: 'saved-estimate', payloadHash: saved.payloadHash });
    expect((await storeEstimate(data)).id).toBe('saved-estimate');
    expect(mocks.create).toHaveBeenCalledOnce();
    await expect(storeEstimate({ ...data, city: 'Rabat' })).rejects.toThrow();
  });
  it('includes the complete estimate summary in the owner email and escapes submitted HTML', async () => {
    await storeEstimate(data);
    const saved = mocks.create.mock.calls[0][0].data;
    const request: FullRequest = { ...saved, id: 'estimate', status: 'NEW', consentVersion: '2026-10', consentAt: new Date(), createdAt: new Date(), updatedAt: new Date(), property: null };
    const internal = internalEmail(request);
    expect(internal.html).toContain('12 Rue du Port'); expect(internal.html).toContain('Sidi Ifni'); expect(internal.html).toContain('6–12 months');
    expect(internal.html).toContain('&lt;script&gt;Owner'); expect(internal.html).not.toContain('<script>Owner');
    const customer = customerEmail(request);
    expect(customer.html).toContain('Your property details have been received');
  });
});
