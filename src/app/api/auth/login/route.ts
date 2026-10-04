import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';
import { createSession } from '@/server/auth';
import { rateLimit } from '@/server/rate-limit';
import { sameOrigin, requestIp, readJson } from '@/server/security';
const schema = z.object({ email: z.email().max(254).transform(value => value.toLowerCase()), password: z.string().min(1).max(72).refine(value => Buffer.byteLength(value, 'utf8') <= 72) });
// Fixed cost-equivalent dummy hash prevents disclosing whether an account exists.
const dummyHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxvdR.jVpA8GLYUVPMtVE0UoS9S';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    if (!await rateLimit(`login-ip:${requestIp(request)}`, 10, 900)) return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    const input = schema.safeParse(await readJson(request, 2000));
    if (!input.success) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 });
    if (!await rateLimit(`login-email:${input.data.email}`, 10, 900)) return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    const user = await db.user.findUnique({ where: { email: input.data.email } });
    const valid = await compare(input.data.password, user?.passwordHash || dummyHash);
    if (!user || !valid) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) { console.error('Admin authentication unavailable', error instanceof Error ? error.name : 'Error'); return NextResponse.json({ error: 'Sign-in is temporarily unavailable.' }, { status: 503 }); }
}
