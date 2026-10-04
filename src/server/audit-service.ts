import 'server-only';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { digest } from './security';
import { verifyReceipt } from './storage';
import type { AuditData } from '@/validations/audit';
export class SubmissionConflict extends Error {}
export class InvalidPhotos extends Error {}
export async function storeAudit(data: AuditData) {
  const { turnstileToken: _token, ...stableData } = data;
  void _token;
  const payloadHash = digest(JSON.stringify(stableData));
  const existing = await db.auditRequest.findUnique({ where: { submissionKey: data.submissionKey } });
  if (existing) { if (existing.payloadHash !== payloadHash) throw new SubmissionConflict(); return existing; }
  let photos;
  try { photos = data.photoReceipts.map(receipt => verifyReceipt(receipt, data.submissionKey)); if (new Set(photos.map(photo => photo.publicId)).size !== photos.length) throw new Error('Duplicate photos'); } catch { throw new InvalidPhotos(); }
  try {
    return await db.$transaction(async tx => tx.auditRequest.create({ data: {
      submissionKey: data.submissionKey, payloadHash,
      fullName: data.fullName, phone: data.phone, email: data.email, country: data.country, plan: data.plan, locale: data.locale,
      authorization: data.authorization, objective: data.objective, availability: data.availability, comments: data.comments || null, consent: data.consent,
      property: { create: { city: data.city, neighborhood: data.neighborhood, type: data.type, surface: data.surface, bedrooms: data.bedrooms, beds: data.beds, bathrooms: data.bathrooms, capacity: data.capacity, amenities: data.amenities, finish: data.finish, isRental: data.isRental, listingUrl: data.listingUrl || null, platforms: data.platforms, nightlyRate: data.nightlyRate, occupancy: data.occupancy, rating: data.rating, management: data.management, propertyStatus: data.propertyStatus, photos: { create: photos.map(({ url, publicId, mimeType, size }) => ({ url, publicId, mimeType, size })) } } },
      emails: { create: [{ kind: 'internal' }, { kind: 'customer' }] }
    } }));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const request = await db.auditRequest.findUnique({ where: { submissionKey: data.submissionKey } });
      if (request && request.payloadHash === payloadHash) return request;
      throw new SubmissionConflict();
    }
    throw error;
  }
}
