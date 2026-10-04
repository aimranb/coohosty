import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
const mocks = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn(), findUnique: vi.fn(), create: vi.fn(), deleteMany: vi.fn(), redirect: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: vi.fn(async () => ({ get: mocks.get, set: mocks.set })) }));
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('@/lib/db', () => ({ db: { session: { findUnique: mocks.findUnique, create: mocks.create, deleteMany: mocks.deleteMany } } }));
import { currentAdmin, createSession, destroySession, requireAdmin, sessionCookie } from '@/server/auth';
describe('database-backed admin sessions', () => {
  beforeEach(() => { vi.clearAllMocks(); vi.stubEnv('AUTH_SECRET', 'test-only-secret-at-least-thirty-two-characters'); mocks.create.mockResolvedValue({}); mocks.deleteMany.mockResolvedValue({ count: 1 }); });
  afterEach(() => vi.unstubAllEnvs());
  it('never queries request data without a valid session cookie', async () => { mocks.get.mockReturnValue(undefined); expect(await currentAdmin()).toBeNull(); expect(mocks.findUnique).not.toHaveBeenCalled(); });
  it('rejects expired sessions', async () => { mocks.get.mockReturnValue({ value: 'a'.repeat(64) }); mocks.findUnique.mockResolvedValue({ expiresAt: new Date(Date.now() - 1000), user: { id: 'admin', email: 'admin@example.com' } }); expect(await currentAdmin()).toBeNull(); });
  it('returns only the administrator identity for a live session', async () => { mocks.get.mockReturnValue({ value: 'a'.repeat(64) }); mocks.findUnique.mockResolvedValue({ expiresAt: new Date(Date.now() + 10000), user: { id: 'admin', email: 'admin@example.com' } }); expect(await currentAdmin()).toEqual({ id: 'admin', email: 'admin@example.com' }); });
  it('stores only a hash and sets secure httpOnly production cookies', async () => { vi.stubEnv('NODE_ENV', 'production'); await createSession('admin'); const persisted = mocks.create.mock.calls[0][0].data; const [name, token, options] = mocks.set.mock.calls[0]; expect(name).toBe(sessionCookie); expect(token).toMatch(/^[a-f0-9]{64}$/); expect(persisted.tokenHash).not.toBe(token); expect(persisted.userId).toBe('admin'); expect(options).toMatchObject({ httpOnly: true, secure: true, sameSite: 'strict', path: '/' }); });
  it('revokes the database session and expires the cookie on logout', async () => { mocks.get.mockReturnValue({ value: 'a'.repeat(64) }); await destroySession(); expect(mocks.deleteMany).toHaveBeenCalledOnce(); expect(mocks.set.mock.calls[0][2].maxAge).toBe(0); });
  it('redirects protected page access without authentication', async () => { mocks.get.mockReturnValue(undefined); mocks.redirect.mockImplementation(() => { throw new Error('redirect'); }); await expect(requireAdmin()).rejects.toThrow('redirect'); expect(mocks.redirect).toHaveBeenCalledWith('/admin/login'); });
});
