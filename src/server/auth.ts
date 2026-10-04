import 'server-only';
import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { privateDigest } from './security';
export const sessionCookie = process.env.NODE_ENV === 'production' ? '__Host-cohosty-session' : 'cohosty-session';
export async function currentAdmin() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await db.session.findUnique({ where: { tokenHash: privateDigest(token) }, include: { user: { select: { id: true, email: true } } } });
  return session && session.expiresAt > new Date() ? session.user : null;
}
export async function requireAdmin() {
  const user = await currentAdmin();
  if (!user) redirect('/admin/login');
  return user;
}
export async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
  await db.session.create({ data: { tokenHash: privateDigest(token), userId, expiresAt } });
  (await cookies()).set(sessionCookie, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', expires: expiresAt });
}
export async function destroySession() {
  const store = await cookies();
  const token = store.get(sessionCookie)?.value;
  if (token) await db.session.deleteMany({ where: { tokenHash: privateDigest(token) } });
  store.set(sessionCookie, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
}
