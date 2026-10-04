import { NextResponse } from 'next/server';
import { estimateSchema } from '@/validations/estimate';
import { rateLimit } from '@/server/rate-limit';
import { readJson, requestIp, sameOrigin } from '@/server/security';
import { storeEstimate } from '@/server/estimate-service';
import { SubmissionConflict } from '@/server/audit-service';
import { deliverEmails } from '@/server/emails';
import { verifyTurnstile } from '@/server/turnstile';
import { db } from '@/lib/db';
import { revenueBenchmark } from '@/server/revenue-benchmark';
export const runtime = 'nodejs';
export const maxDuration = 60;
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  try {
    let raw: unknown;
    try { raw = await readJson(request, 12000); } catch { return NextResponse.json({ error: 'invalid' }, { status: 400 }); }
    const parsed = estimateSchema.safeParse(raw);
    if (!parsed.success) return NextResponse.json({ error: 'validation', fields: Object.fromEntries(parsed.error.issues.map(issue => [String(issue.path[0]), issue.message])) }, { status: 422 });
    if (parsed.data.channel === 'email' && (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)) return NextResponse.json({ error: 'email_unavailable' }, { status: 503 });
    if (parsed.data.channel === 'whatsapp' && !process.env.PRICELABS_REVENUE_API_KEY) return NextResponse.json({ ok: true, delivery: 'whatsapp_prepared', benchmark: null });
    if (!await rateLimit(`estimate:${requestIp(request)}`, 5, 3600)) return NextResponse.json({ error: 'rate' }, { status: 429, headers: { 'Retry-After': '3600' } });
    if (!await verifyTurnstile(parsed.data.turnstileToken)) return NextResponse.json({ error: 'verification' }, { status: 400 });
    const benchmark = await revenueBenchmark(parsed.data);
    if (parsed.data.channel === 'whatsapp') return NextResponse.json({ ok: true, delivery: 'whatsapp_prepared', benchmark });
    const result = await storeEstimate(parsed.data, benchmark);
    let delivery = 'queued';
    try {
      await deliverEmails(result.id);
      const notification = await db.emailOutbox.findUnique({ where: { requestId_kind: { requestId: result.id, kind: 'internal' } }, select: { sentAt: true } });
      if (notification?.sentAt) delivery = 'sent';
    } catch { console.error('Estimate notification remains in the email outbox'); }
    return NextResponse.json({ ok: true, delivery, benchmark }, { status: 201 });
  } catch (error) {
    if (error instanceof SubmissionConflict) return NextResponse.json({ error: 'conflict' }, { status: 409 });
    console.error('Estimate submission unavailable', error instanceof Error ? error.name : 'Error');
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
}
