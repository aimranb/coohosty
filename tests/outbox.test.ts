import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
const mocks = vi.hoisted(() => ({ findMany: vi.fn(), claim: vi.fn(), update: vi.fn(), send: vi.fn() }));
vi.mock('@/lib/db', () => ({ db: { emailOutbox: { findMany: mocks.findMany, updateMany: mocks.claim, update: mocks.update } } }));
vi.mock('resend', () => ({ Resend: class { emails = { send: mocks.send }; } }));
vi.mock('@/emails/templates', () => ({ internalEmail: () => ({ subject: 'Internal', html: '<p>Internal</p>' }), customerEmail: () => ({ subject: 'Customer', html: '<p>Customer</p>' }) }));
import { deliverEmails } from '@/server/emails';
describe('durable transactional email outbox', () => {
  beforeEach(() => { vi.clearAllMocks(); vi.stubEnv('RESEND_API_KEY', 'test-key-not-real'); vi.stubEnv('EMAIL_FROM', 'COOHOSTY <test@example.com>'); mocks.claim.mockResolvedValue({ count: 1 }); mocks.update.mockResolvedValue({}); mocks.send.mockResolvedValue({ data: { id: 'email' }, error: null }); mocks.findMany.mockResolvedValue([{ id: 'outbox-1', kind: 'customer', request: { email: 'owner@example.com' } }]); });
  afterEach(() => vi.unstubAllEnvs());
  it('claims, sends with idempotency and records delivery acceptance', async () => { expect(await deliverEmails()).toEqual({ sent: 1, failed: 0, deferred: false }); expect(mocks.send.mock.calls[0][0].to).toBe('owner@example.com'); expect(mocks.send.mock.calls[0][1]).toEqual({ idempotencyKey: 'cohosty/outbox-1' }); expect(mocks.update.mock.calls[0][0].data.sentAt).toBeInstanceOf(Date); });
  it('does not send a message already claimed by another worker', async () => { mocks.claim.mockResolvedValue({ count: 0 }); expect((await deliverEmails()).sent).toBe(0); expect(mocks.send).not.toHaveBeenCalled(); });
  it('keeps failures pending and releases the claim for retry', async () => { mocks.send.mockResolvedValue({ data: null, error: { name: 'provider_unavailable' } }); expect((await deliverEmails()).failed).toBe(1); expect(mocks.update).toHaveBeenCalledWith({ where: { id: 'outbox-1' }, data: { lockedUntil: null } }); });
  it('does not pretend to send when provider configuration is absent', async () => { vi.stubEnv('RESEND_API_KEY', ''); expect((await deliverEmails()).deferred).toBe(true); expect(mocks.send).not.toHaveBeenCalled(); });
});
