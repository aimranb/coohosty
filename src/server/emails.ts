import 'server-only';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { customerEmail, internalEmail } from '@/emails/templates';
import { site } from '@/config/site';
export async function deliverEmails(requestId?: string) {
  const apiKey = process.env.RESEND_API_KEY, from = process.env.EMAIL_FROM;
  if (!apiKey || !from) { console.error('Email delivery deferred: provider not configured'); return { sent: 0, failed: 0, deferred: true }; }
  const resend = new Resend(apiKey);
  const pending = await db.emailOutbox.findMany({ where: { sentAt: null, ...(requestId ? { requestId } : {}), OR: [{ lockedUntil: null }, { lockedUntil: { lt: new Date() } }] }, take: 20, orderBy: { createdAt: 'asc' }, include: { request: { include: { property: { include: { photos: true } } } } } });
  let sent = 0, failed = 0;
  for (const message of pending) {
    const claim = await db.emailOutbox.updateMany({ where: { id: message.id, sentAt: null, OR: [{ lockedUntil: null }, { lockedUntil: { lt: new Date() } }] }, data: { lockedUntil: new Date(Date.now() + 5 * 60000), attempts: { increment: 1 } } });
    if (!claim.count) continue;
    try {
      const internal = message.kind === 'internal';
      const template = internal ? internalEmail(message.request) : customerEmail(message.request);
      const result = await resend.emails.send({ from, to: internal ? process.env.INTERNAL_NOTIFICATION_EMAIL || site.email : message.request.email, replyTo: internal ? message.request.email : site.email, ...template }, { idempotencyKey: `cohosty/${message.id}` });
      if (result.error) throw new Error(result.error.name);
      await db.emailOutbox.update({ where: { id: message.id }, data: { sentAt: new Date(), lockedUntil: null } }); sent++;
    } catch (error) { console.error('Transactional email delivery failed', { outboxId: message.id, error: error instanceof Error ? error.name : 'Error' }); await db.emailOutbox.update({ where: { id: message.id }, data: { lockedUntil: null } }); failed++; }
  }
  return { sent, failed, deferred: false };
}
