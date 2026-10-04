import { NextResponse } from 'next/server';
import { deliverEmails } from '@/server/emails';
import { secureEqual } from '@/server/security';
import { db } from '@/lib/db';
export const maxDuration = 60;
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || !secureEqual(request.headers.get('authorization') || '', `Bearer ${process.env.CRON_SECRET}`)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const result = await deliverEmails();
    await db.rateLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    await db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    return NextResponse.json(result);
  } catch { return NextResponse.json({ error: 'Processing failed' }, { status: 503 }); }
}
