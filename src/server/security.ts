import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { site } from '@/config/site';
export function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must contain at least 32 characters');
  return value;
}
export function digest(value: string) { return createHash('sha256').update(value).digest('hex'); }
export function privateDigest(value: string) { return createHmac('sha256', secret()).update(value).digest('hex'); }
export function sameOrigin(request: Request) {
  const expected = process.env.NODE_ENV === 'production' ? new URL(site.url).origin : new URL(request.url).origin;
  return request.headers.get('origin') === expected;
}
export function requestIp(request: Request) {
  const header = process.env.TRUSTED_IP_HEADER || 'x-vercel-forwarded-for';
  return request.headers.get(header)?.split(',')[0].trim().slice(0, 100) || 'unknown';
}
export function secureEqual(left: string, right: string) {
  const a = Buffer.from(left), b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
export async function readBytes(request: Request, limit: number): Promise<Buffer> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Invalid body');
  let size = 0;
  const parts: Uint8Array[] = [];
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    size += chunk.value.byteLength;
    if (size > limit) { await reader.cancel(); throw new Error('Body too large'); }
    parts.push(chunk.value);
  }
  return Buffer.concat(parts);
}
export async function readJson(request: Request, limit = 40000): Promise<unknown> { return JSON.parse((await readBytes(request, limit)).toString('utf8')); }
