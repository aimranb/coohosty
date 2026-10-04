import { randomUUID } from 'node:crypto';
import { describe, it, expect, afterAll } from 'vitest';
import { db } from '@/lib/db';
import { auditSchema } from '@/validations/audit';
import { storeAudit } from '@/server/audit-service';
import { validAudit } from './fixtures';
// Opt in only with a dedicated disposable PostgreSQL database.
describe.skipIf(process.env.RUN_DATABASE_TESTS !== '1')('PostgreSQL submission integration', () => {
  const submissionKey = randomUUID();
  afterAll(async () => { await db.auditRequest.deleteMany({ where: { submissionKey } }); await db.$disconnect(); });
  it('persists every section, queues both emails and prevents duplicates', async () => {
    const data = auditSchema.parse({ ...validAudit, submissionKey, comments: 'Integration fixture', isRental: true, listingUrl: 'https://example.com/listing', platforms: ['airbnb'], nightlyRate: 900, occupancy: 60, rating: 9.2, management: 'self', locale: 'ar' });
    const [first, second] = await Promise.all([storeAudit(data), storeAudit(data)]);
    expect(first.id).toBe(second.id);
    const request = await db.auditRequest.findUniqueOrThrow({ where: { id: first.id }, include: { property: { include: { photos: true } }, emails: true } });
    expect(request.locale).toBe('ar'); expect(request.consent).toBe(true); expect(request.comments).toBe('Integration fixture'); expect(request.status).toBe('NEW');
    expect(request.property?.city).toBe('Marrakech'); expect(request.property?.platforms).toEqual(['airbnb']); expect(request.property?.nightlyRate).toBe(900); expect(request.property?.occupancy).toBe(60); expect(request.property?.rating).toBe(9.2);
    expect(request.emails.map(email => email.kind).sort()).toEqual(['customer', 'internal']);
    await expect(storeAudit({ ...data, fullName: 'A different owner' })).rejects.toThrow();
  });
});
