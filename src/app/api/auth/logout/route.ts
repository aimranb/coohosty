import { NextResponse } from 'next/server';
import { sameOrigin } from '@/server/security';
import { destroySession } from '@/server/auth';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await destroySession();
  return NextResponse.json({ ok: true });
}
