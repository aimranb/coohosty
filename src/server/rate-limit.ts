import 'server-only';
import { db } from '@/lib/db';
import { privateDigest } from './security';
export async function rateLimit(identifier: string, max: number, windowSeconds: number) {
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  const key = privateDigest(`${identifier}:${bucket}`);
  const record = await db.rateLimit.upsert({ where: { key }, create: { key, expiresAt: new Date((bucket + 1) * windowSeconds * 1000) }, update: { count: { increment: 1 } } });
  return record.count <= max;
}
