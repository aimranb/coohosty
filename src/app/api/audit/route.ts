import { after, NextResponse } from 'next/server';
import { auditSchema } from '@/validations/audit';
import { rateLimit } from '@/server/rate-limit';
import { readJson, requestIp, sameOrigin } from '@/server/security';
import { storeAudit, InvalidPhotos, SubmissionConflict } from '@/server/audit-service';
import { deliverEmails } from '@/server/emails';
import { verifyTurnstile } from '@/server/turnstile';
export const runtime = 'nodejs';
export const maxDuration = 60;
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  try {
    if (!await rateLimit(`audit:${requestIp(request)}`, 5, 3600)) return NextResponse.json({ error: 'rate' }, { status: 429, headers: { 'Retry-After': '3600' } });
    let raw: unknown;
    try { raw = await readJson(request); } catch { return NextResponse.json({ error: 'invalid' }, { status: 400 }); }
    const parsed = auditSchema.safeParse(raw);
    if (!parsed.success) {
      const fields = Object.fromEntries(parsed.error.issues.map(issue => [String(issue.path[0]), issue.message]));
      return NextResponse.json({ error: 'validation', fields }, { status: 422 });
    }
    if (!await verifyTurnstile(parsed.data.turnstileToken)) return NextResponse.json({ error: 'verification' }, { status: 400 });
    const result = await storeAudit(parsed.data);
    after(async () => { try { await deliverEmails(result.id); } catch { console.error('Email outbox processing deferred'); } });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof InvalidPhotos) return NextResponse.json({ error: 'photos' }, { status: 422 });
    if (error instanceof SubmissionConflict) return NextResponse.json({ error: 'conflict' }, { status: 409 });
    console.error('Audit submission unavailable', error instanceof Error ? error.name : 'Error');
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
}
