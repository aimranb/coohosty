import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
const mocks = vi.hoisted(() => ({ store: vi.fn(), rate: vi.fn(), verify: vi.fn(), deliver: vi.fn(), benchmark: vi.fn(), notification: vi.fn() }));
vi.mock('@/server/estimate-service', () => ({ storeEstimate: mocks.store }));
vi.mock('@/server/audit-service', () => ({ SubmissionConflict: class extends Error {} }));
vi.mock('@/server/rate-limit', () => ({ rateLimit: mocks.rate }));
vi.mock('@/server/turnstile', () => ({ verifyTurnstile: mocks.verify }));
vi.mock('@/server/emails', () => ({ deliverEmails: mocks.deliver }));
vi.mock('@/server/revenue-benchmark', () => ({ revenueBenchmark: mocks.benchmark }));
vi.mock('@/lib/db', () => ({ db: { emailOutbox: { findUnique: mocks.notification } } }));
import { POST } from '@/app/api/estimate/route';
const data = { type: 'villa', bedrooms: '3', city: 'Essaouira', address: '12 Rue du Port', objective: 'time', duration: '6to12', ready: 'now', fullName: 'Test Owner', email: 'owner@example.com', phone: '', channel: 'email', consent: true, locale: 'en', submissionKey: '123e4567-e89b-42d3-a456-426614174000', honeypot: '' };
function request(body: unknown = data, origin = 'http://localhost:3000') { return new Request('http://localhost:3000/api/estimate', { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); }
beforeEach(() => { vi.clearAllMocks(); vi.stubEnv('RESEND_API_KEY', 'test'); vi.stubEnv('EMAIL_FROM', 'test@example.com'); mocks.rate.mockResolvedValue(true); mocks.verify.mockResolvedValue(true); mocks.store.mockResolvedValue({ id: 'estimate-1' }); mocks.benchmark.mockResolvedValue(null); mocks.deliver.mockResolvedValue({ sent: 1 }); mocks.notification.mockResolvedValue({ sentAt: new Date() }); });
afterEach(() => vi.unstubAllEnvs());
describe('estimate submission', () => {
  it('rejects cross-origin requests and missing consent', async () => { expect((await POST(request(data, 'https://evil.example'))).status).toBe(403); expect((await POST(request({ ...data, consent: false }))).status).toBe(422); expect(mocks.store).not.toHaveBeenCalled(); });
  it('does not claim email submission succeeded when email is not configured', async () => { vi.stubEnv('RESEND_API_KEY', ''); const response = await POST(request()); expect(response.status).toBe(503); expect(await response.json()).toEqual({ error: 'email_unavailable' }); expect(mocks.store).not.toHaveBeenCalled(); });
  it('enforces rate limits and bot verification before provider lookup', async () => { mocks.rate.mockResolvedValueOnce(false); expect((await POST(request())).status).toBe(429); mocks.verify.mockResolvedValueOnce(false); expect((await POST(request())).status).toBe(400); expect(mocks.benchmark).not.toHaveBeenCalled(); });
  it('saves all fields and reports accepted owner notification accurately', async () => { const response = await POST(request()); expect(response.status).toBe(201); expect(await response.json()).toEqual({ ok: true, delivery: 'sent', benchmark: null }); expect(mocks.store).toHaveBeenCalledWith(data, null); expect(mocks.deliver).toHaveBeenCalledWith('estimate-1'); });
  it('keeps a saved enquiry successful but distinguishes deferred notification', async () => { mocks.deliver.mockRejectedValueOnce(new Error('provider unavailable')); const response = await POST(request()); expect(response.status).toBe(201); expect((await response.json()).delivery).toBe('queued'); });
  it('prepares WhatsApp without pretending to send or saving a duplicate enquiry', async () => { vi.stubEnv('RESEND_API_KEY', ''); const response = await POST(request({ ...data, channel: 'whatsapp' })); expect((await response.json()).delivery).toBe('whatsapp_prepared'); expect(mocks.store).not.toHaveBeenCalled(); expect(mocks.deliver).not.toHaveBeenCalled(); });
  it('does not expose backend errors or claim success on failed storage', async () => { mocks.store.mockRejectedValueOnce(new Error('database password')); const response = await POST(request()); expect(response.status).toBe(503); expect(await response.text()).not.toContain('password'); });
});
