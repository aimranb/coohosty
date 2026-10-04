import { z } from 'zod';
import { locales, plans, site } from '@/config/site';
export const amenities = ['wifi', 'ac', 'heating', 'pool', 'terrace', 'parking', 'kitchen', 'washer', 'tv', 'view', 'smartLock'] as const;
export const propertyTypes = ['studio', 'apartment', 'villa', 'riad', 'guestHouse', 'other'] as const;
export const finishes = ['unfurnished', 'basic', 'good', 'highEnd'] as const;
export const platforms = ['airbnb', 'booking', 'vrbo', 'other'] as const;
export const objectives = ['revenue', 'time', 'remote', 'investment'] as const;
export const authorizations = ['yes', 'progress', 'no', 'unknown'] as const;
export const propertyStatuses = ['empty', 'longTerm', 'purchase', 'construction'] as const;
const shortText = (max = 120) => z.string().trim().min(1, 'required').max(max, 'tooLong').refine(value => !/[\u0000-\u001f\u007f]/.test(value), 'invalid');
const optionalNumber = (max: number) => z.number().finite().min(0, 'number').max(max, 'number').nullable();
export const auditSchema = z.object({
  fullName: shortText(), phone: z.string().trim().regex(/^\+?[\d ().-]{8,24}$/, 'phone').refine(value => value.replace(/\D/g, '').length >= 8 && value.replace(/\D/g, '').length <= 15, 'phone'),
  email: z.email('email').max(254).transform(value => value.toLowerCase()), country: shortText(), plan: z.enum(plans, { error: 'required' }),
  city: shortText(), neighborhood: shortText(), type: z.enum(propertyTypes, { error: 'required' }),
  surface: z.number().finite().min(1, 'number').max(100000, 'number'), bedrooms: z.number().int().min(0, 'number').max(100, 'number'),
  beds: z.number().int().min(1, 'number').max(200, 'number'), bathrooms: z.number().int().min(1, 'number').max(100, 'number'), capacity: z.number().int().min(1, 'number').max(500, 'number'),
  amenities: z.array(z.enum(amenities)).max(amenities.length).refine(items => new Set(items).size === items.length, 'invalid'), finish: z.enum(finishes, { error: 'required' }),
  isRental: z.boolean(), listingUrl: z.string().trim().max(2048).refine(value => !value || /^https?:\/\//.test(value) && URL.canParse(value), 'url'),
  platforms: z.array(z.enum(platforms)).max(4), nightlyRate: optionalNumber(1000000), occupancy: optionalNumber(100), rating: optionalNumber(10),
  management: z.enum(['self', 'thirdParty']).nullable(), propertyStatus: z.enum(propertyStatuses).nullable(),
  authorization: z.enum(authorizations, { error: 'required' }), objective: z.enum(objectives, { error: 'required' }),
  availability: shortText(300), comments: z.string().trim().max(5000, 'tooLong').refine(value => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value), 'invalid'), consent: z.boolean().refine(value => value, 'consent'),
  locale: z.enum(locales), submissionKey: z.uuid(), honeypot: z.string().max(0, 'invalid'),
  photoReceipts: z.array(z.string().max(3000)).max(site.upload.maxFiles), turnstileToken: z.string().max(2048).optional()
}).superRefine((data, ctx) => {
  if (data.isRental && !data.management) ctx.addIssue({ code: 'custom', message: 'required', path: ['management'] });
  if (!data.isRental && !data.propertyStatus) ctx.addIssue({ code: 'custom', message: 'required', path: ['propertyStatus'] });
}).transform(data => ({ ...data, listingUrl: data.isRental ? data.listingUrl : '', platforms: data.isRental ? data.platforms : [], nightlyRate: data.isRental ? data.nightlyRate : null, occupancy: data.isRental ? data.occupancy : null, rating: data.isRental ? data.rating : null, management: data.isRental ? data.management : null, propertyStatus: data.isRental ? null : data.propertyStatus }));
export type AuditInput = z.input<typeof auditSchema>;
export type AuditData = z.output<typeof auditSchema>;
export const stepFields: (keyof AuditInput)[][] = [
  ['fullName', 'phone', 'email', 'country', 'plan'],
  ['city', 'neighborhood', 'type', 'surface', 'bedrooms', 'beds', 'bathrooms', 'capacity', 'amenities', 'finish'],
  ['isRental', 'listingUrl', 'platforms', 'nightlyRate', 'occupancy', 'rating', 'management', 'propertyStatus'],
  ['authorization'], ['objective', 'availability', 'comments', 'consent']
];
export function selectPlan(value: string | null): AuditInput['plan'] | undefined {
  return plans.includes(value as AuditInput['plan']) ? value as AuditInput['plan'] : undefined;
}
