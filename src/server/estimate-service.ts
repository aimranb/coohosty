import 'server-only';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { digest } from './security';
import { SubmissionConflict } from './audit-service';
import type { EstimateData } from '@/validations/estimate';
import en from '../../messages/en.json';
import type { RevenueBenchmark } from './revenue-benchmark';

export async function storeEstimate(data: EstimateData, benchmark: RevenueBenchmark | null = null) {
  const { turnstileToken: _token, ...stable } = data;
  void _token;
  const payloadHash = digest(JSON.stringify(stable));
  const existing = await db.auditRequest.findUnique({ where: { submissionKey: data.submissionKey } });
  if (existing) { if (existing.payloadHash !== payloadHash) throw new SubmissionConflict(); return existing; }
  const t = en.estimate;
  const comments = [
    `${t.fields.type}: ${t.options[data.type]}`,
    `${t.fields.bedrooms}: ${data.bedrooms}`,
    `${t.fields.city}: ${data.city}`, `${t.fields.address}: ${data.address}`,
    `${t.fields.objective}: ${t.options[data.objective]}`,
    `${t.fields.duration}: ${t.options[data.duration]}`,
    `${t.fields.ready}: ${t.options[data.ready]}`,
    `${t.fields.channel}: ${data.channel === 'email' ? 'Email' : 'WhatsApp'}`,
    ...(benchmark ? [`PriceLabs location/bedroom benchmark: EUR ${benchmark.lower}-${benchmark.upper}/month (annual P25-P75 divided by 12; gross bookings, not net profit). ${benchmark.listings} listings. Retrieved: ${benchmark.retrievedAt}.`] : ['Income estimate: personal review required; no verified automatic range available.']),
  ].join('\n');
  try {
    return await db.auditRequest.create({ data: {
      submissionKey: data.submissionKey, payloadHash, source: 'hero-estimate',
      fullName: data.fullName, email: data.email, phone: data.phone, country: 'Morocco', plan: 'AUDIT', locale: data.locale,
      authorization: 'unknown', objective: data.objective, availability: t.options[data.ready], comments, consent: data.consent,
      emails: { create: [{ kind: 'internal' }, { kind: 'customer' }] },
    } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const existing = await db.auditRequest.findUnique({ where: { submissionKey: data.submissionKey } });
      if (existing?.payloadHash === payloadHash) return existing;
      throw new SubmissionConflict();
    }
    throw error;
  }
}
