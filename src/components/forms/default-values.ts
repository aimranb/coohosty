import type { AuditInput } from '@/validations/audit';
import type { Locale } from '@/config/site';
export function defaultAudit(locale: Locale): AuditInput {
  return {
    fullName: '', phone: '', email: '', country: '', plan: 'UNDECIDED',
    city: '', neighborhood: '', type: 'apartment', surface: 50,
    bedrooms: 1, beds: 1, bathrooms: 1, capacity: 2, amenities: [], finish: 'good',
    isRental: false, listingUrl: '', platforms: [], nightlyRate: null, occupancy: null, rating: null,
    management: null, propertyStatus: 'empty', authorization: 'unknown',
    objective: 'revenue', availability: '', comments: '', consent: false,
    locale, submissionKey: '', honeypot: '', photoReceipts: [], turnstileToken: ''
  };
}
