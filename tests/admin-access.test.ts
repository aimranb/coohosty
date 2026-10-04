import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('@/server/auth', () => ({ currentAdmin: vi.fn().mockResolvedValue(null) }));
import { adminRoute } from '@/server/admin-route';
import { currentAdmin } from '@/server/auth';
describe('server-side admin authorization', () => {
  beforeEach(() => vi.clearAllMocks());
  it('rejects unauthenticated data access before executing a handler', async () => { vi.mocked(currentAdmin).mockResolvedValue(null); const handler = vi.fn(); const result = await adminRoute(new Request('http://localhost:3000/api/admin/export'), handler); expect(result.status).toBe(401); expect(handler).not.toHaveBeenCalled(); });
  it('rejects cross-origin authenticated mutations', async () => { vi.mocked(currentAdmin).mockResolvedValue({ id: 'admin', email: 'admin@example.com' }); const handler = vi.fn(); const result = await adminRoute(new Request('http://localhost:3000/api/admin/requests/1', { method: 'PATCH', headers: { origin: 'https://evil.example' } }), handler, true); expect(result.status).toBe(403); expect(handler).not.toHaveBeenCalled(); });
  it('allows authorized reads with private caching', async () => { vi.mocked(currentAdmin).mockResolvedValue({ id: 'admin', email: 'admin@example.com' }); const handler = vi.fn().mockResolvedValue(new Response('ok')); const result = await adminRoute(new Request('http://localhost:3000/api/admin/export'), handler); expect(result.status).toBe(200); expect(result.headers.get('Cache-Control')).toBe('private, no-store'); });
});
