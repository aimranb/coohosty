import { describe, it, expect } from 'vitest';
import { auditSchema, selectPlan } from '@/validations/audit';
import { validAudit } from './fixtures';
describe('audit validation', () => {
  it('accepts a complete submission and normalizes contact fields', () => { const parsed = auditSchema.parse({ ...validAudit, fullName: '  Test Owner  ', email: 'OWNER@EXAMPLE.COM' }); expect(parsed.fullName).toBe('Test Owner'); expect(parsed.email).toBe('owner@example.com'); });
  it.each([{ consent: false }, { email: 'invalid' }, { phone: 'invalid' }, { capacity: 0 }, { occupancy: 101 }, { surface: NaN }, { bedrooms: 1.5 }, { plan: 'ATTACK' }, { honeypot: 'bot' }, { listingUrl: 'javascript:alert(1)' }, { isRental: true, management: null }, { isRental: false, propertyStatus: null }, { photoReceipts: Array(9).fill('receipt') }])('rejects invalid or unsafe input %j', changes => { expect(auditSchema.safeParse({ ...validAudit, ...changes }).success).toBe(false); });
  it('removes stale rental answers when a property is not rented', () => { const parsed = auditSchema.parse({ ...validAudit, listingUrl: 'https://example.com/listing', nightlyRate: 900, platforms: ['airbnb'], management: 'self' }); expect(parsed.listingUrl).toBe(''); expect(parsed.nightlyRate).toBeNull(); expect(parsed.platforms).toEqual([]); expect(parsed.management).toBeNull(); });
  it('requires all contact and property answers', () => { expect(auditSchema.safeParse({ consent: true }).success).toBe(false); });
  it('rejects header/control-character injection in single-line answers', () => { expect(auditSchema.safeParse({ ...validAudit, city: 'Marrakech\r\nBcc: attacker@example.com' }).success).toBe(false); expect(auditSchema.safeParse({ ...validAudit, comments: 'Unsafe\u0000comment' }).success).toBe(false); });
});
describe('plan preselection', () => { it.each(['AUDIT', 'OPTIMIZE', 'COHOST', 'UNDECIDED'])('accepts %s', plan => expect(selectPlan(plan)).toBe(plan)); it.each([null, 'unknown', '', '<script>'])('ignores invalid %s', value => expect(selectPlan(value)).toBeUndefined()); });
