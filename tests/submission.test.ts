import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validAudit } from './fixtures';
vi.mock('@/server/rate-limit', () => ({ rateLimit: vi.fn().mockResolvedValue(true) }));
vi.mock('@/server/audit-service', () => ({ storeAudit: vi.fn().mockResolvedValue({ id: 'request-id' }), InvalidPhotos: class extends Error {}, SubmissionConflict: class extends Error {} }));
vi.mock('@/server/emails', () => ({ deliverEmails: vi.fn() }));
vi.mock('@/server/turnstile', () => ({ verifyTurnstile: vi.fn().mockResolvedValue(true) }));
vi.mock('next/server', async importOriginal => { const original = await importOriginal<typeof import('next/server')>(); return { ...original, after: vi.fn() }; });
import { POST } from '@/app/api/audit/route';
import { storeAudit } from '@/server/audit-service';
import { rateLimit } from '@/server/rate-limit';
const request = (body: unknown, origin = 'http://localhost:3000') => new Request('http://localhost:3000/api/audit', { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
describe('submission endpoint', () => {
  beforeEach(() => { vi.clearAllMocks(); vi.mocked(rateLimit).mockResolvedValue(true); });
  it('rejects cross-origin submission before persistence', async () => { expect((await POST(request(validAudit, 'https://evil.example'))).status).toBe(403); expect(storeAudit).not.toHaveBeenCalled(); });
  it('enforces server-side consent and validation', async () => { const result = await POST(request({ ...validAudit, consent: false })); expect(result.status).toBe(422); expect(storeAudit).not.toHaveBeenCalled(); });
  it('applies rate limiting', async () => { vi.mocked(rateLimit).mockResolvedValue(false); expect((await POST(request(validAudit))).status).toBe(429); expect(storeAudit).not.toHaveBeenCalled(); });
  it('passes valid normalized submissions to the persistence service', async () => { expect((await POST(request(validAudit))).status).toBe(201); expect(storeAudit).toHaveBeenCalledOnce(); });
  it('does not leak database errors', async () => { vi.mocked(storeAudit).mockRejectedValueOnce(new Error('database secret password')); const result = await POST(request(validAudit)); expect(result.status).toBe(503); expect(await result.text()).not.toContain('password'); });
});
